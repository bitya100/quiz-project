const mongoose = require('mongoose');
const Joi = require('joi'); 
const bcrypt = require('bcryptjs'); 

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
 * עדכון חשוב: בגרסת Async של Mongoose pre-save 
 * לא משתמשים ב-next(). פשוט מסיימים את הפונקציה או זורקים שגיאה.
 */
userSchema.pre('save', async function () {
    // אם הסיסמה לא שונתה, פשוט צא מהפונקציה
    if (!this.isModified('password')) return;

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        // אין קריאה ל-next() כאן!
    } catch (err) {
        throw new Error(err); // זריקת שגיאה תעצור את השמירה
    }
});

// פונקציית וולידציה (Joi) 
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