import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css';

const Navbar = () => {
    const navigate = useNavigate();
    
    // פונקציית עזר לשליפה בטוחה של נתונים (מונעת הצגת undefined)
    const getSafeItem = (key) => {
        const value = localStorage.getItem(key);
        return (value && value !== 'undefined') ? value : null;
    };

    const token = getSafeItem('token');
    const userRole = getSafeItem('role');
    const userName = getSafeItem('userName');

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = '/login';
    };

    return (
        <nav className="navbar">
            <div className="nav-links">
                <Link to="/" className="nav-logo">QUIZ ZONE</Link>
                <Link to="/quizzes" className="nav-link">חידונים</Link>
                
                {/* הצגת "הציונים שלי" רק אם יש טוקן (משתמש מחובר) */}
                {token && (
                    <Link to="/my-scores" className="nav-link">הציונים שלי</Link>
                )}

                {/* תפריט מנהל */}
                {token && userRole === 'admin' && (
                    <>
                        <Link to="/admin/all-scores" className="nav-link" style={{color: 'var(--neon-purple)'}}>
                            ניהול ציונים
                        </Link>
                        <Link to="/create-quiz" className="nav-link nav-link-admin">
                            צור חידון
                        </Link>
                    </>
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
                        {/* כאן התיקון הקריטי להצגת השם */}
                        <span className="user-greeting" style={{color: 'white', marginLeft: '10px'}}>
                            שלום, <b style={{color: 'var(--neon-blue)'}}>{userName || 'אורח'}</b>
                        </span>
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