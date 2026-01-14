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

    if (loading) return <div className="user-greeting-text" style={{textAlign: 'center', marginTop: '100px'}}>טוען נתוני מערכת...</div>;
    if (error) return <div className="user-greeting-text" style={{textAlign: 'center', marginTop: '100px', color: 'red'}}>{error}</div>;

    return (
        <div className="container">
            {/* הכותרת משתמשת במחלקה הקיימת main-title מה-CSS שלך */}
            <h1 className="main-title" style={{ fontSize: '2.8rem' }}>ניהול ציוני מערכת 🛠️</h1>
            <p className="subtitle" style={{ color: 'white', textAlign: 'center' }}>צפייה בכל התוצאות של כל המשתמשים</p>
            
            <div className="scores-table-container">
                <table>
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
                                <td>{result.userId ? result.userId.userName : 'משתמש לא ידוע'}</td>
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