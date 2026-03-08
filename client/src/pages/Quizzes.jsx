import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { setQuizzes, setLoading, deleteQuizAction } from "../store";
import quizService from "../services/quizService";
import { Container, Grid, Card, CardContent, CardMedia, Typography, Button, Box, CircularProgress, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const Quizzes = ({ searchTerm }) => {
  const { list: quizzes, loading } = useSelector((state) => state.quizzes);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [deleteDialog, setDeleteDialog] = useState({ open: false, quizId: null, quizTitle: "" });
  const [notification, setNotification] = useState({ open: false, message: "" });

  useEffect(() => {
    const fetchQuizzes = async () => {
      dispatch(setLoading(true));
      try {
        const data = await quizService.getAllQuizzes();
        dispatch(setQuizzes(data));
      } catch (err) { console.error(err); }
      finally { dispatch(setLoading(false)); }
    };
    fetchQuizzes();
  }, [dispatch]);

  const confirmDelete = async () => {
    try {
      await quizService.deleteQuiz(deleteDialog.quizId);
      dispatch(deleteQuizAction(deleteDialog.quizId)); 
      setNotification({ open: true, message: "החידון נמחק בהצלחה! 🗑️" });
    } catch (err) { 
      setNotification({ open: true, message: "שגיאה במחיקת החידון" });
    } finally {
      setDeleteDialog({ open: false, quizId: null, quizTitle: "" });
    }
  };

  const filteredQuizzes = quizzes.filter((quiz) =>
    quiz.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress color="inherit" /></Box>;

  return (
    /* התיקון כאן: maxWidth="xl" נותן למסך יותר רוחב כדי לארגן 3 כרטיסיות בשורה בנינוחות */
    <Container sx={{ mt: 5, pb: 5 }} maxWidth="xl">
      <Typography variant="h4" sx={{ mb: 4, textAlign: 'right', fontWeight: 'bold', color: '#40e0d0' }}>החידונים שלנו</Typography>
      
      <Grid container spacing={4} dir="rtl">
        {filteredQuizzes.map((quiz) => (
          /* התיקון כאן: xs=12 (מובייל 1 בשורה), sm=6 (טאבלט 2 בשורה), md=4 (מחשב 3 בשורה) */
          <Grid item key={quiz._id} xs={12} sm={6} md={4}>
            <Card sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column', 
              background: 'rgba(255, 255, 255, 0.05)', 
              color: 'white', 
              border: '1px solid rgba(64, 224, 208, 0.2)',
              borderRadius: 3,
              overflow: 'hidden' 
            }}>
              <CardMedia 
                component="img" 
                height="200"
                sx={{ width: '100%', objectFit: 'cover' }} 
                image={quiz.image || "https://placehold.co/400x200/020617/40e0d0.png?text=QUIZ"} 
                alt={quiz.title}
              />
              <CardContent sx={{ textAlign: 'right', flexGrow: 1, p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                  <Typography variant="h5" sx={{ color: '#40e0d0', fontWeight: 'bold', wordBreak: 'break-word', pr: 1 }}>
                    {quiz.title}
                  </Typography>
                  
                  {user?.role === 'admin' && (
                    <Box sx={{ display: 'flex', gap: 0.5, flexShrink: 0 }}>
                      <IconButton 
                        size="small" 
                        onClick={() => navigate(`/edit-quiz/${quiz._id}`)} 
                        sx={{ color: '#40e0d0', bgcolor: 'rgba(64, 224, 208, 0.1)', '&:hover': { bgcolor: 'rgba(64, 224, 208, 0.2)' } }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        onClick={() => setDeleteDialog({ open: true, quizId: quiz._id, quizTitle: quiz.title })} 
                        sx={{ color: '#f44336', bgcolor: 'rgba(244, 67, 54, 0.1)', '&:hover': { bgcolor: 'rgba(244, 67, 54, 0.2)' } }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  )}
                </Box>
                
                <Typography variant="body2" sx={{ opacity: 0.8, mt: 1 }}>
                  {quiz.description}
                </Typography>
              </CardContent>

              <Box sx={{ p: 2, mt: 'auto' }}>
                <Button 
                  component={Link} 
                  to={`/quiz/${quiz._id}`} 
                  fullWidth 
                  variant="contained" 
                  startIcon={<PlayArrowIcon />} 
                  sx={{ 
                    bgcolor: '#40e0d0', 
                    color: '#020617', 
                    fontWeight: 'bold', 
                    border: '2px solid rgba(255, 255, 255, 0.5)',
                    borderRadius: 2,
                    '&:hover': { 
                      bgcolor: '#33b3a6',
                      borderColor: 'rgba(255, 255, 255, 0.9)'
                    } 
                  }}
                >
                  התחל חידון
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ ...deleteDialog, open: false })} PaperProps={{ sx: { bgcolor: '#020617', color: 'white', border: '1px solid #f44336' } }} dir="rtl">
        <DialogTitle sx={{ color: '#f44336', fontWeight: 'bold' }}>מחיקת חידון</DialogTitle>
        <DialogContent>
          <Typography>האם אתה בטוח שברצונך למחוק את החידון "{deleteDialog.quizTitle}" לצמיתות?</Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDeleteDialog({ ...deleteDialog, open: false })} sx={{ color: 'white' }}>ביטול</Button>
          <Button onClick={confirmDelete} variant="contained" sx={{ bgcolor: '#f44336', color: 'white', '&:hover': { bgcolor: '#d32f2f' } }}>מחק עכשיו</Button>
        </DialogActions>
      </Dialog>

      {/* התיקון כאן: הודעת מחיקה קופצת מלמעלה */}
      <Snackbar 
        open={notification.open} 
        autoHideDuration={3000} 
        onClose={() => setNotification({ open: false, message: "" })} 
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{ mt: 8 }}
      >
        <Alert severity="success" sx={{ width: '100%', bgcolor: '#020617', color: '#40e0d0', border: '1px solid #40e0d0' }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Quizzes;