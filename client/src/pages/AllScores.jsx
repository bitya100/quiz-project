import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux"; // הוספנו משיכה מהסטור
import { 
  Container, Typography, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Box, CircularProgress, 
  IconButton, Tooltip, Snackbar, Alert, Dialog, DialogTitle, 
  DialogContent, DialogActions, Button, TableSortLabel 
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import LockIcon from "@mui/icons-material/Lock"; // הוספנו אייקון מנעול

const AllScores = ({ searchTerm = "" }) => {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({ open: false, message: "", severity: "info" });
  
  const [deleteDialog, setDeleteDialog] = useState({ open: false, scoreId: null });
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });

  // משיכת פרטי המשתמש המחובר כדי לבדוק אם הוא מנהל-העל
  const { user } = useSelector((state) => state.auth);
  
  const isSuperAdmin = user?.email === "admin10@gmail.com" && user?.userName === "מנהל.ראשי-admin10";

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
      console.error("Error fetching all scores:", err);
      const errorMsg = err.response?.status === 400
        ? "שגיאת הזדהות (400): הטוקן חסר. אנא התנתק והתחבר מחדש."
        : err.response?.status === 404 
        ? "שגיאה: השרת לא מוצא את הנתיב /all" 
        : err.response?.status === 403
        ? "אין לך הרשאה מספקת בשרת."
        : "שגיאה בטעינת הציונים מהשרת";
      
      setNotification({ open: true, message: errorMsg, severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    // הגנה נוספת ליתר ביטחון גם בצד הלקוח
    if (!isSuperAdmin) return;

    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      
      await axios.delete(`http://localhost:3001/api/results/${deleteDialog.scoreId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setScores(scores.filter(s => s._id !== deleteDialog.scoreId));
      setNotification({ open: true, message: "הציון נמחק בהצלחה", severity: "success" });
    } catch (err) {
      setNotification({ open: true, message: "שגיאה במחיקת הציון", severity: "error" });
    } finally {
      setDeleteDialog({ open: false, scoreId: null });
    }
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const safeSearchTerm = (searchTerm || "").toLowerCase();

  const filteredScores = scores.filter(score => {
    const title = (score.quizTitle || "").toLowerCase();
    const userName = (score.userId?.userName || "").toLowerCase();
    return title.includes(safeSearchTerm) || userName.includes(safeSearchTerm);
  });

  const sortedScores = [...filteredScores].sort((a, b) => {
    if (sortConfig.key === 'userName') {
      const nameA = a.userId?.userName || "";
      const nameB = b.userId?.userName || "";
      if (nameA < nameB) return sortConfig.direction === 'asc' ? -1 : 1;
      if (nameA > nameB) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    }
    if (sortConfig.key === 'quizTitle') {
      const titleA = a.quizTitle || "";
      const titleB = b.quizTitle || "";
      if (titleA < titleB) return sortConfig.direction === 'asc' ? -1 : 1;
      if (titleA > titleB) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    }
    if (sortConfig.key === 'score') {
      const percentA = a.totalQuestions ? a.score / a.totalQuestions : 0;
      const percentB = b.totalQuestions ? b.score / b.totalQuestions : 0;
      return sortConfig.direction === 'asc' ? percentA - percentB : percentB - percentA;
    }
    if (sortConfig.key === 'date') {
      const dateA = new Date(a.date || 0);
      const dateB = new Date(b.date || 0);
      return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
    }
    return 0;
  });

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress color="inherit" /></Box>;

  return (
    <Container maxWidth="lg" sx={{ mt: 5, pb: 5 }}>
      <Typography variant="h4" sx={{ mb: 4, textAlign: 'right', color: '#40e0d0', fontWeight: 'bold' }}>
        כל הציונים במערכת
      </Typography>

      <TableContainer component={Paper} sx={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', border: '1px solid rgba(64, 224, 208, 0.2)', color: 'white' }}>
        <Table dir="rtl">
          <TableHead sx={{ bgcolor: 'rgba(0,0,0,0.5)' }}>
            <TableRow>
              <TableCell align="right">
                <TableSortLabel
                  active={sortConfig.key === 'userName'}
                  direction={sortConfig.key === 'userName' ? sortConfig.direction : 'asc'}
                  onClick={() => handleSort('userName')}
                  sx={{ color: '#40e0d0 !important', fontWeight: 'bold', '& .MuiTableSortLabel-icon': { color: '#40e0d0 !important' } }}
                >
                  שם משתמש
                </TableSortLabel>
              </TableCell>

              <TableCell align="right">
                <TableSortLabel
                  active={sortConfig.key === 'quizTitle'}
                  direction={sortConfig.key === 'quizTitle' ? sortConfig.direction : 'asc'}
                  onClick={() => handleSort('quizTitle')}
                  sx={{ color: '#40e0d0 !important', fontWeight: 'bold', '& .MuiTableSortLabel-icon': { color: '#40e0d0 !important' } }}
                >
                  חידון
                </TableSortLabel>
              </TableCell>

              <TableCell align="right">
                <TableSortLabel
                  active={sortConfig.key === 'score'}
                  direction={sortConfig.key === 'score' ? sortConfig.direction : 'asc'}
                  onClick={() => handleSort('score')}
                  sx={{ color: '#40e0d0 !important', fontWeight: 'bold', '& .MuiTableSortLabel-icon': { color: '#40e0d0 !important' } }}
                >
                  ציון
                </TableSortLabel>
              </TableCell>

              <TableCell align="right">
                <TableSortLabel
                  active={sortConfig.key === 'date'}
                  direction={sortConfig.key === 'date' ? sortConfig.direction : 'asc'}
                  onClick={() => handleSort('date')}
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
              <TableRow key={score._id} sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.08)' } }}>
                <TableCell align="right" sx={{ color: 'white' }}>{score.userId?.userName || "משתמש נמחק"}</TableCell>
                <TableCell align="right" sx={{ color: 'white' }}>{score.quizTitle}</TableCell>
                <TableCell align="right" sx={{ color: 'white' }}>
                  {score.totalQuestions ? Math.round((score.score / score.totalQuestions) * 100) : 0}% ({score.score}/{score.totalQuestions})
                </TableCell>
                <TableCell align="right" sx={{ color: 'white' }}>{new Date(score.date).toLocaleDateString('he-IL')}</TableCell>
                
                {/* התיקון כאן: בדיקת מנהל על למראה הכפתור */}
                <TableCell align="center">
                  <Tooltip title={isSuperAdmin ? "מחק ציון" : "פעולה זו מורשית למנהל-על בלבד"}>
                    <span> {/* Span חובה כדי שה-Tooltip יעבוד על כפתור מכובה */}
                      <IconButton 
                        onClick={() => setDeleteDialog({ open: true, scoreId: score._id })} 
                        color="error"
                        disabled={!isSuperAdmin} // מכבה את הכפתור אם לא מנהל על
                        sx={{ opacity: isSuperAdmin ? 1 : 0.4 }} // מדהה את הכפתור
                      >
                        {isSuperAdmin ? <DeleteIcon /> : <LockIcon fontSize="small" />}
                      </IconButton>
                    </span>
                  </Tooltip>
                </TableCell>

              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, scoreId: null })} PaperProps={{ sx: { bgcolor: '#020617', color: 'white', border: '1px solid #f44336' } }} dir="rtl">
        <DialogTitle sx={{ color: '#f44336', fontWeight: 'bold' }}>מחיקת ציון</DialogTitle>
        <DialogContent>
          <Typography>האם אתה בטוח שברצונך למחוק ציון זה מההיסטוריה?</Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDeleteDialog({ open: false, scoreId: null })} sx={{ color: 'white' }}>ביטול</Button>
          <Button onClick={confirmDelete} variant="contained" sx={{ bgcolor: '#f44336', color: 'white', '&:hover': { bgcolor: '#d32f2f' } }}>מחק עכשיו</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={notification.open} autoHideDuration={6000} onClose={() => setNotification({ ...notification, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} sx={{ mb: 10 }}>
        <Alert severity={notification.severity} sx={{ width: '100%', bgcolor: '#020617', color: '#40e0d0', border: `1px solid ${notification.severity === 'error' ? '#f44336' : '#40e0d0'}` }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AllScores;