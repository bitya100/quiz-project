import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Confetti from 'react-confetti'; // ייבוא הקונפטי

const QuizPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [quiz, setQuiz] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [showScore, setShowScore] = useState(false);
    const [timeLeft, setTimeLeft] = useState(15);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    // הוספת מצב לגודל המסך בשביל הקונפטי
    const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

    useEffect(() => {
        const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id, currentQuestion, showScore]);

    const playSound = (isCorrect) => {
        const audioPath = isCorrect ? '/music/correct.mp3' : '/music/false.mp3';
        const audio = new Audio(audioPath);
        audio.play().catch(err => console.log("Audio play error:", err));
    };

    const playApplause = () => {
        const audio = new Audio('/music/clapps3.mp3');
        audio.play().catch(err => console.log("Applause audio error:", err));
    };

    useEffect(() => {
        axios.get(`http://localhost:3001/api/quizzes/${id}`)
            .then(res => setQuiz(res.data))
            .catch(err => console.error("Error loading quiz:", err));
    }, [id]);

    const finishQuiz = useCallback(async (finalScore) => {
        setShowScore(true);
        playApplause(); 
        
        const token = localStorage.getItem('token');
        const finalPercent = Math.round((finalScore / quiz.questions.length) * 100);

        if (token) {
            try {
                await axios.post('http://localhost:3001/api/results/save', {
                    quizId: id,
                    quizTitle: quiz.title,
                    score: finalPercent
                }, {
                    headers: { Authorization: `Bearer ${token}` }
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

    if (!quiz) return <div className="center-message">טוען חידון...</div>;

    const currentQ = quiz.questions[currentQuestion];
    const finalScorePercent = Math.round((score / quiz.questions.length) * 100);

    return (
        <div className="quiz-wrapper">
            {/* הצגת קונפטי רק בציון 100 ובסיום המשחק */}
            {showScore && finalScorePercent === 100 && (
                <Confetti
                    width={windowSize.width}
                    height={windowSize.height}
                    recycle={false} // יתפוצץ פעם אחת ולא יחזור על עצמו לנצח
                    numberOfPieces={500}
                />
            )}

            {showScore ? (
                <div className="quiz-card-glow">
                    <h2 className="main-title" style={{fontSize: '3rem', marginTop: 0}}>כל הכבוד!</h2>
                    <div className="result-score-circle">
                        {finalScorePercent}%
                    </div>
                    <p style={{fontSize: '1.5rem', marginBottom: '30px'}}>
                        צברת {score} תשובות נכונות מתוך {quiz.questions.length}
                    </p>
                    
                    <div className="result-actions">
                        <button onClick={() => navigate('/my-scores')} className="back-to-scores-btn">
                            לצפייה בציונים שלי
                        </button>
                        <button onClick={() => navigate('/quizzes')} className="back-to-scores-btn" style={{backgroundColor: 'transparent', border: '2px solid white', color: 'white'}}>
                            חזור לחידונים
                        </button>
                    </div>
                </div>
            ) : (
                <div className="quiz-card-glow">
                    <div className="quiz-header">
                        <span>שאלה {currentQuestion + 1} / {quiz.questions.length}</span>
                        <span style={{ color: timeLeft < 5 ? '#ff4d4d' : 'var(--neon-blue)', fontSize: '1.5rem' }}>
                             ⏳ {timeLeft} שניות
                        </span>
                    </div>

                    <div className="quiz-progress-container">
                        <div 
                            className="quiz-progress-bar" 
                            style={{ width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }}
                        ></div>
                    </div>
                    
                    {currentQ.image && (
                        <img src={currentQ.image} alt="שאלה" className="question-img" />
                    )}

                    <h2 className="question-title">{currentQ.questionText}</h2>
                    
                    <div className="quiz-options-grid">
                        {currentQ.options.map((opt, i) => {
                            let statusClass = "";
                            if (selectedAnswer !== null) {
                                if (i === currentQ.correctAnswer) statusClass = "correct";
                                else if (i === selectedAnswer) statusClass = "wrong";
                            }

                            return (
                                <button 
                                    key={i} 
                                    onClick={() => handleAnswerClick(i, i === currentQ.correctAnswer)}
                                    className={`option-btn ${statusClass}`}
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

export default QuizPage;