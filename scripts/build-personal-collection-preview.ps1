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
}

$assetDirectory = Join-Path $OutputRoot 'images\collection'
$dataDirectory = Join-Path $OutputRoot 'data'
New-Item -ItemType Directory -Force -Path $assetDirectory, $dataDirectory | Out-Null
Get-ChildItem -LiteralPath $assetDirectory -Filter '*.jpg' -File -ErrorAction SilentlyContinue | Remove-Item -Force

$games = New-Object Collections.Generic.List[object]
$matched = 0
foreach ($row in $rows) {
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

  $games.Add([ordered]@{
    id = 'collection-' + $row.objectid
    bgg_id = Convert-ToInteger $row.objectid
    title = $row.objectname
    original_name = $row.objectname
    bgg_average = Convert-ToNumber $row.average
    average_rating = Convert-ToNumber $row.average
    weight = $weight
    bgg_rank = Convert-ToInteger $row.rank
    min_players = $minPlayers
    max_players = $maxPlayers
    duration_minutes = $duration
    min_playtime_minutes = Convert-ToInteger $row.minplaytime
    max_playtime_minutes = Convert-ToInteger $row.maxplaytime
    year_published = Convert-ToInteger $row.yearpublished
    language_dependence = $null
    image_id = $null
    cover_image_url = $coverUrl
    source_collection = 'personal-preview'
    item_type = $itemType
    complexity_level = Get-Complexity $weight
    player_count = if ($null -ne $minPlayers -and $null -ne $maxPlayers) { "$minPlayers-$maxPlayers" } else { $null }
    description = $null
    is_featured = $games.Count -lt 3
    is_silver_circle = $itemType -eq 'standalone' -and $weight -gt 0 -and $weight -lt 2.3 -and $duration -le 45
    created_at = ''
    updated_at = ''
  })
}

$outputFile = Join-Path $dataDirectory 'collection-preview.json'
$games | ConvertTo-Json -Depth 4 -Compress | Set-Content -LiteralPath $outputFile -Encoding UTF8
Write-Output ('Generated {0} public game records with {1} confirmed cover matches.' -f $games.Count, $matched)
