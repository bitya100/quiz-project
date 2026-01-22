import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../App.css'; // חשוב לוודא שה-CSS מיובא כדי להשתמש ב-score-pass/fail

const MyScores = ({ searchTerm }) => {
    const [allResults, setAllResults] = useState([]);
    const [filteredResults, setFilteredResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState('date'); 
    const [sortOrder, setSortOrder] = useState('desc');
    const [hoveredRow, setHoveredRow] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.get('http://localhost:3001/api/results/my-scores', {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(res => {
                    setAllResults(res.data);
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

    useEffect(() => {
        let results = allResults.filter(res => 
            res.quizTitle?.toLowerCase().includes(searchTerm?.toLowerCase() || "")
        );

        results.sort((a, b) => {
            let valA = a[sortBy], valB = b[sortBy];
            if (sortBy === 'date') { valA = new Date(a.date); valB = new Date(b.date); }
            if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
            if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
            return 0;
        });

        setFilteredResults(results);
    }, [searchTerm, allResults, sortBy, sortOrder]);

    const handleSort = (column) => {
        if (sortBy === column) setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        else { setSortBy(column); setSortOrder('desc'); }
    };

    if (loading) return <div style={{ textAlign: 'center', marginTop: '50px', color: 'white' }}>טוען נתונים...</div>;

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '30px', color: 'white' }}>היסטוריית הציונים שלי 🏆</h1>
            {filteredResults.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#333', borderRadius: '10px', color: 'white' }}>
                    <p>{searchTerm ? 'לא נמצאו תוצאות' : 'עדיין לא פתרת חידונים - זמין למשתמש רשום בלבד.'}</p>
                </div>
            ) : (
                <div style={{ overflowX: 'auto', boxShadow: '0 4px 15px rgba(0,0,0,0.3)', borderRadius: '10px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#34495e', color: 'white' }}>
                                <th onClick={() => handleSort('quizTitle')} style={thStyle}>
                                    שם החידון {sortBy === 'quizTitle' ? (sortOrder === 'asc' ? '↑' : '↓') : '↕'}
                                </th>
                                <th onClick={() => handleSort('score')} style={thStyle}>
                                    ציון {sortBy === 'score' ? (sortOrder === 'asc' ? '↑' : '↓') : '↕'}
                                </th>
                                <th onClick={() => handleSort('date')} style={thStyle}>
                                    תאריך {sortBy === 'date' ? (sortOrder === 'asc' ? '↑' : '↓') : '↕'}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredResults.map(res => (
                                <tr 
                                    key={res._id} 
                                    onMouseEnter={() => setHoveredRow(res._id)}
                                    onMouseLeave={() => setHoveredRow(null)}
                                    style={{ 
                                        borderBottom: '1px solid #eee',
                                        backgroundColor: hoveredRow === res._id ? '#f1f1f1' : 'transparent',
                                        transition: 'background-color 0.2s'
                                    }}
                                >
                                    <td style={tdStyle}>{res.quizTitle}</td>
                                    {/* עדכון כאן: שימוש ב-className מה-CSS שלך */}
                                    <td style={tdStyle}>
                                        <span className={res.score >= 60 ? 'score-pass' : 'score-fail'}>
                                            {res.score}%
                                        </span>
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
const thStyle = { ...tdStyle, color: 'white', cursor: 'pointer', userSelect: 'none' };

export default MyScores;