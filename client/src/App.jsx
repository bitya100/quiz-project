import React, { useState, useEffect, useCallback } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Particles from "react-tsparticles"; 
import { loadSlim } from "tsparticles-slim"; 
import { Box } from "@mui/material"; 

// ייבוא קומפוננטות 
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Quizzes from "./pages/Quizzes";
import QuizPage from "./pages/QuizPage";
import CreateQuiz from "./pages/CreateQuiz";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword"; 
import ResetPassword from "./pages/ResetPassword"; 
import MyScores from "./pages/MyScores";
import AllScores from "./pages/AllScores"; 
import ManageUsers from "./pages/ManageUsers"; 
import ShabbatPage from "./pages/ShabbatPage"; 
import ScrollToTopBtn from "./components/ScrollToTop"; 
import Footer from "./components/Footer";
import NotFound from "./pages/NotFound"; // ייבוא עמוד 404

const checkShabbat = () => {
  const now = new Date();
  const day = now.getDay();  
  const hour = now.getHours(); 
  if (day === 5 && hour >= 12) return true; 
  if (day === 6 && hour < 19) return true;  
  return false;
};

const ScrollToTopOnNavigate = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const isShabbat = checkShabbat();

  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  const particlesOptions = {
    fullScreen: { enable: true, zIndex: -1 },
    background: { color: { value: "#020617" } },
    fpsLimit: 60,
    particles: {
      number: { value: 6, density: { enable: false } },
      color: { value: ["#00c1ab", "#1e90ff", "#7000ff", "#40e0d0", "#bc13fe"] },
      shape: { type: "circle" },
      opacity: { value: 0.12 }, 
      size: { value: { min: 150, max: 350 } }, 
      move: {
        enable: true,
        speed: 0.8, 
        direction: "none",
        random: true,
        outModes: { default: "bounce" }, 
        attract: { enable: false } 
      },
      shadow: { enable: true, color: "inherit", blur: 50 }
    },
    interactivity: { detectsOn: "window", events: { resize: true } },
    detectRetina: true
  };

  if (isShabbat) {
    return (
      <div style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
        <Particles id="tsparticles" init={particlesInit} options={particlesOptions} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <ShabbatPage />
        </div>
      </div>
    );
  }

  return (
    <Router>
      <ScrollToTopOnNavigate />
      <Particles id="tsparticles" init={particlesInit} options={particlesOptions} />
      
      {/* ה-Wrapper העוטף כולל עכשיו את ה-Navbar בפנים */}
      <div className="app-content-wrapper" style={{ 
        minHeight: '100vh', 
        display: 'flex',
        flexDirection: 'column',
        color: 'white',
        position: 'relative',
        zIndex: 1
      }}>
        
        <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        
        {/* הגדרת flexGrow שמותחת את אזור התוכן ללא פאדינג מיותר */}
        <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <Routes>
            <Route path="/" element={
              <Box>
                <Home />
                <Box id="quizzes-section" sx={{ pt: 8, pb: 10 }}>
                  <Quizzes searchTerm={searchTerm} />
                </Box>
              </Box>
            } />
            
            <Route path="/quizzes" element={
              <Box sx={{ pt: 5 }}>
                <Quizzes searchTerm={searchTerm} />
              </Box>
            } />

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} /> 
            <Route path="/reset-password/:token" element={<ResetPassword />} /> 
            <Route path="/quiz/:id" element={<QuizPage />} />
            <Route path="/my-scores" element={<MyScores searchTerm={searchTerm} />} />
            <Route path="/create-quiz" element={<CreateQuiz />} />
            <Route path="/edit-quiz/:id" element={<CreateQuiz />} />
            <Route path="/admin/all-scores" element={<AllScores searchTerm={searchTerm} />} /> 
            <Route path="/admin/users" element={<ManageUsers searchTerm={searchTerm} />} />
            <Route path="/shabbat" element={<ShabbatPage />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
        
        <Footer />
      </div>

      <ScrollToTopBtn />
    </Router>
  );
}

export default App;