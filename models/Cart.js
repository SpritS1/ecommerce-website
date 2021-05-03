const mongoose = require('mongoose');
const Product = require('./Product');

const ItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
    },
    quantity: {
        type: Number,
        required: true,
        min: [1, 'Quantity can not be less than 1']
    }
    // price: {
    //     type: Number,
    //     required: true,
    // }
}, {
    timestamps: true
});

const CartSchema = new mongoose.Schema({
    items: [ItemSchema],
    subTotal: {
        type: Number,
        default: 0
    }
})

module.exports = mongoose.model('cart', CartSchema);