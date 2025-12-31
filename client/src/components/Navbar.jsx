import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token'); // בדיקת התחברות

    const handleLogout = () => {
        localStorage.removeItem('token'); // מחיקת הטוקן
        navigate('/login');
    };

    return (
        <nav style={{ 
            padding: '15px', 
            backgroundColor: '#333', 
            color: '#fff', 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center' 
        }}>
            <div>
                <Link to="/" style={{ color: '#fff', marginRight: '20px', textDecoration: 'none', fontWeight: 'bold' }}>דף הבית</Link>
                <Link to="/quizzes" style={{ color: '#fff', textDecoration: 'none' }}>חידונים</Link>
            </div>
            
            <div>
                {!token ? (
                    <>
                        <Link to="/login" style={{ color: '#fff', marginRight: '15px', textDecoration: 'none' }}>התחברות</Link>
                        <Link to="/register" style={{ color: '#fff', textDecoration: 'none', border: '1px solid #fff', padding: '5px 10px', borderRadius: '4px' }}>הרשמה</Link>
                    </>
                ) : (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ marginRight: '15px' }}>שלום משתמש!</span>
                        <button 
                            onClick={handleLogout} 
                            style={{ 
                                backgroundColor: '#f44336', 
                                color: 'white', 
                                border: 'none', 
                                padding: '8px 15px', 
                                cursor: 'pointer',
                                borderRadius: '4px'
                            }}>
                            התנתק
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;