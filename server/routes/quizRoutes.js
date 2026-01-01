const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const auth = require('../middleware/auth'); 

// --- נתיבים ציבוריים (נגישים לכולם) ---

// קבלת רשימת כל החידונים
router.get('/', quizController.getAllQuizzes);

// קבלת חידון ספציפי למשחק
router.get('/:id', quizController.getQuizById);


// --- נתיבים מוגנים (דורשים Token ובדיקת מנהל בתוך הקונטרולר) ---

// יצירת חידון חדש
router.post('/', auth, quizController.createQuiz);

// עדכון חידון קיים
router.put('/:id', auth, quizController.updateQuiz);

// מחיקת חידון
router.delete('/:id', auth, quizController.deleteQuiz);

module.exports = router;