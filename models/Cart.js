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
});

const TempCartSchema = new mongoose.Schema({
    cartItems: [ItemSchema],
    subTotal: {
        type: Number,
        default: 0
    },
    updatedAt: { type: Date, default: Date.now, unique: true,index: { expires: 2 * 24 * 60 * 60 } }
},
{
    timestamps: true,
    usePushEach: true
});

TempCartSchema.pre('save', (next) => {
    this.updatedAt = Date.now();
    next();
})

module.exports.Cart = mongoose.model('Cart', CartSchema);
module.exports.TempCart = mongoose.model('TempCart', TempCartSchema);

