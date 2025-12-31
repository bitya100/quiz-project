import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useQuizzes } from '../context/QuizContext';

const Quizzes = () => {
    const { quizzes, loading, refreshQuizzes } = useQuizzes();
    const navigate = useNavigate();

    // שליפת נתונים מה-localStorage בתוך State כדי להבטיח רינדור נכון
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [userRole, setUserRole] = useState(localStorage.getItem('role'));

    useEffect(() => {
        // רענון הערכים מהאחסון המקומי בכל פעם שהקומפוננטה נטענת
        setToken(localStorage.getItem('token'));
        setUserRole(localStorage.getItem('role'));
    }, []);

    const deleteQuiz = async (id) => {
        if (window.confirm("האם את בטוחה שברצונך למחוק את החידון?")) {
            try {
                await axios.delete(`http://localhost:3001/api/quizzes/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                refreshQuizzes();
            } catch (err) {
                alert(err.response?.data?.message || "שגיאה במחיקת החידון");
            }
        }
    };

    if (loading) return (
        <div style={{ textAlign: 'center', marginTop: '100px' }}>
            <h2 style={{ color: '#34495e' }}>טוען חידונים...</h2>
        </div>
    );

    return (
        <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto', direction: 'rtl' }}>
            <h1 style={{ textAlign: 'center', color: '#2c3e50', marginBottom: '40px', fontSize: '32px' }}>החידונים שלנו</h1>
            
            {/* כפתור הוספה - מופיע רק אם המשתמש מחובר */}
            {token && (
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <button onClick={() => navigate('/create-quiz')} style={buttonStyle}>
                        צרי חידון חדש +
                    </button>
                </div>
            )}

            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '25px' }}>
                {quizzes.length === 0 ? (
                    <div style={{ textAlign: 'center', marginTop: '50px' }}>
                        <p>אין חידונים זמינים כרגע.</p>
                        {token && <button onClick={() => navigate('/create-quiz')} style={buttonStyle}>צרי את החידון הראשון!</button>}
                    </div>
                ) : (
                    quizzes.map(quiz => (
                        <div key={quiz._id} style={cardStyle}>
                            <div>
                                <h3 style={{ color: '#2c3e50', marginBottom: '10px' }}>{quiz.title}</h3>
                                <p style={{ color: '#7f8c8d', fontSize: '14px', lineHeight: '1.5', height: '42px', overflow: 'hidden' }}>
                                    {quiz.description}
                                </p>
                            </div>
                            <div style={{ marginTop: '20px', display: 'grid', gap: '10px' }}>
                                <button 
                                    onClick={() => navigate(`/quiz/${quiz._id}`)} 
                                    style={buttonStyle}
                                >
                                    התחל חידון 🚀
                                </button>

                                {/* בדיקה כפולה: האם ה-role הוא admin? */}
                                {userRole === 'admin' && (
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <button 
                                            onClick={() => navigate(`/edit-quiz/${quiz._id}`)} 
                                            style={{ ...smallButtonStyle, backgroundColor: '#f1c40f', color: '#000' }}
                                        >
                                            ערוך ✏️
                                        </button>
                                        <button 
                                            onClick={() => deleteQuiz(quiz._id)} 
                                            style={{ ...smallButtonStyle, backgroundColor: '#e74c3c', color: 'white' }}
                                        >
                                            מחק 🗑️
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

// --- Styles ---
const cardStyle = {
    backgroundColor: '#fff',
    borderRadius: '15px',
    padding: '25px',
    width: '300px',
    boxShadow: '0 10px 20px rgba(0,0,0,0.05)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    transition: 'transform 0.2s ease',
    textAlign: 'right'
};

const buttonStyle = {
    backgroundColor: '#2ecc71',
    color: 'white',
    border: 'none',
    padding: '12px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '16px',
    transition: 'background 0.3s'
};

const smallButtonStyle = {
    flex: 1,
    border: 'none',
    padding: '10px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '600'
};

export default Quizzes;