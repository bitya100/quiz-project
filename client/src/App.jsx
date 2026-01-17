import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { QuizProvider } from "./context/QuizContext";

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

// רכיב איפוס גלילה
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// --- רכיב הפוטר החדש ---
const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="main-footer">
      <p> כל הזכויות שמורות  &copy; {currentYear} </p>
    </footer>
  );
};

function App() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <QuizProvider>
      <Router>
        <ScrollToTop />
        
        <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        
        <div style={{ 
          minHeight: '100vh', 
          display: 'flex',
          flexDirection: 'column', // עוזר לפוטר להישאר למטה
          color: 'white'
        }}>
          {/* קונטיינר התוכן הראשי */}
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

          {/* הצגת הפוטר */}
          <Footer />
        </div>
      </Router>
    </QuizProvider>
  );
}

export default App;