import React, { useState, useEffect, useCallback } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
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
    <footer style={{ 
      width: '100%',
      padding: '20px 0',
      textAlign: 'center',
      background: 'rgba(2, 6, 23, 0.9)', 
      borderTop: '1px solid rgba(64, 224, 208, 0.2)',
      color: '#40e0d0',
      position: 'relative',
      zIndex: 10,
      marginTop: 'auto' // זה הסוד - דוחף אותו לתחתית גם כשהדף ריק
    }}>
      <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 'bold' }}>
        ביתיה. כל הזכויות שמורות &copy; {currentYear}
      </p>
    </footer>
  );
};

function App() {
  const [searchTerm, setSearchTerm] = useState('');

  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  return (
    <Router>
      <ScrollToTop />
      
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          fullScreen: { enable: true, zIndex: -1 },
          background: { color: { value: "#020617" } },
          fpsLimit: 60,
          particles: {
            number: { value: 6, density: { enable: false } }, // קצת יותר עיגולים
            color: { value: ["#00c1ab", "#1e90ff", "#7000ff", "#40e0d0", "#bc13fe"] },
            shape: { type: "circle" },
            opacity: { value: 0.12 }, // קצת יותר שקוף כדי שלא יסנוור
            size: { value: { min: 150, max: 350 } }, // גודל קצת יותר הגיוני
            move: {
              enable: true,
              speed: 0.8, // תנועה חלקה יותר
              direction: "none",
              random: true,
              outModes: { default: "bounce" }, // העיגולים יקפצו מהקצוות במקום לברוח
              attract: { enable: false } // ביטלנו את המגנט - מונע את הגוש הירוק!
            },
            shadow: {
              enable: true,
              color: "inherit",
              blur: 50
            }
          },
          interactivity: {
            detectsOn: "window",
            events: { resize: true }
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
        {/* שימוש ב-flexGrow כדי שהתוכן ידחוף את הפוטר תמיד לתחתית המסך */}
        <div style={{ flexGrow: 1, paddingBottom: '40px' }}>
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
  );
}

export default App;