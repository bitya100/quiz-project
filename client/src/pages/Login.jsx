import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [status, setStatus] = useState({ type: '', message: '' });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ type: '', message: '' });

        try {
            const response = await axios.post('http://localhost:3001/api/users/login', { 
                email: email.toLowerCase(), 
                password 
            });
            
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
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 className="main-title" style={styles.header}>התחברות</h2>

                {status.message && (
                    <div style={{
                        ...styles.statusBox,
                        backgroundColor: status.type === 'success' ? 'rgba(0, 193, 171, 0.1)' : 'rgba(255, 77, 77, 0.1)',
                        borderColor: status.type === 'success' ? '#00c1ab' : '#ff4d4d',
                        color: status.type === 'success' ? '#00c1ab' : '#ff4d4d',
                    }}>
                        {status.message}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={styles.form}>
                    <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                        style={styles.input}
                        placeholder="אימייל"
                    />
                    <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                        style={styles.input}
                        placeholder="סיסמה"
                    />
                    <button type="submit" className="play-btn">כניסה למערכת</button>
                </form>
                <p style={styles.footer}>
                    עוד לא רשום? <span style={styles.link} onClick={() => navigate('/register')}>צור חשבון חדש</span>
                </p>
            </div>
        </div>
    );
};

const styles = {
    container: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', padding: '20px' },
    header: { fontSize: '2.5rem', marginTop: '0', marginBottom: '30px' },
    card: {
        background: 'var(--card-bg)',
        border: '1px solid rgba(64, 224, 208, 0.2)',
        borderRadius: '20px', padding: '40px', boxShadow: '0 0 25px rgba(64, 224, 208, 0.1)',
        width: '100%', maxWidth: '400px', textAlign: 'center'
    },
    statusBox: { padding: '12px', borderRadius: '8px', border: '1px solid', fontSize: '0.9rem', marginBottom: '20px', fontWeight: 'bold' },
    form: { display: 'flex', flexDirection: 'column', gap: '20px' },
    input: { 
        width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #444', 
        background: '#0a0a0c', color: 'white', fontSize: '1rem', boxSizing: 'border-box', outline: 'none' 
    },
    footer: { marginTop: '25px', fontSize: '0.9rem', color: 'white' },
    link: { color: '#40e0d0', cursor: 'pointer', fontWeight: 'bold', textDecoration: 'underline' }
};

export default Login;