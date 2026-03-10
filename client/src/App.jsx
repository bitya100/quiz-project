import React, { useState, useEffect, useCallback } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Particles from "react-tsparticles"; 
import { loadSlim } from "tsparticles-slim"; 
import { Box } from "@mui/material"; // ייבוא Box

// ייבוא קומפוננטות 
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Quizzes from "./pages/Quizzes";
import QuizPage from "./pages/QuizPage";
import CreateQuiz from "./pages/CreateQuiz";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyScores from "./pages/MyScores";
import AllScores from "./pages/AllScores"; 
import ManageUsers from "./pages/ManageUsers"; 
import ShabbatPage from "./pages/ShabbatPage"; 
import ScrollToTopBtn from "./components/ScrollToTop"; 

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

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer style={{ 
      width: '100%',
      padding: '20px 0',
      textAlign: 'center',
      background: 'rgba(2, 6, 23, 0.9)', 
      borderTop: '1px solid rgba(64, 224, 208, 0.2)',
      color: '#40e0d0',
      position: 'relative',
      zIndex: 10,
      marginTop: 'auto' 
    }}>
      <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 'bold' }}>
        ביתיה. כל הזכויות שמורות &copy; {currentYear}
      </p>
    </footer>
  );
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
      <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      
      <div className="app-content-wrapper" style={{ 
        minHeight: '100vh', 
        display: 'flex',
        flexDirection: 'column',
        color: 'white',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{ flexGrow: 1, paddingBottom: '40px' }}>
          <Routes>
            {/* ראוט השער הראשי: כולל את סיפור הגלילה ולמטה את החידונים */}
            <Route path="/" element={
              <Box>
                <Home />
                {/* כאן הכפתור נוחת עם גלילה חלקה */}
                <Box id="quizzes-section" sx={{ pt: 8, pb: 10 }}>
                  <Quizzes searchTerm={searchTerm} />
                </Box>
              </Box>
            } />
            
            {/* ראוט התפריט: מציג ישירות את החידונים למי שלוחץ "חידונים" למעלה */}
            <Route path="/quizzes" element={
              <Box sx={{ pt: 5 }}>
                <Quizzes searchTerm={searchTerm} />
              </Box>
            } />

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/quiz/:id" element={<QuizPage />} />
            <Route path="/my-scores" element={<MyScores searchTerm={searchTerm} />} />
            <Route path="/create-quiz" element={<CreateQuiz />} />
            <Route path="/edit-quiz/:id" element={<CreateQuiz />} />
            <Route path="/admin/all-scores" element={<AllScores searchTerm={searchTerm} />} /> 
            <Route path="/admin/users" element={<ManageUsers searchTerm={searchTerm} />} />
            <Route path="/shabbat" element={<ShabbatPage />} />
            <Route path="*" element={
              <h1 style={{ textAlign: 'center', marginTop: '100px', color: '#00c1ab' }}>
                404 - דף לא נמצא
              </h1>
            } />
          </Routes>
        </div>
        <Footer />
      </div>

      <ScrollToTopBtn />
    </Router>
  );
}

export default App;