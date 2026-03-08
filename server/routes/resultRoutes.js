const express = require('express');
const router = express.Router();
const Result = require('../models/Result');
const auth = require('../middleware/auth'); 

// קבלת הציונים של המשתמש המחובר
router.get('/my-scores', auth, async (req, res) => {
    try {
        const scores = await Result.find({ userId: req.user.userId }).sort({ date: -1 });
        res.json(scores);
    } catch (err) {
        res.status(500).send("שגיאת שרת");
    }
});

// שמירת תוצאה
router.post('/save', auth, async (req, res) => {
    try {
        const { quizId, quizTitle, score, totalQuestions } = req.body;
        const newResult = new Result({
            userId: req.user.userId,
            quizId,
            quizTitle,
            score,
            totalQuestions
        });
        await newResult.save();
        res.status(201).json(newResult);
    } catch (err) {
        res.status(500).send("שגיאה בשמירה");
    }
});

// קבלת כל הציונים במערכת (מנהל בלבד) - התווסף!
router.get('/admin/all', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: "גישה נדחתה" });
        }
        
        // ה-populate מושך את שם המשתמש מתוך טבלת Users כדי שנוכל להציג אותו
        const allScores = await Result.find()
            .populate('userId', 'userName email')
            .sort({ date: -1 });
            
        res.json(allScores);
    } catch (err) {
        res.status(500).send("שגיאת שרת משיכת כל הציונים");
    }
});

module.exports = router;