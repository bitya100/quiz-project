const { User } = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto'); // ספרייה מובנית ב-Node ליצירת טוקנים אקראיים
const nodemailer = require('nodemailer'); // ספרייה לשליחת מיילים

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

        // קידום אוטומטי של מנהל העל
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
        if (req.user.role !== 'admin') return res.status(403).send("גישה נדחתה: מנהלים בלבד");
        
        const currentUserId = req.user._id || req.user.userId;
        const requestingUser = await User.findById(currentUserId);
        
        if (!requestingUser) return res.status(401).send("המשתמש המבצע לא קיים במערכת");

        const isSuperAdmin = requestingUser.email === SUPER_ADMIN_EMAIL;
        
        const userIdToUpdate = req.params.id;
        const { role } = req.body;
        const userToUpdate = await User.findById(userIdToUpdate);
        
        if (!userToUpdate) return res.status(404).send('המשתמש לעדכון לא נמצא');

        if (userToUpdate.email === SUPER_ADMIN_EMAIL) {
            return res.status(403).send("לא ניתן לשנות הרשאה למנהל העל");
        }

        if (role === 'admin' && userToUpdate.role !== 'admin' && userToUpdate.requestedCreator !== true && !isSuperAdmin) {
            return res.status(400).send('לא ניתן למנות למנהל משתמש שלא הגיש בקשה לכך במערכת.');
        }

        if (role === 'user') {
            const adminCount = await User.countDocuments({ role: 'admin' });
            if (userToUpdate.role === 'admin' && adminCount <= 1) {
                return res.status(400).send('לא ניתן להסיר את המנהל האחרון במערכת.');
            }
        }

        const updatedUser = await User.findByIdAndUpdate(
            userIdToUpdate,
            { role: role, requestedCreator: false },
            { new: true }
        );
        
        res.json({ message: `המשתמש ${updatedUser.userName} הוא כעת ${role}`, user: updatedUser });
    } catch (ex) {
        console.error("🔥 Error updating user role:", ex);
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

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).send('נא להזין כתובת אימייל');

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) return res.status(404).send('לא מצאנו משתמש עם אימייל כזה');

        const resetToken = crypto.randomBytes(32).toString('hex');
        
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000;
        await user.save(); 

        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false, 
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            },
            tls: {
                rejectUnauthorized: false 
            }
        });

        const clientUrl = req.headers.origin || 'http://localhost:5173';
        const resetUrl = `${clientUrl}/reset-password/${resetToken}`;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'איפוס סיסמה - אתר החידונים',
            html: `
                <div style="direction: rtl; text-align: right; font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <h2 style="color: #333;">שלום ${user.userName},</h2>
                    <p>קיבלנו בקשה לאיפוס הסיסמה לחשבונך באתר החידונים.</p>
                    <p>כדי לבחור סיסמה חדשה, לחצי על הכפתור הבא (הקישור יהיה בתוקף למשך שעה אחת):</p>
                    <div style="margin: 25px 0;">
                        <a href="${resetUrl}" style="background-color: #4CAF50; color: white; padding: 12px 25px; text-decoration: none; font-weight: bold; border-radius: 5px; display: inline-block;">לחצי כאן לאיפוס הסיסמה</a>
                    </div>
                    <p style="color: #777; font-size: 12px;">אם לא ביקשת לאפס את הסיסמה, אל דאגה - אפשר פשוט להתעלם מהמייל הזה.</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        res.json({ message: 'מייל לאיפוס סיסמה נשלח בהצלחה!' });

    } catch (ex) {
        console.error("Forgot Password Error:", ex);
        res.status(500).send('שגיאה בתהליך שליחת המייל. נסי שנית מאוחר יותר.');
    }
};

// 🔥 הפונקציה המעודכנת עם התחברות אוטומטית מלאה!
const resetPassword = async (req, res) => {
    try {
        const { token, password } = req.body;
        if (!token || !password) return res.status(400).send('נתונים חסרים לביצוע האיפוס');

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) return res.status(400).send('הקישור אינו תקף או שפג תוקפו. אנא בקשי שחזור חדש.');

        user.password = password;
        
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;
        
        await user.save();

        // יצירת טוקן JWT חדש עבור המשתמש כדי לחסוך ממנו ללכת לדף לוגין
        const jwtToken = jwt.sign(
            { _id: user._id, userId: user._id, role: user.role, userName: user.userName },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '7d' }
        );

        // מחזיר את האובייקט המלא בדיוק בפורמט של Login/Register הקיים שלך
        res.json({ 
            message: 'הסיסמה שלך עודכנה בהצלחה! מתחבר אוטומטית...',
            token: jwtToken,
            role: user.role,
            userId: user._id,
            userName: user.userName,
            email: user.email
        });

    } catch (ex) {
        console.error("Reset Password Error:", ex);
        res.status(500).send('שגיאה בתהליך עדכון הסיסמה.');
    }
};

module.exports = { register, login, getProfile, requestCreator, getAllUsers, updateUserRole, deleteUser, forgotPassword, resetPassword };