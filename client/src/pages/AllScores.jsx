import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container, Typography, Box, Paper, CircularProgress,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel
} from "@mui/material";

const AllScores = () => {
  const [allScores, setAllScores] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // משתני מצב לניהול המיון
  const [order, setOrder] = useState('desc'); 
  const [orderBy, setOrderBy] = useState('date'); 

  useEffect(() => {
    const fetchAllScores = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:3001/api/results/admin/all', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // חישוב אחוזים והכנת הנתונים
        const processedData = res.data.map(item => ({
            ...item,
            percentage: Math.round((item.score / item.totalQuestions) * 100) || 0,
            // מניעת קריסה במקרה שהמשתמש נמחק ממסד הנתונים אך הציון שלו נשאר
            userName: item.userId?.userName || 'משתמש נמחק' 
        }));
        
        setAllScores(processedData);
      } catch (err) {
        console.error("Error fetching all scores", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllScores();
  }, []);

  // פונקציה לשינוי סדר וסוג המיון בלחיצה על כותרת
  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  // הלוגיקה שממיינת את המערך
  const sortedScores = [...allScores].sort((a, b) => {
    let valA = a[orderBy];
    let valB = b[orderBy];

    // התאמות ספציפיות לפי סוג העמודה
    if (orderBy === 'date') {
      valA = new Date(a.date).getTime();
      valB = new Date(b.date).getTime();
    } else if (orderBy === 'quizTitle') {
      valA = a.quizTitle.toLowerCase();
      valB = b.quizTitle.toLowerCase();
    } else if (orderBy === 'userName') {
      valA = a.userName.toLowerCase();
      valB = b.userName.toLowerCase();
    }

    if (valA < valB) return order === 'asc' ? -1 : 1;
    if (valA > valB) return order === 'asc' ? 1 : -1;
    return 0;
  });

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress color="inherit" /></Box>;

  return (
    <Container maxWidth="lg" sx={{ mt: 5, pb: 5 }}>
      <Typography variant="h3" sx={{ mb: 4, textAlign: 'center', color: '#40e0d0', fontWeight: 'bold' }}>
        כל הציונים במערכת (ניהול)
      </Typography>
      
      {allScores.length === 0 ? (
        <Typography variant="h5" sx={{ textAlign: 'center', color: 'white', mt: 5 }}>
          אין עדיין ציונים במערכת.
        </Typography>
      ) : (
        <TableContainer component={Paper} sx={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', border: '1px solid rgba(64, 224, 208, 0.2)', borderRadius: 3 }}>
          <Table sx={{ minWidth: 650 }} dir="rtl">
            <TableHead sx={{ bgcolor: 'rgba(0,0,0,0.5)' }}>
              <TableRow>
                <TableCell align="right">
                  <TableSortLabel
                    active={orderBy === 'userName'}
                    direction={orderBy === 'userName' ? order : 'asc'}
                    onClick={() => handleRequestSort('userName')}
                    sx={{ color: '#40e0d0 !important', fontWeight: 'bold', '& .MuiTableSortLabel-icon': { color: '#40e0d0 !important' } }}
                  >
                    שם משתמש
                  </TableSortLabel>
                </TableCell>
                <TableCell align="right">
                  <TableSortLabel
                    active={orderBy === 'quizTitle'}
                    direction={orderBy === 'quizTitle' ? order : 'asc'}
                    onClick={() => handleRequestSort('quizTitle')}
                    sx={{ color: '#40e0d0 !important', fontWeight: 'bold', '& .MuiTableSortLabel-icon': { color: '#40e0d0 !important' } }}
                  >
                    שם החידון
                  </TableSortLabel>
                </TableCell>
                <TableCell align="center">
                  <TableSortLabel
                    active={orderBy === 'percentage'}
                    direction={orderBy === 'percentage' ? order : 'asc'}
                    onClick={() => handleRequestSort('percentage')}
                    sx={{ color: '#40e0d0 !important', fontWeight: 'bold', '& .MuiTableSortLabel-icon': { color: '#40e0d0 !important' } }}
                  >
                    ציון (%)
                  </TableSortLabel>
                </TableCell>
                <TableCell align="left">
                  <TableSortLabel
                    active={orderBy === 'date'}
                    direction={orderBy === 'date' ? order : 'asc'}
                    onClick={() => handleRequestSort('date')}
                    sx={{ color: '#40e0d0 !important', fontWeight: 'bold', '& .MuiTableSortLabel-icon': { color: '#40e0d0 !important' } }}
                  >
                    תאריך
                  </TableSortLabel>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedScores.map((row) => (
                <TableRow key={row._id} sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { bgcolor: 'rgba(255,255,255,0.08)' } }}>
                  <TableCell align="right" sx={{ color: 'white', fontWeight: 'bold' }}>{row.userName}</TableCell>
                  <TableCell align="right" sx={{ color: 'white' }}>{row.quizTitle}</TableCell>
                  <TableCell align="center" sx={{ color: row.percentage >= 60 ? '#4caf50' : '#f44336', fontWeight: 'bold', fontSize: '1.1rem' }}>
                    {row.percentage}%
                  </TableCell>
                  <TableCell align="left" sx={{ color: 'white', opacity: 0.8 }}>
                    {new Date(row.date).toLocaleDateString('he-IL', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default AllScores;