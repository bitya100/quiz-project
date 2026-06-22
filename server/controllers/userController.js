const { User } = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { Resend } = require('resend'); // 🚀 הספרייה החדשה והיציבה

const SUPER_ADMIN_EMAIL = "admin10@gmail.com";

// 🚀 אתחול פשוט של Resend באמצעות מפתח האבטחה
const resend = new Resend(process.env.RESEND_API_KEY);

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

        const clientUrl = req.headers.origin || 'http://localhost:5173';
        const resetUrl = `${clientUrl}/reset-password/${resetToken}`;

        const htmlContent = `
            <div dir="rtl" style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0b0f19; padding: 40px; text-align: center; color: #ffffff;">
                <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 550px; background-color: #151f32; border-radius: 16px; border: 1px solid rgba(64, 224, 208, 0.2); box-shadow: 0 8px 32px rgba(0,0,0,0.4); overflow: hidden;">
                    <tr>
                        <td style="padding: 30px 20px 10px 20px; text-align: center;">
                            <h1 style="color: #40e0d0; margin: 0; font-size: 28px; font-weight: bold; letter-spacing: 1px;">QUIZ MASTER</h1>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 20px 40px 30px 40px; text-align: right;">
                            <h2 style="color: #ffffff; font-size: 20px; margin-top: 0;">שלום ${user.userName},</h2>
                            <p style="color: #94a3b8; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
                                זו בִּתְיָה. הגשת בקשה לאיפוס הסיסמה לחשבונך באתר החידונים.<br>
                                כדי לבחור סיסמה חדשה, יש ללחוץ על הכפתור למטה. הקישור יהיה בתוקף למשך שעה אחת בלבד.
                            </p>
                            <div style="text-align: center; margin: 30px 0;">
                                <a href="${resetUrl}" style="background-color: #40e0d0; color: #0b0f19; font-weight: bold; text-decoration: none; padding: 14px 35px; border-radius: 50px; font-size: 16px; display: inline-block; box-shadow: 0 4px 15px rgba(64, 224, 208, 0.4);">
                                    לאיפוס הסיסמה
                                </a>
                            </div>
                            <hr style="border: 0; border-top: 1px solid rgba(255,255,255,0.1); margin: 30px 0;">
                            <p style="color: #64748b; font-size: 13px; text-align: center; margin: 0;">
                                אם לא ביקשת לאפס את הסיסמה, אל דאגה - אפשר פשוט להתעלם מהמייל הזה.
                            </p>
                        </td>
                    </tr>
                </table>
            </div>
        `;

        // 🚀 שליחה חלקה באמצעות השירות הציבורי של Resend לכתובות בדיקה
        await resend.emails.send({
            from: 'onboarding@resend.dev', // כתובת ברירת המחדל החינמית לבדיקות שלהם
            to: user.email,
            subject: 'איפוס סיסמה - QUIZ MASTER',
            html: htmlContent,
        });

        return res.json({ message: 'מייל לאיפוס סיסמה נשלח בהצלחה!' });

    } catch (ex) {
        console.error("🔥 Detailed Resend Error:", ex);
        return res.status(500).send('שגיאה בתהליך שליחת המייל. נסי שנית מאוחר יותר.');
    }
};

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

        const jwtToken = jwt.sign(
            { _id: user._id, userId: user._id, role: user.role, userName: user.userName },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '7d' }
        );

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

