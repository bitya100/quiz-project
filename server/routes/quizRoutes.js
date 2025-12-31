const express = require('express');
const router = express.Router();
const Quiz = require('../models/Quiz'); // ודאי שהקובץ Models/Quiz.js קיים

// 1. קבלת כל החידונים (עבור דף הרשימה)
router.get('/', async (req, res) => {
    try {
        const quizzes = await Quiz.find();
        res.json(quizzes);
    } catch (err) {
        res.status(500).json({ message: "שגיאה בקבלת רשימת החידונים: " + err.message });
    }
});

// 2. קבלת חידון בודד לפי ה-ID שלו (עבור דף פתרון החידון)
router.get('/:id', async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id);
        if (!quiz) {
            return res.status(404).json({ message: "החידון המבוקש לא נמצא" });
        }
        res.json(quiz);
    } catch (err) {
        // שגיאה בפורמט של ה-ID או שגיאת שרת אחרת
        res.status(500).json({ message: "שגיאה בטעינת החידון הספציפי: " + err.message });
    }
});

module.exports = router;