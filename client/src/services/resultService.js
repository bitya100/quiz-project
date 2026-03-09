import api from './api';

const resultService = {
  saveResult: async (resultData) => {
    // api מטפל בהוספת ה-Token אוטומטית לכל בקשה
    const response = await api.post('/results/save', resultData);
    return response.data;
  },
  
  getMyScores: async () => {
    const response = await api.get('/results/my-scores');
    return response.data;
  },
  
  getAllScores: async () => {
    const response = await api.get('/results/all');
    return response.data;
  },
  
  deleteScore: async (id) => {
    const response = await api.delete(`/results/${id}`);
    return response.data;
  }
};

export default resultService;