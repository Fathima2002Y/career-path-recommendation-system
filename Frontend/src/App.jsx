import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import HelpToSignUp from "./components/help/HelpToSignUp";
import HelpToHome from "./components/help/HelpToHome";
import HelpToQuiz from "./components/help/HelpToQuiz";
import NotFound from "./components/pages/NotFound";
import { Predict } from "./components";
import Chat from "./components/pages/Chat";
import VoiceBot from "./components/pages/Voice";
import Dashboard from "./components/pages/Dashboard";
import ResumeUpload from "./components/pages/ResumeUpload";
import Guidance from "./components/pages/Guidance";
import Jobs from "./components/pages/Jobs";
import SignIn from "./components/pages/SignIn";
import Navbar from "./components/Navbar";
import "regenerator-runtime/runtime";

// Protected route wrapper
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useSelector((state) => state.auth);
  if (!isAuthenticated) return <Navigate to="/signin" replace />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<HelpToHome />} />
        <Route path="/register" element={<HelpToSignUp />} />
        <Route path="/signup" element={<HelpToSignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/quiz" element={<ProtectedRoute><HelpToQuiz /></ProtectedRoute>} />
        <Route path="/predict" element={<ProtectedRoute><Predict /></ProtectedRoute>} />
        <Route path="/resume" element={<ProtectedRoute><ResumeUpload /></ProtectedRoute>} />
        <Route path="/guidance" element={<ProtectedRoute><Guidance /></ProtectedRoute>} />
        <Route path="/jobs" element={<ProtectedRoute><Jobs /></ProtectedRoute>} />
        <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
        <Route path="/voice" element={<ProtectedRoute><VoiceBot /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
