const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Joi = require('joi'); 

const userSchema = new mongoose.Schema({
    userName: { type: String, required: true },
    email: { 
        type: String, 
        required: true, 
        unique: true, 
        lowercase: true 
    },
    password: { type: String, required: true },
    role: { type: String, default: 'user' }
});

// === התיקון: הורדנו את ה-next לגמרי! Mongoose מנהל את זה לבד ===
userSchema.pre('save', async function() {
    // אם הסיסמה לא שונתה, פשוט צא מהפונקציה
    if (!this.isModified('password')) {
        return; 
    }
    
    // מצפינים את הסיסמה
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);

// פונקציית בדיקת תקינות (וולידציה) שמאפשרת עברית
function validateUser(user) {
    const schema = Joi.object({
        userName: Joi.string()
            .pattern(/^[a-zA-Z0-9א-ת\s\-_]+$/) 
            .min(2)
            .max(50)
            .required()
            .messages({
                "string.pattern.base": "שם המשתמש יכול להכיל רק אותיות (בעברית או באנגלית), מספרים ורווחים."
            }),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(1024).required()
    }).unknown(true); // מתעלם משדות אקסטרה אם יש

    return schema.validate(user);
}

module.exports = { User, validateUser };