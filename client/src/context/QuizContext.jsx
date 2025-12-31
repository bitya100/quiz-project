import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const QuizContext = createContext();

// --- הגדרת Axios Interceptor מקצועי ---
// זהו "מאבטח" שרץ לפני כל בקשת HTTP שנשלחת מהאפליקציה
axios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            // אם נמצא טוקן, הוסף אותו ל-Headers תחת המוסכמה של Bearer
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const QuizProvider = ({ children }) => {
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchQuizzes = async () => {
        setLoading(true);
        try {
            // שימי לב: עכשיו אין צורך להוסיף Headers כאן, ה-Interceptor דואג לזה!
            const res = await axios.get('http://localhost:3001/api/quizzes');
            setQuizzes(res.data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching quizzes:", err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuizzes();
    }, []);

    return (
        <QuizContext.Provider value={{ quizzes, loading, refreshQuizzes: fetchQuizzes }}>
            {children}
        </QuizContext.Provider>
    );
};

export const useQuizzes = () => useContext(QuizContext);