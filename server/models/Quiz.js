const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    questionText: { type: String, required: true },
    options: [String], // מערך של תשובות אפשריות
    correctAnswer: { type: Number, required: true } // האינדקס של התשובה הנכונה (0, 1, 2...)
});

const quizSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    category: String,
    questions: [questionSchema], // מערך של שאלות בתוך החידון
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Quiz', quizSchema);