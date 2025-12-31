import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // ייבוא ה-Hook הנכון

const Quizzes = () => {
    const [quizzes, setQuizzes] = useState([]);
    const navigate = useNavigate(); // חובה לקרוא לזה כאן, בתוך גוף הפונקציה!

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const res = await axios.get('http://localhost:3001/api/quizzes');
                setQuizzes(res.data);
            } catch (err) {
                console.error("שגיאה בטעינת חידונים", err);
            }
        };
        fetchQuizzes();
    }, []);

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h1 style={{ textAlign: 'center' }}>החידונים שלנו</h1>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                {quizzes.map(quiz => (
                    <div key={quiz._id} style={{ 
                        border: '1px solid #ddd', 
                        borderRadius: '8px', 
                        margin: '15px', 
                        padding: '20px', 
                        width: '300px',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}>
                        <h3>{quiz.title}</h3>
                        <p>{quiz.description}</p>
                        {/* שימוש נכון ב-navigate בתוך ה-onClick */}
                        <button 
                            onClick={() => navigate(`/quiz/${quiz._id}`)} 
                            style={{ 
                                backgroundColor: '#4CAF50', 
                                color: 'white', 
                                border: 'none', 
                                padding: '10px 15px', 
                                borderRadius: '4px', 
                                cursor: 'pointer',
                                width: '100%'
                            }}
                        >
                            התחל חידון
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Quizzes;