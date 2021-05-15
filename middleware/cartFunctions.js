const mongoose = require('mongoose');
const { Cart, TempCart } = require('../models/Cart');

module.exports.calcSubtotal = (cartId,) => {
    const cart = await Cart.findById(cartId);
    await cart.populate('cartItems.product', 'price').execPopulate();

    let cartSubtotal = 0;

    for (const item of cart.cartItems) {
        cartSubtotal += item.price.value;
    };

    console.log(`Cart subtotal: ${cartSubtotal}`);
    return cartSubtotal;
};
