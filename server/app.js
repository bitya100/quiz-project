require('dotenv').config(); 

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const http = require('http'); 
const { Server } = require('socket.io'); 

// ייבוא נתיבים
const quizRoutes = require('./routes/quizRoutes');
const userRoutes = require('./routes/userRoutes');
const resultRoutes = require('./routes/resultRoutes');

const shabbatBlock = require('./middleware/shabbatBlock');

const app = express();
const server = http.createServer(app); 

// הגדרת רשימת האתרים המורשים (כולל נטליפיי וגם ורסל החדש)
const allowedOrigins = [
    "https://pro-bitya-reactnode.netlify.app", // האתר בנטליפיי
    "https://quiz-project-ashy-pi.vercel.app",   // האתר החדש בורסל
    "http://localhost:5173",
    "http://localhost:3000"
];

// הגדרת CORS עבור Express שתומכת במערך כתובות
app.use(cors({
    origin: function (origin, callback) {
        // מאפשר בקשות ללא origin (כמו בדיקות ב-Postman או קבצים פנימיים)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

// הגדרת CORS עבור Socket.io עם טריק ה-Ping של רנדר
const io = new Server(server, { 
    cors: { 
        origin: allowedOrigins,
        methods: ["GET", "POST"],
        credentials: true
    },
    pingInterval: 5000,  // שולח אות חיים מהשרת לדפדפן כל 5 שניות
    pingTimeout: 3000    // אם אין תגובה תוך 3 שניות, החיבור מתרענן
});

// מונה משתמשים בזמן אמת
let activeUsers = 0;
io.on('connection', (socket) => {
    activeUsers++;
    io.emit('updateUserCount', activeUsers); 

    socket.on('disconnect', () => {
        activeUsers--;
        io.emit('updateUserCount', activeUsers); 
    });
});

// Middleware בסיסיים
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