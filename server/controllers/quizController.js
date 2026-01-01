const Quiz = require('../models/Quiz');

// 1. קבלת כל החידונים - פתוח לכולם
exports.getAllQuizzes = async (req, res) => {
    try {
        const quizzes = await Quiz.find().sort({ createdAt: -1 });
        res.json(quizzes);
    } catch (err) {
        res.status(500).json({ message: "שגיאה בקבלת החידונים: " + err.message });
    }
};

// 2. קבלת חידון בודד לפי ID - פתוח לכולם
exports.getQuizById = async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id);
        if (!quiz) return res.status(404).json({ message: "חידון לא נמצא" });
        res.json(quiz);
    } catch (err) {
        res.status(500).json({ message: "שגיאה בטעינת החידון" });
    }
};

// 3. יצירת חידון חדש - מנהל בלבד
exports.createQuiz = async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: "גישה נדחתה: מנהלים בלבד" });
    }
    try {
        const newQuiz = new Quiz({
            ...req.body,
            creator: req.user._id 
        });
        const savedQuiz = await newQuiz.save();
        res.status(201).json(savedQuiz);
    } catch (err) {
        res.status(400).json({ message: "שגיאה ביצירת החידון: " + err.message });
    }
};

// 4. עדכון חידון קיים - מנהל בלבד
exports.updateQuiz = async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: "גישה נדחתה: מנהלים בלבד" });
    }
    try {
        const updatedQuiz = await Quiz.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true }
        );
        if (!updatedQuiz) return res.status(404).json({ message: "החידון לא נמצא" });
        res.json(updatedQuiz);
    } catch (err) {
        res.status(400).json({ message: "שגיאה בעדכון: " + err.message });
    }
};

// 5. מחיקת חידון - מנהל בלבד
exports.deleteQuiz = async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: "גישה נדחתה: מנהלים בלבד" });
    }
    try {
        const deletedQuiz = await Quiz.findByIdAndDelete(req.params.id);
        if (!deletedQuiz) return res.status(404).json({ message: "החידון לא נמצא" });
        res.json({ message: "החידון נמחק בהצלחה" });
    } catch (err) {
        res.status(500).json({ message: "שגיאה במחיקה" });
    }
};