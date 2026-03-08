const express = require('express');
const router = express.Router();
const { User } = require('../models/User'); // התיקון הקריטי: הוספת סוגריים מסולסלים!
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); 
const auth = require('../middleware/auth');

// הרשמה
router.post('/register', async (req, res) => {
    try {
        const { userName, email, password } = req.body;
        
        let user = await User.findOne({ email: email.toLowerCase() });
        if (user) return res.status(400).send("משתמש עם אימייל זה כבר קיים");

        user = new User({ userName, email: email.toLowerCase(), password, role: 'user' });
        await user.save(); // ה-pre('save') שסידרנו במודל יצפין את הסיסמה כאן

        const token = jwt.sign(
            { userId: user._id, userName: user.userName, role: user.role },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '7d' }
        );

        res.status(201).json({ token, userId: user._id, userName: user.userName, role: user.role });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// התחברות
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(400).send("אימייל או סיסמה שגויים");
        }

        // השוואת הסיסמה המוצפנת
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send("אימייל או סיסמה שגויים");
        }

        const token = jwt.sign(
            { userId: user._id, userName: user.userName, role: user.role },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '7d' }
        );

        res.json({ token, userId: user._id, userName: user.userName, role: user.role });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// קבלת כל המשתמשים (מנהל בלבד)
router.get('/all', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).send("גישה נדחתה: מנהלים בלבד");
        }
        const users = await User.find().select('-password');
        res.json(users);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// מחיקת משתמש
router.delete('/:id', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).send("גישה נדחתה: מנהלים בלבד");
        }
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: "המשתמש נמחק בהצלחה" });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// עדכון תפקיד משתמש (מנהלים בלבד)
router.put('/:id/role', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).send("גישה נדחתה: מנהלים בלבד");
        }
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id, 
            { role: req.body.role }, 
            { new: true }
        ).select('-password');
        
        res.json(updatedUser);
    } catch (err) {
        res.status(500).send(err.message);
    }
});


module.exports = router;