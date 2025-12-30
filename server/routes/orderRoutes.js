const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { auth, admin } = require('../middlewares/auth'); // שימוש ב-JWT

// 1. הוספת הזמנה (POST)
router.post('/', auth, orderController.addOrder);

// 2. שליפת הזמנות של לקוח מסוים (GET)
router.get('/user/:userId', auth, orderController.getOrdersByUser);

// 3. שליפת ממוצע תשלומים ללקוח (GET)
router.get('/average/:userId', [auth, admin], orderController.getAveragePayment);

// 4. שליפת הזמנות בטווח תאריכים (GET)
// שימי לב לשימוש בפרמטרים בשורת ה-URL
router.get('/range/:start/:end', [auth, admin], orderController.getOrdersByDateRange);

module.exports = router;