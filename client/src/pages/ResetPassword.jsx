import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import authService from "../services/authService";
import { Container, Paper, Typography, TextField, Button, Box, Alert, keyframes } from "@mui/material";

// --- אנימציות סימני השאלה הצפים ---
const float1 = keyframes`
  0%, 100% { transform: translate3d(0px, 0px, 0) rotate(0deg); }
  25% { transform: translate3d(10px, -20px, 0) rotate(5deg); }
  50% { transform: translate3d(-10px, -10px, 0) rotate(-5deg); }
  75% { transform: translate3d(15px, 10px, 0) rotate(5deg); }
`;
const float2 = keyframes`
  0%, 100% { transform: translate3d(0px, 0px, 0) rotate(0deg); }
  25% { transform: translate3d(-10px, 20px, 0) rotate(-5deg); }
  50% { transform: translate3d(10px, 10px, 0) rotate(5deg); }
  75% { transform: translate3d(-15px, -10px, 0) rotate(-5deg); }
`;

const QuestionMarkDeco = ({ top, left, right, bottom, color, delay, size = '1.5rem' }) => {
  const [isVisible, setIsVisible] = useState(true);
  const markRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), { threshold: 0 });
    if (markRef.current) observer.observe(markRef.current);
    return () => { if (markRef.current) observer.unobserve(markRef.current); };
  }, []);

  const currentAnimation = Number(delay) % 2 === 0 ? float1 : float2;

  return (
    <Box ref={markRef} sx={{ position: 'absolute', top, left, right, bottom, color, fontSize: size, fontWeight: 'bold', zIndex: 0, pointerEvents: 'none', display: { xs: 'none', sm: 'flex' }, justifyContent: 'center', alignItems: 'center', animation: `${currentAnimation} ${12 + Number(delay)}s ease-in-out infinite`, animationPlayState: isVisible ? 'running' : 'paused', willChange: 'transform', backfaceVisibility: 'hidden', opacity: 0.6 }}>
      <span style={{ textShadow: `0 0 10px ${color}` }}>?</span>
    </Box>
  );
};

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (password !== confirmPassword) {
            setError('הסיסמאות שנקלדו אינן תואמות');
            return;
        }

        if (password.length < 6) {
            setError('הסיסמה חייבת להכיל לפחות 6 תווים');
            return;
        }

        try {
            setLoading(true);
            
            // שליחה לשרת
            const data = await authService.resetPassword(token, password);
            
            setMessage(data.message || 'הסיסמה עודכנה בהצלחה! מייד תועברי לדף הבית...');

            if (data.token) {
                // קבוצת מפתחות 1: משתנים בודדים שטוחים
                localStorage.setItem('token', data.token);
                localStorage.setItem('role', data.role || 'user');
                localStorage.setItem('userName', data.userName || 'משתמשת');
                localStorage.setItem('userId', data.userId || '');
                localStorage.setItem('email', data.email || '');

                // קבוצת מפתחות 2: אובייקט משתמש שלם כרוזת JSON (נפוץ מאוד ב-React Context וב-Redux)
                const userObject = {
                    token: data.token,
                    role: data.role || 'user',
                    userName: data.userName || 'משתמשת',
                    userId: data.userId || '',
                    email: data.email || ''
                };
                localStorage.setItem('user', JSON.stringify(userObject));
                localStorage.setItem('userInfo', JSON.stringify(userObject));
                localStorage.setItem('isLoggedIn', 'true');

                // השהייה קלה לצורך הצגת הודעת ההצלחה, ואז ביצוע ריענון קשיח לעמוד הבית
                setTimeout(() => {
                    window.location.href = '/'; 
                }, 2000);
            } else {
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            }

        } catch (err) {
            setError(err.response?.data || 'הקישור פג תוקף, שגוי או שכבר נעשה בו שימוש.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ position: 'relative', overflow: 'hidden', minHeight: 'calc(100vh - 180px)', display: 'flex', alignItems: 'center', py: 5 }}>
          <QuestionMarkDeco top="10%" left="12%" color="#bc13fe" delay="1" size="2.5rem" />
          <QuestionMarkDeco top="45%" left="15%" color="#ffffff" delay="3" size="1.8rem" />
          <QuestionMarkDeco top="75%" left="8%" color="#40e0d0" delay="0" size="2rem" />
          <QuestionMarkDeco top="25%" right="15%" color="#40e0d0" delay="2" size="1.5rem" />
          <QuestionMarkDeco top="55%" right="8%" color="#bc13fe" delay="5" size="2.2rem" />
          <QuestionMarkDeco top="80%" right="18%" color="#ffffff" delay="4" size="1.7rem" />

          <Container maxWidth="xs" sx={{ position: 'relative', zIndex: 10 }}>
            <Paper elevation={10} sx={{ p: 4, borderRadius: '25px', background: 'rgba(22, 22, 26, 0.85) !important', backdropFilter: 'blur(15px)', color: 'white', border: '1px solid rgba(188, 19, 254, 0.3)', boxShadow: '0 10px 40px rgba(0, 0, 0, 0.6)' }}>
              
              <Typography variant="h4" align="center" sx={{ mb: 2, color: '#bc13fe', fontWeight: '900', textShadow: '0 0 12px rgba(188, 19, 254, 0.4)' }}>
                איפוס סיסמה
              </Typography>
              
              <Typography variant="body2" align="center" sx={{ color: 'rgba(255,255,255,0.85)', mb: 3, lineHeight: 1.6 }}>
                הזיני את הסיסמה החדשה שלך בשני השדות כדי לעדכן אותה ולהיכנס ישירות למערכת.
              </Typography>

              {error && (
                <Alert severity="error" sx={{ mb: 2, bgcolor: 'rgba(231, 76, 60, 0.2)', color: '#ff4d4d', border: '1px solid #e74c3c', borderRadius: '10px', '& .MuiAlert-icon': { color: '#ff4d4d' } }}>
                  {error}
                </Alert>
              )}

              {message && (
                <Alert severity="success" sx={{ mb: 2, bgcolor: 'rgba(39, 174, 96, 0.2)', color: '#2ecc71', border: '1px solid #2ecc71', borderRadius: '10px', '& .MuiAlert-icon': { color: '#2ecc71' } }}>
                  {message}
                </Alert>
              )}
              
              <Box component="form" onSubmit={handleSubmit} sx={{ textAlign: 'right' }}>
                <TextField 
                  fullWidth 
                  label="סיסמה חדשה" 
                  variant="outlined" 
                  margin="normal" 
                  type="password"
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                  disabled={loading || !!message}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      backgroundColor: 'rgba(255, 255, 255, 0.04)',
                      borderRadius: '12px',
                      transition: '0.3s all ease',
                      '& fieldset': { borderColor: 'rgba(188, 19, 254, 0.3)' },
                      '&:hover fieldset': { borderColor: '#bc13fe' },
                      '&.Mui-focused fieldset': { borderColor: '#bc13fe', boxShadow: '0 0 15px rgba(188, 19, 254, 0.3)' },
                      '& input': {
                        textAlign: 'center',
                        '&:-webkit-autofill': {
                          WebkitBoxShadow: '0 0 0 100px #16161a inset !important',
                          WebkitTextFillColor: 'white !important',
                          borderRadius: '11px',
                        }
                      }
                    },
                    '& .MuiInputLabel-root': { 
                      color: 'rgba(255, 255, 255, 0.6)',
                      right: 20, left: 'auto', transformOrigin: 'top right',
                      '&.Mui-focused': { color: '#bc13fe' },
                      '&.MuiInputLabel-shrink': { transform: 'translate(10px, -9px) scale(0.75)' }
                    },
                    '& .MuiOutlinedInput-notchedOutline': { textAlign: 'right' }
                  }} 
                />

                <TextField 
                  fullWidth 
                  label="אימות סיסמה חדשה" 
                  variant="outlined" 
                  margin="normal" 
                  type="password"
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)} 
                  required 
                  disabled={loading || !!message}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      backgroundColor: 'rgba(255, 255, 255, 0.04)',
                      borderRadius: '12px',
                      transition: '0.3s all ease',
                      '& fieldset': { borderColor: 'rgba(188, 19, 254, 0.3)' },
                      '&:hover fieldset': { borderColor: '#bc13fe' },
                      '&.Mui-focused fieldset': { borderColor: '#bc13fe', boxShadow: '0 0 15px rgba(188, 19, 254, 0.3)' },
                      '& input': {
                        textAlign: 'center',
                        '&:-webkit-autofill': {
                          WebkitBoxShadow: '0 0 0 100px #16161a inset !important',
                          WebkitTextFillColor: 'white !important',
                          borderRadius: '11px',
                        }
                      }
                    },
                    '& .MuiInputLabel-root': { 
                      color: 'rgba(255, 255, 255, 0.6)',
                      right: 20, left: 'auto', transformOrigin: 'top right',
                      '&.Mui-focused': { color: '#bc13fe' },
                      '&.MuiInputLabel-shrink': { transform: 'translate(10px, -9px) scale(0.75)' }
                    },
                    '& .MuiOutlinedInput-notchedOutline': { textAlign: 'right' }
                  }} 
                />
                
                <Button type="submit" fullWidth variant="contained" disabled={loading || !!message} sx={{ mt: 3, mb: 2, bgcolor: 'transparent', color: 'white', border: '2px solid #bc13fe', borderRadius: '12px', fontWeight: '800', fontSize: '1.1rem', py: 1.5, textTransform: 'none', transition: '0.3s all', boxShadow: '0 0 10px rgba(188, 19, 254, 0.1)', '&:hover': { bgcolor: '#bc13fe', color: '#0a0a0c', boxShadow: '0 0 25px #bc13fe', transform: 'translateY(-2px)' }, '&:disabled': { border: '2px solid rgba(188, 19, 254, 0.3)', color: 'rgba(255,255,255,0.3)', cursor: 'not-allowed' } }}>
                  {loading ? "מעדכן סיסמה..." : "עדכן סיסמה והתחבר"}
                </Button>
              </Box>

              <Typography align="center" sx={{ mt: 2, fontSize: '0.95rem' }}>
                <Link to="/login" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontWeight: '600', transition: '0.2s' }} onMouseEnter={(e) => { e.target.style.color = '#bc13fe'; e.target.style.textShadow = '0 0 8px #bc13fe'; }} onMouseLeave={(e) => { e.target.style.color = 'rgba(255,255,255,0.7)'; e.target.style.textShadow = 'none'; }}>
                  חזרה להתחברות
                </Link>
              </Typography>

            </Paper>
          </Container>
        </Box>
    );
};

export default ResetPassword;

