const mongoose = require('mongoose');
const { Cart, TempCart } = require('../models/Cart');
const Product = require('../models/Product');
const jwt = require('jsonwebtoken');


module.exports.cart_get = async (req, res) => {
    const client = res.locals.client;

    try {
        if (client) {
            const cart = await Cart.findOne(client.shoppingCartId);

            await cart.populate('cartItems.product', 'name price imageUrl').execPopulate(); // Zostawic
            res.render('cart', { cart });        

        } else if (!client) {
            if (req.cookies.cartToken) {
                const cartId = req.cookies.cartToken;
                const cart = await TempCart.findById(cartId);
                
                if (cart) {
                    await cart.populate('cartItems.product', 'name price imageUrl').execPopulate();
                }
                res.render('cart', { cart });

            } else if (!req.cookies.cartToken) {
                const cart = await TempCart.create({});
                
                res.cookie('cartToken', cart._id, { 
                    maxAge: 2 * 24 * 60 * 60 * 1000,
                    httpOnly: true 
                });
                res.render('cart', { cart });
                
            }
        }        
    } catch (error) {
        console.log(error);
        res.json({ error });
    }



}

module.exports.cart_post = async (req, res) => {
    const productId = req.body.productId;
    const quantity = parseInt(req.body.quantity);
    const client = res.locals.client;

    if (client) {                           // logged client
        try {
            const cart = await Cart.findById(client.shoppingCartId);
            let isProductInCart = false;

            cart.cartItems.forEach(item => {
                if (item.product.equals(productId)) {
                    isProductInCart = true;
                    item.quantity += quantity;
    
                    if ( item.quantity < 1 ) {
                        item.quantity = 1;
                    }

                    cart.save();     
                }
            });
    
            if (isProductInCart) {
                res.json({ cart });
            } else if (!isProductInCart) {
                cart.cartItems.push({ product: productId, quantity});
                cart.save();     

                res.json({ cart });
            }   
        } catch (error) {   
            console.log(error);
            res.status(400).send({ error });
        }
    } else if (!client) {                   // unlogged client
        try {
            if (req.cookies.cartToken) {
                const cartId = req.cookies.cartToken;
                const tempCart = await TempCart.findById(cartId);

                let isProductInCart = false;

                tempCart.cartItems.forEach(item => {
                    if (item.product.equals(productId)) {
                        isProductInCart = true;
                        item.quantity += quantity;
        
                        if ( item.quantity < 1 ) {
                            item.quantity = 1;
                        }
                        tempCart.save();     
                    }
                });

                if (!isProductInCart) {
                    if ( quantity < 1 ) {
                        quantity = 1;
                    }
                    tempCart.cartItems.push({ product: productId, quantity});
                    tempCart.save();     
                }   

                res.cookie('cartToken', tempCart._id, { 
                    maxAge: 2 * 24 * 60 * 60 * 1000 ,
                    httpOnly: true 
                });     
                res.json({tempCart});

            } else if (!req.cookies.cartToken) {
                const tempCart = await TempCart.create({});
                
                tempCart.cartItems.push({ product: productId, quantity});
                tempCart.save();     

                res.cookie('cartToken', tempCart._id, { 
                    maxAge: 2 * 24 * 60 * 60 * 1000,
                    httpOnly: true 
                });     
                res.json({ tempCart });
            }
        } catch (error) {
            console.log(error);
            res.status(400).send({ error });
        }
    }
}



module.exports.cart_delete = async (req, res) => {
    const productId = req.body.productId;
    const client = res.locals.client;
    const tempCart = req.cookies.cartToken;

    try {
        if (client) {
            const cart = await Cart.findById(client.shoppingCartId);

            cart.cartItems.pull({ _id: productId });
            cart.save();

            res.send({ status: true });
        } else if (tempCart) {
            const cart = await TempCart.findById(tempCart);
            
            cart.cartItems.pull({ _id: productId });
            cart.save();
            
            res.send({ status: true }); 
        } else if (!tempCart && !client) {
            res.status(400).send({ status: false, message: "Failed to delete product from cart"});
        }
    } catch (err) {
        console.log(err);
        res.status(400).send({ error }); 
    }
}