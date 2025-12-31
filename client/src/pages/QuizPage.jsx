import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const QuizPage = () => {
    const { id } = useParams(); // מקבל את ה-ID של החידון מהכתובת
    const [quiz, setQuiz] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [showScore, setShowScore] = useState(false);

    useEffect(() => {
        const fetchQuiz = async () => {
            const res = await axios.get(`http://localhost:3001/api/quizzes/${id}`);
            setQuiz(res.data);
        };
        fetchQuiz();
    }, [id]);

    const handleAnswerClick = (index) => {
        if (index === quiz.questions[currentQuestion].correctAnswer) {
            setScore(score + 1);
        }

        const nextQuestion = currentQuestion + 1;
        if (nextQuestion < quiz.questions.length) {
            setCurrentQuestion(nextQuestion);
        } else {
            setShowScore(true);
        }
    };

    if (!quiz) return <h2>טוען חידון...</h2>;

    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            {showScore ? (
                <div>
                    <h2>סיימת! הציון שלך הוא: {score} מתוך {quiz.questions.length}</h2>
                    <button onClick={() => window.location.href = '/quizzes'}>חזרה לרשימה</button>
                </div>
            ) : (
                <div>
                    <h1>{quiz.title}</h1>
                    <div style={{ margin: '20px', padding: '20px', border: '1px solid #ddd' }}>
                        <h3>{quiz.questions[currentQuestion].questionText}</h3>
                        {quiz.questions[currentQuestion].options.map((option, index) => (
                            <button 
                                key={index} 
                                onClick={() => handleAnswerClick(index)}
                                style={{ display: 'block', margin: '10px auto', padding: '10px', width: '200px' }}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default QuizPage;