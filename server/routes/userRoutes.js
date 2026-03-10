const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const userController = require('../controllers/userController'); // מייבאים את כל הפונקציות

// הרשמה והתחברות (פתוח לכולם)
router.post('/register', userController.register);
router.post('/login', userController.login);

// קבלת הפרופיל האישי של המשתמש (חייב להיות מחובר - דרוש auth)
router.get('/profile', auth, userController.getProfile);

// ניהול משתמשים (ההרשאות נבדקות בתוך הקונטרולר)
router.get('/all', auth, userController.getAllUsers);
router.put('/:id/role', auth, userController.updateUserRole);
router.delete('/:id', auth, userController.deleteUser);

module.exports = router;