import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../registerNlogin.css'; // נתיב לקובץ בתיקיית src

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [status, setStatus] = useState({ type: '', message: '' });
    const navigate = useNavigate();

    // משיכת כתובת ה-API מה-env (חייב להתחיל ב-VITE ב-Vite)
    const API_URL = import.meta.env.VITE_API_URL;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ type: '', message: '' });

        try {
            // שימוש בכתובת מה-env כפי שנדרש במסמך [cite: 103, 105]
            const response = await axios.post(`${API_URL}/users/login`, { 
                email: email.toLowerCase(), 
                password 
            });
            
            // שמירת נתונים ב-LocalStorage [cite: 8, 226]
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('userId', response.data.userId); 
            localStorage.setItem('role', response.data.role);
            localStorage.setItem('userName', response.data.userName);

            setStatus({ 
                type: 'success', 
                message: `שלום ${response.data.userName || 'ברוך הבא'}, התחברת בהצלחה!` 
            });

            setTimeout(() => {
                window.location.href = '/quizzes'; 
            }, 2000);
            
        } catch (err) {
            const errorMessage = err.response?.data || 'אימייל או סיסמה שגויים';
            setStatus({ type: 'error', message: 'שגיאה: ' + errorMessage });
        }
    };

    return (
        <div className="auth-page-wrapper">
            <div className="auth-card">
                <h2 className="main-title auth-header">התחברות</h2>

                {status.message && (
                    <div className={`auth-status-box ${status.type}`}>
                        {status.message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="auth-form">
                    <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                        className="auth-input"
                        placeholder="אימייל"
                    />
                    <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                        className="auth-input"
                        placeholder="סיסמה"
                    />
                    <button type="submit" className="play-btn">כניסה למערכת</button>
                </form>
                <p className="auth-footer">
                    עוד לא רשום? <span className="auth-link" onClick={() => navigate('/register')}>צור חשבון חדש</span>
                </p>
            </div>
        </div>
    );
};

export default Login;