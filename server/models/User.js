const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    userName: { type: String, required: true },
    email: { 
        type: String, 
        required: true, 
        unique: true, // חסימת הרשמה כפולה עם אותו מייל
        lowercase: true 
    },
    password: { type: String, required: true },
    role: { type: String, default: 'user' }
});

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

module.exports = { User: mongoose.model('User', userSchema) };