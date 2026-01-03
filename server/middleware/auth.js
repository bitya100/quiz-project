const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) return res.status(401).json({ message: "גישה נדחתה, לא נמצא טוקן" });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
        req.user = verified; 
        next();
    } catch (err) {
        res.status(400).json({ message: "טוקן לא תקין" });
    }
};

// פונקציה לבדיקה אם המשתמש מנהל
const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: "גישה נדחתה: דרושות הרשאות מנהל" });
    }
};

module.exports = { auth, adminOnly };