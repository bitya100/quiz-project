const mongoose = require('mongoose');
const Joi = require('joi'); 

const questionSchema = new mongoose.Schema({
    questionText: { type: String, required: true },
    options: { type: [String], required: true },
    correctAnswer: { type: Number, required: true },
    image: { type: String, default: "" } 
});

const quizSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    image: { type: String, default: "" }, 
    questions: [questionSchema],
    createdAt: { type: Date, default: Date.now },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const Quiz = mongoose.model('Quiz', quizSchema);

// הוספנו ל-Joi אישור לקבל שדות של מונגו (_id) גם ברמת החידון וגם ברמת השאלות
const quizValidationSchema = Joi.object({
    _id: Joi.any(),
    __v: Joi.any(),
    createdAt: Joi.any(),
    creator: Joi.any(),
    title: Joi.string().min(2).max(100).required(),
    description: Joi.string().allow('').optional(),
    image: Joi.string().allow('').optional(),
    questions: Joi.array().items(
        Joi.object({
            _id: Joi.any(), // התיקון הקריטי: מאפשרים למונגו לשלוח ID של שאלה בעריכה
            questionText: Joi.string().required(),
            options: Joi.array().items(Joi.string().allow('')).length(4).required(),
            correctAnswer: Joi.number().min(0).max(3).required(),
            image: Joi.string().allow('').optional()
        }).unknown(true) // מבטיח שכל נתון נסתר שמונגו ידחוף פנימה לא יקריס את השמירה
    ).min(1).required().messages({
        "array.min": "חידון חייב להכיל לפחות שאלה אחת"
    })
}).unknown(true);

module.exports = { Quiz, quizValidationSchema };