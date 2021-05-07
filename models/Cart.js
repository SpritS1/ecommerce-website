const mongoose = require('mongoose');
const Product = require('./Product');

const ItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    },
    quantity: {
        type: Number,
        required: true,
        min: [1, 'Quantity can not be less than 1']
    }
});

const CartSchema = new mongoose.Schema({
    cartItems: [ItemSchema],
    subTotal: {
        type: Number,
        default: 0
    }
})

module.exports = mongoose.model('Cart', CartSchema);
