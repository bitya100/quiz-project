const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { auth, admin } = require('../middleware/auth'); // הגנה על הנתיבים

router.get('/', productController.getAllProducts);
router.post('/', [auth, admin], productController.addProduct); // רק מנהל יכול להוסיף
router.delete('/:id', [auth, admin], productController.deleteProduct);

module.exports = router;