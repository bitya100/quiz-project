import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const CreateQuiz = () => {
    const { id } = useParams(); 
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [questions, setQuestions] = useState([{ questionText: '', options: ['', '', '', ''], correctAnswer: 1 }]);

    useEffect(() => {
        if (id) {
            axios.get(`http://localhost:3001/api/quizzes/${id}`)
                .then(res => {
                    setTitle(res.data.title);
                    setDescription(res.data.description);
                    // התאמת ה-Index מהדאטה בייס (0-3) לתצוגה בטופס (1-4)
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
        
        // התאמת האינדקס בחזרה ל-0 לפני שמירה בשרת
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
                // ה-Interceptor מוסיף את הטוקן אוטומטית!
                await axios.put(`http://localhost:3001/api/quizzes/${id}`, data);
            } else {
                await axios.post('http://localhost:3001/api/quizzes/add', data);
            }
            navigate('/quizzes');
        } catch (err) { 
            const errorMsg = err.response?.data?.message || "שגיאה בשמירת החידון";
            alert(errorMsg); 
        }
    };

    const inputStyle = { display: 'block', width: '100%', marginBottom: '10px', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' };

    return (
        <div style={{ maxWidth: '700px', margin: '30px auto', padding: '20px', backgroundColor: '#fff', borderRadius: '10px', boxShadow: '0 0 15px rgba(0,0,0,0.1)' }}>
            <h1 style={{ textAlign: 'center', color: '#2c3e50' }}>{id ? 'עריכת חידון ✏️' : 'יצירת חידון חדש ➕'}</h1>
            <form onSubmit={handleSubmit}>
                <label>כותרת החידון:</label>
                <input type="text" placeholder="לדוגמה: חידון בירות העולם" value={title} onChange={e => setTitle(e.target.value)} required style={inputStyle} />
                
                <label>תיאור קצר:</label>
                <textarea placeholder="על מה החידון?" value={description} onChange={e => setDescription(e.target.value)} required style={{ ...inputStyle, height: '60px' }} />
                
                <hr style={{ margin: '20px 0', border: '0.5px solid #eee' }} />

                {questions.map((q, qIndex) => (
                    <div key={qIndex} style={{ border: '1px solid #eee', padding: '15px', marginBottom: '15px', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
                        <h4 style={{ marginTop: 0 }}>שאלה מספר {qIndex + 1}</h4>
                        <input type="text" placeholder="הכנס את השאלה כאן" value={q.questionText} onChange={e => handleQuestionChange(qIndex, 'questionText', e.target.value)} required style={inputStyle} />
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                            {q.options.map((opt, oIndex) => (
                                <input key={oIndex} type="text" placeholder={`תשובה ${oIndex + 1}`} value={opt} onChange={e => handleQuestionChange(qIndex, 'options', e.target.value, oIndex)} required style={inputStyle} />
                            ))}
                        </div>
                        
                        <div style={{ textAlign: 'right', marginTop: '10px' }}>
                            <label style={{ fontWeight: 'bold' }}>מספר תשובה נכונה (1-4): </label>
                            <input type="number" min="1" max="4" value={q.correctAnswer} onChange={e => handleQuestionChange(qIndex, 'correctAnswer', e.target.value)} style={{ padding: '8px', width: '50px', borderRadius: '5px', border: '1px solid #ccc' }} />
                        </div>
                    </div>
                ))}

                <button type="button" onClick={addQuestion} style={{ padding: '12px', marginBottom: '20px', cursor: 'pointer', width: '100%', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold' }}>➕ הוסף שאלה נוספת</button>
                
                <button type="submit" style={{ padding: '15px', width: '100%', backgroundColor: '#2ecc71', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '18px', fontWeight: 'bold' }}>
                    {id ? 'עדכן חידון וסיים' : 'פרסם חידון חדש ✅'}
                </button>
            </form>
        </div>
    );
};

export default CreateQuiz;