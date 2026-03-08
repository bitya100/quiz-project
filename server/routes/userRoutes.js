const express = require('express');
const router = express.Router();
const { User } = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); 
const auth = require('../middleware/auth');

const SUPER_ADMIN_EMAIL = "admin10@gmail.com"; 

// הרשמה
router.post('/register', async (req, res) => {
    try {
        const { userName, email, password } = req.body;
        
        let user = await User.findOne({ email: email.toLowerCase() });
        if (user) return res.status(400).send("משתמש עם אימייל זה כבר קיים");

        // התיקון כאן: בודקים אם זה האימייל של מנהל העל ומעניקים תפקיד בהתאם
        const assignedRole = email.toLowerCase() === SUPER_ADMIN_EMAIL ? 'admin' : 'user';

        user = new User({ userName, email: email.toLowerCase(), password, role: assignedRole });
        await user.save(); 

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

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send("אימייל או סיסמה שגויים");
        }

        // התיקון כאן (קריטי עבורך): שדרוג אוטומטי למנהל-על במידה וכבר נרשמת כמשתמש רגיל
        if (user.email === SUPER_ADMIN_EMAIL && user.role !== 'admin') {
            user.role = 'admin';
            await user.save(); // שומרים את השדרוג במסד הנתונים
        }

        const token = jwt.sign(
            { userId: user._id, userName: user.userName, role: user.role }, // user.role עכשיו מעודכן
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '7d' }
        );

        res.json({ token, userId: user._id, userName: user.userName, role: user.role });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// ... שאר הקוד של הראוטים נשאר בדיוק אותו דבר (all, delete, put) ...
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

// מחיקת משתמש (הגנה למנהל על בלבד!)
router.delete('/:id', auth, async (req, res) => {
    try {
        const requestingUser = await User.findById(req.user.userId);
        if (requestingUser.email !== SUPER_ADMIN_EMAIL) {
            return res.status(403).send("גישה נדחתה: רק מנהל-על מורשה למחוק משתמשים");
        }

        const userToDelete = await User.findById(req.params.id);
        if (userToDelete.email === SUPER_ADMIN_EMAIL) {
            return res.status(403).send("לא ניתן למחוק את מנהל העל");
        }

        await User.findByIdAndDelete(req.params.id);
        res.json({ message: "המשתמש נמחק בהצלחה" });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// עדכון תפקיד משתמש (פתוח לכל המנהלים, מוגן על מנהל העל)
router.put('/:id/role', auth, async (req, res) => {
    try {
        // מוודא שמי שמבקש לשנות הוא לפחות מנהל רגיל
        if (req.user.role !== 'admin') {
            return res.status(403).send("גישה נדחתה: מנהלים בלבד");
        }

        const userToUpdate = await User.findById(req.params.id);
        
        // מוודא שאף אחד (גם לא מנהל) לא יכול לשנות את ההרשאה של מנהל העל
        if (userToUpdate.email === SUPER_ADMIN_EMAIL) {
            return res.status(403).send("לא ניתן לשנות הרשאה למנהל העל");
        }

        userToUpdate.role = req.body.role;
        await userToUpdate.save();
        res.json(userToUpdate);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

module.exports = router;