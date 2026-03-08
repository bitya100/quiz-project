import axios from 'axios';

const API_URL = 'http://localhost:3001/api/users'; // נתיב המשתמשים

const getAllUsers = async () => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${API_URL}/all`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// התווסף - פונקציה למחיקת משתמש
const deleteUser = async (userId) => {
  const token = localStorage.getItem('token');
  const response = await axios.delete(`${API_URL}/${userId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

const adminService = { getAllUsers, deleteUser };
export default adminService;