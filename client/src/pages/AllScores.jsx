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

    if (loading) return <div style={styles.center}>טוען נתוני מערכת...</div>;
    if (error) return <div style={{...styles.center, color: 'red'}}>{error}</div>;

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>ניהול ציוני מערכת 🛠️</h1>
            <p style={styles.subtitle}>צפייה בכל התוצאות של כל המשתמשים</p>
            
            <div style={styles.tableWrapper}>
                <table style={styles.table}>
                    <thead>
                        <tr style={styles.thr}>
                            <th style={styles.th}>שם המשתמש</th>
                            <th style={styles.th}>חידון</th>
                            <th style={styles.th}>ציון</th>
                            <th style={styles.th}>תאריך</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allResults.map((result) => (
                            <tr key={result._id} style={styles.tr}>
                                {/* הצגת השם מתוך האובייקט המאוכלס */}
                                <td style={styles.td}>
                                    {result.userId ? result.userId.userName : 'משתמש לא ידוע'}
                                </td>
                                <td style={styles.td}>{result.quizTitle}</td>
                                <td style={{...styles.td, fontWeight: 'bold', color: result.score >= 60 ? '#27ae60' : '#e74c3c'}}>
                                    {result.score}%
                                </td>
                                <td style={styles.td}>{new Date(result.date).toLocaleString('he-IL')}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const styles = {
    container: { padding: '40px', maxWidth: '1000px', margin: '0 auto' },
    title: { textAlign: 'center', color: '#2c3e50' },
    subtitle: { textAlign: 'center', color: '#ffffffff', marginBottom: '30px' },
    tableWrapper: { boxShadow: '0 4px 20px rgba(0,0,0,0.1)', borderRadius: '12px', overflow: 'hidden' },
    table: { width: '100%', borderCollapse: 'collapse', backgroundColor: 'white' },
    thr: { backgroundColor: '#2c3e50', color: 'white' },
    th: { padding: '15px', textAlign: 'center' },
    td: { padding: '12px', textAlign: 'center', borderBottom: '1px solid #eee' },
    center: { textAlign: 'center', marginTop: '100px', fontSize: '20px' }
};

export default AllScores;