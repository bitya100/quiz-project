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

    // פונקציה להפעלת סאונד
    const playSound = (isCorrect) => {
        // הנתיב מתחיל מה-public
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
        const userId = localStorage.getItem('userId');
        const finalPercent = Math.round((finalScore / quiz.questions.length) * 100);

        if (userId) {
            try {
                await axios.post('http://localhost:3001/api/results/save', {
                    userId,
                    quizId: id,
                    quizTitle: quiz.title,
                    score: finalPercent
                });
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
        playSound(isCorrect); // הפעלת המוזיקה כאן

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
                    <button onClick={() => navigate('/quizzes')} style={styles.backButton}>חזור לרשימת החידונים</button>
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
    container: { display: 'flex', justifyContent: 'center', padding: '40px', backgroundColor: '#f0f2f5', minHeight: '90vh' },
    card: { backgroundColor: '#fff', padding: '30px', borderRadius: '15px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)', width: '100%', maxWidth: '600px', textAlign: 'center' },
    header: { display: 'flex', justifyContent: 'space-between', marginBottom: '20px' },
    progress: { width: '100%', height: '8px', backgroundColor: '#eee', borderRadius: '4px', marginBottom: '25px', overflow: 'hidden' },
    progressBar: { height: '100%', backgroundColor: '#3498db', transition: 'width 0.3s ease' },
    questionText: { marginBottom: '25px', fontSize: '22px' },
    optionsGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' },
    optionButton: { padding: '15px', fontSize: '16px', border: '1px solid #ddd', borderRadius: '8px', cursor: 'pointer', backgroundColor: '#fff' },
    resultCircle: { width: '100px', height: '100px', borderRadius: '50%', backgroundColor: '#3498db', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '20px auto', color: '#fff', fontSize: '24px' },
    backButton: { marginTop: '20px', padding: '12px 25px', backgroundColor: '#3498db', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' },
    loading: { textAlign: 'center', marginTop: '50px', fontSize: '20px' }
};

export default QuizPage;