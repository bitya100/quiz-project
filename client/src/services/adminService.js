import api from './api';

const adminService = {
  getAllUsers: async () => {
    // התיקון הקריטי: הוספנו /all לנתיב!
    const response = await api.get('/users/all'); 
    return response.data;
  },
  
  deleteUser: async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },

  updateUserRole: async (id, role) => {
    const response = await api.put(`/users/${id}/role`, { role });
    return response.data;
  }
};

export default adminService;