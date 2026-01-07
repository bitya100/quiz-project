const express = require('express');
const router = express.Router();
const Result = require('../models/Result');
const { auth, adminOnly } = require('../middleware/auth');

// 1. שמירת תוצאה חדשה - רק למשתמש מחובר
router.post('/save', auth, async (req, res) => {
    try {
        const { quizId, quizTitle, score } = req.body;
        const newResult = new Result({ 
            userId: req.user._id, 
            quizId, 
            quizTitle, 
            score 
        });
        await newResult.save();
        res.status(201).json({ message: "הציון נשמר בהצלחה!" });
    } catch (err) {
        res.status(400).json({ message: "שגיאה בשמירת הציון: " + err.message });
    }
});

// 2. קבלת ציונים אישיים - למשתמש המחובר בלבד
router.get('/my-scores', auth, async (req, res) => {
    try {
        const results = await Result.find({ userId: req.user._id }).sort({ date: -1 });
        res.json(results);
    } catch (err) {
        res.status(500).json({ message: "שגיאה בקבלת הציונים" });
    }
});

// 3. מנהל בלבד: קבלת כל הציונים עם שמות המשתמשים 
router.get('/admin/all', auth, adminOnly, async (req, res) => {
    try {
        // כאן הוספנו את ה-populate כדי לקבל את שם המשתמש מה-ID
        const results = await Result.find()
            .populate('userId', 'userName') 
            .sort({ date: -1 });
        res.json(results);
    } catch (err) {
        res.status(500).json({ message: "שגיאה בקבלת נתוני מנהל" });
    }
});

module.exports = router;