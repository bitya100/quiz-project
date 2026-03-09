// server/middleware/shabbatBlock.js
const isShabbat = () => {
    const now = new Date();
    const day = now.getDay();
    const hour = now.getHours();

    // יום שישי (5) מ-12:00 בצהריים ועד סוף היום
    if (day === 5 && hour >= 12) return true; 
    
    // כל יום שבת (6) מתחילת היום ועד 19:00 בערב
    if (day === 6 && hour < 19) return true;  
    
    return false;
};

const shabbatBlock = (req, res, next) => {
    if (isShabbat()) {
        return res.status(503).json({ 
            message: "האתר סגור בשבת. נשמח לראותכם במוצאי שבת!" 
        });
    }
    next();
};

module.exports = shabbatBlock;