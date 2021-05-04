const mongoose = require('mongoose');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const jwt = require('jsonwebtoken');



module.exports.cart_get = async (req, res) => {
    const client = res.locals.client;
    const cart = await Cart.findOne(client.shoppingCartId);
    console.log(cart);
    // res.send(cart);
    res.render('cart', { cart });
}

module.exports.cart_post = async (req, res) => {
    const productId = req.body.productId;
    const quantity = parseInt(req.body.quantity);
    const client = res.locals.client;

    try {
        const product = await Product.findById(productId);
        console.log(product);

        const cart = await Cart.findOne(client.shoppingCartId);
        cart.items.push({ productId: productId, quantity, price: product.price.value });
        cart.save();
        console.log(cart.items);

        res.send("gituwa");
    } catch (error) {   
        console.log(error);
        res.status(400).send({ error });
    }
}