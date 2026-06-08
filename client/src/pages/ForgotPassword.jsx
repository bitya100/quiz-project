import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
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

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        setLoading(true);

        try {
            const cleanEmail = email.trim().toLowerCase();
            const data = await authService.forgotPassword(cleanEmail);
            
            setMessage(data.message || 'מייל לאיפוס סיסמה נשלח בהצלחה! בדקי את תיבת הדואר שלך.');
            setEmail('');
            setEmailSent(true);
        } catch (err) {
            setError(err.response?.data || 'אירעה שגיאה בשליחת המייל. נסי שנית.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ position: 'relative', overflow: 'hidden', minHeight: 'calc(100vh - 180px)', display: 'flex', alignItems: 'center', py: 5 }}>
          {/* רקע סימני השאלה הזוהר */}
          <QuestionMarkDeco top="15%" left="15%" color="#40e0d0" delay="0" size="2rem" />
          <QuestionMarkDeco top="50%" left="8%" color="#ffffff" delay="2" size="1.5rem" />
          <QuestionMarkDeco top="80%" left="18%" color="#bc13fe" delay="4" size="2.5rem" />
          <QuestionMarkDeco top="20%" right="18%" color="#ffffff" delay="1" size="2.2rem" />
          <QuestionMarkDeco top="60%" right="10%" color="#40e0d0" delay="3" size="1.8rem" />
          <QuestionMarkDeco top="85%" right="15%" color="#bc13fe" delay="5" size="1.5rem" />

          <Container maxWidth="xs" sx={{ position: 'relative', zIndex: 10 }}>
            <Paper elevation={10} sx={{ p: 4, borderRadius: '25px', background: 'rgba(22, 22, 26, 0.85) !important', backdropFilter: 'blur(15px)', color: 'white', border: '1px solid rgba(64, 224, 208, 0.3)', boxShadow: '0 10px 40px rgba(0, 0, 0, 0.6)' }}>
              
              <Typography variant="h4" align="center" sx={{ mb: 2, color: '#40e0d0', fontWeight: '900', textShadow: '0 0 12px rgba(64, 224, 208, 0.4)' }}>
                שכחתי סיסמה
              </Typography>
              
              {!emailSent ? (
                <>
                  <Typography variant="body2" align="center" sx={{ color: 'rgba(255,255,255,0.85)', mb: 3, lineHeight: 1.6 }}>
                    הזיני את כתובת האימייל איתה נרשמת למערכת, ונשלח אלייך קישור מאובטח לאיפוס הסיסמה.
                  </Typography>

                  {error && (
                    <Alert severity="error" sx={{ mb: 2, bgcolor: 'rgba(231, 76, 60, 0.2)', color: '#ff4d4d', border: '1px solid #e74c3c', borderRadius: '10px', '& .MuiAlert-icon': { color: '#ff4d4d' } }}>
                      {error}
                    </Alert>
                  )}
                  
                  <Box component="form" onSubmit={handleSubmit} sx={{ textAlign: 'right' }}>
                    <TextField 
                      fullWidth 
                      name="email" 
                      label="אימייל לשחזור" 
                      variant="outlined" 
                      margin="normal" 
                      type="email"
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      required 
                      autoComplete="email" 
                      sx={{
                        // עיצוב תיבת הקלט הכללית
                        '& .MuiOutlinedInput-root': {
                          color: 'white',
                          backgroundColor: 'rgba(255, 255, 255, 0.04)',
                          borderRadius: '12px',
                          transition: '0.3s all ease',
                          '& fieldset': { borderColor: 'rgba(64, 224, 208, 0.3)' },
                          '&:hover fieldset': { borderColor: '#40e0d0' },
                          '&.Mui-focused fieldset': { 
                            borderColor: '#40e0d0',
                            boxShadow: '0 0 15px rgba(64, 224, 208, 0.3)' 
                          },
                          // השמדת הרקע הלבן המכוער של ה-Autofill בדפדפנים
                          '& input': {
                            textAlign: 'center',
                            '&:-webkit-autofill': {
                              WebkitBoxShadow: '0 0 0 100px #16161a inset !important',
                              WebkitTextFillColor: 'white !important',
                              borderRadius: '11px',
                            }
                          }
                        },
                        // עיצוב לייבל (טקסט עליון) מותאם ל-RTL
                        '& .MuiInputLabel-root': { 
                          color: 'rgba(255, 255, 255, 0.6)',
                          right: 20,
                          left: 'auto',
                          transformOrigin: 'top right',
                          '&.Mui-focused': { color: '#40e0d0' },
                          '&.MuiInputLabel-shrink': { transform: 'translate(10px, -9px) scale(0.75)' }
                        },
                        // תיקון החיתוך של המסגרת עבור הלייבל ב-RTL
                        '& .MuiOutlinedInput-notchedOutline': {
                          textAlign: 'right',
                        }
                      }} 
                    />
                    
                    <Button type="submit" fullWidth variant="contained" disabled={loading} sx={{ mt: 3, mb: 2, bgcolor: 'transparent', color: '#40e0d0', border: '2px solid #40e0d0', borderRadius: '12px', fontWeight: '800', fontSize: '1.1rem', py: 1.5, textTransform: 'none', transition: '0.3s all', boxShadow: '0 0 10px rgba(64, 224, 208, 0.1)', '&:hover': { bgcolor: '#40e0d0', color: '#0a0a0c', boxShadow: '0 0 25px #40e0d0', transform: 'translateY(-2px)' }, '&:disabled': { border: '2px solid rgba(64, 224, 208, 0.3)', color: 'rgba(64, 224, 208, 0.4)', cursor: 'not-allowed' } }}>
                      {loading ? "שולח מייל..." : "שלח לי קישור לאיפוס"}
                    </Button>
                  </Box>
                </>
              ) : (
                <Box sx={{ textAlign: 'center', py: 2 }}>
                  <Typography variant="h1" sx={{ fontSize: '4rem', mb: 2 }}>📬</Typography>
                  
                  {message && (
                    <Alert severity="success" sx={{ mb: 3, bgcolor: 'rgba(39, 174, 96, 0.2)', color: '#2ecc71', border: '1px solid #2ecc71', borderRadius: '10px', textAlign: 'right', '& .MuiAlert-icon': { color: '#2ecc71' } }}>
                      {message}
                    </Alert>
                  )}
                  
                  <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)', mb: 2, fontWeight: '500' }}>
                    הקישור נשלח בהצלחה לתיבת המייל שלך!
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', mb: 3, lineHeight: 1.5 }}>
                    אם אינך מוצאת את המייל, בדקי גם בתיקיית ה"ספאם" או ה"קידומי מכירות". הקישור יהיה בתוקף לשעה הקרובה.
                  </Typography>
                </Box>
              )}
              
              <Typography align="center" sx={{ mt: 2, fontSize: '0.95rem' }}>
                <Link to="/login" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontWeight: '600', transition: '0.2s' }} onMouseEnter={(e) => { e.target.style.color = '#40e0d0'; e.target.style.textShadow = '0 0 8px #40e0d0'; }} onMouseLeave={(e) => { e.target.style.color = 'rgba(255,255,255,0.7)'; e.target.style.textShadow = 'none'; }}>
                  חזרה להתחברות
                </Link>
              </Typography>

            </Paper>
          </Container>
        </Box>
    );
};

export default ForgotPassword;