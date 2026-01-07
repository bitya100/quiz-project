import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const QuizPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [quiz, setQuiz] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [showScore, setShowScore] = useState(false);
    const [timeLeft, setTimeLeft] = useState(15);
    const [selectedAnswer, setSelectedAnswer] = useState(null);

    const playSound = (isCorrect) => {
        const audioPath = isCorrect ? '/music/correct.mp3' : '/music/false.mp3';
        const audio = new Audio(audioPath);
        audio.play().catch(err => console.log("Audio play error:", err));
    };

    useEffect(() => {
        axios.get(`http://localhost:3001/api/quizzes/${id}`)
            .then(res => setQuiz(res.data))
            .catch(err => console.error("Error loading quiz:", err));
    }, [id]);

    const finishQuiz = useCallback(async (finalScore) => {
        setShowScore(true);
        const token = localStorage.getItem('token'); // שימוש בטוקן במקום רק ב-ID
        const finalPercent = Math.round((finalScore / quiz.questions.length) * 100);

        if (token) {
            try {
                // שליחת התוצאה עם ה-Token ב-Headers
                await axios.post('http://localhost:3001/api/results/save', {
                    quizId: id,
                    quizTitle: quiz.title,
                    score: finalPercent
                }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                console.log("Score saved successfully");
            } catch (err) {
                console.error("Failed to save score:", err);
            }
        }
    }, [id, quiz]);

    useEffect(() => {
        if (showScore || !quiz || selectedAnswer !== null) return;
        if (timeLeft === 0) {
            handleAnswerClick(null, false);
            return;
        }
        const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        return () => clearInterval(timer);
    }, [timeLeft, showScore, quiz, selectedAnswer]);

    const handleAnswerClick = (index, isCorrect) => {
        if (selectedAnswer !== null) return;

        setSelectedAnswer(index);
        playSound(isCorrect);

        let nextScore = score;
        if (isCorrect) nextScore += 1;
        setScore(nextScore);

        setTimeout(() => {
            const nextQuestion = currentQuestion + 1;
            if (nextQuestion < quiz.questions.length) {
                setCurrentQuestion(nextQuestion);
                setSelectedAnswer(null);
                setTimeLeft(15);
            } else {
                finishQuiz(nextScore);
            }
        }, 1500);
    };

    if (!quiz) return <div style={styles.loading}>טוען חידון...</div>;

    const currentQ = quiz.questions[currentQuestion];

    return (
        <div style={styles.container}>
            {showScore ? (
                <div style={styles.card}>
                    <h2 style={styles.title}>החידון הסתיים!</h2>
                    <div style={styles.resultCircle}>
                        <span style={styles.resultText}>{Math.round((score / quiz.questions.length) * 100)}%</span>
                    </div>
                    <p>צברת {score} תשובות נכונות מתוך {quiz.questions.length}</p>
                    <button onClick={() => navigate('/my-scores')} style={styles.backButton}>לצפייה בכל הציונים שלי</button>
                    <button onClick={() => navigate('/quizzes')} style={{...styles.backButton, backgroundColor: '#95a5a6', marginRight: '10px'}}>חזור לחידונים</button>
                </div>
            ) : (
                <div style={styles.card}>
                    <div style={styles.header}>
                        <span>שאלה {currentQuestion + 1} מתוך {quiz.questions.length}</span>
                        <span style={{ color: timeLeft < 5 ? '#e74c3c' : '#2c3e50', fontWeight: 'bold' }}>
                            ⏳ {timeLeft} שניות
                        </span>
                    </div>
                    <div style={styles.progress}><div style={{ ...styles.progressBar, width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }}></div></div>
                    
                    <h2 style={styles.questionText}>{currentQ.questionText}</h2>
                    
                    <div style={styles.optionsGrid}>
                        {currentQ.options.map((opt, i) => {
                            let dynamicStyle = { ...styles.optionButton };
                            if (selectedAnswer !== null) {
                                if (i === currentQ.correctAnswer) {
                                    dynamicStyle.backgroundColor = '#27ae60';
                                    dynamicStyle.color = 'white';
                                } else if (i === selectedAnswer) {
                                    dynamicStyle.backgroundColor = '#e74c3c';
                                    dynamicStyle.color = 'white';
                                }
                            }

                            return (
                                <button 
                                    key={i} 
                                    onClick={() => handleAnswerClick(i, i === currentQ.correctAnswer)}
                                    style={dynamicStyle}
                                    disabled={selectedAnswer !== null}
                                >
                                    {opt}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

const styles = {
    container: { 
        display: 'flex', 
        justifyContent: 'center', 
        padding: '40px', 
        backgroundColor: 'transparent', // יראה את הצבע של ה-body
        width: '100%',
        boxSizing: 'border-box'
    },
    card: { backgroundColor: '#fff', padding: '30px', borderRadius: '15px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)', width: '100%', maxWidth: '600px', textAlign: 'center', color: '#333' },
    header: { display: 'flex', justifyContent: 'space-between', marginBottom: '20px' },
    progress: { width: '100%', height: '8px', backgroundColor: '#eee', borderRadius: '4px', marginBottom: '25px', overflow: 'hidden' },
    progressBar: { height: '100%', backgroundColor: '#3498db', transition: 'width 0.3s ease' },
    questionText: { marginBottom: '25px', fontSize: '22px' },
    optionsGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' },
    optionButton: { padding: '15px', fontSize: '16px', border: '1px solid #ddd', borderRadius: '8px', cursor: 'pointer', backgroundColor: '#fff' },
    resultCircle: { width: '100px', height: '100px', borderRadius: '50%', backgroundColor: '#3498db', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '20px auto', color: '#fff', fontSize: '24px' },
    backButton: { marginTop: '20px', padding: '12px 25px', backgroundColor: '#00c1abff', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' },
    loading: { textAlign: 'center', marginTop: '50px', fontSize: '20px' }


};

export default QuizPage;