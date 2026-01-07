import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();

    // שליפת נתונים מה-localStorage לצורך הרשאות מותאמות [cite: 16]
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('role');
    const userName = localStorage.getItem('userName');

    const handleLogout = () => {
        localStorage.clear();
        setIsMenuOpen(false);
        window.location.href = '/login'; // אימות יציאה וניקוי נתונים [cite: 15]
    };

    const closeMenu = () => setIsMenuOpen(false);

    return (
        <nav className="navbar" dir="rtl"> {/* הגדרת כיוון RTL לאתר בעברית  */}
            <Link to="/" className="nav-logo" onClick={closeMenu}>QUIZ ZONE</Link>
            
            {/* כפתור המבורגר לרספונסיביות טלפון [cite: 27] */}
            <div className="hamburger" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? '✕' : '☰'}
            </div>

            {/* רשימת קישורים מותאמת לפי סוג משתמש [cite: 42] */}
            <div className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
                <Link to="/quizzes" className="nav-link" onClick={closeMenu}>חידונים</Link>
                
                {token && (
                    <Link to="/my-scores" className="nav-link" onClick={closeMenu}>הציונים שלי</Link>
                )}

                {/* תצוגת ניהול למנהל בלבד [cite: 14, 100] */}
                {token && userRole === 'admin' && (
                    <>
                        <Link to="/admin/all-scores" className="nav-link" style={{color: 'var(--neon-purple)'}} onClick={closeMenu}>
                            ניהול ציונים
                        </Link>
                        <Link to="/admin/users" className="nav-link" style={{color: '#ffcc00'}} onClick={closeMenu}>
                            ניהול משתמשים
                        </Link>
                        <Link to="/create-quiz" className="nav-link nav-link-admin" onClick={closeMenu}>
                            צור חידון
                        </Link>
                    </>
                )}

                <div className="nav-auth-mobile">
                    {!token ? (
                        <>
                            <Link to="/login" className="nav-link" onClick={closeMenu}>התחברות</Link>
                            <Link to="/register" className="nav-link btn-register" onClick={closeMenu}>הרשמה</Link>
                        </>
                    ) : (
                        <div className="user-section-mobile">
                            <span className="user-greeting">
                                שלום, <b style={{color: 'var(--neon-blue)'}}>{userName || 'אורח'}</b>
                            </span>
                            <button onClick={handleLogout} className="btn-logout">התנתק</button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;