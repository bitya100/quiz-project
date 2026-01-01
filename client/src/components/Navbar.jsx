import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css'; // מוודאים שהעיצוב מיובא

const Navbar = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('role');
    const userName = localStorage.getItem('userName');

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = '/login';
    };

    return (
        <nav className="navbar">
            <div className="nav-links">
                <Link to="/" className="nav-logo">QuizApp</Link>
                <Link to="/quizzes" className="nav-link">חידונים</Link>
                
                {/* קישור למנהל בלבד */}
                {token && userRole === 'admin' && (
                    <Link to="/create-quiz" className="nav-link nav-link-admin">
                        ➕ צור חידון
                    </Link>
                )}
            </div>
            
            <div className="nav-auth-buttons">
                {!token ? (
                    <>
                        <Link to="/login" className="nav-link">התחברות</Link>
                        <Link to="/register" className="nav-link btn-register">הרשמה</Link>
                    </>
                ) : (
                    <>
                        <span className="user-greeting">שלום, {userName || 'אורח'}</span>
                        <button onClick={handleLogout} className="btn-logout">
                            התנתק
                        </button>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;