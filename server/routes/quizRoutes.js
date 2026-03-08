const express = require('express');
const router = express.Router();
const Quiz = require('../models/Quiz');
const auth = require('../middleware/auth');

// קבלת כל החידונים
router.get('/', async (req, res) => {
    try {
        const quizzes = await Quiz.find();
        res.json(quizzes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// קבלת חידון לפי ID
router.get('/:id', async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id);
        if (!quiz) return res.status(404).json({ message: 'חידון לא נמצא' });
        res.json(quiz);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// יצירת חידון חדש
router.post('/', auth, async (req, res) => {
    const quiz = new Quiz({
        title: req.body.title,
        description: req.body.description,
        category: req.body.category,
        questions: req.body.questions,
        creator: req.user.userId 
    });

    try {
        const newQuiz = await quiz.save();
        res.status(201).json(newQuiz);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// עריכת חידון קיים - התווסף!
router.put('/:id', auth, async (req, res) => {
    try {
        const updatedQuiz = await Quiz.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true } // מחזיר את המסמך המעודכן
        );
        if (!updatedQuiz) return res.status(404).json({ message: "החידון לא נמצא" });
        res.json(updatedQuiz);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// מחיקת חידון
router.delete('/:id', auth, async (req, res) => {
    try {
        await Quiz.findByIdAndDelete(req.params.id);
        res.json({ message: 'החידון נמחק בהצלחה' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;