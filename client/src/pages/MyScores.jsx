import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MyScores = () => {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            // שימוש בנתיב המאובטח שיצרנו בשרת
            axios.get('http://localhost:3001/api/results/my-scores', {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(res => {
                    setResults(res.data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Error fetching scores:", err);
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, []);

    if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>טוען נתונים...</div>;

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>היסטוריית הציונים שלי 🏆</h1>
            {results.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#9c9c9cff', borderRadius: '10px' }}>
                    <p>עדיין לא פתרת חידונים. זה הזמן להתחיל!</p>
                </div>
            ) : (
                <div style={{ overflowX: 'auto', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', borderRadius: '10px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#3498db', color: 'white' }}>
                                <th style={tdStyle}>שם החידון</th>
                                <th style={tdStyle}>ציון</th>
                                <th style={tdStyle}>תאריך</th>
                            </tr>
                        </thead>
                        <tbody>
                            {results.map(res => (
                                <tr key={res._id} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={tdStyle}>{res.quizTitle}</td>
                                    <td style={{ ...tdStyle, fontWeight: 'bold', color: res.score >= 60 ? '#27ae60' : '#e74c3c' }}>
                                        {res.score}%
                                    </td>
                                    <td style={tdStyle}>{new Date(res.date).toLocaleDateString('he-IL')}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

const tdStyle = { padding: '15px', textAlign: 'center' };
export default MyScores;