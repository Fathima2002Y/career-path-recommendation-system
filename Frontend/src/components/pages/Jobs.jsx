import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { searchJobs } from "../../utils/api";
import "regenerator-runtime/runtime";

const Jobs = () => {
  const location = useLocation();
  const [role, setRole] = useState(location.state?.role || "");
  const [jobType, setJobType] = useState("all");
  const [locationFilter, setLocationFilter] = useState("");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (location.state?.role) {
      fetchJobs(location.state.role, "all", "");
    }
  }, [location.state?.role]);

  const fetchJobs = async (r, type, loc) => {
    setLoading(true);
    setError("");
    setJobs([]);
    try {
      const { data, error: apiError } = await searchJobs(r, type, loc);
      if (apiError) {
        setError(apiError);
      } else if (data?.jobs) {
        setJobs(data.jobs);
      }
    } catch (e) {
      setError(e.message || "Search failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (role.trim()) fetchJobs(role.trim(), jobType, locationFilter);
  };

  return (
    <div className="min-h-screen p-6 md:p-10">
      <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Jobs & Internships</h1>
      <p className="text-gray-400 text-lg mb-8">Discover opportunities tailored for freshers</p>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="max-w-4xl mx-auto mb-10">
        <div className="flex flex-col md:flex-row gap-3">
          <input
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="Enter job role (e.g., Software Developer)"
            className="flex-1 bg-gray-800 text-white border border-gray-600 rounded-xl px-4 py-3 focus:outline-none focus:border-red-500"
          />
          <input
            type="text"
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            placeholder="Location (optional)"
            className="md:w-48 bg-gray-800 text-white border border-gray-600 rounded-xl px-4 py-3 focus:outline-none focus:border-red-500"
          />
          <select
            value={jobType}
            onChange={(e) => setJobType(e.target.value)}
            className="md:w-40 bg-gray-800 text-white border border-gray-600 rounded-xl px-4 py-3 focus:outline-none"
          >
            <option value="all">All Types</option>
            <option value="job">Jobs Only</option>
            <option value="internship">Internships</option>
          </select>
          <button
            type="submit"
            disabled={loading || !role.trim()}
            className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white px-6 py-3 rounded-xl font-bold transition-colors whitespace-nowrap"
          >
            {loading ? "Searching..." : "🔍 Search"}
          </button>
        </div>
      </form>

      {error && (
        <div className="max-w-4xl mx-auto mb-6 bg-red-900 bg-opacity-50 border border-red-500 text-red-300 p-4 rounded-xl text-center">
          {error}
        </div>
      )}

      {loading && (
        <div className="text-center py-20">
          <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400 text-lg">Finding opportunities for you...</p>
        </div>
      )}

      {/* Results */}
      {jobs.length > 0 && !loading && (
        <div className="max-w-4xl mx-auto">
          <p className="text-gray-400 mb-4">{jobs.length} opportunities found</p>
          <div className="space-y-4">
            {jobs.map((job, i) => (
              <div key={i} className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-500 transition-colors">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                  <div className="flex-1">
                    <h3 className="text-white font-bold text-xl">{job.title}</h3>
                    <p className="text-red-400 font-medium">{job.company}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="text-gray-400 text-sm flex items-center gap-1">📍 {job.location}</span>
                      <span className="text-gray-400 text-sm flex items-center gap-1">💰 {job.salary}</span>
                      <span className="text-gray-400 text-sm flex items-center gap-1">⏰ {job.experience}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${job.type === "Internship" ? "bg-yellow-900 text-yellow-300" : "bg-green-900 text-green-300"}`}>
                      {job.type}
                    </span>
                    <span className="text-gray-500 text-xs">{job.posted_date}</span>
                  </div>
                </div>

                <p className="text-gray-400 text-sm mt-3">{job.description}</p>

                {job.skills_required && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {job.skills_required.map((skill, j) => (
                      <span key={j} className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded-full">{skill}</span>
                    ))}
                  </div>
                )}

                <div className="mt-4 flex gap-3">
                  {job.apply_url && (
                    <a
                      href={job.apply_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                      Apply Now →
                    </a>
                  )}
                  <span className="text-gray-500 text-xs self-center">Source: {job.source}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!loading && jobs.length === 0 && !error && role && (
        <div className="text-center py-10">
          <p className="text-gray-400">Search for a role to see available opportunities</p>
        </div>
      )}
    </div>
  );
};

export default Jobs;
