require('dotenv').config(); // חייב להיות ראשון!

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// ייבוא נתיבים
const quizRoutes = require('./routes/quizRoutes');
const userRoutes = require('./routes/userRoutes');
const resultRoutes = require('./routes/resultRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// הגדרת נתיבי ה-API
app.use('/api/quizzes', quizRoutes);
app.use('/api/users', userRoutes);
app.use('/api/results', resultRoutes);

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