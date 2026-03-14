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
    role: { type: String, default: 'user' },
    requestedCreator: { type: Boolean, default: false }
});

// התיקון הסופי: פונקציה אסינכרונית מודרנית ללא next!
userSchema.pre('save', async function () {
    // אם הסיסמה לא שונתה, פשוט יוצאים (return) ומונגו ימשיך לבד
    if (!this.isModified('password')) {
        return; 
    }
    
    // בגלל שזה async, מונגו ממתין אוטומטית עד שההצפנה תסתיים
    // וגם יתפוס שגיאות אוטומטית אם יהיו כאלו
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);

const userValidationSchema = Joi.object({
    userName: Joi.string()
        .pattern(/^[a-zA-Z0-9א-ת\s\-_]+$/) 
        .min(2)
        .max(50)
        .required()
        .messages({
            "string.pattern.base": "שם המשתמש יכול להכיל רק אותיות (בעברית או באנגלית), מספרים ורווחים."
        }),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(1024).required(),
    role: Joi.string().optional()
});

module.exports = { User, userValidationSchema };