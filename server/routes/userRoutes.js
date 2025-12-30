const express = require('express');
const router = express.Router();
// ייבוא ישיר של הפונקציות בתוך סוגריים מסולסלים
const { register, login } = require('../controllers/userController'); 

// עכשיו הראוטר משתמש ישירות בפונקציה
router.post('/register', register);
router.post('/login', login);

module.exports = router;