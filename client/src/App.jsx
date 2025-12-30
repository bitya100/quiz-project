import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

// עכשיו שניהם באים מאותו מקום!
import Register from "./pages/Register";
import Login from "./pages/Login"; 
import Navbar from "./components/Navbar"; // קומפוננטה קטנה נשארת ב-components

function App() {
  return (
    <Router>
      <div>
        <Navbar /> {/* שימוש בנאבבר שיצרת */}
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<h2>דף הבית</h2>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;