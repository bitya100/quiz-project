const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { auth, adminOnly } = require('../middleware/auth'); 

// --- נתיבים ציבוריים ---
router.post('/register', userController.register);
router.post('/login', userController.login);

// --- נתיבים מוגנים ---
router.get('/profile', auth, userController.getProfile);

// --- נתיבי ניהול ---
router.get('/all', auth, adminOnly, userController.getAllUsers);
router.put('/update-role/:id', auth, adminOnly, userController.updateUserRole);

module.exports = router;