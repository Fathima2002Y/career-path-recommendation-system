# 🚂 Railway Deployment Fix Guide

## ✅ What Was Fixed

1. **Added WhiteNoise middleware** - For serving static files in production
2. **Fixed DEBUG setting** - Now properly handles 'False' string
3. **Updated Procfile** - Added `--noinput` flags for non-interactive deployment
4. **Updated railway.json** - Includes collectstatic in start command
5. **Created nixpacks.toml** - Better build control for Railway

## 🚀 Railway Deployment Steps

### Step 1: Push Changes to GitHub

```bash
cd C:\Users\LENOVO\Downloads\career-path-recommendation-system-main
git add .
git commit -m "Fix Railway deployment configuration"
git push origin main
```

### Step 2: Deploy on Railway

1. **Go to Railway**: https://railway.app
2. **New Project** → **Deploy from GitHub repo**
3. **Select**: `Fathima2002Y/career-path-recommendation-system`
4. **Settings**:
   - **Root Directory**: `Prediction`
   - **Build Command**: (Leave empty - nixpacks will handle it)
   - **Start Command**: (Leave empty - nixpacks.toml will handle it)

### Step 3: Add Environment Variables

In Railway dashboard, go to **Variables** tab and add:

```
SECRET_KEY=54^z6@&-er77om9u2njpm3_fzup0v66zmj6#bglb=ag%+(cd9q
DEBUG=False
GOOGLE_API_KEY=AIzaSyDDGQNiaVLLZ1NFeh2FXxuvl12iGRjTHVs
ALLOWED_HOSTS=*.railway.app
CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app
PORT=8000
```

**Note**: Replace `https://your-frontend.vercel.app` with your actual Vercel URL after deploying frontend.

### Step 4: Wait for Deployment

- Railway will automatically:
  1. Detect Python project
  2. Install dependencies from `requirements.txt`
  3. Run migrations
  4. Collect static files
  5. Start Gunicorn server

### Step 5: Get Your Backend URL

1. Go to **Settings** → **Networking**
2. Click **Generate Domain**
3. Copy your Railway URL (e.g., `https://your-app.railway.app`)

---

## 🔍 Troubleshooting

### If Build Fails:

1. **Check Build Logs** in Railway dashboard
2. **Common Issues**:
   - Missing dependencies → Check `requirements.txt`
   - Python version mismatch → Check `runtime.txt`
   - Static files error → Check `STATIC_ROOT` in settings.py

### If Deployment Fails:

1. **Check Deploy Logs** in Railway dashboard
2. **Common Issues**:
   - Database migration errors → Check migrations are up to date
   - Port binding error → Check `$PORT` environment variable
   - Static files not found → Check WhiteNoise is installed

### If App Doesn't Start:

1. **Check Start Command** in Railway settings
2. **Verify Environment Variables** are set correctly
3. **Check Logs** for specific error messages

---

## 📝 Important Notes

- ✅ **WhiteNoise** is now configured for static files
- ✅ **Migrations** run automatically on deploy
- ✅ **Static files** are collected automatically
- ✅ **Gunicorn** binds to `$PORT` (Railway provides this)
- ✅ **DEBUG=False** in production (set via environment variable)

---

## 🔄 After Backend is Live

1. Copy your Railway backend URL
2. Deploy frontend to Vercel
3. Update `CORS_ALLOWED_ORIGINS` in Railway with Vercel URL
4. Update `VITE_API_BASE_URL` in Vercel with Railway URL

---

**Ready to deploy?** Push the changes and follow the steps above! 🚀
