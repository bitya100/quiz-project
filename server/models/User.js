const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); 
const Joi = require('joi'); 

// הגדרת המבנה במונגו - שינינו ל-userName כדי שיתאים ל-React שלך
const userSchema = new mongoose.Schema({
    userName: { type: String, required: true }, // שונה מ-fullName ל-userName
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'registered', 'premium'], default: 'registered' }
});

// שינוי קטן בפונקציית ה-pre למניעת שגיאת "next is not a function"
userSchema.pre('save', async function() {
    // בגרסאות חדשות אין צורך ב-next() אם הפונקציה היא async
    if (!this.isModified('password')) return;
    
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// בדיקת תקינות (Joi) - הותאם לשמות השדות מה-React ולסיסמה קצרה יותר
const validateUser = (user) => {
    const schema = Joi.object({
        userName: Joi.string().min(2).required(), // שונה מ-fullName ל-userName
        email: Joi.string().email().required(),
        password: Joi.string().min(3).required(), // הורדנו למינימום 3 תווים שיהיה לך קל לבדוק
        role: Joi.string()
    });
    return schema.validate(user);
};

const User = mongoose.model('User', userSchema);
module.exports = { User, validateUser };