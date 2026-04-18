# 🎯 AI-Powered Career Guidance Platform

An intelligent career guidance system that helps freshers and students discover their ideal career path using **Machine Learning**, **AI-powered analysis** (Groq LLM), and personalized recommendations. The platform offers career quizzes, resume analysis, career roadmaps, job/internship listings, and AI chat & voice assistants — all in one place.

---

## ✨ Features

### 🔐 User Authentication (JWT)
- Secure sign-up and sign-in with JWT tokens
- Persistent sessions with automatic token refresh
- Protected routes — all features require login

### 📝 Career Quiz (ML-Powered)
- 19-question quiz evaluating skills, interests, and preferences
- **Decision Tree ML model** predicts the best-matching role from 12 core IT career paths
- **AI enhancement**: Gemini/Groq suggests 5+ additional career roles beyond the ML prediction
- Confidence score for each prediction

### 📄 Resume Analyzer (AI-Powered)
- Drag-and-drop PDF resume upload
- AI extracts skills and competencies from resume text
- Suggests 8-10 matching career roles with match percentages
- One-click navigation to career roadmaps and job search for any suggested role

### 🗺️ Career Roadmap Generator
- Enter any career role and get a comprehensive learning roadmap
- Covers 6-12 months in phased milestones
- Includes required skills (with priority levels), recommended certifications, interview tips, salary ranges, and growth prospects
- AI-generated using Groq (Llama 3.3) or Gemini

### 💼 Job & Internship Finder
- Search jobs by role, location, and type (job/internship/all)
- AI generates realistic, current job listings from top companies
- Includes salary ranges, required skills, experience levels, and apply links
- Focused on entry-level and fresher opportunities

### 💬 AI Chat Assistant
- Career guidance chatbot powered by Groq/Gemini
- Context-aware responses using a career guidance knowledge base (PDF)
- Ask any career-related question and get detailed answers

### 🎙️ Voice Assistant
- Voice-based career guidance interaction
- Text-to-speech output for hands-free experience
- Same AI backend as the chat assistant

### 📊 User Dashboard
- Personalized welcome with quick action cards
- View prediction history and resume analysis history
- One-click access to all features

### 📈 Sentiment Analysis
- Feedback form after quiz predictions
- Analyzes user satisfaction with results

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| **Django 5.0** | Web framework |
| **Django REST Framework** | REST API |
| **SimpleJWT** | JWT authentication |
| **Groq API** | AI — Llama 3.3 70B for all AI features |
| **scikit-learn** | ML model (Decision Tree) |
| **PyPDF2** | Resume PDF text extraction |
| **pyttsx3** | Text-to-speech for voice assistant |
| **SQLite** | Database |

### Frontend
| Technology | Purpose |
|---|---|
| **React 18** | UI framework |
| **Vite** | Build tool & dev server |
| **Redux Toolkit** | State management |
| **React Router v6** | Client-side routing |
| **Framer Motion** | Animations |
| **Three.js** | 3D Earth model on landing page |
| **Tailwind CSS** | Styling |
| **SweetAlert2** | Notifications |

---

## 📁 Project Structure

```
career-path-recommendation-system-main/
├── Frontend/                    # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── pages/
│   │   │   │   ├── Dashboard.jsx    # User dashboard
│   │   │   │   ├── ResumeUpload.jsx # Resume analyzer
│   │   │   │   ├── Guidance.jsx     # Career roadmap
│   │   │   │   ├── Jobs.jsx         # Job/internship finder
│   │   │   │   ├── Quiz.jsx         # Career quiz
│   │   │   │   ├── Predict.jsx      # Quiz results + AI roles
│   │   │   │   ├── Chat.jsx         # AI chatbot
│   │   │   │   ├── Voice.jsx        # Voice assistant
│   │   │   │   ├── SignIn.jsx       # Login
│   │   │   │   └── SignUp.jsx       # Registration
│   │   │   └── Navbar.jsx           # Navigation bar
│   │   ├── utils/
│   │   │   └── api.js               # API client with JWT
│   │   └── App.jsx                  # Routes & protected routes
│   ├── features/
│   │   └── auth/authSlice.js        # Redux auth state
│   ├── app/store.js                 # Redux store
│   └── vite.config.js               # Vite + proxy config
│
├── Prediction/                  # Django backend
│   ├── backend/                 # Django project config
│   │   ├── settings.py
│   │   └── urls.py
│   ├── prediction/              # Core app: auth, quiz, ML
│   │   ├── models.py            # UserModel, PredictionHistory
│   │   ├── views.py             # Auth, quiz prediction
│   │   ├── serializers.py       # DRF serializers
│   │   └── urls.py
│   ├── resumeapp/               # Resume upload & analysis
│   ├── guidanceapp/             # Career roadmap generator
│   ├── jobsapp/                 # Job/internship finder
│   ├── chatapp/                 # AI chatbot
│   ├── voiceapp/                # Voice assistant
│   ├── utils/
│   │   └── gemini_utils.py      # Shared AI utility (Groq + Gemini)
│   ├── ml_models/               # Trained ML model (.pkl)
│   ├── datasets/                # Training data & docs
│   ├── requirements.txt
│   └── manage.py
│
├── README.md
└── .gitignore
```

---

## 🚀 Getting Started

### Prerequisites
- **Python 3.10+**
- **Node.js 18+** and **npm**
- **Groq API Key** (free) — [Get one here](https://console.groq.com)

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/career-path-recommendation-system.git
cd career-path-recommendation-system-main
```

### 2. Backend Setup
```bash
cd Prediction

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
echo "GROQ_API_KEY=your_groq_api_key_here" > .env

# Run migrations
python manage.py makemigrations prediction
python manage.py migrate

# Start the server
python manage.py runserver 8000
```

### 3. Frontend Setup
```bash
# Open a new terminal
cd Frontend

# Install dependencies
npm install

# Start the dev server
npm run dev
```

### 4. Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000

---

## 🔑 Environment Variables

Create a `Prediction/.env` file:

```env
# Required
GROQ_API_KEY=gsk_your_groq_api_key_here

# Optional
SECRET_KEY=your-django-secret-key
DEBUG=True
```

> **Note**: The system uses **Groq** (Llama 3.3 70B) with a generous free tier of 30 requests/minute.

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup/` | Register new user |
| POST | `/api/auth/signin/` | Login (returns JWT tokens) |
| POST | `/api/auth/refresh/` | Refresh access token |

### Features
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/get/quiz/` | Submit quiz answers → get prediction |
| GET  | `/api/predictions/history/` | Get prediction history (auth required) |
| GET  | `/api/profile/` | Get user profile (auth required) |
| PATCH | `/api/profile/` | Update user profile (auth required) |
| POST | `/api/resume/upload/` | Upload resume PDF → AI analysis |
| GET  | `/api/resume/history/` | Get resume history (auth required) |
| POST | `/api/guidance/` | Get career roadmap for a role |
| POST | `/api/jobs/` | Search jobs/internships |
| POST | `/api/chat/` | Chat with AI assistant |
| POST | `/api/voice/` | Voice assistant query |
| POST | `/api/get/sentiment/` | Analyze feedback sentiment |

---

## 🌐 Deployment

### Option 1: Render (Recommended)

**Backend (Render Web Service):**
1. Push code to GitHub
2. Create a new **Web Service** on [render.com](https://render.com)
3. Set build command: `pip install -r requirements.txt`
4. Set start command: `cd Prediction && gunicorn backend.wsgi:application --bind 0.0.0.0:$PORT`
5. Add environment variables: `GROQ_API_KEY`, `SECRET_KEY`, `DEBUG=False`

**Frontend (Render Static Site):**
1. Create a new **Static Site** on Render
2. Set build command: `cd Frontend && npm install && npm run build`
3. Set publish directory: `Frontend/dist`
4. Add environment variable: `VITE_API_BASE_URL=https://your-backend.onrender.com/api`

### Option 2: Railway

1. Push to GitHub
2. Create project on [railway.app](https://railway.app)
3. Deploy backend and frontend as separate services
4. Set environment variables in Railway dashboard

### Option 3: Vercel (Frontend) + Render (Backend)

**Frontend on Vercel:**
```bash
cd Frontend
npx vercel
```
Set `VITE_API_BASE_URL` in Vercel environment variables.

**Backend on Render:** Follow Render backend instructions above.

---

## 🧪 How It Works

### Career Quiz Flow
```
User takes 19-question quiz
        ↓
ML Model (Decision Tree) predicts top role from 12 categories
        ↓
AI (Groq/Gemini) suggests 5+ additional roles based on quiz profile
        ↓
User sees results with confidence scores
        ↓
One-click access to Career Roadmap or Job Search for any role
```

### Resume Analysis Flow
```
User uploads PDF resume
        ↓
PyPDF2 extracts text from resume
        ↓
AI analyzes text → extracts skills → suggests 8-10 matching roles
        ↓
Each role shows match percentage and reason
        ↓
One-click navigation to Roadmap or Jobs for any suggested role
```

### AI Provider Strategy
```
Request → Try Groq (llama-3.3-70b-versatile)
              ↓ (if fails)
          Try Groq (llama-3.1-8b-instant)
              ↓ (if fails)
          Try Groq (mixtral-8x7b-32768)
              ↓ (if fails)
          Return error to user
```

---

## 📸 Screenshots

| Feature | Description |
|---------|-------------|
| Landing Page | 3D Earth animation with sign-up CTA |
| Dashboard | Quick actions, prediction/resume history |
| Career Quiz | 19-question interactive quiz |
| Resume Analyzer | Drag-drop upload with AI skill extraction |
| Career Roadmap | Phase-by-phase learning plan |
| Job Finder | Searchable job/internship listings |
| AI Chat | Career guidance chatbot |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -m "Add new feature"`
4. Push to branch: `git push origin feature/new-feature`
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🙏 Acknowledgments

- **Groq** — Fast AI inference with Llama 3.3 70B
- **scikit-learn** — Decision Tree classification model
- **Django** & **React** communities
