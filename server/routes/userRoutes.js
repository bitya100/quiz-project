const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const userController = require('../controllers/userController');

// הרשמה והתחברות (פתוח לכולם)
router.post('/register', userController.register);
router.post('/login', userController.login);

// קבלת הפרופיל האישי של המשתמש 
router.get('/profile', auth, userController.getProfile);

// ראוט חדש: בקשה להפוך ליוצר תוכן (משתמש חייב להיות מחובר)
router.post('/request-creator', auth, userController.requestCreator);

// ניהול משתמשים 
router.get('/all', auth, userController.getAllUsers);
router.put('/:id/role', auth, userController.updateUserRole);
router.delete('/:id', auth, userController.deleteUser);

module.exports = router;