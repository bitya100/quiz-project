const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    image: String, // לנראות ב-React
    category: String
});

module.exports = mongoose.model('Product', productSchema);