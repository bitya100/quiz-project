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

const authService = {
  register,
  login,
};

export default authService;