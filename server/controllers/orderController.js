const Order = require('../models/Order');
const mongoose = require('mongoose');

// הוספת הזמנה חדשה
exports.addOrder = async (req, res) => {
    try {
        const newOrder = new Order(req.body);
        await newOrder.save();
        res.status(201).json(newOrder);
    } catch (err) {
        res.status(400).json({ message: 'שגיאה בהוספת הזמנה' });
    }
};

// שליפת הזמנות לפי קוד לקוח
exports.getOrdersByUser = async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.params.userId });
        res.json(orders);
    } catch (err) {
        res.status(500).send('שגיאת שרת');
    }
};

// שליפת ממוצע תשלום להזמנה ע''פ קוד לקוח
exports.getAveragePayment = async (req, res) => {
    try {
        const result = await Order.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(req.params.userId) } },
            { $group: { _id: "$userId", average: { $avg: "$totalPrice" } } }
        ]);
        res.json(result);
    } catch (err) {
        res.status(500).send('שגיאה בחישוב הממוצע');
    }
};

// שליפת הזמנות בטווח תאריכים
exports.getOrdersByDateRange = async (req, res) => {
    const { start, end } = req.params;
    try {
        const orders = await Order.find({
            orderDate: { $gte: new Date(start), $lte: new Date(end) }
        });
        res.json(orders);
    } catch (err) {
        res.status(500).send('שגיאה בשליפת תאריכים');
    }
};