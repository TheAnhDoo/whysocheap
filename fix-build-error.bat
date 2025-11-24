@echo off
REM Fix Next.js Build Permission Error
echo ========================================
echo Fixing Next.js Build Permission Error
echo ========================================
echo.

REM Stop any running Next.js processes
echo [1/4] Stopping any running Next.js processes...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 >nul

REM Delete .next folder
echo [2/4] Removing .next directory...
if exist .next (
    rmdir /s /q .next
    echo [OK] .next directory removed
) else (
    echo [OK] .next directory doesn't exist
)

REM Delete node_modules/.cache if exists
echo [3/4] Cleaning cache...
if exist node_modules\.cache (
    rmdir /s /q node_modules\.cache
    echo [OK] Cache cleaned
)

REM Clear npm cache
echo [4/4] Clearing npm cache...
call npm cache clean --force
echo [OK] npm cache cleared

echo.
echo ========================================
echo Cleanup complete!
echo ========================================
echo.
echo Now try building again:
echo   npm run build
echo.
pause

