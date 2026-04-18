import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getCareerGuidance } from "../../utils/api";
import "regenerator-runtime/runtime";

const Guidance = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [role, setRole] = useState(location.state?.role || "");
  const [guidance, setGuidance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (location.state?.role) {
      fetchGuidance(location.state.role);
    }
  }, [location.state?.role]);

  const fetchGuidance = async (roleName) => {
    setLoading(true);
    setError("");
    setGuidance(null);
    try {
      const { data, error: apiError } = await getCareerGuidance(roleName);
      if (apiError) {
        setError(apiError);
      } else if (data) {
        setGuidance(data);
      }
    } catch (e) {
      setError(e.message || "Failed to get guidance");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (role.trim()) fetchGuidance(role.trim());
  };

  return (
    <div className="min-h-screen p-6 md:p-10">
      <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Career Roadmap</h1>
      <p className="text-gray-400 text-lg mb-8">Get a detailed step-by-step guide for your dream career</p>

      {/* Search */}
      <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-10 flex gap-3">
        <input
          type="text"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          placeholder="Enter a career role (e.g., Full Stack Developer, Data Scientist)"
          className="flex-1 bg-gray-800 text-white border border-gray-600 rounded-xl px-4 py-3 focus:outline-none focus:border-red-500 transition-colors"
        />
        <button
          type="submit"
          disabled={loading || !role.trim()}
          className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white px-6 py-3 rounded-xl font-bold transition-colors"
        >
          {loading ? "Loading..." : "Get Roadmap"}
        </button>
      </form>

      {error && (
        <div className="max-w-4xl mx-auto mb-6 bg-red-900 bg-opacity-50 border border-red-500 text-red-300 p-4 rounded-xl text-center">
          {error}
        </div>
      )}

      {loading && (
        <div className="text-center py-20">
          <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400 text-lg">Generating your career roadmap...</p>
        </div>
      )}

      {/* Results */}
      {guidance && !loading && (
        <div className="max-w-4xl mx-auto">
          {/* Overview */}
          <div className="bg-gradient-to-br from-red-900 to-gray-800 rounded-xl p-6 mb-6 border border-red-800">
            <h2 className="text-3xl font-bold text-white mb-2">{guidance.role}</h2>
            <p className="text-gray-300 leading-relaxed">{guidance.overview}</p>
            {guidance.salary_range && (
              <div className="mt-4 flex flex-wrap gap-3">
                <span className="bg-green-900 text-green-300 px-3 py-1 rounded-full text-sm">
                  Entry: {guidance.salary_range.entry_level}
                </span>
                <span className="bg-blue-900 text-blue-300 px-3 py-1 rounded-full text-sm">
                  Mid: {guidance.salary_range.mid_level}
                </span>
                <span className="bg-purple-900 text-purple-300 px-3 py-1 rounded-full text-sm">
                  Senior: {guidance.salary_range.senior_level}
                </span>
              </div>
            )}
          </div>

          {/* Skills */}
          {guidance.skills_required && (
            <div className="bg-gray-800 rounded-xl p-6 mb-6 border border-gray-700">
              <h2 className="text-2xl font-bold text-white mb-4">🛠️ Skills Required</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {guidance.skills_required.map((s, i) => (
                  <div key={i} className="flex items-center justify-between bg-gray-700 rounded-lg p-3">
                    <span className="text-white font-medium">{s.skill}</span>
                    <div className="flex gap-2">
                      <span className="bg-gray-600 text-gray-300 text-xs px-2 py-1 rounded">{s.level}</span>
                      <span className={`text-xs px-2 py-1 rounded ${s.priority === "Must Have" ? "bg-red-900 text-red-300" : "bg-yellow-900 text-yellow-300"}`}>
                        {s.priority}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Roadmap Phases */}
          {guidance.roadmap && (
            <div className="bg-gray-800 rounded-xl p-6 mb-6 border border-gray-700">
              <h2 className="text-2xl font-bold text-white mb-4">🗺️ Learning Roadmap</h2>
              <div className="space-y-6">
                {guidance.roadmap.map((phase, i) => (
                  <div key={i} className="relative pl-8 border-l-2 border-red-600">
                    <div className="absolute -left-2.5 top-0 w-5 h-5 bg-red-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">{i + 1}</span>
                    </div>
                    <h3 className="text-white font-bold text-lg mb-2">{phase.phase}</h3>
                    <div className="mb-2">
                      <p className="text-gray-400 text-sm font-medium mb-1">Tasks:</p>
                      <ul className="list-disc list-inside text-gray-300 text-sm space-y-1">
                        {phase.tasks.map((t, j) => <li key={j}>{t}</li>)}
                      </ul>
                    </div>
                    {phase.resources && (
                      <div>
                        <p className="text-gray-400 text-sm font-medium mb-1">Resources:</p>
                        <div className="flex flex-wrap gap-2">
                          {phase.resources.map((r, j) => (
                            <span key={j} className="bg-cyan-900 text-cyan-300 text-xs px-2 py-1 rounded-full">{r}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {guidance.certifications && (
            <div className="bg-gray-800 rounded-xl p-6 mb-6 border border-gray-700">
              <h2 className="text-2xl font-bold text-white mb-4">📜 Recommended Certifications</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {guidance.certifications.map((cert, i) => (
                  <div key={i} className="bg-gray-700 rounded-lg p-4">
                    <h4 className="text-white font-bold">{cert.name}</h4>
                    <p className="text-gray-400 text-sm">{cert.provider}</p>
                    <span className="inline-block mt-1 bg-gray-600 text-gray-300 text-xs px-2 py-1 rounded">{cert.difficulty}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Interview Tips */}
          {guidance.interview_tips && (
            <div className="bg-gray-800 rounded-xl p-6 mb-6 border border-gray-700">
              <h2 className="text-2xl font-bold text-white mb-4">💡 Interview Tips</h2>
              <ul className="space-y-2">
                {guidance.interview_tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-300">
                    <span className="text-green-400 mt-1">✓</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Growth */}
          {guidance.growth_prospects && (
            <div className="bg-gray-800 rounded-xl p-6 mb-6 border border-gray-700">
              <h2 className="text-2xl font-bold text-white mb-3">📈 Growth Prospects</h2>
              <p className="text-gray-300 leading-relaxed">{guidance.growth_prospects}</p>
            </div>
          )}

          {/* Actions */}
          <div className="text-center flex gap-4 justify-center">
            <button
              onClick={() => navigate("/jobs", { state: { role: guidance.role } })}
              className="bg-purple-700 hover:bg-purple-600 text-white px-6 py-3 rounded-xl font-bold transition-colors"
            >
              💼 Find Jobs for {guidance.role}
            </button>
            <button
              onClick={() => { setGuidance(null); setRole(""); }}
              className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-xl font-medium transition-colors"
            >
              Search Another Role
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Guidance;
