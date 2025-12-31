const mongoose = require('mongoose');
const Joi = require('joi'); 

const userSchema = new mongoose.Schema({
    userName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    // הוספת 'user' ל-enum כדי שיתאים לברירת המחדל בקונטרולר
    role: { type: String, enum: ['admin', 'user', 'registered', 'premium'], default: 'user' }
});

// פונקציית וולידציה (Joi) - מוודאת שהנתונים מה-React תקינים
const validateUser = (user) => {
    const schema = Joi.object({
        userName: Joi.string().min(2).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(3).required(),
        role: Joi.string().valid('admin', 'user', 'registered', 'premium')
    });
    return schema.validate(user);
};

const User = mongoose.model('User', userSchema);
module.exports = { User, validateUser };