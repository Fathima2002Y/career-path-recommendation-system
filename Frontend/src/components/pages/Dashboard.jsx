import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getPredictionHistory, getResumeHistory } from "../../utils/api";
import "regenerator-runtime/runtime";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [predictions, setPredictions] = useState([]);
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [predRes, resumeRes] = await Promise.all([
          getPredictionHistory(),
          getResumeHistory(),
        ]);
        if (predRes.data) setPredictions(predRes.data);
        if (resumeRes.data) setResumes(resumeRes.data);
      } catch (e) {
        console.error("Dashboard fetch error:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const quickActions = [
    { title: "Take Career Quiz", desc: "Answer 19 questions to discover your ideal role", icon: "📝", path: "/quiz", color: "from-blue-600 to-blue-800" },
    { title: "Upload Resume", desc: "AI analyzes your resume and suggests matching roles", icon: "📄", path: "/resume", color: "from-green-600 to-green-800" },
    { title: "Browse Jobs", desc: "Find job openings and internships for freshers", icon: "💼", path: "/jobs", color: "from-purple-600 to-purple-800" },
    { title: "AI Chat Assistant", desc: "Ask career questions to our AI chatbot", icon: "💬", path: "/chat", color: "from-cyan-600 to-cyan-800" },
    { title: "Voice Assistant", desc: "Talk to our AI voice assistant for guidance", icon: "🎙️", path: "/voice", color: "from-orange-600 to-orange-800" },
  ];

  return (
    <div className="min-h-screen p-6 md:p-10">
      {/* Welcome */}
      <div className="mb-10">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
          Welcome back, <span className="text-red-500">{user?.name || "User"}</span> 👋
        </h1>
        <p className="text-gray-400 text-lg">Your AI-powered career guidance dashboard</p>
      </div>

      {/* Quick Actions */}
      <div className="mb-10">
        <h2 className="text-2xl font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((action) => (
            <button
              key={action.path}
              onClick={() => navigate(action.path)}
              className={`bg-gradient-to-br ${action.color} p-5 rounded-xl text-left hover:scale-[1.02] transition-transform shadow-lg`}
            >
              <div className="text-3xl mb-2">{action.icon}</div>
              <h3 className="text-white font-bold text-lg">{action.title}</h3>
              <p className="text-gray-200 text-sm mt-1">{action.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Prediction History */}
      <div className="mb-10">
        <h2 className="text-2xl font-semibold text-white mb-4">Recent Predictions</h2>
        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : predictions.length === 0 ? (
          <div className="bg-gray-800 rounded-xl p-6 text-center">
            <p className="text-gray-400">No predictions yet. Take the career quiz to get started!</p>
            <button onClick={() => navigate("/quiz")} className="mt-3 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium">
              Take Quiz
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {predictions.slice(0, 4).map((pred) => (
              <div key={pred.id} className="bg-gray-800 rounded-xl p-5 border border-gray-700">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-white font-bold text-lg">{pred.predicted_role}</h3>
                    <p className="text-gray-400 text-sm mt-1">
                      Confidence: <span className="text-green-400">{(pred.probability * 100).toFixed(1)}%</span>
                    </p>
                  </div>
                  <span className="text-gray-500 text-xs">{new Date(pred.created_at).toLocaleDateString()}</span>
                </div>
                {pred.ai_suggested_roles && pred.ai_suggested_roles.length > 0 && (
                  <div className="mt-3">
                    <p className="text-gray-400 text-xs mb-1">AI also suggested:</p>
                    <div className="flex flex-wrap gap-1">
                      {pred.ai_suggested_roles.slice(0, 3).map((r, i) => (
                        <span key={i} className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded-full">
                          {r.role}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Resume History */}
      <div>
        <h2 className="text-2xl font-semibold text-white mb-4">Resume Analyses</h2>
        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : resumes.length === 0 ? (
          <div className="bg-gray-800 rounded-xl p-6 text-center">
            <p className="text-gray-400">No resume analyses yet. Upload your resume for AI-powered suggestions!</p>
            <button onClick={() => navigate("/resume")} className="mt-3 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium">
              Upload Resume
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {resumes.slice(0, 4).map((r) => (
              <div key={r.id} className="bg-gray-800 rounded-xl p-5 border border-gray-700">
                <div className="flex justify-between items-start">
                  <h3 className="text-white font-bold">Resume Analysis</h3>
                  <span className="text-gray-500 text-xs">{new Date(r.created_at).toLocaleDateString()}</span>
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {r.extracted_skills.slice(0, 5).map((skill, i) => (
                    <span key={i} className="bg-blue-900 text-blue-200 text-xs px-2 py-1 rounded-full">{skill}</span>
                  ))}
                  {r.extracted_skills.length > 5 && (
                    <span className="text-gray-500 text-xs px-2 py-1">+{r.extracted_skills.length - 5} more</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
