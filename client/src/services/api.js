import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api'
});

// מטפל בשליחת הטוקן לשרת בכל בקשה
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// מטפל בתשובות שחוזרות מהשרת (כאן אנחנו תופסים את חסימת השבת)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 503) {
      // אם השרת מחזיר 503, מעבירים בכוח את המשתמש לדף השבת
      window.location.href = '/shabbat';
    }
    return Promise.reject(error);
  }
);

export default api;