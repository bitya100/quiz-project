const { User } = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

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

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: 'bitya210@gmail.com',
            // נושא המייל כולל עכשיו את המייל של המבקש
            subject: `👑 בקשה מ-${updatedUser.email} להצטרפות כיוצר תוכן`,
            html: `
                <div dir="rtl" style="font-family: Arial, sans-serif; padding: 25px; border: 2px solid #bc13fe; border-radius: 12px; max-width: 550px; background-color: #fdfbff; margin: 0 auto;">
                    <h2 style="color: #bc13fe; margin-top: 0; text-align: center; border-bottom: 2px solid #bc13fe; padding-bottom: 10px;">בקשה חדשה התקבלה!</h2>
                    <p style="font-size: 1.1rem; color: #333;">משתמש הגיש בקשה להפוך ליוצר תוכן במערכת:</p>
                    
                    <div style="background-color: #f3e8ff; padding: 15px; border-radius: 8px; margin: 20px 0; border-right: 5px solid #bc13fe;">
                        <p style="margin: 5px 0;"><strong>שם משתמש:</strong> ${updatedUser.userName}</p>
                        <p style="margin: 5px 0;"><strong>אימייל:</strong> <a href="mailto:${updatedUser.email}">${updatedUser.email}</a></p>
                        <p style="margin: 5px 0;"><strong>מזהה מערכת:</strong> ${updatedUser._id}</p>
                    </div>
                    
                    <p style="font-size: 0.95rem; color: #666; text-align: center;">
                        ניתן ללחוץ על כתובת המייל לעיל כדי להשיב למשתמש ישירות.
                    </p>
                </div>
            `
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("🔥 שגיאה בשליחת מייל:", error);
            } else {
                console.log("📨 מייל התראה נשלח בהצלחה ל-bitya210@gmail.com:", info.response);
            }
        });

        res.status(200).json({ message: "בקשתך נשלחה להנהלה!" });
    } catch (ex) { 
        console.error("Error in requestCreator:", ex);
        res.status(500).send('שגיאה בשליחת הבקשה'); 
    }
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
        if (userToUpdate.email === SUPER_ADMIN_EMAIL) return res.status(403).send("לא ניתן לשנות הרשאה למנהל העל");

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

module.exports = { register, login, getProfile, requestCreator, getAllUsers, updateUserRole, deleteUser };