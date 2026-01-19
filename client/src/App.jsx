import React, { useState, useEffect, useCallback } from "react"; // הוספנו useCallback
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { QuizProvider } from "./context/QuizContext";
import Particles from "react-tsparticles"; // ייבוא חלקיקים
import { loadSlim } from "tsparticles-slim"; // ייבוא המנוע הקל

// ייבוא קומפוננטות (נשאר ללא שינוי)
import Navbar from "./components/Navbar";
import Quizzes from "./pages/Quizzes";
import QuizPage from "./pages/QuizPage";
import CreateQuiz from "./pages/CreateQuiz";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyScores from "./pages/MyScores";
import AllScores from "./pages/AllScores"; 
import ManageUsers from "./pages/ManageUsers"; 

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="main-footer">
      <p> כל הזכויות שמורות &copy; {currentYear} </p>
    </footer>
  );
};

function App() {
  const [searchTerm, setSearchTerm] = useState('');

  // פונקציית אתחול לחלקיקים
  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  return (
    <QuizProvider>
      <Router>
        <ScrollToTop />
        
        {/* --- רקע חלקיקים אינטראקטיבי --- */}
        <Particles
          id="tsparticles"
          init={particlesInit}
          options={{
            fullScreen: { enable: true, zIndex: -1 }, // דואג שיהיה ברקע מאחור
            background: {
              color: { value: "transparent" }, // משתמש ברקע שנגדיר ב-CSS
            },
            fpsLimit: 120,
            interactivity: {
              events: {
                onHover: {
                  enable: true,
                  mode: "repulse", // אפקט בריחה מהעכבר
                },
                resize: true,
              },
              modes: {
                repulse: {
                  distance: 120, // מרחק הבריחה
                  duration: 0.4,
                },
              },
            },
            particles: {
              color: { value: "#40e0d0" }, // צבע טורקיז ניאון
              links: {
                color: "#40e0d0",
                distance: 150,
                enable: true,
                opacity: 0.3,
                width: 1,
              },
              move: {
                enable: true,
                speed: 2,
                direction: "none",
                random: false,
                straight: false,
                outModes: { default: "out" },
              },
              number: {
                density: { enable: true, area: 800 },
                value: 100, // כמות החלקיקים
              },
              opacity: { value: 0.5 },
              shape: { type: "circle" },
              size: { value: { min: 1, max: 3 } },
            },
            detectRetina: true,
          }}
        />

        <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        
        {/* הוספנו className כדי לשלוט בשקיפות התוכן מעל הרקע */}
        <div className="app-content-wrapper" style={{ 
          minHeight: '100vh', 
          display: 'flex',
          flexDirection: 'column',
          color: 'white',
          position: 'relative',
          zIndex: 1
        }}>
          <div style={{ flex: 1, paddingBottom: '50px' }}>
            <Routes>
              <Route path="/" element={<Navigate to="/quizzes" />} />
              <Route path="/quizzes" element={<Quizzes searchTerm={searchTerm} />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/quiz/:id" element={<QuizPage />} />
              <Route path="/my-scores" element={<MyScores searchTerm={searchTerm} />} />
              <Route path="/create-quiz" element={<CreateQuiz />} />
              <Route path="/edit-quiz/:id" element={<CreateQuiz />} />
              <Route path="/admin/all-scores" element={<AllScores searchTerm={searchTerm} />} /> 
              <Route path="/admin/users" element={<ManageUsers searchTerm={searchTerm} />} />
              <Route path="*" element={
                <h1 style={{ textAlign: 'center', marginTop: '100px', color: '#00c1ab' }}>
                  404 - דף לא נמצא
                </h1>
              } />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </QuizProvider>
  );
}

export default App;