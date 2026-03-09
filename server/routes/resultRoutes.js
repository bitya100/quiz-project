const express = require('express');
const router = express.Router();
const Result = require('../models/Result');
const { User } = require('../models/User'); 
const auth = require('../middleware/auth'); 

const SUPER_ADMIN_EMAIL = "admin10@gmail.com"; 

// משיכת ציונים אישיים
router.get('/my-scores', auth, async (req, res) => {
    try {
        // התיקון: תומך גם בטוקנים ישנים (userId) וגם בחדשים (_id)
        const currentUserId = req.user._id || req.user.userId || req.user.id;
        
        const scores = await Result.find({ userId: currentUserId }).sort({ date: -1 });
        res.json(scores);
    } catch (err) {
        console.error("Error fetching my scores:", err);
        res.status(500).send("שגיאת שרת");
    }
});

// שמירת תוצאה
router.post('/save', auth, async (req, res) => {
    try {
        const { quizId, quizTitle, score, totalQuestions } = req.body;
        
        // התיקון הקריטי: שולפים את המזהה בכל צורה שהוא עשוי להגיע מהטוקן
        const currentUserId = req.user._id || req.user.userId || req.user.id;

        if (!currentUserId) {
            return res.status(400).json({ message: "שגיאה: לא תקין מזהה משתמש בטוקן" });
        }

        const newResult = new Result({
            userId: currentUserId,
            quizId,
            quizTitle,
            score,
            totalQuestions
        });
        
        await newResult.save();
        res.status(201).json(newResult);
    } catch (err) {
        console.error("Error saving result:", err);
        res.status(500).send("שגיאה בשמירה");
    }
});

// קבלת כל הציונים (למנהלים)
router.get('/all', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: "גישה נדחתה: מנהלים בלבד" });
        }
        const allScores = await Result.find()
            .populate('userId', 'userName email')
            .sort({ date: -1 });
        res.json(allScores);
    } catch (err) {
        res.status(500).send("שגיאת שרת");
    }
});

// מחיקת ציון 
router.delete('/:id', auth, async (req, res) => {
    try {
        // התיקון למחיקה מותאמת
        const currentUserId = req.user._id || req.user.userId || req.user.id;
        const user = await User.findById(currentUserId);
        
        if (!user || user.email !== SUPER_ADMIN_EMAIL) {
            return res.status(403).json({ message: "רק מנהל-על מורשה למחוק ציונים" });
        }

        const result = await Result.findByIdAndDelete(req.params.id);
        if (!result) {
            return res.status(404).json({ message: "הציון לא נמצא" });
        }
        
        res.json({ message: "הציון נמחק בהצלחה" });
    } catch (err) {
        console.error("Delete Error:", err);
        res.status(500).json({ message: "שגיאה במחיקה" });
    }
});

module.exports = router;