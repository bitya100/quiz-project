import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
    Table, TableBody, TableCell, TableContainer, TableHead, 
    TableRow, Paper, Typography, Container, Box, CircularProgress 
} from '@mui/material';
// תיקון נתיב ה-CSS כדי לצאת מתיקיית pages לתיקיית src
import '../App.css'; 

const AllScores = ({ searchTerm }) => { // קבלת החיפוש מה-Navbar דרך App.js
    const [allResults, setAllResults] = useState([]);
    const [filteredResults, setFilteredResults] = useState([]);
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
                setFilteredResults(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching all scores:", err);
                setError('שגיאה בטעינת הנתונים. וודא שאתה מחובר כמנהל.');
                setLoading(false);
            }
        };
        fetchAllScores();
    }, []);

    // לוגיקת הסינון - מגיבה לשינויים ב-searchTerm שמגיע מה-Navbar
    useEffect(() => {
        const results = allResults.filter(result => {
            const quizTitle = result.quizTitle?.toLowerCase() || '';
            const userName = result.userId?.userName?.toLowerCase() || '';
            const search = searchTerm?.toLowerCase() || '';
            
            return quizTitle.includes(search) || userName.includes(search);
        });
        setFilteredResults(results);
    }, [searchTerm, allResults]);

    if (loading) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
            <CircularProgress sx={{ color: '#00c1ab' }} />
        </Box>
    );

    if (error) return <div className="center-message error-message">{error}</div>;

    return (
        <Container maxWidth="lg" sx={{ py: 4 }} dir="rtl">
            <Typography 
                variant="h3" 
                className="admin-page-title" 
                sx={{ mb: 4, fontFamily: 'Assistant', fontWeight: 800 }}
            >
                ניהול ציוני מערכת 🛠️
            </Typography>

            <TableContainer component={Paper} className="scores-table-container" elevation={5}>
                <Table sx={{ minWidth: 650 }}>
                    <TableHead>
                        <TableRow>
                            <TableCell align="right" sx={{ fontFamily: 'Assistant', fontWeight: 'bold' }}>שם המשתמש</TableCell>
                            <TableCell align="right" sx={{ fontFamily: 'Assistant', fontWeight: 'bold' }}>חידון</TableCell>
                            <TableCell align="right" sx={{ fontFamily: 'Assistant', fontWeight: 'bold' }}>ציון</TableCell>
                            <TableCell align="right" sx={{ fontFamily: 'Assistant', fontWeight: 'bold' }}>תאריך</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredResults.length > 0 ? (
                            filteredResults.map((result) => (
                                <TableRow key={result._id} className="user-row" hover>
                                    <TableCell align="right" sx={{ fontFamily: 'Assistant' }}>
                                        {result.userId ? result.userId.userName : 'אורח'}
                                    </TableCell>
                                    <TableCell align="right" sx={{ fontFamily: 'Assistant' }}>
                                        {result.quizTitle}
                                    </TableCell>
                                    <TableCell align="right" sx={{ fontFamily: 'Assistant' }}>
                                        <span className={result.score >= 60 ? 'score-pass' : 'score-fail'}>
                                            {result.score}%
                                        </span>
                                    </TableCell>
                                    <TableCell align="right" sx={{ fontFamily: 'Assistant' }}>
                                        {new Date(result.date).toLocaleString('he-IL')}
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} align="center" sx={{ py: 5 }}>
                                    <Typography variant="body1" sx={{ fontFamily: 'Assistant', color: '#666' }}>
                                        לא נמצאו תוצאות התואמות לחיפוש: "{searchTerm}"
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default AllScores;