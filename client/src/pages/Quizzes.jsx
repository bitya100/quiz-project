import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { setQuizzes, setLoading, deleteQuizAction } from "../store";
import quizService from "../services/quizService";
import { Container, Card, CardContent, CardMedia, Typography, Button, Box, CircularProgress, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchOffIcon from "@mui/icons-material/SearchOff"; 
import axios from "axios";

const Quizzes = ({ searchTerm = "" }) => {
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
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      // הכתובת החדשה למחיקה!
      await axios.delete(`https://quiz-project-t7g7.onrender.com/api/quizzes/${deleteDialog.quizId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      dispatch(deleteQuizAction(deleteDialog.quizId)); 
      setNotification({ open: true, message: "החידון נמחק בהצלחה! 🗑️" });
    } catch (err) { 
      setNotification({ open: true, message: "שגיאה במחיקת החידון" });
    } finally {
      setDeleteDialog({ open: false, quizId: null, quizTitle: "" });
    }
  };

  const filteredQuizzes = quizzes.filter((quiz) =>
    quiz.title.toLowerCase().includes(searchTerm.toLowerCase().trim())
  );

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress color="inherit" /></Box>;

  return (
    <Container sx={{ mt: 5, pb: 5 }} maxWidth="lg">
      <Typography variant="h4" sx={{ mb: 4, textAlign: 'right', fontWeight: 'bold', color: '#40e0d0' }}>החידונים שלנו</Typography>
      
      {filteredQuizzes.length === 0 ? (
        <Box sx={{ textAlign: 'center', mt: 10, mb: 10 }}>
          <SearchOffIcon sx={{ fontSize: 80, color: 'rgba(255,255,255,0.3)', mb: 2 }} />
          <Typography variant="h5" sx={{ color: 'rgba(255,255,255,0.7)' }}>
            מצטערים, לא נמצא הערך המבוקש.
          </Typography>
        </Box>
      ) : (
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, 
          gap: 4,
          dir: 'rtl'
        }}>
          {filteredQuizzes.map((quiz) => (
            <Card key={quiz._id} sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column', 
              background: 'rgba(255, 255, 255, 0.05)', 
              color: 'white', 
              border: '1px solid rgba(64, 224, 208, 0.2)',
              borderRadius: 3,
              overflow: 'hidden',
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 8px 25px rgba(64, 224, 208, 0.3)',
                  borderColor: '#40e0d0'
              }
            }}>
              
              <Box sx={{ 
                width: '100%', 
                height: 200, 
                bgcolor: 'rgba(0, 0, 0, 0.3)', 
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderBottom: '1px solid rgba(64, 224, 208, 0.2)'
              }}>
                <CardMedia 
                component="img" 
                image={
                  quiz.image 
                    ? quiz.image.startsWith('/uploads') 
                      ? `https://quiz-project-t7g7.onrender.com${quiz.image}` // <-- התיקון כאן!
                      : quiz.image
                    : "https://placehold.co/400x200/020617/40e0d0.png?text=QUIZ"
                }
                  alt={quiz.title}
                  sx={{ 
                    maxHeight: '100%', 
                    maxWidth: '100%',
                    objectFit: 'contain' 
                  }} 
                />
              </Box>

              <CardContent sx={{ textAlign: 'right', flexGrow: 1, p: 3, display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
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
                
                <Typography variant="body2" sx={{ 
                  opacity: 0.8, 
                  mb: 2,
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {quiz.description}
                </Typography>
                
                <Box sx={{ flexGrow: 1 }} />
              </CardContent>

              <Box sx={{ p: 3, pt: 0 }}>
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
                    py: 1,
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
          ))}
        </Box>
      )}

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