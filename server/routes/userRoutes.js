const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { auth, adminOnly } = require('../middleware/auth'); 

// --- נתיבים ציבוריים ---
router.post('/register', userController.register);
router.post('/login', userController.login);

// --- נתיבים מוגנים (דורשים Token) ---
router.post('/save-result', auth, userController.saveQuizResult);
router.get('/profile', auth, userController.getProfile);

// --- נתיבי ניהול (מנהל בלבד) ---
// קבלת רשימת כל המשתמשים
router.get('/all', auth, adminOnly, userController.getAllUsers);

// עדכון תפקיד (הפוך למנהל או החזר למשתמש)
router.put('/update-role/:id', auth, adminOnly, userController.updateUserRole);

module.exports = router;