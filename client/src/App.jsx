import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Quizzes from "./pages/Quizzes";
import QuizPage from "./pages/QuizPage"; // השורה הזו הייתה חסרה!
import Navbar from "./components/Navbar";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/quizzes" element={<Quizzes />} />
        {/* נתיב לחידון ספציפי עם ID */}
        <Route path="/quiz/:id" element={<QuizPage />} /> 
        <Route path="/" element={<h2 style={{ textAlign: 'center', marginTop: '50px' }}>ברוכים הבאים לאתר החידונים!</h2>} />
      </Routes>
    </Router>
  );
}

export default App;