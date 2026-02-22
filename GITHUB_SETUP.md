# 📦 GitHub Setup & Deployment Guide

## Step 1: Initialize Git Repository (if not already done)

```bash
# Navigate to project root
cd C:\Users\LENOVO\Downloads\career-path-recommendation-system-main

# Initialize git (if not already initialized)
git init

# Check current status
git status
```

## Step 2: Add All Files (Except .env)

```bash
# Add all files
git add .

# Check what will be committed (make sure .env is NOT included)
git status
```

## Step 3: Create Initial Commit

```bash
git commit -m "Initial commit: Career Path Recommendation System with deployment config"
```

## Step 4: Create GitHub Repository

1. **Go to GitHub**: https://github.com/Fathima2002Y
2. **Click "New"** (or go to https://github.com/new)
3. **Repository Settings**:
   - Repository name: `career-path-recommendation-system` (or your preferred name)
   - Description: "AI-powered Career Path Recommendation System with ML, NLP, and Chatbot"
   - Visibility: Public or Private (your choice)
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
4. **Click "Create repository"**

## Step 5: Connect and Push to GitHub

```bash
# Add your GitHub repository as remote
git remote add origin https://github.com/Fathima2002Y/career-path-recommendation-system.git

# Or if you used a different name:
# git remote add origin https://github.com/Fathima2002Y/YOUR-REPO-NAME.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Step 6: Verify on GitHub

1. Go to https://github.com/Fathima2002Y/career-path-recommendation-system
2. Verify all files are uploaded
3. **IMPORTANT**: Make sure `.env` file is NOT visible (it should be in .gitignore)

---

## 🚀 After GitHub Setup: Deploy to Production

### Quick Deploy Steps:

#### 1. Deploy Backend to Railway

1. Go to https://railway.app
2. Sign up/login with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select: `Fathima2002Y/career-path-recommendation-system`
5. **Settings**:
   - Root Directory: `Prediction`
   - Add Environment Variables:
     ```
     SECRET_KEY=54^z6@&-er77om9u2njpm3_fzup0v66zmj6#bglb=ag%+(cd9q
     DEBUG=False
     GOOGLE_API_KEY=AIzaSyDDGQNiaVLLZ1NFeh2FXxuvl12iGRjTHVs
     ALLOWED_HOSTS=*.railway.app
     ```
6. Wait for deployment
7. Copy your Railway backend URL

#### 2. Deploy Frontend to Vercel

1. Go to https://vercel.com
2. Sign up/login with GitHub
3. Click "New Project" → Import `Fathima2002Y/career-path-recommendation-system`
4. **Settings**:
   - Root Directory: `Frontend`
   - Environment Variable:
     ```
     VITE_API_BASE_URL=https://YOUR-RAILWAY-URL.railway.app/api
     ```
5. Deploy
6. Copy your Vercel frontend URL

#### 3. Update CORS in Railway

1. Go back to Railway dashboard
2. Update environment variable:
   ```
   CORS_ALLOWED_ORIGINS=https://YOUR-VERCEL-URL.vercel.app
   ```
3. Railway will auto-redeploy

---

## ✅ Checklist Before Pushing to GitHub

- [ ] `.env` file is in `.gitignore` (should NOT be committed)
- [ ] All deployment files are added
- [ ] No sensitive data in code
- [ ] README.md is updated (optional)
- [ ] All features tested locally

---

## 🔒 Security Reminders

1. **Never commit `.env` files** - They contain your API keys
2. **Use environment variables** in deployment platforms
3. **Generate new SECRET_KEY** for production (already done)
4. **Keep GOOGLE_API_KEY secret**

---

## 📝 Next Steps After GitHub Push

1. ✅ Push code to GitHub
2. ✅ Deploy backend to Railway
3. ✅ Deploy frontend to Vercel
4. ✅ Update CORS settings
5. ✅ Test deployed application
6. ✅ Share your live URL! 🎉

---

**Ready?** Follow the steps above to push to GitHub, then deploy! 🚀
