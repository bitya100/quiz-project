// const express = require('express');
// const router = express.Router();
// const productController = require('../controllers/productController');
// // תיקון שם הפונקציה ל-adminOnly והסרת הסוגריים המרובעים המיותרים
// const { auth, adminOnly } = require('../middleware/auth'); 

// router.get('/', productController.getAllProducts);

// // שימוש ב-adminOnly כפונקציה רגילה
// router.post('/', auth, adminOnly, productController.addProduct); 
// router.delete('/:id', auth, adminOnly, productController.deleteProduct);

// module.exports = router;