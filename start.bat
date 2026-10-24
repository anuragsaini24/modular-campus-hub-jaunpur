@echo off
setlocal
title Modular Campus Hub - PIT Jaunpur
color 0E

echo ==============================================================================
echo        MODULAR CAMPUS HUB - FEATURE 1: AI COLLEGE ASSISTANT
echo     Prasad Institute of Technology, Jaunpur - Hacktoberfest Hack Day 2026
echo ==============================================================================
echo.
echo [1/3] Enforcing strict D: drive cache isolation (Zero writes to C:)...
set npm_config_cache=d:\anurag\.cache\npm
set TEMP=d:\anurag\.cache\tmp
set TMP=d:\anurag\.cache\tmp
set NEXT_TELEMETRY_DISABLED=1

if not exist "d:\anurag\.cache\npm" mkdir "d:\anurag\.cache\npm"
if not exist "d:\anurag\.cache\tmp" mkdir "d:\anurag\.cache\tmp"

echo [2/3] Checking dependencies & build status...
if not exist "d:\anurag\node_modules" (
    echo Installing node dependencies on D: drive...
    call npm install
)

if not exist "d:\anurag\.next" (
    echo Building production package...
    call npm run build
)

echo [3/3] Launching web app on http://localhost:3000...
echo.
echo Opening browser in 2 seconds...
start http://localhost:3000
echo.
echo Running Next.js server... Press Ctrl+C to stop.
call npm start -- -p 3000

pause
