const { User, validateUser } = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
    try {
        const { error } = validateUser(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        let user = await User.findOne({ email: req.body.email.toLowerCase() });
        if (user) return res.status(400).send('משתמש כבר רשום במערכת');

        const newUser = new User({
            userName: req.body.userName,
            email: req.body.email.toLowerCase(),
            password: req.body.password, 
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
            userName: newUser.userName,
            email: newUser.email // <-- הוספנו את המייל למען אבטחה
        });
    } catch (ex) {
        console.error("Register Error Details:", ex);
        return res.status(500).send(ex.message || 'שגיאת שרת פנימית');
    }
};

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
            userName: user.userName,
            email: user.email // <-- הוספנו את המייל למען אבטחה
        });
    } catch (ex) {
        console.error("Login Error Details:", ex);
        res.status(500).send(ex.message || 'שגיאה בתהליך ההתחברות');
    }
};

const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        res.json(user);
    } catch (ex) {
        res.status(500).send('שגיאה בטעינת הפרופיל');
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (ex) {
        res.status(500).send('שגיאה בטעינת רשימת המשתמשים');
    }
};

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