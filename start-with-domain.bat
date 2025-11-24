@echo off
REM WhySoCheap - Start with Custom Domain
REM This script helps you start your app with domain support

echo ========================================
echo WhySoCheap - Local Domain Setup
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo [1/4] Building the application...
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Build failed!
    pause
    exit /b 1
)

echo.
echo [2/4] Starting Next.js server...
start /B npm start
timeout /t 3 >nul

echo.
echo [3/4] Checking for tunneling tools...
echo.

REM Check for ngrok
where ngrok >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [INFO] ngrok found!
    echo.
    echo Choose your tunneling method:
    echo 1. ngrok (requires account, free tier available)
    echo 2. Cloudflare Tunnel (requires Cloudflare account, free)
    echo 3. localtunnel (no account needed, quick test)
    echo 4. Skip tunneling (access via localhost only)
    echo.
    set /p choice="Enter choice (1-4): "
    
    if "%choice%"=="1" (
        echo.
        echo [INFO] Starting ngrok...
        echo [INFO] Make sure you've configured your domain in ngrok dashboard
        echo [INFO] Command: ngrok http 3000 --domain=yourdomain.com
        echo.
        ngrok http 3000 --domain=yourdomain.com
    ) else if "%choice%"=="2" (
        echo.
        echo [INFO] Starting Cloudflare Tunnel...
        echo [INFO] Make sure you've set up your tunnel first
        echo [INFO] Command: cloudflared tunnel run whysocheap
        echo.
        cloudflared tunnel run whysocheap
    ) else if "%choice%"=="3" (
        echo.
        echo [INFO] Starting localtunnel...
        echo [INFO] Installing localtunnel if needed...
        call npm install -g localtunnel
        echo [INFO] Starting tunnel...
        lt --port 3000
    ) else (
        echo.
        echo [INFO] Skipping tunneling
        echo [INFO] Your app is running at: http://localhost:3000
        echo [INFO] Press Ctrl+C to stop
        pause
    )
) else (
    echo [WARNING] ngrok not found
    echo.
    echo To use your domain, you need a tunneling tool:
    echo.
    echo Option 1: Install ngrok
    echo   1. Download from https://ngrok.com/download
    echo   2. Extract to a folder in your PATH
    echo   3. Sign up at https://dashboard.ngrok.com
    echo   4. Run: ngrok config add-authtoken YOUR_TOKEN
    echo.
    echo Option 2: Install Cloudflare Tunnel
    echo   1. Download from https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/installation/
    echo   2. Run: cloudflared tunnel login
    echo   3. Run: cloudflared tunnel create whysocheap
    echo.
    echo Option 3: Use localtunnel (quick test)
    echo   1. Run: npm install -g localtunnel
    echo   2. Run: lt --port 3000
    echo.
    echo Your app is running at: http://localhost:3000
    echo Press Ctrl+C to stop
    pause
)

