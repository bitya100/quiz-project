import api from './api';

const API_URL = '/users'; // api.js כבר מכיל את ה- baseURL המעודכן

const register = async (userData) => {
  const response = await api.post(`${API_URL}/register`, userData);
  return response.data;
};

const login = async (userData) => {
  const response = await api.post(`${API_URL}/login`, userData);
  return response.data;
};

// תוספת: פונקציה לשליחת בקשת מייל לאיפוס סיסמה
const forgotPassword = async (email) => {
  const response = await api.post(`${API_URL}/forgot-password`, { email });
  return response.data;
};

// תוספת: פונקציה לביצוע איפוס הסיסמה בפועל עם הטוקן
const resetPassword = async (token, password) => {
  const response = await api.post(`${API_URL}/reset-password`, { token, password });
  return response.data;
};

const authService = {
  register,
  login,
  forgotPassword, // הוספנו לאובייקט המיוצא
  resetPassword,  // הוספנו לאובייקט המיוצא
};

export default authService;