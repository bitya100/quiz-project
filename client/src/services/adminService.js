import api from './api';

const adminService = {
  getAllUsers: async () => {
    const response = await api.get('/users'); 
    return response.data;
  },
  
  deleteUser: async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  }
};

export default adminService;