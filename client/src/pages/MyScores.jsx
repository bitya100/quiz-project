import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api"; // התיקון הקריטי: משתמשים ב-api שלנו ולא ב-axios נקי
import {
  Container, Typography, Box, Paper, Button, CircularProgress,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel
} from "@mui/material";
import QuizIcon from '@mui/icons-material/Quiz'; 

const MyScores = () => {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [order, setOrder] = useState('desc'); 
  const [orderBy, setOrderBy] = useState('date'); 

  useEffect(() => {
    const fetchScores = async () => {
      try {
        // התיקון: api.get מצרף את הטוקן אוטומטית מאיפה שהוא לא נמצא (local או session)
        const res = await api.get('/results/my-scores');
        
        const processedData = res.data.map(item => ({
            ...item,
            percentage: Math.round((item.score / item.totalQuestions) * 100) || 0
        }));
        
        setScores(processedData);
      } catch (err) {
        console.error("Error fetching scores", err);
      } finally {
        setLoading(false);
      }
    };
    fetchScores();
  }, []);

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortedScores = [...scores].sort((a, b) => {
    let valA = a[orderBy];
    let valB = b[orderBy];

    if (orderBy === 'date') {
      valA = new Date(valA).getTime();
      valB = new Date(valB).getTime();
    } 
    else if (orderBy === 'quizTitle') {
      valA = valA.toLowerCase();
      valB = valB.toLowerCase();
    }

    if (valA < valB) return order === 'asc' ? -1 : 1;
    if (valA > valB) return order === 'asc' ? 1 : -1;
    return 0;
  });

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress color="inherit" /></Box>;

  if (scores.length === 0) {
    return (
      <Container maxWidth="sm" sx={{ mt: 10, textAlign: 'center' }}>
        <Paper elevation={10} sx={{ p: 5, borderRadius: 4, background: 'rgba(255,255,255,0.05)', color: 'white', backdropFilter: 'blur(10px)', border: '1px solid rgba(64, 224, 208, 0.2)' }}>
          <QuizIcon sx={{ fontSize: 70, color: '#40e0d0', mb: 2 }} />
          <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold' }}>עוד לא פתרת כלום!</Typography>
          <Typography variant="body1" sx={{ mb: 4, opacity: 0.8 }}>
            זה הזמן להתחיל! בחר חידון, בדוק את הידע שלך, והציונים שלך יופיעו כאן.
          </Typography>
          <Button component={Link} to="/quizzes" variant="contained" size="large" sx={{ bgcolor: '#40e0d0', color: '#020617', fontWeight: 'bold', '&:hover': { bgcolor: '#00c1ab' } }}>
            למעבר לחידונים
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 5, pb: 5 }}>
      <Typography variant="h3" sx={{ mb: 4, textAlign: 'center', color: '#40e0d0', fontWeight: 'bold' }}>הציונים שלי</Typography>
      <TableContainer component={Paper} sx={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', border: '1px solid rgba(64, 224, 208, 0.2)', borderRadius: 3 }}>
        <Table sx={{ minWidth: 650 }} dir="rtl">
          <TableHead sx={{ bgcolor: 'rgba(0,0,0,0.5)' }}>
            <TableRow>
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
                <TableCell align="right" sx={{ color: 'white' }}>{row.quizTitle}</TableCell>
                <TableCell align="center" sx={{ color: row.percentage >= 60 ? '#4caf50' : '#f44336', fontWeight: 'bold', fontSize: '1.1rem' }}>
                  {row.percentage}%
                </TableCell>
                <TableCell align="left" sx={{ color: 'white' }}>
                  {new Date(row.date).toLocaleDateString('he-IL', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default MyScores;