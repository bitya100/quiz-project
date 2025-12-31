require('dotenv').config(); // חייב להיות ראשון!

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const quizRoutes = require('./routes/quizRoutes');
const userRoutes = require('./routes/userRoutes');
const resultRoutes = require('./routes/resultRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// נתיבים
app.use('/api/quizzes', quizRoutes);
app.use('/api/users', userRoutes);
app.use('/api/results', resultRoutes);

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
});