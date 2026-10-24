@echo off
setlocal
title Modular Campus Hub - Package for Handover
color 0B

echo ==============================================================================
echo        MODULAR CAMPUS HUB - PACKAGING PORTABLE ZIP FOR HANDOVER
echo ==============================================================================
echo.
echo Packaging clean repository (excluding heavy node_modules, .cache, and .git)...
echo Destination: d:\anurag\Modular-Campus-Hub-Jaunpur.zip
echo.

powershell -NoProfile -Command ^
  "$dest = 'd:\anurag\Modular-Campus-Hub-Jaunpur.zip'; " ^
  "if (Test-Path $dest) { Remove-Item $dest -Force }; " ^
  "$items = Get-ChildItem -Path 'd:\anurag' -Exclude 'node_modules', '.cache', '.next', '.git', 'Modular-Campus-Hub-Jaunpur.zip'; " ^
  "Compress-Archive -Path $items -DestinationPath $dest -CompressionLevel Optimal; " ^
  "if (Test-Path $dest) { " ^
  "  $size = [math]::Round((Get-Item $dest).Length / 1MB, 2); " ^
  "  Write-Host '==============================================================================' -ForegroundColor Green; " ^
  "  Write-Host ('SUCCESS! Created portable handover zip: ' + $dest + ' (' + $size + ' MB)') -ForegroundColor Green; " ^
  "  Write-Host 'Send this zip file to your friend via Pendrive, Google Drive, or WhatsApp!' -ForegroundColor Yellow; " ^
  "  Write-Host 'Your friend just unzips it and double-clicks start.bat!' -ForegroundColor Cyan; " ^
  "  Write-Host '==============================================================================' -ForegroundColor Green; " ^
  "} else { " ^
  "  Write-Host 'Failed to create zip archive.' -ForegroundColor Red; " ^
  "}"

pause
