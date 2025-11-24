@echo off
REM ============================================
REM Start Next.js Dev Server for Network Access
REM Access from phone: http://YOUR_IP:3000
REM ============================================

echo.
echo ============================================
echo   Starting Next.js Dev Server (Network Mode)
echo ============================================
echo.

REM Find and display IP address
echo Finding your IP address...
echo.

for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4 Address"') do (
    set IP=%%a
    set IP=!IP:~1!
    echo ============================================
    echo   Your IP Address: !IP!
    echo ============================================
    echo.
    echo On your phone, open:
    echo   http://!IP!:3000
    echo.
    echo Make sure your phone is on the SAME Wi-Fi network!
    echo.
    echo ============================================
    echo   Starting server...
    echo ============================================
    echo.
    goto :start
)

:start
REM Start Next.js with network access
npm run dev:network

pause

