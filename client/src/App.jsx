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

// --- רכיב עזר לאיפוס גלילה (מוגדר בתוך הקובץ) ---
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // בכל פעם שהנתיב משתנה, המסך קופץ ללמעלה
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

function App() {
  // ניהול מצב החיפוש ברמת האפליקציה
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <QuizProvider>
      <Router>
        {/* הפעלת איפוס הגלילה בתוך הראוטר */}
        <ScrollToTop />
        
        <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        
        <div style={{ 
          minHeight: '100vh', 
          paddingBottom: '50px',
          color: 'white'
        }}>
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
              <h1 style={{ textAlign: 'center', marginTop: '100px', color: '#00c1ab', textShadow: '0 0 10px #00c1ab' }}>
                404 - דף לא נמצא
              </h1>
            } />
          </Routes>
        </div>
      </Router>
    </QuizProvider>
  );
}

export default App;