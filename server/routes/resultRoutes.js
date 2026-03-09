const express = require('express');
const router = express.Router();
const Result = require('../models/Result');
const { User } = require('../models/User'); 
const auth = require('../middleware/auth'); 

// האימייל של מנהל העל - רק הוא מורשה למחוק!
const SUPER_ADMIN_EMAIL = "admin10@gmail.com"; 

// קבלת הציונים של המשתמש המחובר (פתוח לכל משתמש רגיל)
router.get('/my-scores', auth, async (req, res) => {
    try {
        const scores = await Result.find({ userId: req.user.userId }).sort({ date: -1 });
        res.json(scores);
    } catch (err) {
        res.status(500).send("שגיאת שרת");
    }
});

// שמירת תוצאה (פתוח לכל משתמש רגיל)
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

// ==========================================
// אזור מנהלים
// ==========================================

// 1. קבלת כל הציונים במערכת - פתוח לכל מנהל (רגיל או מנהל-על)
router.get('/all', auth, async (req, res) => {
    try {
        // אם המשתמש הוא לא מנהל בכלל, נחסום אותו
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: "גישה נדחתה: מנהלים בלבד" });
        }
        
        // מנהל (מכל סוג) יקבל את כל הנתונים
        const allScores = await Result.find()
            .populate('userId', 'userName email')
            .sort({ date: -1 });
            
        res.json(allScores);
    } catch (err) {
        res.status(500).send("שגיאת שרת משיכת כל הציונים");
    }
});

// 2. מחיקת ציון ספציפי - פתוח למנהל-על בלבד!
router.delete('/:id', auth, async (req, res) => {
    try {
        // מושכים את המשתמש מהמסד כדי לבדוק את האימייל האמיתי שלו
        const requestingUser = await User.findById(req.user.userId);
        
        // אם האימייל שלו לא תואם לאימייל של מנהל העל - חוסמים אותו!
        if (requestingUser.email !== SUPER_ADMIN_EMAIL) {
            return res.status(403).send("גישה נדחתה: רק מנהל-על מורשה למחוק ציונים");
        }

        // מחיקה בפועל (מתבצע רק אם עבר את הבדיקה למעלה)
        await Result.findByIdAndDelete(req.params.id);
        res.json({ message: "הציון נמחק בהצלחה" });
    } catch (err) {
        res.status(500).send("שגיאה במחיקת הציון");
    }
});

module.exports = router;