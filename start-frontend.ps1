# Career Path Recommendation System - Frontend Startup Script
# Run this script in PowerShell (in a separate terminal)

Write-Host "=== Starting Frontend Server ===" -ForegroundColor Green

# Navigate to Frontend directory
Set-Location "Frontend"

# Check if node_modules exists
if (Test-Path "node_modules") {
    Write-Host "Dependencies already installed." -ForegroundColor Yellow
} else {
    Write-Host "Installing npm dependencies..." -ForegroundColor Yellow
    npm install
}

# Start Vite development server
Write-Host "Starting Vite development server on http://localhost:5173..." -ForegroundColor Green
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Cyan
npm run dev
