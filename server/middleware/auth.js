const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
        return res.status(401).json({ message: "גישה נדחתה, חסר טוקן" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        req.user = decoded;
        next(); // ממשיך לפונקציה הבאה בראוטר
    } catch (ex) {
        res.status(400).json({ message: "טוקן לא תקין" });
    }
};

// השורה הכי חשובה - בלי זה הכל קורס!
module.exports = auth;