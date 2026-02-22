# 🔧 Railway Root Directory Fix

## ❌ The Problem

Railway is trying to build from the **root directory** which contains both `Frontend/` and `Prediction/` folders. Nixpacks can't determine which one to build, causing the error:

```
Nixpacks was unable to generate a build plan for this app.
```

## ✅ The Solution

You need to tell Railway to use the `Prediction` directory as the root directory.

---

## 🚀 Fix Steps (Choose ONE method)

### Method 1: Set Root Directory in Railway Dashboard (RECOMMENDED)

1. **Go to Railway Dashboard**
   - Visit: https://railway.app
   - Open your project

2. **Go to Settings**
   - Click on your service/project
   - Click **Settings** tab

3. **Set Root Directory**
   - Scroll down to **Root Directory**
   - Enter: `Prediction`
   - Click **Save**

4. **Redeploy**
   - Railway will automatically redeploy with the new root directory
   - Or click **Redeploy** manually

---

### Method 2: Delete and Recreate Service

If Method 1 doesn't work:

1. **Delete the current service** in Railway
2. **Create a new service**:
   - Click "New" → "GitHub Repo"
   - Select your repository
   - **IMPORTANT**: Before clicking "Deploy", go to **Settings**
   - Set **Root Directory** to: `Prediction`
   - Then click "Deploy"

---

## ✅ After Setting Root Directory

Once Railway is building from `Prediction/`, it will:
1. ✅ Detect `requirements.txt` (Python project)
2. ✅ Use `nixpacks.toml` for build configuration
3. ✅ Install dependencies
4. ✅ Run migrations
5. ✅ Collect static files
6. ✅ Start Gunicorn server

---

## 🔍 Verify It's Working

After setting the root directory, check the build logs. You should see:
- ✅ "Detected Python project"
- ✅ "Installing dependencies from requirements.txt"
- ✅ "Building application..."
- ✅ "Starting server..."

---

## 📝 Environment Variables

Don't forget to add these in Railway **Variables** tab:

```
SECRET_KEY=54^z6@&-er77om9u2njpm3_fzup0v66zmj6#bglb=ag%+(cd9q
DEBUG=False
GOOGLE_API_KEY=AIzaSyDDGQNiaVLLZ1NFeh2FXxuvl12iGRjTHVs
ALLOWED_HOSTS=*.railway.app
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

---

## 🎯 Quick Checklist

- [ ] Set Root Directory to `Prediction` in Railway Settings
- [ ] Add all environment variables
- [ ] Redeploy
- [ ] Check build logs for success
- [ ] Test backend URL

---

**The root directory setting is the key!** Once Railway knows to build from `Prediction/`, everything should work. 🚀
