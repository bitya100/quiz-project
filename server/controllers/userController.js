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

        const token = jwt.sign(
            { _id: newUser._id, role: newUser.role }, 
            process.env.JWT_SECRET || 'fallback_secret'
        );

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

// --- עדכון תפקיד משתמש (למנהל בלבד + הגנה על המנהל האחרון) ---
const updateUserRole = async (req, res) => {
    try {
        const userIdToUpdate = req.params.id;
        const { role } = req.body; // 'admin' או 'user'

        // 1. אם מנסים להסיר הרשאת מנהל (להפוך ל-user)
        if (role === 'user') {
            const adminCount = await User.countDocuments({ role: 'admin' });
            const userToUpdate = await User.findById(userIdToUpdate);

            // בדיקה אם זה המנהל האחרון במערכת
            if (userToUpdate.role === 'admin' && adminCount <= 1) {
                return res.status(400).send('לא ניתן להסיר את המנהל האחרון במערכת. חייב להישאר לפחות מנהל אחד.');
            }
        }

        // 2. ביצוע העדכון
        const updatedUser = await User.findByIdAndUpdate(
            userIdToUpdate, 
            { role: role }, 
            { new: true }
        ).select('-password');

        if (!updatedUser) return res.status(404).send('משתמש לא נמצא');
        
        res.json({ message: `המשתמש ${updatedUser.userName} הוא כעת ${role}`, user: updatedUser });
    } catch (ex) {
        res.status(500).send('שגיאה בעדכון התפקיד');
    }
};

module.exports = { 
    register, 
    login, 
    saveQuizResult, 
    getProfile,
    getAllUsers,
    updateUserRole 
};