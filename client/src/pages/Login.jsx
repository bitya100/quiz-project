import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // שליחת הבקשה לשרת
            const response = await axios.post('http://localhost:3001/api/users/login', { 
                email, 
                password 
            });
            
            // שמירת ה-Token שהשרת מחזיר
            localStorage.setItem('token', response.data.token);
            alert('התחברת בהצלחה!');
            
            // כאן אפשר להוסיף ניווט לדף הבית
        } catch (err) {
            alert('שגיאה: ' + (err.response?.data || 'משהו השתבש'));
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>התחברות</h2>
            <form onSubmit={handleSubmit}>
                <input type="email" placeholder="אימייל" onChange={(e) => setEmail(e.target.value)} required />
                <br /><br />
                <input type="password" placeholder="סיסמה" onChange={(e) => setPassword(e.target.value)} required />
                <br /><br />
                <button type="submit">התחבר</button>
            </form>
        </div>
    );
};

export default Login;