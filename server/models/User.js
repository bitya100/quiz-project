const mongoose = require('mongoose');
const Joi = require('joi'); 

const userSchema = new mongoose.Schema({
    userName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { 
        type: String, 
        enum: ['admin', 'user'], 
        default: 'user' 
    },
    // שדה היסטוריית ניצחונות ומשחקים
    quizHistory: [{
        quizTitle: { type: String },
        score: { type: Number },
        totalQuestions: { type: Number },
        date: { type: Date, default: Date.now }
    }]
}, { timestamps: true });

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