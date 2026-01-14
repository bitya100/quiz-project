import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../registerNlogin.css';

function Register() {
  const { register, handleSubmit, formState: { errors } } = useForm(); // שימוש ב-react-hook-form [cite: 72]
  const navigate = useNavigate();
  const [status, setStatus] = useState({ type: '', message: '' });

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

  const onSubmit = async (data) => {
    setStatus({ type: '', message: '' });
    try {
      const response = await axios.post(`${API_URL}/users/register`, data);
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('role', response.data.role);
      localStorage.setItem('userName', response.data.userName);
      localStorage.setItem('userId', response.data.userId);

      setStatus({ type: 'success', message: 'נרשמת וחוברת בהצלחה!' });

      setTimeout(() => {
        window.location.href = '/quizzes'; 
      }, 2000);

    } catch (error) {
      const errorMessage = error.response?.data || 'שגיאה בחיבור לשרת';
      setStatus({ type: 'error', message: errorMessage });
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-card">
        <h2 className="main-title auth-header">הרשמה</h2>
        {status.message && <div className={`auth-status-box ${status.type}`}>{status.message}</div>}
        <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
            <div className="auth-input-container">
                <input {...register("userName", { required: true })} placeholder="שם משתמש" className="auth-input" />
                {errors.userName && <span className="auth-error-text">שדה חובה</span>}
            </div>
            <div className="auth-input-container">
                <input {...register("email", { required: true })} placeholder="אימייל" type="email" className="auth-input" />
                {errors.email && <span className="auth-error-text">אימייל לא תקין</span>}
            </div>
            <div className="auth-input-container">
                <input {...register("password", { required: true, minLength: 6 })} placeholder="סיסמה (6+ תווים)" type="password" className="auth-input" />
                {errors.password && <span className="auth-error-text">סיסמה קצרה מדי</span>}
            </div>
            <button type="submit" className="play-btn">צור חשבון והיכנס</button>
        </form>
        <p className="auth-footer">
            כבר יש לך חשבון? <span className="auth-link" onClick={() => navigate('/login')}>התחבר כאן</span>
        </p>
      </div>
    </div>
  );
}

export default Register;