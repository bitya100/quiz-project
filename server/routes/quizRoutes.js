const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const validate = require('../middleware/validator');
const { quizValidationSchema } = require('../models/Quiz');
const quizController = require('../controllers/quizController'); // מחברים את הקונטרולר

// קבלת כל החידונים וחידון בודד
router.get('/', quizController.getAllQuizzes);
router.get('/:id', quizController.getQuizById);

// יצירת חידון חדש - מוגן ע"י אימות משתמש (auth) ובדיקת תקינות נתונים (validate)
router.post('/', auth, validate(quizValidationSchema), quizController.createQuiz);

// עריכת חידון קיים - מוגן
router.put('/:id', auth, validate(quizValidationSchema), quizController.updateQuiz);

// מחיקת חידון - מוגן
router.delete('/:id', auth, quizController.deleteQuiz);

module.exports = router;