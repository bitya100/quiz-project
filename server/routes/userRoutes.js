const express = require('express');
const router = express.Router();
// ייבוא הקונטרולר
const userController = require('../controllers/userController');
// התיקון הקריטי: ייבוא באמצעות Destructuring (סוגריים מסולסלים)
const { auth, adminOnly } = require('../middleware/auth'); 

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

// בונוס לדרישות הפרויקט: נתיב למנהל בלבד לצפייה בכל המשתמשים
router.get('/all', auth, adminOnly, userController.getAllUsers);

// בונוס נוסף: נתיב למנהל בלבד לקידום משתמש למנהל
router.put('/make-admin/:id', auth, adminOnly, userController.makeAdmin);

module.exports = router;