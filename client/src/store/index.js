import { configureStore, createSlice } from "@reduxjs/toolkit";

// ניסיון לשלוף את המשתמש מהאחסון המקומי
const savedUser = JSON.parse(localStorage.getItem("user") || sessionStorage.getItem("user"));
const savedToken = localStorage.getItem("token") || sessionStorage.getItem("token");

// התיקון: אנחנו בודקים האם הנתונים שמורים כמו שצריך *עם אימייל*
// אם יש משתמש ישן בלי אימייל, אנחנו מתעלמים ממנו כדי לאלץ התחברות מחדש
const isValidUser = savedUser && savedUser.email; 

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: isValidUser ? savedUser : null,
    token: isValidUser ? savedToken : null,
    isAuthenticated: !!isValidUser,
  },
  reducers: {
    login: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
    },
  },
});

const quizzesSlice = createSlice({
  name: "quizzes",
  initialState: {
    list: [],
    loading: false,
  },
  reducers: {
    setQuizzes: (state, action) => {
      state.list = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    addQuizAction: (state, action) => {
      state.list.push(action.payload);
    },
    deleteQuizAction: (state, action) => {
      state.list = state.list.filter((quiz) => quiz._id !== action.payload);
    },
  },
});

export const { login, logout } = authSlice.actions;
export const { setQuizzes, setLoading, addQuizAction, deleteQuizAction } = quizzesSlice.actions;

const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    quizzes: quizzesSlice.reducer,
  },
});

export default store;