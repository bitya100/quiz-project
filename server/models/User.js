const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    userName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'user' }
});

// התיקון הקריטי: מחקנו את ה-next! בגרסאות מודרניות של Mongoose עם async, פשוט מחזירים תשובה.
userSchema.pre('save', async function() {
    // אם לא שינו את הסיסמה (למשל כשרק מעדכנים תפקיד), פשוט עוצרים פה והשמירה ממשיכה
    if (!this.isModified('password')) {
        return;
    }
    
    // מצפינים את הסיסמה
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

module.exports = { User: mongoose.model('User', userSchema) };