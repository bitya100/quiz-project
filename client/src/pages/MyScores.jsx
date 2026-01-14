import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MyScores = ({ searchTerm }) => { // קבלת ה-Prop מה-App.js
    const [allResults, setAllResults] = useState([]); // הנתונים המקוריים
    const [filteredResults, setFilteredResults] = useState([]); // הנתונים להצגה
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.get('http://localhost:3001/api/results/my-scores', {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(res => {
                    setAllResults(res.data);
                    setFilteredResults(res.data);
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

    // לוגיקת סינון לפי שם חידון
    useEffect(() => {
        const results = allResults.filter(res => 
            res.quizTitle?.toLowerCase().includes(searchTerm?.toLowerCase() || "")
        );
        setFilteredResults(results);
    }, [searchTerm, allResults]);

    if (loading) return <div style={{ textAlign: 'center', marginTop: '50px', color: 'white' }}>טוען נתונים...</div>;

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '30px', color: 'white' }}>היסטוריית הציונים שלי 🏆</h1>
            {filteredResults.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#333', borderRadius: '10px', color: 'white' }}>
                    <p>{searchTerm ? 'לא נמצאו תוצאות לחיפוש שלך' : 'עדיין לא פתרת חידונים. זה הזמן להתחיל!'}</p>
                </div>
            ) : (
                <div style={{ overflowX: 'auto', boxShadow: '0 4px 15px rgba(0,0,0,0.3)', borderRadius: '10px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#34495e', color: 'white' }}>
                                <th style={tdStyle}>שם החידון</th>
                                <th style={tdStyle}>ציון</th>
                                <th style={tdStyle}>תאריך</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredResults.map(res => (
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

const tdStyle = { padding: '15px', textAlign: 'center', color: '#333' };
export default MyScores;