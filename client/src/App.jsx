import React, { useState, useEffect, useCallback } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { QuizProvider } from "./context/QuizContext";
import Particles from "react-tsparticles"; 
import { loadSlim } from "tsparticles-slim"; 

// ייבוא קומפוננטות
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

  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  return (
    <QuizProvider>
      <Router>
        <ScrollToTop />
        
        {/* --- רקע "הילה" (Aura Gradient) רגוע ומרשים --- */}
        <Particles
          id="tsparticles"
          init={particlesInit}
          options={{
            fullScreen: { enable: true, zIndex: -1 },
            background: {
              color: { value: "#020617" }, // כחול נייבי עמוק מאוד
            },
            fpsLimit: 60,
            particles: {
              number: {
                value: 5, // רק 5 חלקיקים ענקיים! זה הסוד לרגיעה
                density: { enable: false }
              },
              color: {
                value: ["#00c1ab", "#1e90ff", "#7000ff", "#40e0d0"] // צבעי מותג רכים
              },
              shape: {
                type: "circle"
              },
              opacity: {
                value: 0.15, // שקוף מאוד, כמעט לא מורגש
              },
              size: {
                value: { min: 300, max: 500 } // חלקיקים ענקיים שיוצרים "כתמי אור"
              },
              move: {
                enable: true,
                speed: 0.5, // תנועה איטית ברמה של בקושי להבחין בה
                direction: "none",
                random: true,
                straight: false,
                outModes: { default: "out" },
                attract: { enable: true, rotateX: 600, rotateY: 1200 }
              },
              // הוספת טשטוש (Blur) דרך ה-Canvas
              shadow: {
                enable: true,
                color: "inherit",
                blur: 50 // יוצר מראה של ענן ולא עיגול חד
              }
            },
            interactivity: {
              detectsOn: "window",
              events: {
                resize: true
              }
            },
            detectRetina: true
          }}
        />

        <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        
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