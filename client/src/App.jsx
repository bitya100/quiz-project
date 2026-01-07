import React from "react";
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
  return (
    <QuizProvider>
      <Router>
        {/* הנאבבאר מופיע בכל הדפים [cite: 42] */}
        <Navbar />
        
        {/* קונטיינר ראשי עם עיצוב רספונסיבי [cite: 21, 27] */}
        <div style={{ 
          minHeight: '100vh', 
          backgroundColor: '#0a0a0c', // צבע כהה שמתאים לעיצוב הניאון
          paddingBottom: '50px',
          color: 'white'
        }}>
          <Routes>
            {/* ניתובים ציבוריים */}
            <Route path="/" element={<Navigate to="/quizzes" />} />
            <Route path="/quizzes" element={<Quizzes />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* דף ביצוע החידון */}
            <Route path="/quiz/:id" element={<QuizPage />} />

            {/* דפים למשתמשים מחוברים בלבד [cite: 17, 99] */}
            <Route path="/my-scores" element={<MyScores />} />

            {/* דפי ניהול למנהל בלבד (Admin Only) [cite: 14, 16, 97] */}
            <Route path="/create-quiz" element={<CreateQuiz />} />
            <Route path="/edit-quiz/:id" element={<CreateQuiz />} />
            <Route path="/admin/all-scores" element={<AllScores />} /> 
            <Route path="/admin/users" element={<ManageUsers />} />

            {/* דף שגיאה 404 */}
            <Route path="*" element={
              <h1 style={{ textAlign: 'center', marginTop: '100px', color: 'var(--neon-blue)' }}>
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