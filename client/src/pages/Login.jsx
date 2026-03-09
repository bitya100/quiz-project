import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login as loginAction } from "../store";
import authService from "../services/authService";
import { Container, Paper, Typography, TextField, Button, Box, Alert, Checkbox, FormControlLabel } from "@mui/material";

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
      // התיקון: שומרים גם את המייל של המשתמש בדפדפן!
      storage.setItem("user", JSON.stringify({ 
        userId: data.userId, 
        userName: data.userName, 
        email: data.email,
        role: data.role 
      }));

      if (rememberMe) {
        localStorage.setItem("rememberedEmail", formData.email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }

      setLoading(false);
      setSuccessMsg("התחברת בהצלחה! רק רגע...");

      setTimeout(() => {
        // וגם ב-Redux
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
    <Container maxWidth="xs" sx={{ mt: 10 }}>
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
  );
};

export default Login;