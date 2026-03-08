import { configureStore, createSlice } from '@reduxjs/toolkit';

// פונקציית עזר למשיכת נתונים מכל סוגי האחסון הזמינים
const getInitialAuth = () => {
  const user = localStorage.getItem('user') || sessionStorage.getItem('user');
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  
  return {
    user: user ? JSON.parse(user) : null,
    token: token || null,
  };
};

const authSlice = createSlice({
  name: 'auth',
  initialState: getInitialAuth(),
  reducers: {
    login: (state, action) => {
      // כאן אנחנו מעדכנים רק את ה-State של Redux.
      // השמירה הפיזית ב-LocalStorage או ב-SessionStorage מתבצעת כבר ב-Login.jsx
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      // ניקוי יסודי של כל סוגי האחסון
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
    },
  },
});

const quizSlice = createSlice({
  name: 'quizzes',
  initialState: { list: [], loading: false },
  reducers: {
    setQuizzes: (state, action) => { state.list = action.payload; },
    setLoading: (state, action) => { state.loading = action.payload; },
    addQuiz: (state, action) => { state.list.push(action.payload); },
    updateQuiz: (state, action) => {
      const index = state.list.findIndex(q => q._id === action.payload._id);
      if (index !== -1) state.list[index] = action.payload;
    },
    deleteQuizAction: (state, action) => {
      state.list = state.list.filter(q => q._id !== action.payload);
    }
  },
});

export const { login, logout } = authSlice.actions;
export const { setQuizzes, setLoading, addQuiz, updateQuiz, deleteQuizAction } = quizSlice.actions;

export const store = configureStore({
  reducer: { auth: authSlice.reducer, quizzes: quizSlice.reducer },
});