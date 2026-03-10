import axios from 'axios';

// משתנה חכם: ימשוך את הכתובת מנטליפי, ואם אין (במחשב המקומי) ישתמש בכתובת המקומית מה-.env
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: apiUrl
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