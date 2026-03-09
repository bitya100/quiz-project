const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const auth = require('../middleware/auth'); // מוודאים שרק מחוברים יכולים להעלות

// יצירת תיקיית uploads אם היא לא קיימת עדיין
const dir = './uploads';
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}

// הגדרות השמירה של multer (איפה לשמור ואיך לקרוא לקובץ)
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        // הוספת חותמת זמן לשם הקובץ כדי שלא יהיו כפילויות
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// נתיב ההעלאה בפועל
router.post('/', auth, upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send('לא נבחרה תמונה');
        }
        // מחזירים את הקישור לתמונה שנשמרה
        res.json({ imageUrl: `/uploads/${req.file.filename}` });
    } catch (error) {
        res.status(500).send("שגיאה בשמירת התמונה");
    }
});

module.exports = router;