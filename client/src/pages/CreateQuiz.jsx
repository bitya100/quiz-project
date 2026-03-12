import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import { 
  Container, Typography, TextField, Button, Box, Paper, 
  IconButton, Grid, Card, MenuItem, Divider, CircularProgress, Snackbar, Alert 
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import SaveIcon from "@mui/icons-material/Save";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import api from "../services/api"; // שימוש ב-API החכם שלך במקום ב-axios נקי

const CreateQuiz = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false); 
  const [notification, setNotification] = useState({ open: false, message: "", severity: "success" });
  const isEditMode = !!id;

  const { register, control, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      title: "",
      description: "",
      image: "",
      questions: [{ questionText: "", options: ["", "", "", ""], correctAnswer: 0, image: "" }]
    }
  });

  const { fields, append, remove } = useFieldArray({ control, name: "questions" });

  useEffect(() => {
    if (isEditMode) {
      const fetchQuiz = async () => {
        try {
          const res = await api.get(`/quizzes/${id}`);
          reset(res.data);
        } catch (err) {
          setNotification({ open: true, message: "שגיאה בטעינת החידון", severity: "error" });
        }
      };
      fetchQuiz();
    }
  }, [id, isEditMode, reset]);

  const handleMainImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      // ה-api מצרף את כתובת השרת והטוקן באופן אוטומטי
      const res = await api.post(`/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setValue('image', res.data.imageUrl);
      setNotification({ open: true, message: "התמונה הועלתה בהצלחה", severity: "success" });
    } catch (err) {
      setNotification({ open: true, message: "שגיאה בהעלאת התמונה", severity: "error" });
    }
  };

  const handleQuestionImageUpload = async (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await api.post(`/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setValue(`questions.${index}.image`, res.data.imageUrl);
      setNotification({ open: true, message: "תמונת השאלה הועלתה", severity: "success" });
    } catch (err) {
      setNotification({ open: true, message: "שגיאה בהעלאת התמונה", severity: "error" });
    }
  };

  const onSubmit = async (data) => {
    if (loading || isSubmitted) return; 
    
    setLoading(true);
    
    try {
      const url = isEditMode ? `/quizzes/${id}` : `/quizzes`;
      const method = isEditMode ? "put" : "post";

      await api[method](url, data);

      setIsSubmitted(true); 
      setNotification({ open: true, message: isEditMode ? "החידון עודכן בהצלחה! 🚀" : "החידון נוצר בהצלחה! 🎉", severity: "success" });
      
      setTimeout(() => { navigate("/quizzes"); }, 2000);
    } catch (err) {
      setLoading(false); 
      setNotification({ open: true, message: "שגיאה בשמירה: " + (err.response?.data?.message || err.message), severity: "error" });
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 5, mb: 10 }}>
      <Paper elevation={4} sx={{ p: 4, borderRadius: 3, background: "rgba(255,255,255,0.05)", color: "white", backdropFilter: "blur(10px)" }}>
        <Typography variant="h4" sx={{ mb: 4, textAlign: "center", color: "#40e0d0", fontWeight: "bold" }}>
          {isEditMode ? "עריכת חידון" : "יצירת חידון חדש"}
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)} dir="rtl">
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth label="כותרת החידון"
                {...register("title", { required: "חובה להזין כותרת" })}
                error={!!errors.title} helperText={errors.title?.message}
                InputLabelProps={{ shrink: true, style: { color: "#40e0d0" } }}
                sx={{ input: { color: "white" }, "& .MuiOutlinedInput-root": { "& fieldset": { borderColor: "rgba(255,255,255,0.3)" } } }}
                disabled={loading || isSubmitted} 
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', gap: 1, height: '100%', alignItems: 'center' }}>
                <Button variant="outlined" component="label" fullWidth disabled={loading || isSubmitted} sx={{ height: '100%', minHeight: '56px', color: "#40e0d0", borderColor: "rgba(255,255,255,0.3)" }}>
                  {watch('image') ? '✅ תמונת נושא הועלתה' : '🖼️ העלאת תמונת נושא לחידון'}
                  <input type="file" hidden accept="image/*" onChange={handleMainImageUpload} />
                </Button>
                {watch('image') && (
                  <IconButton 
                    onClick={(e) => {
                      e.preventDefault();
                      setValue('image', '', { shouldValidate: true, shouldDirty: true });
                    }} 
                    color="error" 
                    title="הסר תמונה"
                    disabled={loading || isSubmitted}
                    sx={{ border: '1px solid rgba(244, 67, 54, 0.5)', borderRadius: 1, height: '100%' }}
                  >
                    <DeleteIcon />
                  </IconButton>
                )}
              </Box>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth multiline rows={2} label="תיאור קצר"
                {...register("description")}
                InputLabelProps={{ shrink: true, style: { color: "#40e0d0" } }}
                sx={{ textarea: { color: "white" }, "& .MuiOutlinedInput-root": { "& fieldset": { borderColor: "rgba(255,255,255,0.3)" } } }}
                disabled={loading || isSubmitted}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 4, bgcolor: "rgba(64, 224, 208, 0.2)" }} />
          <Typography variant="h5" sx={{ mb: 3, color: "#40e0d0" }}>שאלות</Typography>

          {fields.map((field, index) => (
            <Card key={field.id} sx={{ p: 3, mb: 3, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", color: "white" }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                <Typography variant="h6">שאלה {index + 1}</Typography>
                <IconButton onClick={() => remove(index)} color="error" disabled={fields.length === 1 || loading || isSubmitted}><DeleteIcon /></IconButton>
              </Box>

              <TextField
                fullWidth label="נוסח השאלה"
                {...register(`questions.${index}.questionText`, { required: true })}
                InputLabelProps={{ shrink: true, style: { color: "#40e0d0" } }}
                sx={{ mb: 3, input: { color: "white" }, "& .MuiOutlinedInput-root": { "& fieldset": { borderColor: "rgba(255,255,255,0.3)" } } }}
                disabled={loading || isSubmitted}
              />

              <Grid container spacing={2}>
                {[0, 1, 2, 3].map((optIndex) => (
                  <Grid item xs={12} sm={6} key={optIndex}>
                    <TextField
                      fullWidth label={`תשובה ${optIndex + 1}`}
                      {...register(`questions.${index}.options.${optIndex}`, { required: true })}
                      InputLabelProps={{ shrink: true, style: { color: "#40e0d0" } }}
                      sx={{ input: { color: "white" }, "& .MuiOutlinedInput-root": { "& fieldset": { borderColor: "rgba(255,255,255,0.3)" } } }}
                      disabled={loading || isSubmitted}
                    />
                  </Grid>
                ))}
              </Grid>

              <Box sx={{ mt: 3, display: "flex", alignItems: "center", gap: 2 }}>
                <TextField 
                  select 
                  label="תשובה נכונה" 
                  defaultValue={0}
                  InputLabelProps={{ shrink: true, style: { color: "#40e0d0" } }}
                  sx={{ width: 150, "& .MuiSelect-select": { color: "white" }, "& .MuiOutlinedInput-root": { "& fieldset": { borderColor: "rgba(255,255,255,0.3)" } } }} 
                  {...register(`questions.${index}.correctAnswer`, { valueAsNumber: true })}
                  disabled={loading || isSubmitted}
                >
                  {[0, 1, 2, 3].map((i) => (<MenuItem key={i} value={i}>תשובה {i + 1}</MenuItem>))}
                </TextField>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Button variant="outlined" component="label" startIcon={<CloudUploadIcon />} disabled={loading || isSubmitted} sx={{ color: "#40e0d0", borderColor: "#40e0d0", height: '56px' }}>
                    תמונה לשאלה
                    <input type="file" hidden accept="image/*" onChange={(e) => handleQuestionImageUpload(e, index)} />
                  </Button>
                  
                  {watch(`questions.${index}.image`) && (
                    <>
                      <Typography variant="caption" color="#2cd8bbd6">✅</Typography>
                      <IconButton 
                        size="small" 
                        onClick={(e) => {
                          e.preventDefault();
                          setValue(`questions.${index}.image`, '', { shouldValidate: true, shouldDirty: true });
                        }} 
                        color="error"
                        title="הסר תמונה"
                        disabled={loading || isSubmitted}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </>
                  )}
                </Box>
              </Box>
            </Card>
          ))}

          <Button 
            variant="outlined" 
            startIcon={<AddCircleIcon />} 
            onClick={() => append({ questionText: "", options: ["", "", "", ""], correctAnswer: 0, image: "" })} 
            sx={{ mb: 4, color: "#40e0d0", borderColor: "#40e0d0" }}
            disabled={loading || isSubmitted}
          >
            הוספת שאלה
          </Button>

          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/quizzes')}
              disabled={loading || isSubmitted}
              sx={{
                flex: 1,
                color: '#f44336',
                borderColor: 'rgba(244, 67, 54, 0.5)',
                fontWeight: 'bold',
                py: 1.5,
                '&:hover': {
                  borderColor: '#f44336',
                  bgcolor: 'rgba(244, 67, 54, 0.1)'
                }
              }}
            >
              ביטול
            </Button>

            <Button 
              type="submit" 
              size="large" 
              disabled={loading || isSubmitted} 
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : (isSubmitted ? <CheckCircleIcon /> : <SaveIcon />)} 
              sx={{ 
                flex: 1, 
                bgcolor: isSubmitted ? "#2cd8bbd6" : "#40e0d0", 
                color: isSubmitted ? "white" : "#020617", 
                fontWeight: "bold", 
                py: 1.5,
                "&:hover": { bgcolor: isSubmitted ? "#2cd8bbd6" : "#00c1ab" },
                "&:disabled": { 
                  bgcolor: isSubmitted ? "#2cd8bbd6" : "rgba(41, 202, 180, 0.83)", 
                  color: isSubmitted ? "white" : "" 
                }
              }}
            >
              {isSubmitted 
                ? (isEditMode ? "עודכן בהצלחה!" : "החידון נוצר בהצלחה!") 
                : (loading ? "שומר נתונים..." : (isEditMode ? "עדכן חידון" : "צור חידון"))}
            </Button>
          </Box>
        </form>
      </Paper>

      <Snackbar 
        open={notification.open} 
        autoHideDuration={3000} 
        onClose={() => setNotification({ ...notification, open: false })} 
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        sx={{ mb: 10 }} 
      >
        <Alert onClose={() => setNotification({ ...notification, open: false })} severity={notification.severity} sx={{ width: '100%', bgcolor: '#020617', color: '#40e0d0', border: '1px solid #40e0d0' }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CreateQuiz;