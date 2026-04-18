import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Loader from "../Loader/Loader";
import FeedbackForm from "../feedbackForm/Feedback";
import { useSelector } from 'react-redux';
import "regenerator-runtime/runtime";

const Predict = () => {
  const location = useLocation();
  const { prediction, predicted_role, probability, ai_suggested_roles } = location.state || {};
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const feedback = useSelector((state) => state.feedback.feedbacks);

  // Fallback role mapping for backward compatibility
  const roleMapping = {
    0: "Network Security Engineer", 1: "Software Engineer", 2: "UI/UX Engineer",
    3: "Software Developer", 4: "Database Developer", 5: "QA Engineer",
    6: "Web Developer", 7: "CRM Technical Developer", 8: "Technical Supporter",
    9: "Systems Security Administrator", 10: "Applications Developer",
    11: "Mobile Applications Developer",
  };

  const role = predicted_role || roleMapping[prediction] || "Unknown Role!";
  const confidencePercent = probability ? (probability * 100).toFixed(1) : null;

  useEffect(() => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  }, []);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="relative w-full overflow-hidden">
          <video className="absolute top-0 left-0 w-full h-full object-cover z-0" autoPlay loop muted>
            <source src="../../../public/bg.mp4" type="video/mp4" />
          </video>

          <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-6">
            <h1 className="text-5xl md:text-7xl my-10 text-center text-white font-bold">Your Future Career Path</h1>

            {prediction !== undefined ? (
              <div className="w-full max-w-5xl">
                {/* Main Prediction */}
                <div className="shadow-md rounded-xl p-8 text-center bg-opacity-80 bg-white mb-8">
                  <p className="text-2xl text-black mb-2">Most Probably You will be a</p>
                  <p className="font-bold text-4xl md:text-5xl text-red-600 mb-2">{role}</p>
                  {confidencePercent && (
                    <p className="text-xl text-slate-600">
                      Confidence: <span className="font-bold text-green-600">{confidencePercent}%</span>
                    </p>
                  )}
                  <div className="flex gap-3 justify-center mt-4">
                    <button
                      onClick={() => navigate("/guidance", { state: { role } })}
                      className="bg-cyan-600 hover:bg-cyan-700 text-white px-5 py-2 rounded-lg font-medium transition-colors"
                    >
                      📚 Career Roadmap
                    </button>
                    <button
                      onClick={() => navigate("/jobs", { state: { role } })}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg font-medium transition-colors"
                    >
                      💼 Find Jobs
                    </button>
                  </div>
                </div>

                {/* AI Suggested Roles */}
                {ai_suggested_roles && ai_suggested_roles.length > 0 && (
                  <div className="bg-black bg-opacity-70 rounded-xl p-6 mb-8 backdrop-blur-sm">
                    <h2 className="text-2xl font-bold text-white mb-4 text-center">
                      🤖 AI Also Suggests These Roles
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {ai_suggested_roles.map((r, i) => (
                        <div key={i} className="bg-gray-800 rounded-lg p-4 border border-gray-600 hover:border-gray-400 transition-colors">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="text-white font-bold">{r.role}</h3>
                            <span className="bg-green-900 text-green-300 text-xs px-2 py-1 rounded-full font-bold">
                              {r.match_percentage}%
                            </span>
                          </div>
                          <p className="text-gray-400 text-sm mb-3">{r.reason}</p>
                          <div className="flex gap-2">
                            <button
                              onClick={() => navigate("/guidance", { state: { role: r.role } })}
                              className="bg-cyan-800 hover:bg-cyan-700 text-white text-xs px-3 py-1 rounded-lg transition-colors"
                            >
                              📚 Roadmap
                            </button>
                            <button
                              onClick={() => navigate("/jobs", { state: { role: r.role } })}
                              className="bg-purple-800 hover:bg-purple-700 text-white text-xs px-3 py-1 rounded-lg transition-colors"
                            >
                              💼 Jobs
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Feedback */}
                <div className="mt-6">
                  <p className="text-3xl font-semibold text-center my-6 text-red-500">
                    What is your thought? Are you satisfied with the result? Tell Us.
                  </p>
                  <FeedbackForm />
                </div>
              </div>
            ) : (
              <p className="text-2xl text-red-500">No prediction available.</p>
            )}

            {prediction !== undefined && feedback !== '' && (
              <div className="flex flex-row items-center mt-10">
                <button className="py-3 px-8 rounded-xl bg-sky-600 text-white font-bold shadow-md hover:bg-sky-800" onClick={() => navigate("/chat")}>
                  Chat Agent
                </button>
                <button className="ml-10 py-3 px-8 rounded-xl bg-green-600 text-white font-bold shadow-md hover:bg-green-800" onClick={() => navigate("/voice")}>
                  Voice Agent
                </button>
              </div>
            )}

            <button className="mt-10 py-3 px-8 rounded-xl bg-red-600 text-black font-bold shadow-md hover:bg-red-400" onClick={() => navigate("/quiz")}>
              Retake Quiz
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Predict;
