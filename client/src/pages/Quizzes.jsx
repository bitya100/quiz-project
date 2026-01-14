import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuizzes } from '../context/QuizContext';
import axios from 'axios';
import '../App.css'; 

const Quizzes = ({ searchTerm }) => {
    const { quizzes, loading, refreshQuizzes } = useQuizzes();
    const [filteredQuizzes, setFilteredQuizzes] = useState([]);
    const navigate = useNavigate();
    const userRole = localStorage.getItem('role');
    const token = localStorage.getItem('token');

    useEffect(() => {
        const results = quizzes.filter(quiz => 
            quiz.title?.toLowerCase().includes(searchTerm?.toLowerCase() || "") ||
            quiz.description?.toLowerCase().includes(searchTerm?.toLowerCase() || "")
        );
        setFilteredQuizzes(results);
    }, [searchTerm, quizzes]);

    const deleteQuiz = async (id) => {
        if (!window.confirm("בטוח שברצונך למחוק את החידון לצמיתות?")) return;
        try {
            await axios.delete(`http://localhost:3001/api/quizzes/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            refreshQuizzes();
        } catch (err) { 
            console.error(err);
            alert("שגיאה במערכת - ודא שהשרת מחובר"); 
        }
    };

    if (loading) return (
        <div className="loader-container">
            <div className="spinner"></div>
            <h2 className="main-title" style={styles.loaderTitle}>טוען את האתגרים...</h2>
        </div>
    );

    return (
        <div className="page-wrapper" style={styles.pageWrapper}>
            <header style={styles.header}>
                <h1 className="main-title">QUIZ ZONE</h1>
                <p className="subtitle">בחרו אתגר, צברו נקודות והוכיחו שאתם יודעים!</p>
                
                {userRole === 'admin' && (
                    <button onClick={() => navigate('/create-quiz')} className="admin-create-btn">
                        ⚡ יצירת חידון חדש ⚡
                    </button>
                )}
            </header>

            <div className="quizzes-grid">
                {filteredQuizzes.length === 0 ? (
                    <p className="subtitle" style={styles.noResults}>
                        {searchTerm ? `לא נמצאו חידונים עבור "${searchTerm}"` : 'לא נמצאו חידונים כרגע...'}
                    </p>
                ) : (
                    filteredQuizzes.map(quiz => (
                        <div key={quiz._id} className="quiz-card">
                            <h3 className="card-title">{quiz.title}</h3>
                            <p className="card-description">{quiz.description}</p>
                            
                            <div className="card-footer" style={styles.cardFooter}>
                                <button onClick={() => navigate(`/quiz/${quiz._id}`)} className="play-btn">
                                    בואו נשחק!
                                </button>

                                {userRole === 'admin' && (
                                    <div className="admin-actions" style={styles.adminActions}>
                                        <button 
                                            onClick={() => navigate(`/edit-quiz/${quiz._id}`)} 
                                            style={styles.editBtn}
                                        >
                                            עריכה ✏️
                                        </button>
                                        <button 
                                            onClick={() => deleteQuiz(quiz._id)} 
                                            style={styles.deleteBtn}
                                        >
                                            מחיקה 🗑️
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

const styles = {
    pageWrapper: {
        paddingTop: '10px', // צמצום הריווח העליון כדי למנוע גלילה מיותרת
    },
    header: {
        textAlign: 'center', 
        padding: '20px 0' // צמצום הפדינג מ-40 ל-20
    },
    loaderTitle: {
        fontSize: '2rem'
    },
    noResults: {
        gridColumn: '1/-1', 
        fontSize: '2rem',
        textAlign: 'center'
    },
    cardFooter: {
        width: '100%'
    },
    adminActions: {
        display: 'flex', 
        gap: '15px', 
        marginTop: '20px', 
        justifyContent: 'center'
    },
    editBtn: {
        color: 'var(--neon-blue)', 
        background: 'none', 
        border: '1px solid var(--neon-blue)', 
        padding: '5px 15px', 
        borderRadius: '8px', 
        cursor: 'pointer', 
        fontWeight: 'bold'
    },
    deleteBtn: {
        color: '#ff4d4d', 
        background: 'none', 
        border: '1px solid #ff4d4d', 
        padding: '5px 15px', 
        borderRadius: '8px', 
        cursor: 'pointer', 
        fontWeight: 'bold'
    }
};

export default Quizzes;