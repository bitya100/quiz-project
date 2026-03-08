import { configureStore, createSlice } from '@reduxjs/toolkit';

// Slice לניהול המשתמש והתחברות
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
  },
  reducers: {
    login: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
  },
});

// Slice לניהול החידונים
const quizSlice = createSlice({
  name: 'quizzes',
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {
    setQuizzes: (state, action) => {
      state.list = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { login, logout } = authSlice.actions;
export const { setQuizzes, setLoading } = quizSlice.actions;

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    quizzes: quizSlice.reducer,
  },
});