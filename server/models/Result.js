const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    quizId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz',
        required: true
    },
    quizTitle: {
        type: String,
        required: true
    },
    score: {
        type: Number,
        required: true
    },
    // זה השדה שהיה חסר וגרם לכל הבלאגן!
    totalQuestions: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Result', resultSchema);