const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    title: String,
    price: Number,
    description: String,
    category: String,
    image: String,
    sold: Boolean,
    dateOfSale: {
        type: Date,
        required: true
    }
});

module.exports = mongoose.model('Product', ProductSchema);
