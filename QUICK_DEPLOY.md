# 🚀 Quick Deployment Guide

## Fastest Way: Railway + Vercel (Recommended)

### Step 1: Deploy Backend to Railway (5 minutes)

1. **Go to [railway.app](https://railway.app)** and sign up with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Configure Backend**
   - Set **Root Directory** to: `Prediction`
   - Railway will auto-detect Python
   - Add these **Environment Variables**:
     ```
     SECRET_KEY=run-python-generate_secret_key.py-to-get-this
     DEBUG=False
     GOOGLE_API_KEY=AIzaSyBCyLZjHtCIMVwgNdcbKF5tmTzpQiyO8IA
     ALLOWED_HOSTS=*.railway.app
     CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app
     ```

4. **Deploy**
   - Railway will automatically build and deploy
   - Copy your backend URL (e.g., `https://your-app.railway.app`)

### Step 2: Deploy Frontend to Vercel (3 minutes)

1. **Go to [vercel.com](https://vercel.com)** and sign up with GitHub

2. **Import Project**
   - Click "New Project"
   - Import your GitHub repository
   - Set **Root Directory** to: `Frontend`

3. **Configure Environment Variable**
   - Add: `VITE_API_BASE_URL` = `https://your-backend-url.railway.app/api`
   - Replace `your-backend-url` with your actual Railway URL

4. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy automatically
   - Copy your frontend URL

### Step 3: Update CORS (1 minute)

1. Go back to Railway dashboard
2. Update `CORS_ALLOWED_ORIGINS` to your Vercel URL:
   ```
   CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app
   ```
3. Railway will automatically redeploy

### Step 4: Generate Secret Key

Run this command in the Prediction folder:
```bash
cd Prediction
python generate_secret_key.py
```

Copy the generated key and update `SECRET_KEY` in Railway environment variables.

---

## ✅ That's It!

Your app is now live:
- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-app.railway.app`

---

## 🔧 Alternative: Render (Free Tier)

### Backend on Render

1. Go to [render.com](https://render.com)
2. New → Web Service
3. Connect GitHub repo
4. Settings:
   - Root Directory: `Prediction`
   - Build: `pip install -r requirements.txt && python manage.py collectstatic --noinput`
   - Start: `gunicorn backend.wsgi:application --bind 0.0.0.0:$PORT`
5. Add environment variables (same as Railway)
6. Deploy

### Frontend on Vercel (same as above)

---

## 📝 Important Notes

1. **Generate Secret Key**: Always use `generate_secret_key.py` for production
2. **Update CORS**: Make sure frontend URL is in `CORS_ALLOWED_ORIGINS`
3. **Environment Variables**: Never commit `.env` files to Git
4. **HTTPS**: Both platforms provide HTTPS automatically

---

## 🐛 Common Issues

**CORS Errors**: Update `CORS_ALLOWED_ORIGINS` with your frontend URL

**404 Errors**: Check that `VITE_API_BASE_URL` points to your backend

**Static Files**: Railway/Render handle this automatically

---

For detailed instructions, see `DEPLOYMENT.md`
