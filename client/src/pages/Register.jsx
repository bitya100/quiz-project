import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const [status, setStatus] = useState({ type: '', message: '' });

  const onSubmit = async (data) => {
    setStatus({ type: '', message: '' });
    try {
      const response = await axios.post('http://localhost:3001/api/users/register', data);
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('role', response.data.role);
      localStorage.setItem('userName', response.data.userName);
      localStorage.setItem('userId', response.data.userId);

      setStatus({ 
        type: 'success', 
        message: 'נרשמת וחוברת בהצלחה! ברוך הבא ל-QUIZ ZONE, מיד נכנסים...' 
      });

      setTimeout(() => {
        window.location.href = '/quizzes'; 
      }, 2000);

    } catch (error) {
      const errorMessage = error.response?.data || 'שגיאה בחיבור לשרת';
      if (errorMessage.includes('exists') || errorMessage.includes('קיים')) {
        setStatus({ type: 'error', message: 'נראה שאתה כבר רשום במערכת.' });
      } else {
        setStatus({ type: 'error', message: errorMessage });
      }
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 className="main-title" style={styles.header}>הרשמה</h2>
        
        {status.message && (
          <div style={{
            ...styles.statusBox,
            backgroundColor: status.type === 'success' ? 'rgba(0, 193, 171, 0.1)' : 'rgba(255, 77, 77, 0.1)',
            borderColor: status.type === 'success' ? '#00c1ab' : '#ff4d4d',
            color: status.type === 'success' ? '#00c1ab' : '#ff4d4d',
          }}>
            {status.message}
            {status.type === 'error' && status.message.includes('רשום') && (
              <span style={styles.inlineLink} onClick={() => navigate('/login')}> לעבור להתחברות?</span>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} style={styles.form}>
            <div style={styles.inputContainer}>
                <input {...register("userName", { required: true })} placeholder="שם משתמש" style={styles.input} />
                {errors.userName && <span style={styles.error}>שדה חובה</span>}
            </div>

            <div style={styles.inputContainer}>
                <input {...register("email", { required: true })} placeholder="אימייל" type="email" style={styles.input} />
                {errors.email && <span style={styles.error}>אימייל לא תקין</span>}
            </div>

            <div style={styles.inputContainer}>
                <input {...register("password", { required: true, minLength: 6 })} placeholder="סיסמה (6+ תווים)" type="password" style={styles.input} />
                {errors.password && <span style={styles.error}>סיסמה קצרה מדי</span>}
            </div>

            <button type="submit" className="play-btn">צור חשבון והיכנס</button>
        </form>

        <p style={styles.footer}>
            כבר יש לך חשבון? <span style={styles.link} onClick={() => navigate('/login')}>התחבר כאן</span>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: { padding: '50px 20px', display: 'flex', justifyContent: 'center' },
  header: { fontSize: '2.5rem', marginTop: '0', marginBottom: '30px' },
  card: {
    background: 'var(--card-bg)',
    padding: '40px', borderRadius: '20px', border: '1px solid rgba(64, 224, 208, 0.2)',
    width: '100%', maxWidth: '400px', textAlign: 'center', boxShadow: '0 0 25px rgba(64, 224, 208, 0.1)'
  },
  statusBox: { padding: '12px', borderRadius: '8px', border: '1px solid', fontSize: '0.9rem', marginBottom: '20px', fontWeight: 'bold' },
  form: { display: 'flex', flexDirection: 'column', gap: '20px' },
  input: { 
    width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #444', 
    background: '#0a0a0c', color: 'white', fontSize: '1rem', boxSizing: 'border-box'
  },
  inputContainer: { display: 'flex', flexDirection: 'column', textAlign: 'right' },
  error: { color: '#ff4d4d', fontSize: '0.8rem', marginTop: '5px' },
  inlineLink: { textDecoration: 'underline', cursor: 'pointer', fontWeight: 'bold', marginLeft: '5px' },
  footer: { marginTop: '25px', fontSize: '0.9rem', color: 'white' },
  link: { color: '#40e0d0', cursor: 'pointer', fontWeight: 'bold', textDecoration: 'underline' }
};

export default Register;