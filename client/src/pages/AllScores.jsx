import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux"; 
import { 
  Container, Typography, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Box, CircularProgress, 
  IconButton, Tooltip, Snackbar, Alert, Dialog, DialogTitle, 
  DialogContent, DialogActions, Button, TableSortLabel 
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import LockIcon from "@mui/icons-material/Lock"; 

const SUPER_ADMIN_USERNAME = "מנהל.ראשי-admin10";

const AllScores = ({ searchTerm = "" }) => {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({ open: false, message: "", severity: "info" });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, scoreId: null });
  
  // משתני מצב לניהול המיון - בדיוק כמו ב-MyScores
  const [order, setOrder] = useState('desc'); 
  const [orderBy, setOrderBy] = useState('date'); 

  const { user } = useSelector((state) => state.auth);
  const isSuperAdmin = user?.userName === SUPER_ADMIN_USERNAME;

  useEffect(() => {
    fetchScores();
  }, []);

  const fetchScores = async () => {
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const res = await axios.get("http://localhost:3001/api/results/all", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setScores(res.data);
    } catch (err) {
      setNotification({ open: true, message: "שגיאה בטעינת נתונים", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!isSuperAdmin) return;
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const res = await axios.delete(`http://localhost:3001/api/results/${deleteDialog.scoreId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setScores(scores.filter(s => s._id !== deleteDialog.scoreId));
      setNotification({ open: true, message: res.data.message, severity: "success" });
    } catch (err) {
      const msg = err.response?.data?.message || "שגיאה במחיקה";
      setNotification({ open: true, message: msg, severity: "error" });
    } finally {
      setDeleteDialog({ open: false, scoreId: null });
    }
  };

  // פונקציה שמטפלת בלחיצה על כותרת בטבלה
  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  // סינון הציונים לפי שורת החיפוש
  const filteredScores = scores.filter(score => {
    const title = (score.quizTitle || "").toLowerCase();
    const userName = (score.userId?.userName || "").toLowerCase();
    return title.includes(searchTerm.toLowerCase()) || userName.includes(searchTerm.toLowerCase());
  });

  // לוגיקת המיון המעודכנת
  const sortedScores = [...filteredScores].sort((a, b) => {
    let valA, valB;

    if (orderBy === 'userName') {
      valA = (a.userId?.userName || "אנונימי").toLowerCase();
      valB = (b.userId?.userName || "אנונימי").toLowerCase();
    } else if (orderBy === 'quizTitle') {
      valA = (a.quizTitle || "").toLowerCase();
      valB = (b.quizTitle || "").toLowerCase();
    } else if (orderBy === 'score') {
      // נמיין לפי היחס של הציון (כדי שהמיון יהיה מדויק גם אם מספר השאלות שונה)
      valA = a.score / (a.totalQuestions || 1);
      valB = b.score / (b.totalQuestions || 1);
    } else if (orderBy === 'date') {
      valA = new Date(a.date).getTime();
      valB = new Date(b.date).getTime();
    }

    if (valA < valB) return order === 'asc' ? -1 : 1;
    if (valA > valB) return order === 'asc' ? 1 : -1;
    return 0;
  });

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress color="inherit" /></Box>;

  return (
    <Container maxWidth="lg" sx={{ mt: 5, pb: 5 }}>
      <Typography variant="h4" sx={{ mb: 4, textAlign: 'right', color: '#40e0d0', fontWeight: 'bold' }}>
        כל הציונים במערכת
      </Typography>

      <TableContainer component={Paper} sx={{ background: 'rgba(255, 255, 255, 0.05)', borderRadius: 3, border: '1px solid rgba(255,255,255,0.1)' }}>
        <Table dir="rtl">
          <TableHead sx={{ bgcolor: 'rgba(64, 224, 208, 0.1)' }}>
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
                  חידון
                </TableSortLabel>
              </TableCell>

              <TableCell align="right">
                <TableSortLabel
                  active={orderBy === 'score'}
                  direction={orderBy === 'score' ? order : 'asc'}
                  onClick={() => handleRequestSort('score')}
                  sx={{ color: '#40e0d0 !important', fontWeight: 'bold', '& .MuiTableSortLabel-icon': { color: '#40e0d0 !important' } }}
                >
                  ציון
                </TableSortLabel>
              </TableCell>

              <TableCell align="right">
                <TableSortLabel
                  active={orderBy === 'date'}
                  direction={orderBy === 'date' ? order : 'asc'}
                  onClick={() => handleRequestSort('date')}
                  sx={{ color: '#40e0d0 !important', fontWeight: 'bold', '& .MuiTableSortLabel-icon': { color: '#40e0d0 !important' } }}
                >
                  תאריך
                </TableSortLabel>
              </TableCell>

              <TableCell align="center" sx={{ color: '#40e0d0', fontWeight: 'bold' }}>מחיקה</TableCell>
            
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedScores.map((score) => (
              <TableRow key={score._id} sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' } }}>
                <TableCell align="right" sx={{ color: 'white' }}>{score.userId?.userName || "אנונימי"}</TableCell>
                <TableCell align="right" sx={{ color: 'white' }}>{score.quizTitle}</TableCell>
                <TableCell align="right" sx={{ color: 'white' }}>{score.score}/{score.totalQuestions}</TableCell>
                <TableCell align="right" sx={{ color: 'white' }}>{new Date(score.date).toLocaleDateString('he-IL')}</TableCell>
                <TableCell align="center">
                  <Tooltip title={isSuperAdmin ? "מחק" : "נעול למנהל-על"}>
                    <span>
                      <IconButton onClick={() => setDeleteDialog({ open: true, scoreId: score._id })} disabled={!isSuperAdmin} color="error">
                        {isSuperAdmin ? <DeleteIcon /> : <LockIcon fontSize="small" sx={{ opacity: 0.5 }} />}
                      </IconButton>
                    </span>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, scoreId: null })} dir="rtl">
        <DialogTitle sx={{ bgcolor: '#020617', color: '#f44336' }}>אישור מחיקה</DialogTitle>
        <DialogActions sx={{ bgcolor: '#020617' }}>
          <Button onClick={() => setDeleteDialog({ open: false, scoreId: null })} sx={{ color: 'white' }}>ביטול</Button>
          <Button onClick={confirmDelete} variant="contained" sx={{ bgcolor: '#f44336' }}>מחק</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={notification.open} autoHideDuration={4000} onClose={() => setNotification({ ...notification, open: false })}>
        <Alert severity={notification.severity}>{notification.message}</Alert>
      </Snackbar>
    </Container>
  );
};

export default AllScores;