const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');

// ייבוא ה-Middlewares להגנה
const { verifyToken, isAdmin } = require('../middlewares/auth');

// ניתובים פתוחים (צפייה בלבד)
router.get('/', quizController.getQuizzes);
router.get('/:id', quizController.getQuizById);

// ניתובים מוגנים למשתמשים רשומים בלבד (verifyToken)
router.post('/add', verifyToken, quizController.createQuiz);
router.put('/:id', verifyToken, quizController.updateQuiz);

// ניתוב מוגן למנהלים בלבד (isAdmin דורש קודם verifyToken)
router.delete('/:id', verifyToken, isAdmin, quizController.deleteQuiz);

module.exports = router;