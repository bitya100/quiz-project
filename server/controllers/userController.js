const { User, validateUser } = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// --- פונקציית הרשמה ---
const register = async (req, res) => {
    try {
        // 1. וולידציה של הקלט
        const { error } = validateUser(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        // 2. בדיקה אם המשתמש קיים
        let user = await User.findOne({ email: req.body.email.toLowerCase() });
        if (user) return res.status(400).send('משתמש כבר רשום במערכת');

        // 3. יצירת משתמש חדש
        // שים לב: אנחנו לא מצפינים כאן ידנית! 
        // ה-pre('save') במודל User.js יטפל בהצפנה אוטומטית.
        const newUser = new User({
            userName: req.body.userName,
            email: req.body.email.toLowerCase(),
            password: req.body.password, 
            role: 'user' 
        });

        await newUser.save();

        // 4. יצירת טוקן
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
        console.error("Register Error Details:", ex); // מדפיס את השגיאה לטרמינל של השרת
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
        console.error("Login Error Details:", ex);
        res.status(500).send('שגיאה בתהליך ההתחברות');
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

// --- עדכון תפקיד משתמש ---
const updateUserRole = async (req, res) => {
    try {
        const userIdToUpdate = req.params.id;
        const { role } = req.body;

        if (role === 'user') {
            const adminCount = await User.countDocuments({ role: 'admin' });
            const userToUpdate = await User.findById(userIdToUpdate);
            if (userToUpdate.role === 'admin' && adminCount <= 1) {
                return res.status(400).send('לא ניתן להסיר את המנהל האחרון במערכת.');
            }
        }

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
    getProfile,
    getAllUsers,
    updateUserRole 
};