import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { uploadResume } from "../../utils/api";
import "regenerator-runtime/runtime";

const ResumeUpload = () => {
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped && dropped.type === "application/pdf") {
      setFile(dropped);
      setError("");
    } else {
      setError("Please upload a PDF file");
    }
  };

  const handleFileSelect = (e) => {
    const selected = e.target.files[0];
    if (selected && selected.type === "application/pdf") {
      setFile(selected);
      setError("");
    } else {
      setError("Please upload a PDF file");
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const { data, error: apiError } = await uploadResume(file);
      if (apiError) {
        setError(apiError);
      } else if (data) {
        setResult(data);
      }
    } catch (e) {
      setError(e.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 md:p-10">
      <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Resume Analyzer</h1>
      <p className="text-gray-400 text-lg mb-8">Upload your resume and let AI suggest the best career roles for you</p>

      {/* Upload Area */}
      {!result && (
        <div className="max-w-2xl mx-auto">
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors cursor-pointer
              ${dragOver ? "border-red-500 bg-red-900 bg-opacity-20" : "border-gray-600 hover:border-gray-400"}`}
            onClick={() => document.getElementById("fileInput").click()}
          >
            <div className="text-5xl mb-4">📄</div>
            <p className="text-white text-lg font-medium mb-2">
              {file ? file.name : "Drag & drop your resume PDF here"}
            </p>
            <p className="text-gray-400 text-sm">or click to browse files</p>
            <input id="fileInput" type="file" accept=".pdf" onChange={handleFileSelect} className="hidden" />
          </div>

          {file && (
            <div className="mt-6 text-center">
              <button
                onClick={handleUpload}
                disabled={loading}
                className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white px-8 py-3 rounded-xl font-bold text-lg transition-colors"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Analyzing...
                  </span>
                ) : "Analyze Resume"}
              </button>
            </div>
          )}

          {error && (
            <div className="mt-4 bg-red-900 bg-opacity-50 border border-red-500 text-red-300 p-4 rounded-xl text-center">
              {error}
            </div>
          )}
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="max-w-4xl mx-auto">
          {/* Summary */}
          <div className="bg-gray-800 rounded-xl p-6 mb-6 border border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-3">📊 Analysis Summary</h2>
            <p className="text-gray-300 leading-relaxed">{result.summary}</p>
          </div>

          {/* Skills */}
          <div className="bg-gray-800 rounded-xl p-6 mb-6 border border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-3">🛠️ Extracted Skills</h2>
            <div className="flex flex-wrap gap-2">
              {result.skills.map((skill, i) => (
                <span key={i} className="bg-blue-900 text-blue-200 px-3 py-1 rounded-full text-sm font-medium">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Suggested Roles */}
          <div className="bg-gray-800 rounded-xl p-6 mb-6 border border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-4">🎯 Suggested Career Roles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {result.roles.map((role, i) => (
                <div key={i} className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-white font-bold text-lg">{role.role}</h3>
                    <span className="bg-green-900 text-green-300 text-xs px-2 py-1 rounded-full font-bold">
                      {role.match_percentage}%
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm mb-3">{role.reason}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate("/guidance", { state: { role: role.role } })}
                      className="bg-cyan-700 hover:bg-cyan-600 text-white text-xs px-3 py-1 rounded-lg transition-colors"
                    >
                      📚 Roadmap
                    </button>
                    <button
                      onClick={() => navigate("/jobs", { state: { role: role.role } })}
                      className="bg-purple-700 hover:bg-purple-600 text-white text-xs px-3 py-1 rounded-lg transition-colors"
                    >
                      💼 Find Jobs
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Try Again */}
          <div className="text-center">
            <button
              onClick={() => { setResult(null); setFile(null); }}
              className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-xl font-medium transition-colors"
            >
              Upload Another Resume
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeUpload;
