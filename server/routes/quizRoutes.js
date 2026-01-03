const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
// התיקון הקריטי: ייבוא של auth ו-adminOnly מתוך האובייקט המיוצא
const { auth, adminOnly } = require('../middleware/auth'); 

// --- נתיבים ציבוריים (נגישים לכולם - גם לאורחים) ---

// קבלת רשימת כל החידונים
router.get('/', quizController.getAllQuizzes);

// קבלת חידון ספציפי למשחק
router.get('/:id', quizController.getQuizById);


// --- נתיבים מוגנים (מנהל בלבד - Admin Only) ---
// לפי דרישות הפרויקט, רק מנהל יכול לבצע פעולות CRUD של יצירה, עריכה ומחיקה

// יצירת חידון חדש
router.post('/', auth, adminOnly, quizController.createQuiz);

// עדכון חידון קיים
router.put('/:id', auth, adminOnly, quizController.updateQuiz);

// מחיקת חידון
router.delete('/:id', auth, adminOnly, quizController.deleteQuiz);

module.exports = router;