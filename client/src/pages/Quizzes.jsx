import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { setQuizzes, setLoading, deleteQuizAction } from "../store";
import quizService from "../services/quizService";
import api from "../services/api"; 
import { 
  Container, Card, CardContent, CardMedia, Typography, Button, 
  Box, CircularProgress, IconButton, Dialog, DialogTitle, 
  DialogContent, DialogActions, Snackbar, Alert 
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchOffIcon from "@mui/icons-material/SearchOff"; 
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

// הגדרת מנהל העל לפי אימייל מדויק (כמו בשרת)
const SUPER_ADMIN_EMAIL = "admin10@gmail.com";

const Quizzes = ({ searchTerm = "" }) => {
  const { list: quizzes, loading } = useSelector((state) => state.quizzes);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [deleteDialog, setDeleteDialog] = useState({ open: false, quizId: null, quizTitle: "" });
  const [creatorDialog, setCreatorDialog] = useState(false); 
  const [notification, setNotification] = useState({ open: false, message: "" });

  const serverUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:3001';

  // זיהוי קפדני של מנהל העל
  const isSuperAdmin = user?.email?.toLowerCase() === SUPER_ADMIN_EMAIL;

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
      await api.delete(`/quizzes/${deleteDialog.quizId}`);
      dispatch(deleteQuizAction(deleteDialog.quizId)); 
      setNotification({ open: true, message: "החידון נמחק בהצלחה! 🗑️" });
    } catch (err) { 
      setNotification({ open: true, message: err.response?.data?.message || "שגיאה במחיקת החידון" });
    } finally {
      setDeleteDialog({ open: false, quizId: null, quizTitle: "" });
    }
  };

  const handleApplyCreator = async () => {
    try {
      await api.post('/users/request-creator');
      setCreatorDialog(false);
      setNotification({ open: true, message: "הבקשה נשמרה במסד הנתונים והועברה למנהל המערכת! 🚀" });
    } catch (error) {
      console.error(error);
      setNotification({ open: true, message: "שגיאה בשליחת הבקשה." });
    }
  };

  const filteredQuizzes = quizzes.filter((quiz) =>
    quiz.title.toLowerCase().includes(searchTerm.toLowerCase().trim())
  );

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress color="inherit" /></Box>;

  return (
    <Container sx={{ mt: 5, pb: 10 }} maxWidth="lg">
      <Typography variant="h4" sx={{ mb: 4, textAlign: 'right', fontWeight: '900', color: '#40e0d0' }}>החידונים שלנו</Typography>
      
      {filteredQuizzes.length === 0 ? (
        <Box sx={{ textAlign: 'center', mt: 10, mb: 10 }}>
          <SearchOffIcon sx={{ fontSize: 80, color: 'rgba(255,255,255,0.3)', mb: 2 }} />
          <Typography variant="h5" sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: '500' }}>
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
          {filteredQuizzes.map((quiz) => {
            
            // בדיקת הרשאות פנימית לכל חידון
            const creatorId = typeof quiz.creator === 'object' ? quiz.creator?._id : quiz.creator;
            const isCreator = user && (creatorId === user._id || creatorId === user.userId);
            
            // האם יש לו סמכות לבצע פעולות על החידון הספציפי הזה?
            const isAuthorized = isSuperAdmin || isCreator;

            // האם להציג את הכפתורים בכלל? (כן, לכל המנהלים)
            const showButtons = user?.role === 'admin';

            return (
            <Card key={quiz._id} sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column', 
              background: 'rgba(255, 255, 255, 0.03)', 
              color: 'white', 
              border: '1px solid rgba(64, 224, 208, 0.1)',
              borderRadius: 4,
              overflow: 'hidden',
              transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)', 
              '&:hover': {
                  transform: 'translateY(-10px)',
                  boxShadow: '0 15px 30px rgba(64, 224, 208, 0.2)',
                  borderColor: 'rgba(64, 224, 208, 0.5)',
                  background: 'rgba(255, 255, 255, 0.05)'
              }
            }}>
              
              <Box sx={{ 
                width: '100%', 
                height: 200, 
                bgcolor: 'rgba(0, 0, 0, 0.4)', 
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
              }}>
                <CardMedia 
                component="img" 
                image={
                  quiz.image 
                    ? quiz.image.startsWith('/uploads') 
                      ? `${serverUrl}${quiz.image}` 
                      : quiz.image
                    : "https://placehold.co/400x200/020617/40e0d0.png?text=QUIZ"
                }
                  alt={quiz.title}
                  sx={{ 
                    maxHeight: '100%', 
                    maxWidth: '100%',
                    objectFit: 'contain',
                    p: 1
                  }} 
                />
              </Box>

              <CardContent sx={{ textAlign: 'right', flexGrow: 1, p: 3, display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography variant="h5" sx={{ color: '#40e0d0', fontWeight: '800', wordBreak: 'break-word', pr: 1, letterSpacing: '0.5px' }}>
                    {quiz.title}
                  </Typography>
                  
                  {/* מציג את הכפתורים לכל אדמין, אבל מטפל בלחיצה בצורה חכמה */}
                  {showButtons && (
                    <Box sx={{ display: 'flex', gap: 0.5, flexShrink: 0 }}>
                      <IconButton 
                        size="small" 
                        onClick={() => {
                          if (isAuthorized) {
                            navigate(`/edit-quiz/${quiz._id}`);
                          } else {
                            setNotification({ open: true, message: "פעולה נדחתה: אתה מורשה לערוך רק חידונים שאתה יצרת." });
                          }
                        }} 
                        sx={{ color: '#40e0d0', bgcolor: 'rgba(64, 224, 208, 0.1)', '&:hover': { bgcolor: 'rgba(64, 224, 208, 0.3)' } }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        onClick={() => {
                          if (isAuthorized) {
                            setDeleteDialog({ open: true, quizId: quiz._id, quizTitle: quiz.title });
                          } else {
                            setNotification({ open: true, message: "פעולה נדחתה: אתה מורשה למחוק רק חידונים שאתה יצרת." });
                          }
                        }} 
                        sx={{ color: '#f44336', bgcolor: 'rgba(244, 67, 54, 0.1)', '&:hover': { bgcolor: 'rgba(244, 67, 54, 0.3)' } }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  )}
                </Box>
                
                <Typography variant="body2" sx={{ 
                  opacity: 0.7, 
                  mb: 2,
                  fontSize: '0.95rem',
                  lineHeight: 1.6,
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
                  startIcon={<PlayArrowIcon sx={{ fontSize: '28px !important' }} />} 
                  sx={{ 
                    background: 'linear-gradient(45deg, #40e0d0 30%, #2bd2c2 90%)',
                    color: '#020617', 
                    fontWeight: '900', 
                    fontSize: '1.1rem',
                    borderRadius: '50px',
                    py: 1.2,
                    boxShadow: '0 4px 15px rgba(64, 224, 208, 0.4)',
                    transition: 'all 0.3s ease',
                    animation: 'pulse 2s infinite',
                    '@keyframes pulse': {
                      '0%': { transform: 'scale(1)', boxShadow: '0 4px 10px rgba(64, 224, 208, 0.4)' },
                      '50%': { transform: 'scale(1.03)', boxShadow: '0 0 15px rgba(73, 240, 252, 0.93)' },
                      '100%': { transform: 'scale(1)', boxShadow: '0 4px 10px rgba(64, 224, 208, 0.4)' }
                    },
                    '&:hover': { 
                      background: 'linear-gradient(45deg, #2bd2c2 30%, #40e0d0 90%)',
                      transform: 'translateY(-3px) scale(1.05)',
                      boxShadow: '0 8px 25px rgba(64, 224, 208, 0.9)'
                    } 
                  }}
                >
                  התחל חידון
                </Button>
              </Box>
            </Card>
          )})}
        </Box>
      )}

      {user && user.role !== 'admin' && (
        <Box sx={{ 
          mt: 10, 
          p: 4, 
          borderRadius: 4, 
          background: 'linear-gradient(135deg, rgba(188, 19, 254, 0.1) 0%, rgba(64, 224, 208, 0.1) 100%)',
          border: '1px solid rgba(188, 19, 254, 0.3)',
          textAlign: 'center',
          boxShadow: '0 0 30px rgba(0,0,0,0.3)'
        }}>
          <AutoAwesomeIcon sx={{ fontSize: 50, color: '#bc13fe', mb: 2 }} />
          <Typography variant="h4" sx={{ color: 'white', fontWeight: '900', mb: 2 }}>
            יש לך רעיון לחידון מנצח?
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', mb: 4, maxWidth: '600px', mx: 'auto', fontSize: '1.1rem' }}>
            צוות Quiz Master מחפש יוצרי תוכן מוכשרים! אם יש לך ידע נרחב ורעיונות לשאלות מאתגרות, אולי מקומך איתנו.
          </Typography>
          <Button 
            variant="contained" 
            size="large"
            onClick={() => setCreatorDialog(true)}
            sx={{ 
              bgcolor: '#bc13fe', 
              color: 'white', 
              fontWeight: '800', 
              fontSize: '1.1rem',
              px: 5, py: 1.5, borderRadius: '50px',
              transition: 'all 0.3s ease',
              '&:hover': { bgcolor: '#a00bd9', transform: 'translateY(-2px)', boxShadow: '0 8px 25px rgba(188, 19, 254, 0.6)' } 
            }}
          >
            הגש בקשה להיות יוצר
          </Button>
        </Box>
      )}

      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ ...deleteDialog, open: false })} PaperProps={{ sx: { bgcolor: '#020617', color: 'white', border: '1px solid #f44336', borderRadius: 3 } }} dir="rtl">
        <DialogTitle sx={{ color: '#f44336', fontWeight: '900' }}>מחיקת חידון</DialogTitle>
        <DialogContent>
          <Typography sx={{ fontSize: '1.1rem' }}>האם אתה בטוח שברצונך למחוק את החידון "{deleteDialog.quizTitle}" לצמיתות?</Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, pb: 3, px: 3 }}>
          <Button onClick={() => setDeleteDialog({ ...deleteDialog, open: false })} sx={{ color: 'white', fontWeight: 'bold' }}>ביטול</Button>
          <Button onClick={confirmDelete} variant="contained" sx={{ bgcolor: '#f44336', color: 'white', fontWeight: 'bold', borderRadius: '30px', px: 3, '&:hover': { bgcolor: '#d32f2f' } }}>מחק עכשיו</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={creatorDialog} onClose={() => setCreatorDialog(false)} PaperProps={{ sx: { bgcolor: '#020617', color: 'white', border: '1px solid #bc13fe', borderRadius: 4, maxWidth: '500px' } }} dir="rtl">
        <DialogTitle sx={{ color: '#bc13fe', fontWeight: '900', textAlign: 'center', fontSize: '1.8rem', pt: 4 }}>
          הצטרף ליוצרי התוכן שלנו 👑
        </DialogTitle>
        <DialogContent sx={{ textAlign: 'center', pb: 4 }}>
          <Typography sx={{ mb: 3, color: 'rgba(255,255,255,0.9)', fontSize: '1.1rem', fontWeight: '500' }}>
            יוצרי התוכן של Quiz Master מקבלים גישה בלעדית ללוח בקרה מתקדם המאפשר:
          </Typography>
          <Box sx={{ textAlign: 'right', bgcolor: 'rgba(255,255,255,0.05)', p: 3, borderRadius: 3, mb: 3 }}>
            <Typography sx={{ mb: 1.5, fontWeight: '500' }}>✨ יצירת חידונים חדשים</Typography>
            <Typography sx={{ mb: 1.5, fontWeight: '500' }}>📊 צפייה בסטטיסטיקות מתקדמות</Typography>
            <Typography sx={{ fontWeight: '500' }}>🏆 ניהול ואתגר של הקהילה</Typography>
          </Box>
          <Typography variant="body2" sx={{ color: '#40e0d0', fontWeight: 'bold' }}>
            הבקשה שלך תישלח ישירות למנהל המערכת הראשי לבחינה.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, justifyContent: 'center', gap: 2, pb: 4 }}>
          <Button onClick={() => setCreatorDialog(false)} variant="outlined" sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)', borderRadius: '30px', px: 4, fontWeight: 'bold' }}>ביטול</Button>
          <Button onClick={handleApplyCreator} variant="contained" sx={{ bgcolor: '#bc13fe', color: 'white', borderRadius: '30px', px: 5, fontWeight: 'bold', fontSize: '1.1rem', '&:hover': { bgcolor: '#a00bd9', transform: 'scale(1.05)' }, transition: 'all 0.2s' }}>שלח בקשה</Button>
        </DialogActions>
      </Dialog>

      <Snackbar 
        open={notification.open} 
        autoHideDuration={4000} 
        onClose={() => setNotification({ open: false, message: "" })} 
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        sx={{ mb: 8 }}
      >
        <Alert severity={notification.message.includes("שגיאה") || notification.message.includes("נדחתה") ? "error" : "success"} sx={{ width: '100%', bgcolor: '#020617', color: '#40e0d0', border: '1px solid #40e0d0', fontSize: '1.1rem', fontWeight: 'bold', borderRadius: 3 }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Quizzes;