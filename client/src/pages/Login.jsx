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
            // 1. שליחת בקשת POST לשרת
            const response = await axios.post('http://localhost:3001/api/users/login', { 
                email: email.toLowerCase(), 
                password 
            });
            
            // 2. שמירת הנתונים ב-localStorage (התיקון כאן!)
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('userId', response.data.userId); 
            localStorage.setItem('role', response.data.role); // שומר את התפקיד (admin/user)
            localStorage.setItem('userName', response.data.userName); // שומר את שם המשתמש

            console.log("Login successful, role:", response.data.role);
            
            alert(`שלום ${response.data.userName || 'ברוך הבא'}, התחברת בהצלחה!`);
            
            // 3. ניווט לדף החידונים ורענון המערכת
            navigate('/quizzes'); 
            window.location.reload(); // חשוב כדי שה-Header ודף החידונים יזהו את ה-role החדש מיד
            
        } catch (err) {
            const errorMessage = err.response?.data || 'אימייל או סיסמה שגויים';
            alert('שגיאה בהתחברות: ' + errorMessage);
            console.error('Login error:', err);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>התחברות</h2>
                <form onSubmit={handleSubmit}>
                    <div style={styles.inputGroup}>
                        <label>אימייל:</label>
                        <input 
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                            style={styles.input}
                            placeholder="your@email.com"
                        />
                    </div>
                    <div style={styles.inputGroup}>
                        <label>סיסמה:</label>
                        <input 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                            style={styles.input}
                            placeholder="הכנס סיסמה"
                        />
                    </div>
                    <button type="submit" style={styles.button}>התחבר</button>
                </form>
                <p style={styles.footer}>
                    עוד לא רשום? <span style={styles.link} onClick={() => navigate('/register')}>צור חשבון</span>
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
        height: '80vh',
        backgroundColor: '#f4f4f4'
    },
    card: {
        padding: '30px',
        borderRadius: '8px',
        backgroundColor: '#fff',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        width: '350px',
        textAlign: 'center'
    },
    title: { marginBottom: '20px', color: '#333' },
    inputGroup: { marginBottom: '15px', textAlign: 'right', direction: 'rtl' },
    input: {
        width: '100%',
        padding: '10px',
        marginTop: '5px',
        borderRadius: '4px',
        border: '1px solid #ccc',
        boxSizing: 'border-box'
    },
    button: {
        width: '100%',
        padding: '10px',
        backgroundColor: '#28a745',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '16px',
        marginTop: '10px'
    },
    footer: { marginTop: '15px', fontSize: '14px' },
    link: { color: '#007bff', cursor: 'pointer', textDecoration: 'underline' }
};

export default Login;