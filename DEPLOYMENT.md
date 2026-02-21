# Deployment Guide - Career Path Recommendation System

This guide covers deploying the full-stack application to various platforms.

## 🚀 Quick Deploy Options

### Option 1: Railway (Recommended - Easiest)

Railway supports both backend and frontend deployment.

#### Backend Deployment (Railway)

1. **Create Railway Account**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Deploy Backend**
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository
   - Railway will auto-detect Python
   - Set root directory to: `Prediction`
   - Add environment variables:
     ```
     SECRET_KEY=your-secret-key-here
     DEBUG=False
     GOOGLE_API_KEY=your-google-api-key
     ALLOWED_HOSTS=your-app.railway.app
     CORS_ALLOWED_ORIGINS=https://your-frontend-url.vercel.app
     ```
   - Railway will automatically deploy

3. **Get Backend URL**
   - Copy the generated URL (e.g., `https://your-app.railway.app`)

#### Frontend Deployment (Vercel)

1. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub
   - Click "New Project" → Import your repository
   - Set root directory to: `Frontend`
   - Add environment variable:
     ```
     VITE_API_BASE_URL=https://your-backend-url.railway.app/api
     ```
   - Deploy

---

### Option 2: Render (Alternative)

#### Backend on Render

1. **Create Render Account**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub

2. **Deploy Backend**
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Settings:
     - **Name**: career-path-backend
     - **Root Directory**: Prediction
     - **Environment**: Python 3
     - **Build Command**: `pip install -r requirements.txt && python manage.py collectstatic --noinput`
     - **Start Command**: `gunicorn backend.wsgi:application --bind 0.0.0.0:$PORT`
   - Add environment variables:
     ```
     SECRET_KEY=your-secret-key-here
     DEBUG=False
     GOOGLE_API_KEY=your-google-api-key
     ALLOWED_HOSTS=your-app.onrender.com
     CORS_ALLOWED_ORIGINS=https://your-frontend-url.vercel.app
     ```
   - Deploy

#### Frontend on Vercel

Same as Option 1.

---

### Option 3: Docker Deployment

#### Backend with Docker

1. **Build Docker Image**
   ```bash
   cd Prediction
   docker build -t career-path-backend .
   ```

2. **Run Container**
   ```bash
   docker run -p 8000:8000 \
     -e SECRET_KEY=your-secret-key \
     -e DEBUG=False \
     -e GOOGLE_API_KEY=your-api-key \
     -e ALLOWED_HOSTS=your-domain.com \
     career-path-backend
   ```

#### Frontend Build

```bash
cd Frontend
npm run build
# Deploy the 'dist' folder to any static hosting (Netlify, Vercel, etc.)
```

---

## 📋 Pre-Deployment Checklist

### Backend

- [ ] Update `SECRET_KEY` in environment variables
- [ ] Set `DEBUG=False` in production
- [ ] Update `ALLOWED_HOSTS` with your domain
- [ ] Update `CORS_ALLOWED_ORIGINS` with frontend URL
- [ ] Add `GOOGLE_API_KEY` to environment variables
- [ ] Install `gunicorn`: `pip install gunicorn`
- [ ] Test migrations: `python manage.py migrate`
- [ ] Collect static files: `python manage.py collectstatic`

### Frontend

- [ ] Update `VITE_API_BASE_URL` with backend URL
- [ ] Build for production: `npm run build`
- [ ] Test production build locally: `npm run preview`

---

## 🔧 Environment Variables

### Backend (.env or Platform Settings)

```env
SECRET_KEY=your-django-secret-key-here
DEBUG=False
GOOGLE_API_KEY=your-google-api-key
ALLOWED_HOSTS=your-backend-domain.com
CORS_ALLOWED_ORIGINS=https://your-frontend-domain.com
```

### Frontend (Platform Settings)

```env
VITE_API_BASE_URL=https://your-backend-domain.com/api
```

---

## 🛠️ Manual Deployment Steps

### Backend (Production Setup)

1. **Install Production Server**
   ```bash
   pip install gunicorn
   ```

2. **Run Migrations**
   ```bash
   python manage.py migrate
   ```

3. **Collect Static Files**
   ```bash
   python manage.py collectstatic --noinput
   ```

4. **Start with Gunicorn**
   ```bash
   gunicorn backend.wsgi:application --bind 0.0.0.0:8000
   ```

### Frontend (Production Build)

1. **Build for Production**
   ```bash
   cd Frontend
   npm run build
   ```

2. **Preview Build**
   ```bash
   npm run preview
   ```

3. **Deploy `dist` folder** to your hosting platform

---

## 🌐 Platform-Specific Instructions

### Railway

- Uses `railway.json` for configuration
- Automatically detects Python projects
- Supports environment variables
- Free tier available

### Render

- Uses `render.yaml` for configuration
- Supports Python web services
- Free tier available (with limitations)

### Vercel

- Uses `vercel.json` for configuration
- Perfect for React/Vite apps
- Free tier with excellent performance
- Automatic HTTPS

### Heroku

1. Install Heroku CLI
2. Login: `heroku login`
3. Create app: `heroku create your-app-name`
4. Set config vars in Heroku dashboard
5. Deploy: `git push heroku main`

---

## 🔐 Security Checklist

- [ ] Change `SECRET_KEY` to a secure random string
- [ ] Set `DEBUG=False` in production
- [ ] Configure `ALLOWED_HOSTS` properly
- [ ] Use HTTPS (most platforms provide this automatically)
- [ ] Keep `GOOGLE_API_KEY` secret
- [ ] Enable CORS only for your frontend domain
- [ ] Regularly update dependencies

---

## 📝 Generate Secret Key

Run this to generate a secure Django secret key:

```python
from django.core.management.utils import get_random_secret_key
print(get_random_secret_key())
```

---

## 🐛 Troubleshooting

### Backend Issues

- **Static files not loading**: Run `python manage.py collectstatic`
- **CORS errors**: Check `CORS_ALLOWED_ORIGINS` matches frontend URL
- **Database errors**: Run `python manage.py migrate`
- **Port issues**: Use `$PORT` environment variable (platforms set this automatically)

### Frontend Issues

- **API connection failed**: Check `VITE_API_BASE_URL` is correct
- **Build errors**: Run `npm install` and check for dependency issues
- **404 on routes**: Configure your hosting to serve `index.html` for all routes

---

## 📚 Additional Resources

- [Django Deployment Checklist](https://docs.djangoproject.com/en/stable/howto/deployment/checklist/)
- [Vite Production Build](https://vitejs.dev/guide/build.html)
- [Railway Documentation](https://docs.railway.app/)
- [Render Documentation](https://render.com/docs)
- [Vercel Documentation](https://vercel.com/docs)

---

## ✅ Post-Deployment

1. Test all features:
   - User registration
   - Quiz submission
   - Career prediction
   - Chatbot
   - Voice assistant
   - Sentiment analysis

2. Monitor logs for errors

3. Set up error tracking (optional):
   - Sentry
   - LogRocket
   - Rollbar

---

**Need Help?** Check the platform-specific documentation or open an issue in the repository.
