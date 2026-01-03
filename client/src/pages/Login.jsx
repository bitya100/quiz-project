import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3001/api/users/login', { 
                email: email.toLowerCase(), 
                password 
            });
            
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('userId', response.data.userId); 
            localStorage.setItem('role', response.data.role);
            localStorage.setItem('userName', response.data.userName);

            alert(`שלום ${response.data.userName || 'ברוך הבא'}, התחברת בהצלחה!`);
            
            window.location.href = '/quizzes'; 
            
        } catch (err) {
            const errorMessage = err.response?.data || 'אימייל או סיסמה שגויים';
            alert('שגיאה בהתחברות: ' + errorMessage);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 className="main-title" style={{ fontSize: '2.5rem', marginTop: '0', marginBottom: '30px' }}>
                    התחברות
                </h2>
                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <input 
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                            style={styles.input}
                            placeholder="אימייל"
                        />
                    </div>
                    <div style={styles.inputGroup}>
                        <input 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                            style={styles.input}
                            placeholder="סיסמה"
                        />
                    </div>
                    <button type="submit" className="play-btn" style={styles.button}>
                        כניסה למערכת
                    </button>
                </form>
                <p style={styles.footer}>
                    עוד לא רשום? <span style={styles.link} onClick={() => navigate('/register')}>צור חשבון חדש</span>
                </p>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '80vh',
        padding: '20px'
    },
    card: {
        background: 'var(--card-bg)',
        border: '1px solid rgba(64, 224, 208, 0.2)',
        borderRadius: '20px',
        padding: '40px',
        boxShadow: '0 0 25px rgba(64, 224, 208, 0.1)',
        width: '100%',
        maxWidth: '400px',
        textAlign: 'center'
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
    },
    inputGroup: {
        textAlign: 'right'
    },
    input: {
        width: '100%',
        padding: '12px',
        borderRadius: '8px',
        border: '1px solid #444',
        background: '#0a0a0c',
        color: 'white',
        fontSize: '1rem',
        boxSizing: 'border-box',
        outline: 'none'
    },
    button: {
        marginTop: '10px'
    },
    footer: {
        marginTop: '25px',
        color: '#94a3b8',
        fontSize: '0.9rem'
    },
    link: {
        // התיקון כאן - עטפתי בגרשיים
        color: 'var(--neon-blue)', 
        cursor: 'pointer',
        fontWeight: 'bold',
        textDecoration: 'underline'
    }
};

export default Login;