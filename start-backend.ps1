# Career Path Recommendation System - Backend Startup Script
# Run this script in PowerShell

Write-Host "=== Starting Backend Server ===" -ForegroundColor Green

# Navigate to Prediction directory
Set-Location "Prediction"

# Check if virtual environment exists
if (Test-Path "venv") {
    Write-Host "Virtual environment found." -ForegroundColor Yellow
} else {
    Write-Host "Creating virtual environment..." -ForegroundColor Yellow
    python -m venv venv
}

# Activate virtual environment (handle execution policy)
Write-Host "Activating virtual environment..." -ForegroundColor Yellow
$env:VIRTUAL_ENV = Join-Path $PWD "venv"
$env:PATH = "$env:VIRTUAL_ENV\Scripts;$env:PATH"

# Verify activation
if (Test-Path "$env:VIRTUAL_ENV\Scripts\python.exe") {
    Write-Host "Virtual environment activated successfully!" -ForegroundColor Green
} else {
    Write-Host "Failed to activate virtual environment!" -ForegroundColor Red
    exit 1
}

# Install/upgrade pip
Write-Host "Upgrading pip..." -ForegroundColor Yellow
python -m pip install --upgrade pip --quiet

# Install dependencies
Write-Host "Installing Python dependencies..." -ForegroundColor Yellow
pip install -r requirements.txt

# Run migrations
Write-Host "Running Django migrations..." -ForegroundColor Yellow
python manage.py migrate

# Start Django server
Write-Host "Starting Django server on http://localhost:8000..." -ForegroundColor Green
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Cyan
python manage.py runserver 8000
