import api from './api';

const saveResult = async (resultData) => {
  const response = await api.post('/results/save', resultData);
  return response.data;
};

const getMyScores = async () => {
  try {
    const response = await api.get('/results/my-scores');
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Error fetching scores:", error);
    return [];
  }
};

export default { saveResult, getMyScores };