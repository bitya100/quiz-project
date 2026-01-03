import React from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const response = await axios.post('http://localhost:3001/api/users/register', data);
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('role', response.data.role);
      localStorage.setItem('userName', response.data.userName);
      localStorage.setItem('userId', response.data.userId);

      alert('נרשמת וחוברת בהצלחה! ברוך הבא ל-QUIZ ZONE');
      
      window.location.href = '/quizzes'; 
    } catch (error) {
      console.error('שגיאה בהרשמה:', error);
      alert(error.response?.data || 'שגיאה בחיבור לשרת');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 className="main-title" style={{fontSize: '2.5rem', marginTop: '0', marginBottom: '30px'}}>
            הרשמה
        </h2>
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
  card: {
    background: 'var(--card-bg)',
    padding: '40px',
    borderRadius: '20px',
    border: '1px solid rgba(64, 224, 208, 0.2)',
    width: '100%',
    maxWidth: '400px',
    textAlign: 'center',
    boxShadow: '0 0 25px rgba(64, 224, 208, 0.1)'
  },
  form: { display: 'flex', flexDirection: 'column', gap: '20px' },
  input: { 
    width: '100%',
    padding: '12px', 
    borderRadius: '8px', 
    border: '1px solid #444', 
    background: '#0a0a0c', 
    color: 'white', 
    fontSize: '1rem',
    boxSizing: 'border-box'
  },
  inputContainer: { display: 'flex', flexDirection: 'column', textAlign: 'right' },
  error: { color: '#ff4d4d', fontSize: '0.8rem', marginTop: '5px' },
  footer: { marginTop: '25px', color: '#94a3b8', fontSize: '0.9rem' },
  link: { color: '#40e0d0', cursor: 'pointer', fontWeight: 'bold', textDecoration: 'underline' }
};

export default Register;