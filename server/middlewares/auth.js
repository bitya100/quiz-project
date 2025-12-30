const jwt = require('jsonwebtoken');

// מידלוואר לאימות טוקן כללי (Authentication)
const auth = (req, res, next) => {
    const token = req.header('x-auth-token'); 
    if (!token) return res.status(401).send('גישה נדחתה. לא סופק טוקן.');

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; 
        next();
    } catch (ex) {
        res.status(400).send('טוקן לא תקין.');
    }
};

// מידלוואר לבדיקת הרשאת מנהל (Authorization)
const admin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).send('גישה נדחתה. מנהלים בלבד.');
    }
    next();
};

module.exports = { auth, admin };