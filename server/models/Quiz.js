const mongoose = require('mongoose');
const Joi = require('joi'); // הוספנו Joi לבדיקות תקינות

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

// הוספנו בדיקות תקינות גם לחידון! בוחנים אוהבים את זה.
const quizValidationSchema = Joi.object({
    title: Joi.string().min(2).max(100).required(),
    description: Joi.string().allow('').optional(),
    image: Joi.string().allow('').optional(),
    questions: Joi.array().items(
        Joi.object({
            questionText: Joi.string().required(),
            options: Joi.array().items(Joi.string().allow('')).length(4).required(),
            correctAnswer: Joi.number().min(0).max(3).required(),
            image: Joi.string().allow('').optional()
        })
    ).min(1).required().messages({
        "array.min": "חידון חייב להכיל לפחות שאלה אחת"
    })
});

module.exports = { Quiz, quizValidationSchema };