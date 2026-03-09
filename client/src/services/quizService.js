import api from './api'; 

const getAllQuizzes = async () => {
  const response = await api.get('/quizzes'); 
  return response.data;
};

const getQuizById = async (id) => {
  const response = await api.get(`/quizzes/${id}`);
  return response.data;
};

const deleteQuiz = async (id) => {
  const response = await api.delete(`/quizzes/${id}`);
  return response.data;
};

export default { getAllQuizzes, getQuizById, deleteQuiz };