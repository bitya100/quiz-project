const { User, validateUser } = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// --- פונקציית הרשמה מתוקנת (כוללת החזרת נתונים לחיבור אוטומטי) ---
const register = async (req, res) => {
    try {
        const { error } = validateUser(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        let user = await User.findOne({ email: req.body.email.toLowerCase() });
        if (user) return res.status(400).send('משתמש כבר רשום במערכת');

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        const newUser = new User({
            userName: req.body.userName,
            email: req.body.email.toLowerCase(),
            password: hashedPassword,
            role: 'user' 
        });

        await newUser.save();

        // יצירת טוקן מיד לאחר ההרשמה
        const token = jwt.sign(
            { _id: newUser._id, role: newUser.role }, 
            process.env.JWT_SECRET || 'fallback_secret'
        );

        // שליחת כל הנתונים הנדרשים ל-Frontend
        return res.status(201).json({ 
            message: 'נרשמת בהצלחה!',
            token: token,
            role: newUser.role,
            userId: newUser._id,
            userName: newUser.userName 
        });
    } catch (ex) {
        return res.status(500).send('שגיאת שרת פנימית');
    }
};

// --- פונקציית התחברות ---
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) return res.status(400).send('אימייל או סיסמה שגויים');

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(400).send('אימייל או סיסמה שגויים');

        const token = jwt.sign(
            { _id: user._id, role: user.role }, 
            process.env.JWT_SECRET || 'fallback_secret'
        );

        res.json({ 
            token: token, 
            role: user.role, 
            userId: user._id, 
            userName: user.userName 
        });
    } catch (ex) {
        res.status(500).send('שגיאה בתהליך ההתחברות');
    }
};

// --- שמירת תוצאת חידון (היסטוריה) ---
const saveQuizResult = async (req, res) => {
    try {
        const { quizTitle, score, totalQuestions } = req.body;
        const userId = req.user._id;

        const user = await User.findById(userId);
        if (!user) return res.status(404).send('משתמש לא נמצא');

        user.quizHistory.push({
            quizTitle,
            score,
            totalQuestions
        });

        await user.save();
        res.status(200).send('התוצאה נשמרה בהצלחה');
    } catch (ex) {
        res.status(500).send('שגיאה בשמירת התוצאה');
    }
};

// --- קבלת נתוני פרופיל והיסטוריה ---
const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        res.json(user);
    } catch (ex) {
        res.status(500).send('שגיאה בטעינת הפרופיל');
    }
};

// --- קבלת כל המשתמשים (למנהל בלבד) ---
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (ex) {
        res.status(500).send('שגיאה בטעינת רשימת המשתמשים');
    }
};

// הייצוא הכולל
module.exports = { 
    register, 
    login, 
    saveQuizResult, 
    getProfile,
    getAllUsers 
};