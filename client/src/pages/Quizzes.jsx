import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuizzes } from '../context/QuizContext';
import axios from 'axios';
import '../App.css'; 

const Quizzes = ({ searchTerm }) => {
    const { quizzes, loading, refreshQuizzes } = useQuizzes();
    const [filteredQuizzes, setFilteredQuizzes] = useState([]);
    
    // States לניהול מודאל המחיקה המעוצב
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [quizToDelete, setQuizToDelete] = useState(null);

    const navigate = useNavigate();
    const userRole = localStorage.getItem('role');
    const token = localStorage.getItem('token');
    
    // רפרנס כדי שנוכל לגלול אל החידונים בלחיצת כפתור
    const quizGridRef = useRef(null);

    useEffect(() => {
        const results = quizzes.filter(quiz => 
            quiz.title?.toLowerCase().includes(searchTerm?.toLowerCase() || "") ||
            quiz.description?.toLowerCase().includes(searchTerm?.toLowerCase() || "")
        );
        setFilteredQuizzes(results);
    }, [searchTerm, quizzes]);

    // פונקציה לפתיחת המודאל במקום ה-Confirm המובנה
    const openDeleteModal = (quiz) => {
        setQuizToDelete(quiz);
        setIsModalOpen(true);
    };

    const deleteQuiz = async () => {
        if (!quizToDelete) return;
        try {
            await axios.delete(`http://localhost:3001/api/quizzes/${quizToDelete._id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            refreshQuizzes();
            setIsModalOpen(false); // סגירת המודאל בסיום
            setQuizToDelete(null);
        } catch (err) { 
            console.error(err);
            alert("שגיאה במערכת - ודא שהשרת מחובר"); 
        }
    };

    // פונקציה לגלילה חלקה לחידונים
    const scrollToQuizzes = () => {
        quizGridRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    if (loading) return (
        <div className="loader-container">
            <div className="spinner"></div>
            <h2 className="main-title" style={styles.loaderTitle}>טוען את האתגרים...</h2>
        </div>
    );

    return (
        <div className="page-wrapper" style={styles.pageWrapper}>
            
            {/* --- מודאל אישור מחיקה מעוצב --- */}
            {isModalOpen && (
                <div style={styles.modalOverlay}>
                    <div className="quiz-card-glow" style={styles.modalContent}>
                        <h2 style={{ color: '#ff4d4d', marginBottom: '15px' }}>אישור מחיקה</h2>
                        <p style={{ fontSize: '1.2rem', marginBottom: '30px' }}>
                            האם אתה בטוח שברצונך למחוק את החידון <strong>"{quizToDelete?.title}"</strong>? 
                            לא ניתן לבטל פעולה זו.
                        </p>
                        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
                            <button 
                                onClick={deleteQuiz} 
                                className="back-to-scores-btn" 
                                style={{ background: '#ff4d4d', border: 'none', color: 'white' }}
                            >
                                מחק לצמיתות
                            </button>
                            <button 
                                onClick={() => setIsModalOpen(false)} 
                                className="restart-btn"
                            >
                                ביטול
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* --- Hero Section: מסך קבלת הפנים החדש --- */}
            <section style={styles.heroSection}>
                <div style={styles.heroContent}>
                    <h1 className="main-title" style={styles.heroTitle}>QUIZ ZONE</h1>
                    <p className="subtitle" style={styles.heroSubtitle}>
                        המקום שבו ידע הופך לציון. מוכנים לאתגר?
                    </p>
                    <button onClick={scrollToQuizzes} className="hero-btn" style={styles.heroBtn}>
                        גלו את החידונים ↓
                    </button>
                    
                    {userRole === 'admin' && (
                        <button 
                            onClick={() => navigate('/create-quiz')} 
                            className="admin-create-btn"
                            style={{ marginTop: '20px' }}
                        >
                            ⚡יצירת חידון חדש⚡
                        </button>
                    )}
                </div>
            </section>

            {/* --- אזור החידונים --- */}
            <div ref={quizGridRef} style={styles.gridContainer}>
                <h2 style={styles.sectionDivider}>החידונים שלנו</h2>
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
                                                onClick={() => openDeleteModal(quiz)} 
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
        </div>
    );
};

// --- סטיילים משלימים ---
const styles = {
    modalOverlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 3000,
        backdropFilter: 'blur(8px)'
    },
    modalContent: {
        maxWidth: '500px',
        padding: '40px',
        textAlign: 'center',
        border: '2px solid #ff4d4d',
        boxShadow: '0 0 30px rgba(255, 77, 77, 0.2)'
    },
    pageWrapper: {
        paddingTop: '0', 
    },
    heroSection: {
        height: '90vh', // תופס כמעט את כל גובה המסך
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'radial-gradient(circle, rgba(22,22,26,1) 0%, rgba(10,10,12,1) 100%)',
        borderBottom: '2px solid var(--neon-blue)',
    },
    heroContent: {
        textAlign: 'center',
        padding: '20px',
    },
    heroTitle: {
        fontSize: '5rem',
        marginBottom: '10px',
        letterSpacing: '5px',
    },
    heroSubtitle: {
        fontSize: '1.8rem',
        marginBottom: '40px',
        color: '#ccc',
    },
    heroBtn: {
        padding: '15px 40px',
        fontSize: '1.4rem',
        fontWeight: 'bold',
        backgroundColor: 'transparent',
        color: 'var(--neon-blue)',
        border: '3px solid var(--neon-blue)',
        borderRadius: '50px',
        cursor: 'pointer',
        transition: '0.3s ease',
        boxShadow: '0 0 15px rgba(64, 224, 208, 0.4)',
    },
    gridContainer: {
        padding: '80px 5%',
        minHeight: '100vh',
    },
    sectionDivider: {
        textAlign: 'center',
        color: 'white',
        fontSize: '2.5rem',
        marginBottom: '50px',
        textDecoration: 'underline var(--neon-blue)',
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