import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const linkStyle = { 
        color: '#fff', 
        marginRight: '20px', 
        textDecoration: 'none',
        fontSize: '16px'
    };

    return (
        <nav style={{ 
            padding: '15px 30px', 
            backgroundColor: '#2c3e50', 
            color: '#fff', 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
        }}>
            <div>
                <Link to="/" style={{ ...linkStyle, fontWeight: 'bold', fontSize: '18px' }}>QuizApp</Link>
                <Link to="/quizzes" style={linkStyle}>חידונים</Link>
                {/* קישור לדף המנהל החדש */}
                <Link to="/create-quiz" style={{ ...linkStyle, color: '#f1c40f' }}>➕ צור חידון</Link>
            </div>
            
            <div>
                {!token ? (
                    <>
                        <Link to="/login" style={linkStyle}>התחברות</Link>
                        <Link to="/register" style={{ 
                            ...linkStyle, 
                            backgroundColor: '#3498db', 
                            padding: '8px 15px', 
                            borderRadius: '5px' 
                        }}>הרשמה</Link>
                    </>
                ) : (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ marginLeft: '15px' }}>שלום!</span>
                        <button 
                            onClick={handleLogout} 
                            style={{ 
                                backgroundColor: '#e74c3c', 
                                color: 'white', 
                                border: 'none', 
                                padding: '8px 15px', 
                                cursor: 'pointer',
                                borderRadius: '5px'
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