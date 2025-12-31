const Quiz = require('../models/Quiz');

// 1. קבלת כל החידונים (Read)
exports.getQuizzes = async (req, res) => {
    try {
        const quizzes = await Quiz.find();
        res.json(quizzes);
    } catch (err) {
        res.status(500).json({ message: "שגיאה בקבלת החידונים: " + err.message });
    }
};

// 2. קבלת חידון בודד לפי ID
exports.getQuizById = async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id);
        if (!quiz) return res.status(404).json({ message: "חידון לא נמצא" });
        res.json(quiz);
    } catch (err) {
        res.status(500).json({ message: "שגיאה בטעינת החידון" });
    }
};

// 3. יצירת חידון חדש (Create)
exports.createQuiz = async (req, res) => {
    try {
        const newQuiz = new Quiz(req.body);
        const savedQuiz = await newQuiz.save();
        res.status(201).json(savedQuiz);
    } catch (err) {
        res.status(400).json({ message: "שגיאה ביצירה: " + err.message });
    }
};

// 4. עדכון חידון קיים (Update)
exports.updateQuiz = async (req, res) => {
    try {
        const updatedQuiz = await Quiz.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true }
        );
        res.json(updatedQuiz);
    } catch (err) {
        res.status(400).json({ message: "שגיאה בעדכון: " + err.message });
    }
};

// 5. מחיקת חידון (Delete)
exports.deleteQuiz = async (req, res) => {
    try {
        await Quiz.findByIdAndDelete(req.params.id);
        res.json({ message: "החידון נמחק בהצלחה" });
    } catch (err) {
        res.status(500).json({ message: "שגיאה במחיקה" });
    }
};