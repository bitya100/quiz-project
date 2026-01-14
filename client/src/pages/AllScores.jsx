import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AllScores = () => {
    const [allResults, setAllResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAllScores = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:3001/api/results/admin/all', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setAllResults(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching all scores:", err);
                setError('אין לך הרשאות לצפות בדף זה או שיש שגיאת שרת.');
                setLoading(false);
            }
        };
        fetchAllScores();
    }, []);

    if (loading) return <div className="center-message">טוען נתוני מערכת...</div>;
    if (error) return <div className="center-message error-message">{error}</div>;

    return (
        <div className="container" style={{ direction: 'rtl' }}>
            {/* כותרת נקייה ללא אפקט ניאון */}
            <h1 className="admin-page-title">ניהול ציוני מערכת 🛠️</h1>
            <p className="subtitle" style={{ color: '#666', marginBottom: '30px' }}>
                צפייה בכל התוצאות של כל המשתמשים
            </p>
            
            <div className="scores-table-container">
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th>שם המשתמש</th>
                            <th>חידון</th>
                            <th>ציון</th>
                            <th>תאריך</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allResults.map((result) => (
                            <tr key={result._id}>
                                <td>
                                    {result.userId ? result.userId.userName : 'משתמש לא ידוע'}
                                </td>
                                <td>{result.quizTitle}</td>
                                <td className={result.score >= 60 ? 'score-pass' : 'score-fail'}>
                                    {result.score}%
                                </td>
                                <td>{new Date(result.date).toLocaleString('he-IL')}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AllScores;