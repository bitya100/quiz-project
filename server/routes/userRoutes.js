const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const validate = require('../middleware/validator'); // ייבוא ה-Middleware שיצרת
const { userValidationSchema } = require('../models/User'); // ייבוא הסכמה
const userController = require('../controllers/userController');

// הרשמה והתחברות
router.post('/register', validate(userValidationSchema), userController.register);
router.post('/login', userController.login);

// 🔥 ראוטים חדשים לשחזור ואיפוס סיסמה
router.post('/forgot-password', userController.forgotPassword);
router.post('/reset-password', userController.resetPassword);

// קבלת הפרופיל האישי של המשתמש 
router.get('/profile', auth, userController.getProfile);

// ראוט חדש: בקשה להפוך ליוצר תוכן (משתמש חייב להיות מחובר)
router.post('/request-creator', auth, userController.requestCreator);

// ניהול משתמשים 
router.get('/all', auth, userController.getAllUsers);
router.put('/:id/role', auth, userController.updateUserRole);
router.delete('/:id', auth, userController.deleteUser);

module.exports = router;