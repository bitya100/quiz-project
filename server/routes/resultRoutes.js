const express = require('express');
const router = express.Router();
const Result = require('../models/Result');
const { User } = require('../models/User'); // הוספנו את המודל של המשתמש
const { auth, adminOnly } = require('../middleware/auth');

// 1. שמירת תוצאה - מעדכן גם את טבלת התוצאות וגם את המשתמש עצמו
router.post('/save', auth, async (req, res) => {
    try {
        const { quizId, quizTitle, score, totalQuestions } = req.body;
        
        // א. שמירה בטבלת התוצאות הכללית (עבור המנהל)
        const newResult = new Result({ 
            userId: req.user._id, 
            quizId, 
            quizTitle, 
            score 
        });
        await newResult.save();

        // ב. שמירה בתוך ה-User (עבור הפרופיל/היסטוריה)
        await User.findByIdAndUpdate(req.user._id, {
            $push: {
                quizHistory: {
                    quizTitle,
                    score,
                    totalQuestions,
                    date: new Date()
                }
            }
        });

        res.status(201).json({ message: "הציון נשמר בהצלחה בכל המערכות!" });
    } catch (err) {
        res.status(400).json({ message: "שגיאה בשמירת הציון: " + err.message });
    }
});

// 2. קבלת ציונים אישיים
router.get('/my-scores', auth, async (req, res) => {
    try {
        const results = await Result.find({ userId: req.user._id }).sort({ date: -1 });
        res.json(results);
    } catch (err) {
        res.status(500).json({ message: "שגיאה בקבלת הציונים" });
    }
});

// 3. מנהל בלבד: קבלת כל הציונים
router.get('/admin/all', auth, adminOnly, async (req, res) => {
    try {
        const results = await Result.find()
            .populate('userId', 'userName') 
            .sort({ date: -1 });
        res.json(results);
    } catch (err) {
        res.status(500).json({ message: "שגיאה בקבלת נתוני מנהל" });
    }
});

module.exports = router;