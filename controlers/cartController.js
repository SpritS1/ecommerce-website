const mongoose = require('mongoose');
const Cart = require('../models/Cart');


module.exports.cart_get = (req, res) => {
    res.render('cart');
}

module.exports.cart_post = async (req, res) => {
    const productId = req.body.productId;
    const quantity = parseInt(req.body.quantity);
}