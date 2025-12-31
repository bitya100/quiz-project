const express = require('express');
const router = express.Router();
const Result = require('../models/Result');

// 1. שמירת תוצאה חדשה
router.post('/save', async (req, res) => {
    try {
        const { userId, quizId, quizTitle, score } = req.body;
        const newResult = new Result({ userId, quizId, quizTitle, score });
        await newResult.save();
        res.status(201).json({ message: "הציון נשמר בהצלחה!" });
    } catch (err) {
        res.status(400).json({ message: "שגיאה בשמירת הציון: " + err.message });
    }
});

// 2. קבלת כל הציונים של משתמש ספציפי
router.get('/user/:userId', async (req, res) => {
    try {
        const results = await Result.find({ userId: req.params.userId }).sort({ date: -1 });
        res.json(results);
    } catch (err) {
        res.status(500).json({ message: "שגיאה בקבלת הציונים" });
    }
});

module.exports = router;