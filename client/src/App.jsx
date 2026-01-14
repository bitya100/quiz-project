import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
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

function App() {
  // ניהול מצב החיפוש ברמת האפליקציה כדי שיעבור מהנאבבאר לדפים
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <QuizProvider>
      <Router>
        {/* הנאבבאר מקבל את הפונקציה לעדכון החיפוש ואת הערך הנוכחי */}
        <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        
        {/* קונטיינר ראשי עם עיצוב רספונסיבי */}
        <div style={{ 
          minHeight: '100vh', 
          paddingBottom: '50px',
          color: 'white'
        }}>
          <Routes>
            {/* ניתובים ציבוריים - מעבירים את searchTerm לדפים שצריכים סינון */}
            <Route path="/" element={<Navigate to="/quizzes" />} />
            <Route path="/quizzes" element={<Quizzes searchTerm={searchTerm} />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* דף ביצוע החידון */}
            <Route path="/quiz/:id" element={<QuizPage />} />

            {/* דפים למשתמשים מחוברים בלבד */}
            <Route path="/my-scores" element={<MyScores searchTerm={searchTerm} />} />

            {/* דפי ניהול למנהל בלבד (Admin Only) */}
            <Route path="/create-quiz" element={<CreateQuiz />} />
            <Route path="/edit-quiz/:id" element={<CreateQuiz />} />
            
            {/* דף ניהול הציונים מקבל את ה-searchTerm מהנאבבאר */}
            <Route path="/admin/all-scores" element={<AllScores searchTerm={searchTerm} />} /> 
            
            {/* דף ניהול משתמשים - גם כאן נוכל להשתמש בחיפוש בעתיד */}
            <Route path="/admin/users" element={<ManageUsers searchTerm={searchTerm} />} />

            {/* דף שגיאה 404 */}
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