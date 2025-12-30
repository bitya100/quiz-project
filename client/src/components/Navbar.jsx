import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    // בדיקה האם קיים Token בזיכרון של הדפדפן
    const token = localStorage.getItem('token');

    const handleLogout = () => {
        localStorage.removeItem('token'); // מחיקת המפתח הסודי
        alert('התנתקת בהצלחה');
        navigate('/login'); // העברה לדף התחברות
    };

    return (
        <nav style={{ padding: '15px', backgroundColor: '#333', color: '#fff', display: 'flex', justifyContent: 'space-between' }}>
            <div>
                <Link to="/" style={{ color: '#fff', marginRight: '15px', textDecoration: 'none' }}>דף הבית</Link>
                <Link to="/products" style={{ color: '#fff', textDecoration: 'none' }}>מוצרים</Link>
            </div>
            
            <div>
                {!token ? (
                    // מה שרואים כשלא מחוברים
                    <>
                        <Link to="/login" style={{ color: '#fff', marginRight: '15px', textDecoration: 'none' }}>התחברות</Link>
                        <Link to="/register" style={{ color: '#fff', textDecoration: 'none' }}>הרשמה</Link>
                    </>
                ) : (
                    // מה שרואים כשמחוברים
                    <>
                        <span style={{ marginRight: '15px' }}>שלום משתמש!</span>
                        <button onClick={handleLogout} style={{ cursor: 'pointer', backgroundColor: 'red', color: 'white', border: 'none', padding: '5px 10px' }}>התנתק</button>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;