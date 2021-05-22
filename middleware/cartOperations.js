const mongoose = require('mongoose');
const { Cart, TempCart } = require('../models/Cart');

module.exports.calcSubtotal = async (cart) => {
    await cart.populate('cartItems.product', 'price').execPopulate();

    let cartSubtotal = 0;

    for (const item of cart.cartItems) {
        cartSubtotal += item.product.price.value * item.quantity;
    };

    console.log(`Cart subtotal: ${cartSubtotal}`);
    return cartSubtotal;
};

module.exports.isProductInCart = (cart, productId, quantity) => {
    for (const item of cart.cartItems) {
        if (item.product.equals(productId)) {
            item.quantity += quantity;
            
            if ( item.quantity < 1 ) {
                item.quantity = 1;
            }

            return true;
        } 
    };

    return false;
};
