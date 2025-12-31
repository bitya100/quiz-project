const jwt = require('jsonwebtoken');

// בדיקה אם המשתמש מחובר (עבור הוספת חידון)
exports.verifyToken = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) return res.status(401).json({ message: "גישה נדחתה, לא נמצא טוקן" });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified; // מכיל את ה-id וה-role
        next();
    } catch (err) {
        res.status(400).json({ message: "טוקן לא תקין" });
    }
};

// בדיקה אם המשתמש הוא מנהל (עבור מחיקת חידון)
exports.isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: "פעולה זו מותרת למנהלים בלבד" });
    }
};