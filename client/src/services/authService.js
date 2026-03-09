import api from './api';

const API_URL = '/users'; // api.js כבר מכיל את ה- http://localhost:3001/api

const register = async (userData) => {
  // נשלח ל- http://localhost:3001/api/users/register
  const response = await api.post(`${API_URL}/register`, userData);
  return response.data;
};

const login = async (userData) => {
  // נשלח ל- http://localhost:3001/api/users/login
  const response = await api.post(`${API_URL}/login`, userData);
  return response.data;
};

const authService = {
  register,
  login,
};

export default authService;