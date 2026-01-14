// const express = require('express');
// const router = express.Router();
// const orderController = require('../controllers/orderController');
// // תיקון נתיב ל-'../middleware/auth' ותיקון שם הפונקציה ל-adminOnly
// const { auth, adminOnly } = require('../middleware/auth'); 

// // 1. הוספת הזמנה (POST)
// router.post('/', auth, orderController.addOrder);

// // 2. שליפת הזמנות של לקוח מסוים (GET)
// router.get('/user/:userId', auth, orderController.getOrdersByUser);

// // 3. שליפת ממוצע תשלומים ללקוח (GET - למנהל בלבד)
// router.get('/average/:userId', auth, adminOnly, orderController.getAveragePayment);

// // 4. שליפת הזמנות בטווח תאריכים (GET - למנהל בלבד)
// router.get('/range/:start/:end', auth, adminOnly, orderController.getOrdersByDateRange);

// module.exports = router;