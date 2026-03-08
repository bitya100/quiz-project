const express = require('express');
const router = express.Router();
const Result = require('../models/Result');
const { User } = require('../models/User');
const { auth, adminOnly } = require('../middleware/auth');

router.post('/save', auth, async (req, res) => {
    try {
        const { quizId, quizTitle, score, totalQuestions } = req.body;
        
        // הוספנו totalQuestions גם כאן כדי שהמנהל יראה את הנתון המלא
        const newResult = new Result({ 
            userId: req.user._id, 
            quizId, 
            quizTitle, 
            score,
            totalQuestions // וודא שגם ב-Result.js הוספת את השדה הזה
        });
        await newResult.save();

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

        res.status(201).json({ message: "הציון נשמר בהצלחה!" });
    } catch (err) {
        res.status(400).json({ message: "שגיאה בשמירת הציון: " + err.message });
    }
});

router.get('/my-scores', auth, async (req, res) => {
    try {
        const results = await Result.find({ userId: req.user._id }).sort({ date: -1 });
        res.json(results);
    } catch (err) {
        res.status(500).json({ message: "שגיאה בקבלת הציונים" });
    }
});

router.get('/admin/all', auth, adminOnly, async (req, res) => {
    try {
        const results = await Result.find()
            .populate('userId', 'userName email') // הוספתי אימייל כדי שהמנהל יזהה משתמשים בקלות
            .sort({ date: -1 });
        res.json(results);
    } catch (err) {
        res.status(500).json({ message: "שגיאה בקבלת נתוני מנהל" });
    }
});

module.exports = router;