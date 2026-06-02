param(
  [string]$WorkbookPath = 'D:\TABLE TOP GAMES JAPAN PROJECT\## FEB26_UPDATED 3 SHEET - master_database - Copy.xlsx',
  [string]$WorksheetName = 'UPDATED '
)

$ErrorActionPreference = 'Stop'
$outputPath = Join-Path $PSScriptRoot '..\src\data\ttgjVenues.generated.ts'
$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false
$excel.DisplayAlerts = $false

function Clean-Cell([object]$worksheet, [int]$row, [int]$column) {
  $value = [string]$worksheet.Cells.Item($row, $column).Text
  if ($value -eq 'None') {
    return ''
  }
  return $value.Trim()
}

function Parse-Coordinate([string]$value) {
  if ([string]::IsNullOrWhiteSpace($value)) {
    return $null
  }
  $parsed = 0.0
  if ([double]::TryParse($value, [Globalization.NumberStyles]::Float, [Globalization.CultureInfo]::InvariantCulture, [ref]$parsed)) {
    return $parsed
  }
  return $null
}

try {
  $workbook = $excel.Workbooks.Open($WorkbookPath, 0, $true)
  $worksheet = $workbook.Worksheets.Item($WorksheetName)
  $venues = @()

  for ($row = 2; $row -le $worksheet.UsedRange.Rows.Count; $row++) {
    $sourceId = Clean-Cell $worksheet $row 1
    $name = Clean-Cell $worksheet $row 7
    if ([string]::IsNullOrWhiteSpace($sourceId) -or [string]::IsNullOrWhiteSpace($name)) {
      continue
    }

    $type = Clean-Cell $worksheet $row 2
    $open = Clean-Cell $worksheet $row 12
    $close = Clean-Cell $worksheet $row 13
    $hoursNotes = Clean-Cell $worksheet $row 14
    $games = Clean-Cell $worksheet $row 31
    $specialty = Clean-Cell $worksheet $row 32
    $context = @(
      (Clean-Cell $worksheet $row 36),
      (Clean-Cell $worksheet $row 37),
      (Clean-Cell $worksheet $row 38)
    ) | Where-Object { -not [string]::IsNullOrWhiteSpace($_) }
    $description = if ($context.Count -gt 0) { $context[0] } elseif ($specialty) { $specialty } else { $type }
    $notes = $context -join ' '
    $specialties = @($specialty, $games) | Where-Object { -not [string]::IsNullOrWhiteSpace($_) }
    $hours = @(
      (@($open, $close) | Where-Object { -not [string]::IsNullOrWhiteSpace($_) }) -join '-',
      $hoursNotes
    ) | Where-Object { -not [string]::IsNullOrWhiteSpace($_) }

    $venues += [ordered]@{
      sourceId = $sourceId
      name = $name
      nameJapanese = Clean-Cell $worksheet $row 6
      category = $type
      address = Clean-Cell $worksheet $row 9
      city = Clean-Cell $worksheet $row 11
      prefecture = Clean-Cell $worksheet $row 11
      postalCode = Clean-Cell $worksheet $row 10
      latitude = Parse-Coordinate (Clean-Cell $worksheet $row 17)
      longitude = Parse-Coordinate (Clean-Cell $worksheet $row 18)
      phone = Clean-Cell $worksheet $row 15
      website = Clean-Cell $worksheet $row 19
      email = Clean-Cell $worksheet $row 26
      hours = $hours -join ' | '
      description = $description
      specialties = @($specialties)
      englishFriendly = Clean-Cell $worksheet $row 35
      priceRange = Clean-Cell $worksheet $row 29
      social = Clean-Cell $worksheet $row 20
      notes = $notes
      status = 'Active'
    }
  }

  $json = $venues | ConvertTo-Json -Depth 4
  $content = @"
// Generated from the UPDATED worksheet in the TTGJ master workbook.
// Run scripts/import-ttgj-workbook.ps1 to refresh this file.
import type { TTGJVenue } from './ttgjVenues';

export const generatedTTGJVenues: TTGJVenue[] = $json;
"@
  [IO.File]::WriteAllText((Resolve-Path (Split-Path $outputPath)).Path + '\' + (Split-Path $outputPath -Leaf), $content, [Text.UTF8Encoding]::new($false))
  Write-Output ('Imported {0} venues from {1} / {2}' -f $venues.Count, $WorkbookPath, $WorksheetName)
}
finally {
  if ($workbook) {
    $workbook.Close($false)
  }
  $excel.Quit()
  [Runtime.InteropServices.Marshal]::ReleaseComObject($excel) | Out-Null
}
