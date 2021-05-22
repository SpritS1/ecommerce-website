const mongoose = require('mongoose');
const { Cart, TempCart } = require('../models/Cart');
const Product = require('../models/Product');
const jwt = require('jsonwebtoken');
const cartOperations = require('../middleware/cartOperations');

module.exports.cart_get = async (req, res) => {
    const client = res.locals.client;

    try {
        if (client) {
            const cart = await Cart.findOne(client.shoppingCartId);

            await cart.populate('cartItems.product', 'name subcategory price imageUrl').execPopulate(); // Zostawic
            res.render('cart', { cart });        

        } else if (!client) {
            if (req.cookies.cartToken) {
                const cartId = req.cookies.cartToken;
                const cart = await TempCart.findById(cartId);
                
                if (cart) {
                    await cart.populate('cartItems.product', 'name subcategory price imageUrl').execPopulate();
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
    console.log(productId);
    
    if (client) {                           // logged client
        try {
            const cart = await Cart.findById(client.shoppingCartId);
        
            const isProductInCart = cartOperations.isProductInCart(cart, productId, quantity);
            console.log(isProductInCart);
    
            if (isProductInCart) {
                cart.subTotal = await cartOperations.calcSubtotal(cart);
                cart.save();
                
                res.json({ cart });
            } else if (!isProductInCart) {
                cart.cartItems.push({ product: productId, quantity});

                cart.subTotal = await cartOperations.calcSubtotal(cart);
                cart.save();     

                res.json({ cart });
            }   
        } catch (error) {   
            console.log(error);
            res.status(400).send({ error });
        }
    } else if (!client) {                   // unlogged client
        try {
            const cartTokenMaxAge = 30 * 24 * 60 * 60 * 1000;
            
            if (req.cookies.cartToken) {
                const cartId = req.cookies.cartToken;
                const cart = await TempCart.findById(cartId);

                const isProductInCart = cartOperations.isProductInCart(cart, productId, quantity);

                if (isProductInCart) {
                    cart.subTotal = await cartOperations.calcSubtotal(cart);
                    cart.save();
                    
                    res.cookie('cartToken', cart._id, { 
                        maxAge: cartTokenMaxAge,
                        httpOnly: true 
                    });     
                    
                    res.json({ cart });
                } else if (!isProductInCart) {
                    cart.cartItems.push({ product: productId, quantity});
    
                    cart.subTotal = await cartOperations.calcSubtotal(cart);
                    cart.save();     
    
                    res.cookie('cartToken', cart._id, { 
                        maxAge: cartTokenMaxAge,
                        httpOnly: true 
                    });     
                    
                    res.json({ cart });
                }   
            } else if (!req.cookies.cartToken) {
                const cart = await TempCart.create({});
                
                cart.cartItems.push({ product: productId, quantity});
                
                cart.subTotal = await cartOperations.calcSubtotal(cart);

                cart.save();     

                res.cookie('cartToken', cart._id, { 
                    maxAge: cartTokenMaxAge,
                    httpOnly: true 
                });     

                res.json({ cart });
            }
        } catch (error) {
            console.log(error);
            res.status(400).send({ error });
        }
    }
};



module.exports.cart_delete = async (req, res) => {
    const itemId = req.body.itemId;
    const client = res.locals.client;
    const tempCart = req.cookies.cartToken;

    try {
        if (client) {
            const cart = await Cart.findById(client.shoppingCartId);

            const item = cart.cartItems.find(( item ) => {  
                return item._id.equals(itemId);
            });

            const quantity = item.quantity;
            const productId = item.product;

            cart.cartItems.pull({ _id: itemId });

            cart.subTotal = await cartOperations.calcSubtotal(cart);

            cart.save();

            res.send({ status: true, cart });
        } else if (tempCart) {
            const cart = await TempCart.findById(tempCart);

            const item = await cart.cartItems.find(( item ) => {
                return item._id.equals(itemId);
            });

            console.log(item);

            const quantity = item.quantity;
            const productId = item.product;

            cart.subTotal = await cartOperations.calcSubtotal(cart);

            cart.cartItems.pull({ _id: itemId });

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