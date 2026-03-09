require('dotenv').config(); // חייב להיות ראשון!

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path'); 

// ייבוא נתיבים
const quizRoutes = require('./routes/quizRoutes');
const userRoutes = require('./routes/userRoutes');
const resultRoutes = require('./routes/resultRoutes');

// ⭐️ 1. ייבוא ה-Middleware המותאם אישית שלנו (חסימת שבת)
const shabbatBlock = require('./middleware/shabbatBlock');

const app = express();

// Middleware בסיסיים
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// חשיפת תיקיית התמונות לדפדפן
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ⭐️ 2. הפעלת חסימת השבת על כל הבקשות שמגיעות לשרת!
// חשוב שזה יהיה כאן, לפני הראוטים של ה-API
app.use(shabbatBlock);

// הגדרת נתיבי ה-API
app.use('/api/quizzes', quizRoutes);
app.use('/api/users', userRoutes);
app.use('/api/results', resultRoutes);
app.use('/api/upload', require('./routes/uploadRoutes')); 

// טיפול בנתיבים לא קיימים (404)
app.use((req, res, next) => {
    res.status(404).json({ message: "הנתיב המבוקש לא נמצא בשרת" });
});

// טיפול בשגיאות כלליות של השרת
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "שגיאת שרת פנימית", error: err.message });
});

// חיבור ל-MongoDB
const uri = process.env.MONGO_URI;

if (!uri) {
    console.error("❌ שגיאה: לא נמצא MONGO_URI בקובץ .env");
} else {
    mongoose.connect(uri)
        .then(() => console.log('✅ התחברנו בהצלחה ל-MongoDB!'))
        .catch(err => {
            console.error('❌ שגיאה בחיבור למונגו (בדקי סיסמה ב-.env):');
            console.error(err.message);
        });
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`🚀 השרת רץ בפורט ${PORT}`);
    console.log(`📡 נתיבי הציונים זמינים ב: http://localhost:${PORT}/api/results`);
});