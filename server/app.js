require('dotenv').config(); // חייב להיות ראשון!

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const http = require('http'); // נוסף עבור Socket.io
const { Server } = require('socket.io'); // נוסף עבור Socket.io

// ייבוא נתיבים
const quizRoutes = require('./routes/quizRoutes');
const userRoutes = require('./routes/userRoutes');
const resultRoutes = require('./routes/resultRoutes');

const shabbatBlock = require('./middleware/shabbatBlock');

const app = express();
const server = http.createServer(app); // יצירת שרת http שמשתמש ב-express
const io = new Server(server, { cors: { origin: "*" } }); // הגדרת סוקט עם תמיכת CORS

// מונה משתמשים בזמן אמת
let activeUsers = 0;
io.on('connection', (socket) => {
    activeUsers++;
    io.emit('updateUserCount', activeUsers); // שליחת עדכון לכולם

    socket.on('disconnect', () => {
        activeUsers--;
        io.emit('updateUserCount', activeUsers); // עדכון כשמישהו מתנתק
    });
});

// Middleware בסיסיים
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(shabbatBlock);

// הגדרת נתיבי ה-API
app.use('/api/quizzes', quizRoutes);
app.use('/api/users', userRoutes);
app.use('/api/results', resultRoutes);
app.use('/api/upload', require('./routes/uploadRoutes')); 

app.use((req, res, next) => {
    res.status(404).json({ message: "הנתיב המבוקש לא נמצא בשרת" });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "שגיאת שרת פנימית", error: err.message });
});

const uri = process.env.MONGO_URI;
if (!uri) {
    console.error("❌ שגיאה: לא נמצא MONGO_URI בקובץ .env");
} else {
    mongoose.connect(uri)
        .then(() => console.log('✅ התחברנו בהצלחה ל-MongoDB!'))
        .catch(err => console.error('❌ שגיאה בחיבור למונגו:', err.message));
}

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`🚀 השרת רץ בפורט ${PORT}`);
});