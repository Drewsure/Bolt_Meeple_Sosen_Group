param(
  [Parameter(Mandatory = $true)]
  [string] $CsvPath,

  [Parameter(Mandatory = $true)]
  [string] $ImageDirectory,

  [string] $OutputRoot = (Join-Path $PSScriptRoot '..\public')
)

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

function Convert-ToNumber([string] $Value) {
  if ([string]::IsNullOrWhiteSpace($Value)) {
    return $null
  }

  $result = 0.0
  if ([double]::TryParse($Value, [Globalization.NumberStyles]::Any, [Globalization.CultureInfo]::InvariantCulture, [ref] $result)) {
    return $result
  }

  return $null
}

function Convert-ToInteger([string] $Value) {
  $number = Convert-ToNumber $Value
  if ($null -eq $number -or $number -le 0) {
    return $null
  }

  return [int] $number
}

function Normalize-Title([string] $Value, [bool] $IsImageFile = $false) {
  $cleaned = $Value `
    -replace '(?i)\.(png|jpe?g|webp)$', '' `
    -replace '\(-?\d{1,4}\)', '' `
    -replace '(?i)\bbest\s*\d+(?:\s*-\s*\d+)?\b', '' `
    -replace '(?i)\b(first|second|third|fourth|1st|2nd|3rd|4th)\s+edition\b', '' `
    -replace '&', ' and '
  if ($IsImageFile) {
    $cleaned = $cleaned -replace '\(?-?\d{1,4}$', ''
  }
  $decomposed = $cleaned.Normalize([Text.NormalizationForm]::FormD)
  $lettersOnly = -join ($decomposed.ToCharArray() | Where-Object {
    [Globalization.CharUnicodeInfo]::GetUnicodeCategory($_) -ne [Globalization.UnicodeCategory]::NonSpacingMark
  })
  return ($lettersOnly -replace '[^a-zA-Z0-9]+', '').ToLowerInvariant()
}

function Get-Complexity([double] $Weight) {
  if ($Weight -le 1.8) { return 'Beginner' }
  if ($Weight -le 2.6) { return 'Intermediate' }
  if ($Weight -le 3.4) { return 'Advanced' }
  return 'Master'
}

function Get-PlayerPhrase($Minimum, $Maximum) {
  if ($null -eq $Minimum -or $null -eq $Maximum) { return 'flexible table groups' }
  if ($Minimum -eq 1 -and $Maximum -eq 1) { return 'solo play' }
  if ($Minimum -eq 1) { return "solo to $Maximum players" }
  if ($Minimum -eq $Maximum) { return "$Minimum players" }
  if ($Maximum -ge 8) { return "large groups of $Minimum-$Maximum" }
  return "$Minimum-$Maximum players"
}

function Get-DurationPhrase($Duration) {
  if ($null -eq $Duration) { return 'open-ended' }
  if ($Duration -le 15) { return "rapid $Duration-minute" }
  if ($Duration -le 30) { return "quick $Duration-minute" }
  if ($Duration -le 60) { return "focused $Duration-minute" }
  if ($Duration -le 90) { return "extended $Duration-minute" }
  return "deep $Duration-minute"
}

function Get-ComplexityPhrase([string] $Complexity) {
  if ($Complexity -eq 'Master') { return 'heavy strategic' }
  if ($Complexity -eq 'Advanced') { return 'strategic' }
  if ($Complexity -eq 'Intermediate') { return 'tactical' }
  return 'gateway-friendly'
}

function Get-RankingPhrase($Rank) {
  if ($null -eq $Rank) { return '' }
  if ($Rank -le 100) { return 'top-ranked ' }
  if ($Rank -le 500) { return 'highly regarded ' }
  if ($Rank -le 1000) { return 'well-regarded ' }
  return ''
}

function Get-LanguagePhrase([string] $LanguageDependence) {
  if ($LanguageDependence -like '*No necessary*') { return 'no required in-game text, making it strong for English table talk' }
  if ($LanguageDependence -like '*Some necessary*') { return 'light reading needs that can be supported with a small phrase sheet' }
  if ($LanguageDependence -like '*Moderate*') { return 'moderate text demands suited to guided vocabulary support' }
  if ($LanguageDependence -like '*Extensive*' -or $LanguageDependence -like '*Unplayable*') { return 'heavy language demands best handled with translation aids or guided play' }
  return 'language requirements to confirm before session planning'
}

function Get-BaseTitle([string] $Title) {
  return ($Title -split '[:\u2013-]')[0].Trim()
}

function New-GameDescription([string] $Title, [string] $ItemType, [string] $Complexity, $Minimum, $Maximum, $Duration, $Rank, [string] $LanguageDependence) {
  $rankPhrase = Get-RankingPhrase $Rank
  $durationPhrase = Get-DurationPhrase $Duration
  $complexityPhrase = Get-ComplexityPhrase $Complexity
  $playerPhrase = Get-PlayerPhrase $Minimum $Maximum
  $languagePhrase = Get-LanguagePhrase $LanguageDependence

  if ($ItemType -eq 'expansion') {
    $parentTitle = Get-BaseTitle $Title
    return "Expansion content for $parentTitle, adding $complexityPhrase options for $playerPhrase with $languagePhrase."
  }

  return "$Title is a $rankPhrase$durationPhrase $complexityPhrase title for $playerPhrase, with $languagePhrase."
}

function Write-Thumbnail([string] $Source, [string] $Destination) {
  $image = [Drawing.Image]::FromFile($Source)
  try {
    $width = 320
    $height = [Math]::Max(180, [Math]::Round($image.Height * $width / $image.Width))
    $bitmap = New-Object Drawing.Bitmap $width, $height
    try {
      $graphics = [Drawing.Graphics]::FromImage($bitmap)
      try {
        $graphics.InterpolationMode = [Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $graphics.SmoothingMode = [Drawing.Drawing2D.SmoothingMode]::HighQuality
        $graphics.PixelOffsetMode = [Drawing.Drawing2D.PixelOffsetMode]::HighQuality
        $graphics.DrawImage($image, 0, 0, $width, $height)
      } finally {
        $graphics.Dispose()
      }
      $jpegCodec = [Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
      $quality = New-Object Drawing.Imaging.EncoderParameter([Drawing.Imaging.Encoder]::Quality, 76L)
      $parameters = New-Object Drawing.Imaging.EncoderParameters 1
      $parameters.Param[0] = $quality
      try {
        $bitmap.Save($Destination, $jpegCodec, $parameters)
      } finally {
        $quality.Dispose()
        $parameters.Dispose()
      }
    } finally {
      $bitmap.Dispose()
    }
  } finally {
    $image.Dispose()
  }
}

$rows = Import-Csv -LiteralPath $CsvPath
$images = Get-ChildItem -LiteralPath $ImageDirectory -File | Where-Object { $_.Extension -match '(?i)^\.(png|jpe?g|webp)$' }
$imageMap = @{}
foreach ($image in $images) {
  $key = Normalize-Title $image.Name $true
  if (-not $imageMap.ContainsKey($key)) {
    $imageMap[$key] = $image
  }
}
$coverOverrides = @{
  '338542' = '18 10 Rounds*'
  '83195' = 'Ghost Blitz *'
  '2448' = 'Mancala or Kalah *'
  '2389' = 'Othello *'
  '373106' = 'Sky Team *'
  '183394' = 'Viticulture *'
  '255262' = 'Agricola All Creatures Big and Small *'
  '8203' = "Hey, That's My Fish*"
  '353152' = 'Framework *'
  '230802' = 'Azul Mini*'
}
$titleOverrides = @{
  '255262' = 'Agricola: All Creatures Big and Small - The Big Box'
  '336718' = 'Clover Bouquet'
  '8203' = "Hey, That's My Fish!"
  '353152' = 'Framework'
}
$excludedObjectIds = @('164847', '2961')

$assetDirectory = Join-Path $OutputRoot 'images\collection'
$dataDirectory = Join-Path $OutputRoot 'data'
New-Item -ItemType Directory -Force -Path $assetDirectory, $dataDirectory | Out-Null
Get-ChildItem -LiteralPath $assetDirectory -Filter '*.jpg' -File -ErrorAction SilentlyContinue | Remove-Item -Force

$games = New-Object Collections.Generic.List[object]
$matched = 0
foreach ($row in $rows) {
  if ($excludedObjectIds -contains $row.objectid) {
    continue
  }

  $titleKey = Normalize-Title $row.objectname
  $coverUrl = $null
  $matchedImage = if ($coverOverrides.ContainsKey($row.objectid)) {
    $images | Where-Object { $_.Name -like $coverOverrides[$row.objectid] } | Select-Object -First 1
  } elseif ($imageMap.ContainsKey($titleKey)) {
    $imageMap[$titleKey]
  } else {
    $null
  }
  if ($null -ne $matchedImage) {
    $matched += 1
    $fileName = '{0}.jpg' -f $row.objectid
    Write-Thumbnail $matchedImage.FullName (Join-Path $assetDirectory $fileName)
    $coverUrl = '/images/collection/' + $fileName
  }

  $weight = Convert-ToNumber $row.avgweight
  if ($null -eq $weight) { $weight = 0 }
  $minPlayers = Convert-ToInteger $row.minplayers
  $maxPlayers = Convert-ToInteger $row.maxplayers
  $duration = Convert-ToInteger $row.playingtime
  $itemType = if ([string]::IsNullOrWhiteSpace($row.itemtype)) { 'standalone' } else { $row.itemtype }
  $complexity = Get-Complexity $weight
  $rank = Convert-ToInteger $row.rank
  $languageDependence = if ([string]::IsNullOrWhiteSpace($row.bgglanguagedependence)) { $null } else { $row.bgglanguagedependence }
  $displayTitle = if ($titleOverrides.ContainsKey($row.objectid)) { $titleOverrides[$row.objectid] } else { $row.objectname }

  $games.Add([ordered]@{
    id = 'collection-' + $row.objectid
    bgg_id = Convert-ToInteger $row.objectid
    title = $displayTitle
    original_name = $displayTitle
    bgg_average = Convert-ToNumber $row.average
    average_rating = Convert-ToNumber $row.average
    weight = $weight
    bgg_rank = $rank
    min_players = $minPlayers
    max_players = $maxPlayers
    duration_minutes = $duration
    min_playtime_minutes = Convert-ToInteger $row.minplaytime
    max_playtime_minutes = Convert-ToInteger $row.maxplaytime
    year_published = Convert-ToInteger $row.yearpublished
    language_dependence = $languageDependence
    image_id = $null
    cover_image_url = $coverUrl
    source_collection = 'personal-preview'
    item_type = $itemType
    complexity_level = $complexity
    player_count = if ($null -ne $minPlayers -and $null -ne $maxPlayers) { "$minPlayers-$maxPlayers" } else { $null }
    description = New-GameDescription $displayTitle $itemType $complexity $minPlayers $maxPlayers $duration $rank $languageDependence
    is_featured = $games.Count -lt 3
    is_silver_circle = $itemType -eq 'standalone' -and $weight -gt 0 -and $weight -lt 2.3 -and $duration -le 45
    created_at = ''
    updated_at = ''
  })
}

$manualGames = @(
  @{
    Id = 'manual-azul-board-game'
    Title = 'Azul'
    ImagePattern = 'Azul (2018).png'
    CoverFile = 'azul-board-game.jpg'
    MinPlayers = 2
    MaxPlayers = 4
    Duration = 45
    MinPlaytime = 30
    MaxPlaytime = 45
    Year = 2017
    Weight = 1.774
    Rank = 99
    Description = 'Azul is an abstract tile-drafting game about decorating a palace wall with patterned Portuguese tiles, creating useful table talk about colors, placement, patterns, and choices.'
  },
  @{
    Id = 'manual-roller-coaster-challenge'
    Title = 'Roller Coaster Challenge'
    ImagePattern = 'Roller Coaster Challenge.jpg'
    CoverFile = 'roller-coaster-challenge.jpg'
    MinPlayers = 1
    MaxPlayers = 1
    Duration = 20
    MinPlaytime = 15
    MaxPlaytime = 30
    Year = 2017
    Weight = 1.2
    Rank = $null
    Description = 'Roller Coaster Challenge is a solo logic puzzle about building a working coaster track, making it useful for simple English around position, direction, height, and problem solving.'
  }
)

foreach ($manual in $manualGames) {
  if ($games | Where-Object { $_.id -eq $manual.Id -or $_.title -eq $manual.Title } | Select-Object -First 1) {
    continue
  }

  $coverUrl = $null
  $matchedImage = $images | Where-Object { $_.Name -eq $manual.ImagePattern } | Select-Object -First 1
  if ($null -ne $matchedImage) {
    $matched += 1
    Write-Thumbnail $matchedImage.FullName (Join-Path $assetDirectory $manual.CoverFile)
    $coverUrl = '/images/collection/' + $manual.CoverFile
  }

  $games.Add([ordered]@{
    id = $manual.Id
    bgg_id = $null
    title = $manual.Title
    original_name = $manual.Title
    bgg_average = $null
    average_rating = $null
    weight = $manual.Weight
    bgg_rank = $manual.Rank
    min_players = $manual.MinPlayers
    max_players = $manual.MaxPlayers
    duration_minutes = $manual.Duration
    min_playtime_minutes = $manual.MinPlaytime
    max_playtime_minutes = $manual.MaxPlaytime
    year_published = $manual.Year
    language_dependence = 'No necessary in-game text'
    image_id = $null
    cover_image_url = $coverUrl
    source_collection = 'manual-preview'
    item_type = 'standalone'
    complexity_level = Get-Complexity $manual.Weight
    player_count = "$($manual.MinPlayers)-$($manual.MaxPlayers)"
    description = $manual.Description
    is_featured = $false
    is_silver_circle = $true
    created_at = ''
    updated_at = ''
  })
}

$outputFile = Join-Path $dataDirectory 'collection-preview.json'
$games | ConvertTo-Json -Depth 4 -Compress | Set-Content -LiteralPath $outputFile -Encoding UTF8
Write-Output ('Generated {0} public game records with {1} confirmed cover matches.' -f $games.Count, $matched)
