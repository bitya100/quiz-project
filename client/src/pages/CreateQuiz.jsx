import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuizzes } from '../context/QuizContext';

const CreateQuiz = () => {
    const { id } = useParams(); 
    const navigate = useNavigate();
    const { refreshQuizzes } = useQuizzes(); 
    
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    // הוסר ה-State של ה-icon
    const [questions, setQuestions] = useState([{ questionText: '', options: ['', '', '', ''], correctAnswer: 1 }]);

    useEffect(() => {
        if (id) {
            axios.get(`http://localhost:3001/api/quizzes/${id}`)
                .then(res => {
                    setTitle(res.data.title);
                    setDescription(res.data.description);
                    // הוסרה טעינת האימוג'י
                    setQuestions(res.data.questions.map(q => ({ 
                        ...q, 
                        correctAnswer: Number(q.correctAnswer) + 1 
                    })));
                })
                .catch(err => console.error("Error loading quiz for edit:", err));
        }
    }, [id]);

    const handleQuestionChange = (index, field, value, optIndex = null) => {
        const newQuestions = [...questions];
        if (optIndex !== null) newQuestions[index].options[optIndex] = value;
        else newQuestions[index][field] = value;
        setQuestions(newQuestions);
    };

    const addQuestion = () => setQuestions([...questions, { questionText: '', options: ['', '', '', ''], correctAnswer: 1 }]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const data = { 
            title, 
            description, 
            // השדה icon הוסר מהנתונים שנשלחים לשרת
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

    const inputStyle = { 
        display: 'block', 
        width: '100%', 
        marginBottom: '15px', 
        padding: '12px', 
        borderRadius: '8px', 
        border: '1px solid rgba(255,255,255,0.1)', 
        backgroundColor: 'rgba(255,255,255,0.05)', 
        color: 'white',
        boxSizing: 'border-box',
        textAlign: 'right'
    };
    
    return (
        <div className="page-wrapper" style={{ padding: '20px', minHeight: '100vh', direction: 'rtl' }}>
            <div className="quiz-card" style={{ maxWidth: '800px', margin: '40px auto', background: 'rgba(20, 20, 35, 0.9)', padding: '30px', borderRadius: '20px', border: '1px solid var(--neon-blue)', boxShadow: '0 0 20px rgba(64, 224, 208, 0.2)' }}>
                
                <h1 className="main-title" style={{ fontSize: '2.5rem', marginBottom: '30px', textAlign: 'center' }}>
                    {id ? 'עריכת חידון' : 'יצירת חידון חדש'}
                </h1>
                
                <form onSubmit={handleSubmit}>
                    {/* כל בלוק האימוג'ים והבחירה שלהם הוסר מכאן */}

                    <label className="subtitle" style={{ display: 'block', marginBottom: '5px', textAlign: 'right' }}>כותרת החידון:</label>
                    <input type="text" placeholder="שם החידון..." value={title} onChange={e => setTitle(e.target.value)} required style={inputStyle} />
                    
                    <label className="subtitle" style={{ display: 'block', marginBottom: '5px', textAlign: 'right' }}>תיאור קצר:</label>
                    <textarea placeholder="תאר בקצרה את האתגר..." value={description} onChange={e => setDescription(e.target.value)} required style={{ ...inputStyle, height: '80px' }} />
                    
                    <hr style={{ margin: '30px 0', border: 'none', height: '1px', background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.2), transparent)' }} />

                    {questions.map((q, qIndex) => (
                        <div key={qIndex} style={{ padding: '20px', marginBottom: '25px', borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <h4 style={{ marginTop: 0, color: 'var(--neon-blue)', marginBottom: '15px', textAlign: 'right' }}>שאלה {qIndex + 1}</h4>
                            <input type="text" placeholder="מה השאלה?" value={q.questionText} onChange={e => handleQuestionChange(qIndex, 'questionText', e.target.value)} required style={inputStyle} />
                            
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                {q.options.map((opt, oIndex) => (
                                    <input key={oIndex} type="text" placeholder={`תשובה ${oIndex + 1}`} value={opt} onChange={e => handleQuestionChange(qIndex, 'options', e.target.value, oIndex)} required style={inputStyle} />
                                ))}
                            </div>
                            
                            <div style={{ textAlign: 'right', marginTop: '15px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '10px' }}>
                                <label style={{ color: '#ccc', marginLeft: '10px' }}>מספר תשובה נכונה (1-4): </label>
                                <input type="number" min="1" max="4" value={q.correctAnswer} onChange={e => handleQuestionChange(qIndex, 'correctAnswer', e.target.value)} 
                                    style={{ ...inputStyle, width: '70px', display: 'inline-block', marginBottom: 0 }} />
                            </div>
                        </div>
                    ))}

                    <button type="button" onClick={addQuestion} className="play-btn" style={{ marginBottom: '20px', width: '100%', background: 'transparent', border: '1px solid var(--neon-blue)', color: 'var(--neon-blue)' }}>
                        ➕ הוסף שאלה נוספת
                    </button>
                    
                    <button type="submit" className="admin-create-btn" style={{ width: '100%', margin: '0', padding: '15px', fontSize: '1.2rem' }}>
                        {id ? 'שמור שינויים ועדכן' : 'פרסם חידון עכשיו'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateQuiz;