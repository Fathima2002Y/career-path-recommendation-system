# Career Path Recommendation System - Startup Instructions

## Quick Start (Windows PowerShell)

### Option 1: Using PowerShell Scripts (Recommended)

**Terminal 1 - Backend:**
```powershell
.\start-backend.ps1
```

**Terminal 2 - Frontend (open a new terminal):**
```powershell
.\start-frontend.ps1
```

---

### Option 2: Manual Commands

#### Terminal 1 - Backend Server

Copy and paste these commands one by one:

```powershell
# Navigate to Prediction folder
Set-Location Prediction

# Check if venv exists, create if not
if (-not (Test-Path venv)) {
    python -m venv venv
    Write-Host "Virtual environment created" -ForegroundColor Green
}

# Activate virtual environment (Windows PowerShell method)
$env:VIRTUAL_ENV = "$PWD\venv"
$env:PATH = "$env:VIRTUAL_ENV\Scripts;$env:PATH"

# Verify activation
python --version
pip --version

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Start Django server
python manage.py runserver 8000
```

**Expected output:** 
- Server running at `http://127.0.0.1:8000/`
- You should see: `Starting development server at http://127.0.0.1:8000/`

---

#### Terminal 2 - Frontend Server (New Terminal Window)

Open a **new PowerShell terminal** and run:

```powershell
# Navigate to Frontend folder
Set-Location Frontend

# Install dependencies (if not already installed)
if (-not (Test-Path node_modules)) {
    npm install
}

# Start Vite development server
npm run dev
```

**Expected output:**
- Vite dev server URL: `http://localhost:5173/`
- You should see: `Local: http://localhost:5173/`

---

## Troubleshooting

### If you get "execution policy" error:

Run this command first (as Administrator if needed):
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### If virtual environment activation fails:

Try this alternative activation method:
```powershell
& ".\venv\Scripts\Activate.ps1"
```

If that fails, use the manual PATH method (already included in the commands above).

### If backend server doesn't start:

1. Check if port 8000 is already in use:
```powershell
netstat -ano | findstr :8000
```

2. Kill the process if needed, or use a different port:
```powershell
python manage.py runserver 8001
```

### If frontend doesn't start:

1. Check if port 5173 is already in use:
```powershell
netstat -ano | findstr :5173
```

2. Clear node_modules and reinstall:
```powershell
Remove-Item -Recurse -Force node_modules
npm install
```

### Check if servers are running:

```powershell
# Check backend
Invoke-WebRequest -Uri http://localhost:8000/ -UseBasicParsing

# Check frontend (in browser)
# Open: http://localhost:5173
```

---

## Verification

1. **Backend Test**: Open browser and go to `http://localhost:8000/`
   - Should see JSON response with API status

2. **Frontend Test**: Open browser and go to `http://localhost:5173/`
   - Should see the Career Path Recommendation System homepage

3. **API Connection**: The frontend should automatically connect to the backend at `http://localhost:8000`

---

## Stopping the Servers

- **Backend**: Press `Ctrl+C` in Terminal 1
- **Frontend**: Press `Ctrl+C` in Terminal 2

---

## Environment Variables

Make sure you have a `.env` file in the `Prediction` folder with:
```
GOOGLE_API_KEY=your_google_api_key_here
```

This is required for chatbot and voice assistant features to work.

---

## Notes

- Both servers must be running simultaneously
- Backend must start before testing frontend API calls
- Virtual environment activation persists in the same PowerShell session
- If you close the terminal, you'll need to reactivate the venv
