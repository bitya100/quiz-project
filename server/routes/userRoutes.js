const express = require('express');
const router = express.Router();
// ייבוא הקונטרולר - שימי לב שייבאנו את כל הפונקציות
const userController = require('../controllers/userController');
// ייבוא ה-Middleware של ה-Auth (כדי שנוכל להשתמש בזה בנתיבים מוגנים)
const auth = require('../middleware/auth'); 

// --- נתיבים ציבוריים ---
// הרשמה: /api/users/register
router.post('/register', userController.register);

// התחברות: /api/users/login
router.post('/login', userController.login);


// --- נתיבים מוגנים (דורשים Token) ---
// שמירת תוצאת חידון להיסטוריה
router.post('/save-result', auth, userController.saveQuizResult);

// קבלת נתוני הפרופיל וההיסטוריה
router.get('/profile', auth, userController.getProfile);

module.exports = router;