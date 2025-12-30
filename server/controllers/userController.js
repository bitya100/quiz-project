const { User, validateUser } = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// פונקציית הרשמה
const register = async (req, res) => {
    try {
        console.log("--- ניסיון הרשמה חדש ---");
        const { error } = validateUser(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        let user = await User.findOne({ email: req.body.email.toLowerCase() });
        if (user) return res.status(400).send('משתמש כבר רשום במערכת');

        const newUser = new User({
            userName: req.body.userName,
            email: req.body.email.toLowerCase(),
            password: req.body.password
        });

        await newUser.save();
        console.log("✅ משתמש נשמר בהצלחה!");
        return res.status(201).json({ message: 'נרשמת בהצלחה!' });
    } catch (ex) {
        console.log("❌ שגיאה בהרשמה:", ex.message);
        return res.status(500).send('שגיאת שרת: ' + ex.message);
    }
};

// פונקציית התחברות (הייתה חסרה ולכן השרת קרס)
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) return res.status(400).send('אימייל או סיסמה שגויים');

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(400).send('אימייל או סיסמה שגויים');

        const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET || 'secretKey');
        res.send({ token });
    } catch (ex) {
        res.status(500).send('שגיאה בהתחברות');
    }
};

// ייצוא מסודר של שתיהן
module.exports = {
    register,
    login
};