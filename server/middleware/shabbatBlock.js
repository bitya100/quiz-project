// server/middleware/shabbatBlock.js

const isShabbat = () => {
    const now = new Date();
    
    // סימולציה: נגיד לשרת שהיום יום שבת (6) והשעה 10 בבוקר
    const day = 6;  // במקום now.getDay()
    const hour = 10; // במקום now.getHours()

    // הלוגיקה המקורית שלך:
    if (day === 5 && hour >= 16) return true; // שישי אחה"צ
    if (day === 6 && hour < 19) return true;  // שבת לפני צאתה
    
    return false;
};
const shabbatBlock = (req, res, next) => {
    if (isShabbat()) {
        return res.status(503).json({ 
            message: "האתר סגור בשבת. שאבעס!!!" 
        });
    }
    next();
};

module.exports = shabbatBlock;