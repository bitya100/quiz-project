import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login as loginAction } from "../store";
import authService from "../services/authService";
import resultService from "../services/resultService";
import { Container, Paper, Typography, TextField, Button, Box, Alert, Checkbox, FormControlLabel, keyframes } from "@mui/material";

// --- אנימציות סימני השאלה (מותאם לביצועים) ---
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
    <Box
      ref={markRef}
      sx={{
        position: 'absolute', top, left, right, bottom, color, fontSize: size, fontWeight: 'bold', zIndex: 0,
        pointerEvents: 'none', display: { xs: 'none', sm: 'flex' }, justifyContent: 'center', alignItems: 'center',
        animation: `${currentAnimation} ${12 + Number(delay)}s ease-in-out infinite`,
        animationPlayState: isVisible ? 'running' : 'paused',
        willChange: 'transform', backfaceVisibility: 'hidden', opacity: 0.6
      }}
    >
      <span style={{ textShadow: `0 0 10px ${color}` }}>?</span>
    </Box>
  );
};
// --- סוף אנימציות ---

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState(""); 
  const [rememberMe, setRememberMe] = useState(false);
  
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setFormData((prev) => ({ ...prev, email: savedEmail }));
      setRememberMe(true);
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setSuccessMsg("");

    try {
      const data = await authService.login(formData);
      
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem("token", data.token);
      storage.setItem("user", JSON.stringify({ 
        userId: data.userId, userName: data.userName, email: data.email, role: data.role 
      }));

      if (rememberMe) {
        localStorage.setItem("rememberedEmail", formData.email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }

      setLoading(false);

      const pendingResultStr = sessionStorage.getItem('pendingResult');
      
      if (pendingResultStr) {
        try {
          const pendingResult = JSON.parse(pendingResultStr);
          await resultService.saveResult(pendingResult);
          sessionStorage.removeItem('pendingResult');
          
          setSuccessMsg("התחברת בהצלחה! שומר את הציון שלך...");
          
          setTimeout(() => {
            dispatch(loginAction({
              user: { userId: data.userId, userName: data.userName, email: data.email, role: data.role },
              token: data.token
            }));
            navigate("/my-scores");
          }, 1500);
          return;
        } catch (err) {
          console.error("Failed to save pending result", err);
        }
      }

      setSuccessMsg("התחברת בהצלחה! רק רגע...");

      setTimeout(() => {
        dispatch(loginAction({
          user: { userId: data.userId, userName: data.userName, email: data.email, role: data.role },
          token: data.token
        }));
        navigate("/quizzes");
      }, 1500);

    } catch (err) {
      setError(err.response?.data || "שגיאה בהתחברות. בדקו את המייל והסיסמה.");
      setLoading(false);
    }
  };

  return (
    <Box sx={{ position: 'relative', overflow: 'hidden', minHeight: '85vh', display: 'flex', alignItems: 'center', py: 5 }}>
      {/* רקע סימני שאלה */}
      <QuestionMarkDeco top="15%" left="15%" color="#40e0d0" delay="0" size="2rem" />
      <QuestionMarkDeco top="50%" left="8%" color="#ffffff" delay="2" size="1.5rem" />
      <QuestionMarkDeco top="80%" left="18%" color="#bc13fe" delay="4" size="2.5rem" />
      <QuestionMarkDeco top="20%" right="18%" color="#ffffff" delay="1" size="2.2rem" />
      <QuestionMarkDeco top="60%" right="10%" color="#40e0d0" delay="3" size="1.8rem" />
      <QuestionMarkDeco top="85%" right="15%" color="#bc13fe" delay="5" size="1.5rem" />

      <Container maxWidth="xs" sx={{ position: 'relative', zIndex: 10 }}>
        <Paper elevation={10} sx={{ p: 4, borderRadius: 3, background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', color: 'white', border: '1px solid rgba(64, 224, 208, 0.2)' }}>
          <Typography variant="h4" align="center" sx={{ mb: 3, color: '#40e0d0', fontWeight: 'bold' }}>
            התחברות
          </Typography>
          
          {error && <Alert severity="error" sx={{ mb: 2, bgcolor: 'rgba(211, 47, 47, 0.2)', color: '#ff8a80' }}>{error}</Alert>}
          
          <Box component="form" onSubmit={handleSubmit} sx={{ textAlign: 'right' }}>
            <TextField fullWidth name="email" label="אימייל" variant="outlined" margin="normal" value={formData.email} onChange={handleChange} required InputLabelProps={{ style: { color: '#40e0d0' } }} sx={{ input: { color: 'white' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' }, '&:hover fieldset': { borderColor: '#40e0d0' } } }} />
            <TextField fullWidth name="password" label="סיסמה" type="password" variant="outlined" margin="normal" value={formData.password} onChange={handleChange} required InputLabelProps={{ style: { color: '#40e0d0' } }} sx={{ input: { color: 'white' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' }, '&:hover fieldset': { borderColor: '#40e0d0' } } }} />
            
            <FormControlLabel
              control={<Checkbox checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} sx={{ color: '#40e0d0', '&.Mui-checked': { color: '#40e0d0' } }} />}
              label="זכור אותי במכשיר זה"
              sx={{ color: 'white', mt: 1, mb: 1 }}
            />

            <Button
              type="submit" 
              fullWidth 
              variant="contained" 
              disabled={loading || !!successMsg}
              sx={{ 
                mt: 2, mb: 2, 
                bgcolor: successMsg ? '#2cd8bbd6' : '#40e0d0', 
                color: successMsg ? 'white' : '#020617', 
                fontWeight: 'bold', py: 1.5, 
                '&:hover': { bgcolor: successMsg ? '#2cd8bbd6' : '#00c1ab' },
                '&:disabled': { bgcolor: successMsg ? '#2cd8bbd6' : 'rgba(64, 224, 208, 0.3)', color: successMsg ? 'white' : '' }
              }}
            >
              {successMsg ? successMsg : (loading ? "בודק נתונים..." : "כניסה")}
            </Button>
          </Box>
          <Typography align="center" sx={{ opacity: 0.8 }}>
            אין לך חשבון? <Link to="/register" style={{ color: '#40e0d0', textDecoration: 'none', fontWeight: 'bold' }}>הירשם כאן</Link>
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;