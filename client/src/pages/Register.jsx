import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login as loginAction } from "../store";
import authService from "../services/authService";
import resultService from "../services/resultService"; // הוספנו ייבוא
import { Container, Paper, Typography, TextField, Button, Box, Alert } from "@mui/material";

const Register = () => {
  const [formData, setFormData] = useState({ userName: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState(""); 
  
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setSuccessMsg("");

    try {
      const data = await authService.register(formData);
      
      // התיקון: אנחנו חייבים לשמור את הטוקן ב-sessionStorage כדי שהבקשה של שמירת הציון תעבוד!
      sessionStorage.setItem("token", data.token);
      sessionStorage.setItem("user", JSON.stringify({ 
        userId: data.userId, 
        userName: data.userName, 
        email: data.email, 
        role: data.role 
      }));

      setLoading(false);

      // --- התיקון: משיכת הציון הממתין של האורח ---
      const pendingResultStr = sessionStorage.getItem('pendingResult');
      
      if (pendingResultStr) {
        try {
          const pendingResult = JSON.parse(pendingResultStr);
          await resultService.saveResult(pendingResult); // שומרים למסד הנתונים
          sessionStorage.removeItem('pendingResult'); // מנקים לאחר ההצלחה
          
          setSuccessMsg("נרשמת בהצלחה! שומר את הציון שלך...");
          
          setTimeout(() => {
            dispatch(loginAction({
              user: { userId: data.userId, userName: data.userName, email: data.email, role: data.role },
              token: data.token
            }));
            navigate("/my-scores"); // מעביר ישירות לציונים
          }, 1500);
          return;
        } catch (err) {
          console.error("Failed to save pending result", err);
        }
      }

      // התנהגות רגילה אם אין ציון
      setSuccessMsg("נרשמת בהצלחה! רק רגע...");

      setTimeout(() => {
        dispatch(loginAction({
          user: { userId: data.userId, userName: data.userName, email: data.email, role: data.role },
          token: data.token
        }));
        navigate("/quizzes");
      }, 1500);

    } catch (err) {
      setError(err.response?.data || "שגיאה ברישום.");
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 10 }}>
      <Paper elevation={10} sx={{ p: 4, borderRadius: 3, background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', color: 'white', border: '1px solid rgba(64, 224, 208, 0.2)' }}>
        <Typography variant="h4" align="center" sx={{ mb: 3, color: '#40e0d0', fontWeight: 'bold' }}>הרשמה</Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        
        <Box component="form" onSubmit={handleSubmit} dir="rtl">
          <TextField fullWidth name="userName" label="שם משתמש" variant="outlined" margin="normal" value={formData.userName} onChange={handleChange} required InputLabelProps={{ style: { color: '#40e0d0' } }} sx={{ input: { color: 'white' } }} />
          <TextField fullWidth name="email" label="אימייל" variant="outlined" margin="normal" value={formData.email} onChange={handleChange} required InputLabelProps={{ style: { color: '#40e0d0' } }} sx={{ input: { color: 'white' } }} />
          <TextField fullWidth name="password" label="סיסמה" type="password" variant="outlined" margin="normal" value={formData.password} onChange={handleChange} required InputLabelProps={{ style: { color: '#40e0d0' } }} sx={{ input: { color: 'white' } }} />
          
          <Button 
            type="submit" 
            fullWidth 
            variant="contained" 
            disabled={loading || !!successMsg} 
            sx={{ 
              mt: 3, 
              mb: 2, 
              bgcolor: successMsg ? '#2cd8bbd6' : '#40e0d0', 
              color: successMsg ? 'white' : '#020617', 
              fontWeight: 'bold', 
              py: 1.5,
              '&:disabled': { bgcolor: successMsg ? '#2cd8bbd6' : 'rgba(64, 224, 208, 0.3)', color: successMsg ? 'white' : '' }
            }}
          >
            {successMsg ? successMsg : (loading ? "מעבד נתונים..." : "הרשמה")}
          </Button>
        </Box>
        <Typography align="center">
          כבר יש לך חשבון? <Link to="/login" style={{ color: '#40e0d0', textDecoration: 'none' }}>התחבר כאן</Link>
        </Typography>
      </Paper>
    </Container>
  );
};

export default Register;