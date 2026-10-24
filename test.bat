@echo off
setlocal
title Modular Campus Hub - Automated Test Suite
color 0A

echo ==============================================================================
echo        MODULAR CAMPUS HUB - RUNNING FULL AUTOMATED VERIFICATION SUITE
echo ==============================================================================
echo.
set npm_config_cache=d:\anurag\.cache\npm
set TEMP=d:\anurag\.cache\tmp
set TMP=d:\anurag\.cache\tmp
set NEXT_TELEMETRY_DISABLED=1

echo Executing Vitest test suites...
call npm test

echo.
echo ==============================================================================
echo Automated test run completed!
echo ==============================================================================
pause
