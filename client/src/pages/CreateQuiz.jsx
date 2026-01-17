import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuizzes } from '../context/QuizContext';
import { IconButton, Box, Typography, Button, Input, Textarea, Divider, Stack } from '@mui/joy';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { motion, AnimatePresence } from 'framer-motion';

const CreateQuiz = () => {
    const { id } = useParams(); 
    const navigate = useNavigate();
    const { refreshQuizzes } = useQuizzes(); 
    
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [questions, setQuestions] = useState([{ questionText: '', options: ['', '', '', ''], correctAnswer: 1, image: '' }]);

    useEffect(() => {
        if (id) {
            axios.get(`http://localhost:3001/api/quizzes/${id}`)
                .then(res => {
                    setTitle(res.data.title);
                    setDescription(res.data.description);
                    setQuestions(res.data.questions.map(q => ({ 
                        ...q, 
                        correctAnswer: Number(q.correctAnswer) + 1,
                        image: q.image || '' 
                    })));
                })
                .catch(err => console.error("Error loading quiz for edit:", err));
        }
    }, [id]);

    const handleImageUpload = (index, e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const newQuestions = [...questions];
                newQuestions[index].image = reader.result; 
                setQuestions(newQuestions);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleQuestionChange = (index, field, value, optIndex = null) => {
        const newQuestions = [...questions];
        if (optIndex !== null) newQuestions[index].options[optIndex] = value;
        else {
            if (field === 'correctAnswer') {
                const val = Number(value);
                if (val < 1 || val > 4) return; 
            }
            newQuestions[index][field] = value;
        }
        setQuestions(newQuestions);
    };

    const addQuestion = () => setQuestions([...questions, { questionText: '', options: ['', '', '', ''], correctAnswer: 1, image: '' }]);

    const removeQuestion = (index) => {
        if (questions.length === 1) {
            alert("חובה להשאיר לפחות שאלה אחת בחידון");
            return;
        }
        const newQuestions = questions.filter((_, i) => i !== index);
        setQuestions(newQuestions);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = { 
            title, 
            description, 
            questions: questions.map(q => ({ 
                ...q, 
                correctAnswer: Number(q.correctAnswer) - 1 
            })) 
        };

        try {
            if (id) {
                await axios.put(`http://localhost:3001/api/quizzes/${id}`, data);
            } else {
                await axios.post('http://localhost:3001/api/quizzes/', data);
            }
            if (refreshQuizzes) await refreshQuizzes(); 
            navigate('/quizzes');
        } catch (err) { 
            const errorMsg = err.response?.data?.message || "שגיאה בשמירת החידון";
            alert(errorMsg); 
        }
    };

    return (
        <div className="page-wrapper" style={{ padding: '20px', minHeight: '100vh', direction: 'rtl' }}>
            <Box className="quiz-card" sx={{ 
                maxWidth: '800px', 
                margin: '40px auto', 
                background: 'rgba(20, 20, 35, 0.9)', 
                padding: '30px', 
                borderRadius: '20px', 
                border: '1px solid #00c1ab', 
                boxShadow: '0 0 20px rgba(0, 193, 171, 0.2)' 
            }}>
                <Typography level="h2" sx={{ color: 'white', mb: 3, textAlign: 'center', textShadow: '0 0 10px #00c1ab' }}>
                    {id ? 'עריכת חידון' : 'יצירת חידון חדש'}
                </Typography>
                
                <form onSubmit={handleSubmit}>
                    <Typography level="body-md" sx={{ color: '#00c1ab', mb: 1 }}>כותרת החידון:</Typography>
                    <Input 
                        placeholder="שם החידון..." 
                        value={title} 
                        onChange={e => setTitle(e.target.value)} 
                        required 
                        variant="soft"
                        sx={{ mb: 2, bgcolor: 'rgba(255,255,255,0.05)', color: 'white' }} 
                    />
                    
                    <Typography level="body-md" sx={{ color: '#00c1ab', mb: 1 }}>תיאור קצר:</Typography>
                    <Textarea 
                        minRows={2}
                        placeholder="תאר בקצרה את האתגר..." 
                        value={description} 
                        onChange={e => setDescription(e.target.value)} 
                        required 
                        variant="soft"
                        sx={{ mb: 3, bgcolor: 'rgba(255,255,255,0.05)', color: 'white' }} 
                    />
                    
                    <Divider sx={{ my: 3, bgcolor: 'rgba(255,255,255,0.1)' }} />

                    <AnimatePresence>
                        {questions.map((q, qIndex) => (
                            <motion.div
                                key={qIndex}
                                initial={{ opacity: 0, height: 0, x: -20 }}
                                animate={{ opacity: 1, height: 'auto', x: 0 }}
                                exit={{ opacity: 0, x: 100, transition: { duration: 0.3 } }}
                                layout
                            >
                                <Box sx={{ 
                                    padding: '20px', 
                                    marginBottom: '25px', 
                                    borderRadius: '12px', 
                                    backgroundColor: 'rgba(255,255,255,0.02)', 
                                    border: '1px solid rgba(255,255,255,0.05)',
                                    position: 'relative'
                                }}>
                                    <IconButton 
                                        color="danger" 
                                        variant="soft"
                                        onClick={() => removeQuestion(qIndex)}
                                        sx={{
                                            position: 'absolute',
                                            top: '10px',
                                            left: '10px',
                                            borderRadius: '50%',
                                            '&:hover': { bgcolor: 'rgba(255, 77, 77, 0.2)' }
                                        }}
                                    >
                                        <DeleteForeverIcon />
                                    </IconButton>

                                    <Typography level="h4" sx={{ color: '#00c1ab', mb: 2 }}>שאלה {qIndex + 1}</Typography>
                                    
                                    <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                                        <Input 
                                            fullWidth
                                            placeholder="מה השאלה?" 
                                            value={q.questionText} 
                                            onChange={e => handleQuestionChange(qIndex, 'questionText', e.target.value)} 
                                            required 
                                            variant="outlined"
                                            sx={{ bgcolor: 'transparent', color: 'white' }}
                                        />
                                        <Button
                                            component="label"
                                            variant="soft"
                                            startDecorator={<AddPhotoAlternateIcon />}
                                            sx={{ 
                                                minWidth: '120px',
                                                bgcolor: 'rgba(0, 193, 171, 0.1)',
                                                color: '#00c1ab',
                                                '&:hover': { bgcolor: 'rgba(0, 193, 171, 0.2)' }
                                            }}
                                        >
                                            תמונה
                                            <input 
                                                type="file" 
                                                hidden 
                                                accept="image/*" 
                                                onChange={(e) => handleImageUpload(qIndex, e)} 
                                            />
                                        </Button>
                                    </Stack>

                                    {q.image && (
                                        <Box sx={{ mb: 2, textAlign: 'center', position: 'relative' }}>
                                            <img 
                                                src={q.image} 
                                                alt="preview" 
                                                style={{ maxHeight: '150px', borderRadius: '8px', border: '1px solid #00c1ab' }} 
                                            />
                                            <br />
                                            <Button 
                                                size="sm" 
                                                color="danger" 
                                                variant="plain" 
                                                onClick={() => handleQuestionChange(qIndex, 'image', '')}
                                            >
                                                הסר תמונה
                                            </Button>
                                        </Box>
                                    )}
                                    
                                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                        {q.options.map((opt, oIndex) => (
                                            <Input 
                                                key={oIndex} 
                                                placeholder={`תשובה ${oIndex + 1}`} 
                                                value={opt} 
                                                onChange={e => handleQuestionChange(qIndex, 'options', e.target.value, oIndex)} 
                                                required 
                                                variant="outlined"
                                                sx={{ bgcolor: 'transparent', color: 'white' }}
                                            />
                                        ))}
                                    </Box>
                                    
                                    <Stack direction="row" alignItems="center" spacing={2} sx={{ mt: 2, pt: 2, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                                        <Typography level="body-sm" sx={{ color: '#ccc' }}>מספר תשובה נכונה (1-4): </Typography>
                                        <Input 
                                            type="number" 
                                            slotProps={{ input: { min: 1, max: 4 } }}
                                            value={q.correctAnswer} 
                                            onChange={e => handleQuestionChange(qIndex, 'correctAnswer', e.target.value)} 
                                            required
                                            sx={{ width: '80px', bgcolor: 'transparent', color: 'white' }}
                                        />
                                    </Stack>
                                </Box>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    <Button 
                        fullWidth 
                        variant="outlined" 
                        onClick={addQuestion} 
                        sx={{ 
                            mb: 4, 
                            borderColor: '#00c1ab', 
                            color: '#00c1ab',
                            '&:hover': { bgcolor: 'rgba(0, 193, 171, 0.1)', borderColor: '#00c1ab' }
                        }}
                    >
                        ➕ הוסף שאלה נוספת
                    </Button>
                    
                    <Divider sx={{ mb: 3, bgcolor: 'rgba(255,255,255,0.1)' }} />

                    <Stack direction="row" spacing={2}>
                        <Button 
                            variant="soft" 
                            color="neutral"
                            size="lg"
                            onClick={() => navigate('/quizzes')}
                            sx={{ 
                                flex: 1,
                                fontWeight: 'bold',
                                bgcolor: 'rgba(255,255,255,0.1)',
                                color: 'white',
                                '&:hover': { bgcolor: 'rgba(255, 77, 77, 0.2)', color: '#ff4d4d' }
                            }}
                        >
                            ביטול וחזרה
                        </Button>

                        <Button 
                            type="submit" 
                            size="lg"
                            sx={{ 
                                flex: 2, 
                                background: 'linear-gradient(45deg, #00c1ab, #008e7d)',
                                color: 'white',
                                fontWeight: 'bold',
                                fontSize: '1.1rem',
                                boxShadow: '0 4px 15px rgba(0, 193, 171, 0.3)'
                            }}
                        >
                            {id ? 'שמור שינויים ועדכן' : 'פרסם חידון עכשיו'}
                        </Button>
                    </Stack>
                </form>
            </Box>
        </div>
    );
};

export default CreateQuiz;