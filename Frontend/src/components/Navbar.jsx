import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../features/auth/authSlice";
import "regenerator-runtime/runtime";

const Navbar = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  // Don't show navbar on landing page
  if (location.pathname === "/") return null;

  const isActive = (path) =>
    location.pathname === path
      ? "bg-red-600 text-white"
      : "text-gray-300 hover:bg-gray-700 hover:text-white";

  return (
    <nav className="bg-gray-900 bg-opacity-90 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={isAuthenticated ? "/dashboard" : "/"} className="flex items-center gap-2">
            <span className="text-red-500 font-bold text-xl">🎯</span>
            <span className="text-white font-bold text-lg hidden sm:block">CareerAI</span>
          </Link>

          {/* Nav Links */}
          {isAuthenticated && (
            <div className="flex items-center gap-1">
              <Link to="/dashboard" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive("/dashboard")}`}>
                Dashboard
              </Link>
              <Link to="/quiz" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive("/quiz")}`}>
                Quiz
              </Link>
              <Link to="/resume" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive("/resume")}`}>
                Resume
              </Link>
              <Link to="/jobs" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive("/jobs")}`}>
                Jobs
              </Link>
              <Link to="/chat" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive("/chat")}`}>
                Chat
              </Link>
              <Link to="/voice" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive("/voice")}`}>
                Voice
              </Link>
            </div>
          )}

          {/* User Menu */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <span className="text-gray-300 text-sm hidden md:block">
                  Hi, <span className="text-red-400 font-semibold">{user?.name || "User"}</span>
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex gap-2">
                <Link to="/signin" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                  Sign In
                </Link>
                <Link to="/register" className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
