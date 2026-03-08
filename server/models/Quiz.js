const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    questionText: { type: String, required: true },
    options: { type: [String], required: true },
    correctAnswer: { type: Number, required: true },
    image: { type: String, default: "" } 
});

const quizSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    image: { type: String, default: "" }, // השדה החדש לתמונת החידון!
    // הקטגוריה נמחקה מכאן
    questions: [questionSchema],
    createdAt: { type: Date, default: Date.now },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Quiz', quizSchema);