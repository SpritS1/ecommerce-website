const mongoose = require('mongoose');
const { Cart, TempCart } = require('../models/Cart');
const Client = require('../models/Client');
const jwt = require('jsonwebtoken');

const jwtseed = 'pantofel';

const checkCartQuantity = async (req, res, next) => {
    try {
        const token = req.cookies.authToken;
        const tempCartToken = req.cookies.cartToken;

        if (token) {
            const clientId = await jwt.decode(token, jwtseed).id;
            const client = await Client.findById(clientId);
            const cart = await Cart.findById(client.shoppingCartId);    

            res.locals.cartItemsQuantity = cart.cartItems.length;
        } else if (tempCartToken) {
            const cart = await TempCart.findById(tempCartToken);

            res.locals.cartItemsQuantity = cart.cartItems.length;
        }
        next();
    }
    catch (err) {
        console.log(err);
        res.locals.cartItemsQuantity = 0;
        next();
    }
};

module.exports = checkCartQuantity;
