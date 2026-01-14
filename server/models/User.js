const mongoose = require('mongoose');
const Joi = require('joi'); 
const bcrypt = require('bcryptjs'); // חובה להתקין: npm install bcryptjs

const userSchema = new mongoose.Schema({
    userName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { 
        type: String, 
        enum: ['admin', 'user'], 
        default: 'user' 
    },
    quizHistory: [{
        quizTitle: { type: String },
        score: { type: Number },
        totalQuestions: { type: Number },
        date: { type: Date, default: Date.now }
    }]
}, { timestamps: true });

/**
 * מימוש דרישה 1: שימוש ב-pre save middleware של Mongoose
 * פונקציה זו מצפינה את הסיסמה אוטומטית לפני שמירה ב-DB
 */
userSchema.pre('save', async function (next) {
    // אם הסיסמה לא שונתה, המשך הלאה
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

// פונקציית וולידציה (Joi) - עבור רישום משתמש חדש 
const validateUser = (user) => {
    const schema = Joi.object({
        userName: Joi.string().min(2).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(3).required(),
        role: Joi.string().valid('admin', 'user')
    });
    return schema.validate(user);
};

const User = mongoose.model('User', userSchema);
module.exports = { User, validateUser };