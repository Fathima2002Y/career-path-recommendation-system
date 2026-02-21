# GitHub Setup Script for Career Path Recommendation System
# Run this script to prepare your project for GitHub

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "GitHub Setup Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if git is installed
$gitCheck = git --version 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Git is installed: $gitCheck" -ForegroundColor Green
} else {
    Write-Host "✗ Git is not installed. Please install Git first." -ForegroundColor Red
    Write-Host "Download from: https://git-scm.com/download/win" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "Step 1: Initializing Git repository..." -ForegroundColor Yellow

# Initialize git if not already initialized
if (Test-Path ".git") {
    Write-Host "✓ Git repository already initialized" -ForegroundColor Green
} else {
    git init
    Write-Host "✓ Git repository initialized" -ForegroundColor Green
}

Write-Host ""
Write-Host "Step 2: Checking .gitignore..." -ForegroundColor Yellow

if (Test-Path ".gitignore") {
    Write-Host "✓ .gitignore file exists" -ForegroundColor Green
} else {
    Write-Host "✗ .gitignore not found" -ForegroundColor Red
}

Write-Host ""
Write-Host "Step 3: Adding files to git..." -ForegroundColor Yellow
git add .

Write-Host ""
Write-Host "Step 4: Checking what will be committed..." -ForegroundColor Yellow
Write-Host "IMPORTANT: Make sure .env files are NOT in this list!" -ForegroundColor Red
Write-Host ""
git status --short | Select-Object -First 20

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Review the files above - make sure .env is NOT listed" -ForegroundColor Yellow
Write-Host "2. Create initial commit:" -ForegroundColor Yellow
Write-Host "   git commit -m 'Initial commit: Career Path Recommendation System'" -ForegroundColor White
Write-Host ""
Write-Host "3. Create repository on GitHub:" -ForegroundColor Yellow
Write-Host "   Go to: https://github.com/new" -ForegroundColor White
Write-Host "   Repository name: career-path-recommendation-system" -ForegroundColor White
Write-Host "   DO NOT initialize with README/gitignore" -ForegroundColor White
Write-Host ""
Write-Host "4. Connect and push:" -ForegroundColor Yellow
Write-Host "   git remote add origin https://github.com/Fathima2002Y/career-path-recommendation-system.git" -ForegroundColor White
Write-Host "   git branch -M main" -ForegroundColor White
Write-Host "   git push -u origin main" -ForegroundColor White
Write-Host ""
Write-Host "For detailed instructions, see GITHUB_SETUP.md" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
