const { User, validateUser } = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// --- פונקציית הרשמה ---
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
        return res.status(201).json({ message: 'נרשמת בהצלחה!' });
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
        const userId = req.user._id; // מגיע מה-middleware (הטוקן)

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
        // מוצאים את המשתמש ושולחים הכל חוץ מהסיסמה
        const user = await User.findById(req.user._id).select('-password');
        res.json(user);
    } catch (ex) {
        res.status(500).send('שגיאה בטעינת הפרופיל');
    }
};

// הייצוא המתוקן שכולל את כל הפונקציות
module.exports = { 
    register, 
    login, 
    saveQuizResult, 
    getProfile 
};