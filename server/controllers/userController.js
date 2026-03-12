const { User } = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SUPER_ADMIN_EMAIL = "admin10@gmail.com"; 

const register = async (req, res) => {
    try {
        let user = await User.findOne({ email: req.body.email.toLowerCase() });
        if (user) return res.status(400).send('משתמש כבר רשום במערכת');

        const assignedRole = req.body.email.toLowerCase() === SUPER_ADMIN_EMAIL ? 'admin' : 'user';

        const newUser = new User({
            userName: req.body.userName,
            email: req.body.email.toLowerCase(),
            password: req.body.password, 
            role: assignedRole 
        });

        await newUser.save();

        const token = jwt.sign(
            { _id: newUser._id, userId: newUser._id, role: newUser.role, userName: newUser.userName }, 
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '7d' }
        );

        return res.status(201).json({ 
            message: 'נרשמת בהצלחה!',
            token: token,
            role: newUser.role,
            userId: newUser._id,
            userName: newUser.userName,
            email: newUser.email 
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

        // קידום אוטומטי של מנהל העל (משתמשים ב-updateOne כדי למנוע קריסות של save)
        if (user.email === SUPER_ADMIN_EMAIL && user.role !== 'admin') {
            await User.updateOne({ _id: user._id }, { role: 'admin' });
            user.role = 'admin';
        }

        const token = jwt.sign(
            { _id: user._id, userId: user._id, role: user.role, userName: user.userName }, 
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '7d' }
        );

        res.json({ token: token, role: user.role, userId: user._id, userName: user.userName, email: user.email });
    } catch (ex) { 
        console.error("Login Error:", ex);
        res.status(500).send(ex.message || 'שגיאה בתהליך ההתחברות'); 
    }
};

const getProfile = async (req, res) => {
    try {
        const currentUserId = req.user._id || req.user.userId;
        const user = await User.findById(currentUserId).select('-password');
        if (!user) return res.status(404).send('משתמש לא נמצא');

        const freshToken = jwt.sign( 
            { _id: user._id, userId: user._id, role: user.role, userName: user.userName }, 
            process.env.JWT_SECRET || 'secret', 
            { expiresIn: '7d' } 
        );

        const userResponse = user.toObject();
        userResponse.token = freshToken; 
        res.json(userResponse);
    } catch (ex) { res.status(500).send('שגיאה בטעינת הפרופיל'); }
};

const requestCreator = async (req, res) => {
    try {
        const currentUserId = req.user._id || req.user.userId;
        const updatedUser = await User.findByIdAndUpdate(currentUserId, { requestedCreator: true }, { new: true });
        if (!updatedUser) return res.status(404).send('משתמש לא נמצא');
        res.status(200).json({ message: "בקשתך נשלחה להנהלה!" });
    } catch (ex) { res.status(500).send('שגיאה בשליחת הבקשה'); }
};

const getAllUsers = async (req, res) => {
    try {
        if (req.user.role !== 'admin') return res.status(403).send("גישה נדחתה: מנהלים בלבד");
        const users = await User.find().select('-password');
        res.json(users);
    } catch (ex) { res.status(500).send('שגיאה בטעינת רשימת המשתמשים'); }
};

const updateUserRole = async (req, res) => {
    try {
        // 1. הגנת מנהלים כללית
        if (req.user.role !== 'admin') return res.status(403).send("גישה נדחתה: מנהלים בלבד");
        
        // 2. זיהוי המשתמש המבצע
        const currentUserId = req.user._id || req.user.userId;
        const requestingUser = await User.findById(currentUserId);
        
        // הגנה מקריסה: אם המשתמש המבצע לא קיים יותר במסד (נמחק)
        if (!requestingUser) return res.status(401).send("המשתמש המבצע לא קיים במערכת");

        const isSuperAdmin = requestingUser.email === SUPER_ADMIN_EMAIL;
        
        // 3. זיהוי המשתמש שרוצים לעדכן
        const userIdToUpdate = req.params.id;
        const { role } = req.body;
        const userToUpdate = await User.findById(userIdToUpdate);
        
        if (!userToUpdate) return res.status(404).send('המשתמש לעדכון לא נמצא');

        // 4. הגנה על מנהל העל
        if (userToUpdate.email === SUPER_ADMIN_EMAIL) {
            return res.status(403).send("לא ניתן לשנות הרשאה למנהל העל");
        }

        // 5. לוגיקת הרשאות אישור
        if (role === 'admin' && userToUpdate.role !== 'admin' && userToUpdate.requestedCreator !== true && !isSuperAdmin) {
            return res.status(400).send('לא ניתן למנות למנהל משתמש שלא הגיש בקשה לכך במערכת.');
        }

        if (role === 'user') {
            const adminCount = await User.countDocuments({ role: 'admin' });
            if (userToUpdate.role === 'admin' && adminCount <= 1) {
                return res.status(400).send('לא ניתן להסיר את המנהל האחרון במערכת.');
            }
        }

        // 6. התיקון הקריטי: עדכון ישיר ובטוח מול המסד ללא שימוש ב-save()
        const updatedUser = await User.findByIdAndUpdate(
            userIdToUpdate,
            { role: role, requestedCreator: false },
            { new: true } // מבקש ממונגו להחזיר את האובייקט *אחרי* העדכון
        );
        
        res.json({ message: `המשתמש ${updatedUser.userName} הוא כעת ${role}`, user: updatedUser });
    } catch (ex) { 
        console.error("🔥 Error updating user role:", ex);
        // מחזיר את הודעת השגיאה המדויקת למקרה שיש תקלה אחרת כדי שיהיה קל לדבג
        res.status(500).send(`שגיאה פנימית בעדכון תפקיד: ${ex.message}`); 
    }
};

const deleteUser = async (req, res) => {
    try {
        const currentUserId = req.user._id || req.user.userId;
        const requestingUser = await User.findById(currentUserId);
        
        if (!requestingUser || requestingUser.email !== SUPER_ADMIN_EMAIL) {
            return res.status(403).send("גישה נדחתה: רק מנהל-על מורשה למחוק משתמשים");
        }
        
        const userToDelete = await User.findById(req.params.id);
        if (!userToDelete) return res.status(404).send("משתמש לא נמצא");
        if (userToDelete.email === SUPER_ADMIN_EMAIL) return res.status(403).send("לא ניתן למחוק את מנהל העל");
        
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: "המשתמש נמחק בהצלחה" });
    } catch (err) { res.status(500).send(err.message); }
};

module.exports = { register, login, getProfile, requestCreator, getAllUsers, updateUserRole, deleteUser };