const { User, validateUser } = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// פונקציית הרשמה
const register = async (req, res) => {
    try {
        console.log("נתוני הרשמה התקבלו:", req.body);

        // 1. בדיקת תקינות קלט
        const { error } = validateUser(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        // 2. בדיקה אם המשתמש קיים (אימייל באותיות קטנות)
        let user = await User.findOne({ email: req.body.email.toLowerCase() });
        if (user) return res.status(400).send('משתמש כבר רשום במערכת');

        // 3. הצפנת הסיסמה (פעם אחת בלבד!)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        // 4. יצירת המשתמש החדש
        const newUser = new User({
            userName: req.body.userName,
            email: req.body.email.toLowerCase(),
            password: hashedPassword,
            role: 'user' // תפקיד התחלתי
        });

        await newUser.save();
        console.log("משתמש נרשם בהצלחה:", newUser.email);
        return res.status(201).json({ message: 'נרשמת בהצלחה!' });

    } catch (ex) {
        console.error("שגיאת שרת בהרשמה:", ex.message);
        return res.status(500).send('שגיאת שרת פנימית');
    }
};

// פונקציית התחברות
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // חיפוש המשתמש
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) return res.status(400).send('אימייל או סיסמה שגויים');

        // השוואת סיסמה שהוקלדה מול ה-Hash בדאטה-בייס
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(400).send('אימייל או סיסמה שגויים');

        // יצירת טוקן עם ה-ID וה-Role
        const token = jwt.sign(
            { _id: user._id, role: user.role }, 
            process.env.JWT_SECRET || 'fallback_secret'
        );

        // שליחת התגובה ל-Frontend
        res.json({ 
            token: token, 
            role: user.role, 
            userId: user._id, 
            userName: user.userName 
        });

    } catch (ex) {
        console.error("שגיאת שרת בלוגין:", ex.message);
        res.status(500).send('שגיאה בתהליך ההתחברות');
    }
};

module.exports = { register, login };