const mongoose = require('mongoose');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const jwt = require('jsonwebtoken');



module.exports.cart_get = async (req, res) => {
    const client = res.locals.client;
    const cart = await Cart.findOne(client.shoppingCartId);
    await cart.populate('cartItems.product', 'name price imageUrl').execPopulate(); // Zostawic
    console.log(cart);
    // res.json({ cart });
    res.render('cart', { cart });
}

module.exports.cart_post = async (req, res) => {
    const productId = req.body.productId;
    const quantity = parseInt(req.body.quantity);
    const client = res.locals.client;

    try {
        const cart = await Cart.findById(client.shoppingCartId);
        let productInCart = false;
        cart.cartItems.forEach(item => {
            if (item.product.equals(productId)) {
                productInCart = true;
                console.log("Produkt już jest w koszyku");
                item.quantity += quantity;

                if ( item.quantity < 1 ) {
                    item.quantity = 1;
                }
                cart.save();     
            }
        });

        if (productInCart) {
            res.json({ cart });
        } else if (!productInCart) {
            cart.cartItems.push({ product: productId, quantity});
            cart.save();     
            res.json({ cart });
        }   
    } catch (error) {   
        console.log(error);
        res.status(400).send({ error });
    }
}