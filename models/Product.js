const mongoose = require('mongoose');

function capitalizeFirstChar(word) {
    const capitalizedWord = word.charAt(0).toUpperCase() + word.slice(1);
    return capitalizedWord;
}

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        lowercase: true,
        required: true,
        get: capitalizeFirstChar
    },
    category: {
        type: String,
        lowercase: true,
        required: true,
    },
    subcategory: {
        type: String,
        lowercase: true,
    },
    description: String,
    quantity: Number,
    price: {
        value: Number,
        currency: String
    },
    imageUrl: [{
        type: String,
    }],
    color: {
        type: String,
        lowercase: true
    }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;