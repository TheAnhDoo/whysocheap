# Fix Next.js Build Permission Error (PowerShell)
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Fixing Next.js Build Permission Error" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Stop any running Next.js processes
Write-Host "[1/4] Stopping any running Node.js processes..." -ForegroundColor Yellow
$nodeProcesses = Get-Process -Name node -ErrorAction SilentlyContinue
if ($nodeProcesses) {
    Stop-Process -Name node -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 2
    Write-Host "[OK] Node.js processes stopped" -ForegroundColor Green
} else {
    Write-Host "[OK] No Node.js processes running" -ForegroundColor Green
}

# Delete .next folder
Write-Host "[2/4] Removing .next directory..." -ForegroundColor Yellow
if (Test-Path ".next") {
    Remove-Item -Path ".next" -Recurse -Force -ErrorAction SilentlyContinue
    Write-Host "[OK] .next directory removed" -ForegroundColor Green
} else {
    Write-Host "[OK] .next directory doesn't exist" -ForegroundColor Green
}

# Delete node_modules/.cache if exists
Write-Host "[3/4] Cleaning cache..." -ForegroundColor Yellow
if (Test-Path "node_modules\.cache") {
    Remove-Item -Path "node_modules\.cache" -Recurse -Force -ErrorAction SilentlyContinue
    Write-Host "[OK] Cache cleaned" -ForegroundColor Green
}

# Clear npm cache
Write-Host "[4/4] Clearing npm cache..." -ForegroundColor Yellow
npm cache clean --force | Out-Null
Write-Host "[OK] npm cache cleared" -ForegroundColor Green

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Cleanup complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Now try building again:" -ForegroundColor Yellow
Write-Host "  npm run build" -ForegroundColor White
Write-Host ""

