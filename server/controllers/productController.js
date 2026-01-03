// const Product = require('../models/Product'); // בלי סוגריים מסולסלים
// // 1. שליפת כל המוצרים (Read)
// exports.getAllProducts = async (req, res) => {
//     try {
//         const products = await Product.find();
//         res.json(products);
//     } catch (err) {
//         res.status(500).json({ message: 'שגיאת שרת בשליפת מוצרים' });
//     }
// };

// // 2. הוספת מוצר חדש (Create) - רק למנהל
// exports.addProduct = async (req, res) => {
//     try {
//         const product = new Product(req.body);
//         await product.save();
//         res.status(201).json(product);
//     } catch (err) {
//         res.status(400).json({ message: 'נתונים לא תקינים' });
//     }
// };

// // 3. עדכון מוצר (Update)
// exports.updateProduct = async (req, res) => {
//     try {
//         const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
//         res.json(updatedProduct);
//     } catch (err) {
//         res.status(400).json({ message: 'עדכון נכשל' });
//     }
// };

// // 4. מחיקת מוצר (Delete)
// exports.deleteProduct = async (req, res) => {
//     try {
//         await Product.findByIdAndDelete(req.params.id);
//         res.json({ message: 'המוצר נמחק' });
//     } catch (err) {
//         res.status(400).json({ message: 'מחיקה נכשלה' });
//     }
// };