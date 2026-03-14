const { Quiz } = require('../models/Quiz'); // התיקון כאן: הוספת סוגריים מסולסלים!

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

    // בדיקה שיש לפחות שאלה אחת
    if (!req.body.questions || req.body.questions.length === 0) {
        return res.status(400).json({ message: "חידון חייב להכיל לפחות שאלה אחת" });
    }

    try {
        const userId = req.user._id || req.user.userId;
        const newQuiz = new Quiz({
            ...req.body,
            creator: userId 
        });

        const savedQuiz = await newQuiz.save();
        res.status(201).json(savedQuiz);

    } catch (err) {
        res.status(400).json({ message: "שגיאה ביצירת החידון: " + err.message });
    }
};

// 4. עדכון חידון קיים - מנהל בלבד + הגבלת יוצר
exports.updateQuiz = async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: "גישה נדחתה: מנהלים בלבד" });
    }

    // בדיקה שלא מוחקים את כל השאלות
    if (req.body.questions && req.body.questions.length === 0) {
        return res.status(400).json({ message: "חידון חייב להכיל לפחות שאלה אחת" });
    }

    try {
        // שלב א': מציאת החידון כדי לבדוק מי יצר אותו
        const quiz = await Quiz.findById(req.params.id);
        if (!quiz) {
            return res.status(404).json({ message: "החידון לא נמצא" });
        }

        // שלב ב': בדיקת הרשאות - האם זה מנהל העל או היוצר של החידון?
        const userId = req.user._id || req.user.userId;
        const isSuperAdmin = req.user.userName && req.user.userName.toLowerCase().includes('admin10');
        const isCreator = quiz.creator && quiz.creator.toString() === userId.toString();

        if (!isCreator && !isSuperAdmin) {
            return res.status(403).json({ message: "פעולה נדחתה: אתה מורשה לערוך רק חידונים שאתה יצרת." });
        }

        // שלב ג': ביצוע העדכון בפועל
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

// 5. מחיקת חידון - מנהל בלבד + הגבלת יוצר
exports.deleteQuiz = async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: "גישה נדחתה: מנהלים בלבד" });
    }
    
    try {
        // שלב א': מציאת החידון כדי לבדוק מי יצר אותו
        const quiz = await Quiz.findById(req.params.id);
        if (!quiz) {
            return res.status(404).json({ message: "החידון לא נמצא" });
        }

        // שלב ב': בדיקת הרשאות - האם זה מנהל העל או היוצר של החידון?
        const userId = req.user._id || req.user.userId;
        const isSuperAdmin = req.user.userName && req.user.userName.toLowerCase().includes('admin10');
        const isCreator = quiz.creator && quiz.creator.toString() === userId.toString();

        if (!isCreator && !isSuperAdmin) {
            return res.status(403).json({ message: "פעולה נדחתה: אתה מורשה למחוק רק חידונים שאתה יצרת." });
        }

        // שלב ג': ביצוע המחיקה בפועל
        await Quiz.findByIdAndDelete(req.params.id);
        res.json({ message: "החידון נמחק בהצלחה" });

    } catch (err) {
        res.status(500).json({ message: "שגיאה במחיקה" });
    }
};