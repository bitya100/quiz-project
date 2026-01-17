const mongoose = require('mongoose');

// הגדרת הסכימה עבור שאלה בודדת בחידון
const questionSchema = new mongoose.Schema({
    questionText: { 
        type: String, 
        required: true 
    },
    options: {
        type: [String],
        required: true
    }, // מערך של תשובות אפשריות
    correctAnswer: { 
        type: Number, 
        required: true 
    }, // האינדקס של התשובה הנכונה (0, 1, 2...)
    
    // השורה שנוספה כדי לאפשר שמירת תמונה (בפורמט Base64 או URL)
    image: { 
        type: String, 
        default: "" 
    } 
});

// הגדרת הסכימה עבור החידון כולו
const quizSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true 
    },
    description: {
        type: String
    },
    category: {
        type: String
    },
    questions: [questionSchema], // מערך של שאלות המשתמשות ב-questionSchema שלמעלה
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

// ייצוא המודל לשימוש בשאר חלקי השרת
module.exports = mongoose.model('Quiz', quizSchema);