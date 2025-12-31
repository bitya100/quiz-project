const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/userController');

// הנתיב המלא יהיה /api/users/register
router.post('/register', register);

// הנתיב המלא יהיה /api/users/login
router.post('/login', login);

module.exports = router;