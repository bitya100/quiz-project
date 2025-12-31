import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MyScores = () => {
    const [results, setResults] = useState([]);
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        if (userId) {
            axios.get(`http://localhost:3001/api/results/user/${userId}`)
                .then(res => setResults(res.data))
                .catch(err => console.error(err));
        }
    }, [userId]);

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
            <h1 style={{ textAlign: 'center' }}>הציונים שלי 🏆</h1>
            {results.length === 0 ? <p>עדיין לא פתרת חידונים.</p> : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f2f2f2' }}>
                            <th style={tdStyle}>שם החידון</th>
                            <th style={tdStyle}>ציון</th>
                            <th style={tdStyle}>תאריך</th>
                        </tr>
                    </thead>
                    <tbody>
                        {results.map(res => (
                            <tr key={res._id}>
                                <td style={tdStyle}>{res.quizTitle}</td>
                                <td style={{...tdStyle, fontWeight: 'bold', color: res.score >= 60 ? 'green' : 'red'}}>{res.score}</td>
                                <td style={tdStyle}>{new Date(res.date).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

const tdStyle = { border: '1px solid #ddd', padding: '12px', textAlign: 'center' };
export default MyScores;