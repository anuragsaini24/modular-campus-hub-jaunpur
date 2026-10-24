@echo off
setlocal
title Modular Campus Hub - Development Server
color 0B

echo ==============================================================================
echo        MODULAR CAMPUS HUB - STARTING NEXT.JS DEVELOPMENT SERVER
echo ==============================================================================
echo.
set npm_config_cache=d:\anurag\.cache\npm
set TEMP=d:\anurag\.cache\tmp
set TMP=d:\anurag\.cache\tmp
set NEXT_TELEMETRY_DISABLED=1

echo Starting development server on http://localhost:3000...
start http://localhost:3000
call npm run dev

pause
