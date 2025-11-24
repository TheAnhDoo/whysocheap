@echo off
REM ============================================
REM Cloudflare Tunnel Startup Script
REM For whysocheap.site
REM ============================================

echo.
echo ============================================
echo   Starting WhySoCheap Website
echo   Domain: whysocheap.site
echo ============================================
echo.

REM Change to project directory
cd /d "%~dp0"

REM Check if Node.js is installed
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org
    pause
    exit /b 1
)

REM Check if cloudflared is installed
where cloudflared >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] cloudflared is not installed or not in PATH
    echo Please install cloudflared:
    echo   choco install cloudflared
    echo   OR download from: https://github.com/cloudflare/cloudflared/releases
    pause
    exit /b 1
)

REM Check if .env.local exists
if not exist ".env.local" (
    echo [WARNING] .env.local file not found
    echo Make sure you have configured your environment variables
    echo.
)

REM Build the application
echo [1/4] Building Next.js application...
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Build failed!
    pause
    exit /b 1
)
echo [OK] Build completed successfully
echo.

REM Start Next.js app in a new window
echo [2/4] Starting Next.js server...
start "WhySoCheap - Next.js App" cmd /k "npm start"
echo [OK] Next.js server starting in new window
echo.

REM Wait for server to start
echo [3/4] Waiting for server to be ready...
timeout /t 10 /nobreak >nul
echo [OK] Server should be ready
echo.

REM Start Cloudflare Tunnel
echo [4/4] Starting Cloudflare Tunnel...
echo.
echo ============================================
echo   Tunnel starting...
echo   Your site will be available at:
echo   https://whysocheap.site
echo   https://www.whysocheap.site
echo ============================================
echo.
echo [INFO] Keep this window open to keep the tunnel running
echo [INFO] Press Ctrl+C to stop the tunnel
echo.

cloudflared tunnel run whysocheap

REM If tunnel stops, show message
echo.
echo [INFO] Tunnel stopped. Press any key to exit...
pause >nul

