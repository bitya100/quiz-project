// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import '../App.css';

// const Navbar = () => {
//     const [isMenuOpen, setIsMenuOpen] = useState(false);
//     const navigate = useNavigate();

//     // שליפת נתונים מה-localStorage לצורך הרשאות מותאמות
//     const token = localStorage.getItem('token');
//     const userRole = localStorage.getItem('role');
//     const userName = localStorage.getItem('userName');

//     const handleLogout = () => {
//         localStorage.clear();
//         setIsMenuOpen(false);
//         window.location.href = '/login'; // אימות יציאה וניקוי נתונים
//     };

//     const closeMenu = () => setIsMenuOpen(false);

//     return (
//         <nav className="navbar" dir="rtl">
//             <Link to="/" className="nav-logo" onClick={closeMenu}>QUIZ ZONE</Link>
            
//             {/* כפתור המבורגר לרספונסיביות */}
//             <div className="hamburger" onClick={() => setIsMenuOpen(!isMenuOpen)}>
//                 {isMenuOpen ? '✕' : '☰'}
//             </div>

//             {/* רשימת קישורים */}
//             <div className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
//                 <Link to="/quizzes" className="nav-link" onClick={closeMenu}>חידונים</Link>
                
//                 {token && (
//                     <Link to="/my-scores" className="nav-link" onClick={closeMenu}>הציונים שלי</Link>
//                 )}

//                 {/* תצוגת ניהול למנהל בלבד */}
//                 {token && userRole === 'admin' && (
//                     <>
//                         <Link to="/admin/all-scores" className="nav-link" style={{color: 'var(--neon-purple)'}} onClick={closeMenu}>
//                             ניהול ציונים
//                         </Link>
//                         <Link to="/admin/users" className="nav-link" style={{color: '#ffcc00'}} onClick={closeMenu}>
//                             ניהול משתמשים
//                         </Link>
//                         <Link to="/create-quiz" className="nav-link nav-link-admin" onClick={closeMenu}>
//                             צור חידון
//                         </Link>
//                     </>
//                 )}

//                 {/* אזור אימות ומשתמש - מבנה שטוח לפיזור נכון */}
//                 <div className="nav-auth-section">
//                     <span className="user-greeting" style={{ color: 'white' }}>
//                         שלום, <b style={{ color: 'var(--neon-blue)' }}>{userName || 'אורח'}</b>
//                     </span>
                    
//                     {!token ? (
//                         <div className="auth-buttons">
//                             <Link to="/login" className="nav-link" onClick={closeMenu}>התחברות</Link>
//                             <Link to="/register" className="nav-link btn-register" onClick={closeMenu}>הרשמה</Link>
//                         </div>
//                     ) : (
//                         <button onClick={handleLogout} className="btn-logout">התנתק</button>
//                     )}
//                 </div>
//             </div>
//         </nav>
//     );
// };

// export default Navbar;
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();

    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('role');
    const userName = localStorage.getItem('userName');

    const handleLogout = () => {
        localStorage.clear();
        setIsMenuOpen(false);
        window.location.href = '/login';
    };

    const closeMenu = () => setIsMenuOpen(false);

    return (
        <nav className="navbar" dir="rtl">
            <Link to="/" className="nav-logo" onClick={closeMenu}>QUIZ ZONE</Link>
            
            <div className="hamburger" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? '✕' : '☰'}
            </div>

            <div className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
                <Link to="/quizzes" className="nav-link" onClick={closeMenu}>חידונים</Link>
                
                {token && (
                    <Link to="/my-scores" className="nav-link" onClick={closeMenu}>הציונים שלי</Link>
                )}

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

                {/* ברכת השלום מוצגת כאלמנט עצמאי לפיזור אופטימלי */}
                <span className="nav-link user-greeting-text">
                    שלום, <b style={{ color: 'var(--neon-blue)' }}>{userName || 'אורח'}</b>
                </span>
                
                {!token ? (
                    <>
                        <Link to="/login" className="nav-link" onClick={closeMenu}>התחברות</Link>
                        <Link to="/register" className="nav-link btn-register" onClick={closeMenu}>הרשמה</Link>
                    </>
                ) : (
                    <button onClick={handleLogout} className="btn-logout">התנתק</button>
                )}
            </div>
        </nav>
    );
};

export default Navbar;