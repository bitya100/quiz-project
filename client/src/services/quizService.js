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

// פונקציה חדשה להעלאת תמונה ישירות לקלאודינארי מהדפדפן
const uploadImageToCloudinary = async (file) => {
  const CLOUD_NAME = "YOUR_CLOUD_NAME"; // <-- להחליף בשם הענן שלך
  const UPLOAD_PRESET = "quiz_preset";   // שם ה-Preset ה-Unsigned שיצרת

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  try {
    const response = await fetch(`https://api.cloudinary.com/v1_1/${dtxm5hz1m}/image/upload`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) throw new Error("העלאת התמונה נכשלה");

    const data = await response.json();
    
    // מחזיר את הקישור הקבוע עם אופטימיזציה אוטומטית (f_auto, q_auto) לטעינה מהירה
    return data.secure_url.replace("/upload/", "/upload/f_auto,q_auto/");
  } catch (error) {
    console.error("Cloudinary Error:", error);
    throw error;
  }
};

export default { getAllQuizzes, getQuizById, deleteQuiz, uploadImageToCloudinary };