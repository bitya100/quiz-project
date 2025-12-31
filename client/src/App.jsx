import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { QuizProvider } from "./context/QuizContext";
import Quizzes from "./pages/Quizzes";
import QuizPage from "./pages/QuizPage";
import CreateQuiz from "./pages/CreateQuiz";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyScores from "./pages/MyScores";

function App() {
  return (
    <QuizProvider>
      <Router>
        <Navbar />
        <div style={{ minHeight: '90vh', backgroundColor: '#f9f9f9', paddingBottom: '50px' }}>
          <Routes>
            <Route path="/" element={<Navigate to="/quizzes" />} />
            <Route path="/quizzes" element={<Quizzes />} />
            <Route path="/quiz/:id" element={<QuizPage />} />
            <Route path="/create-quiz" element={<CreateQuiz />} />
            <Route path="/edit-quiz/:id" element={<CreateQuiz />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/my-scores" element={<MyScores />} />
            <Route path="*" element={<h1 style={{ textAlign: 'center', marginTop: '50px' }}>404 - דף לא נמצא</h1>} />
          </Routes>
        </div>
      </Router>
    </QuizProvider>
  );
}

export default App;