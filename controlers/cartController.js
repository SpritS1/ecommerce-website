const mongoose = require('mongoose');
const { Cart, TempCart } = require('../models/Cart');
const Product = require('../models/Product');
const jwt = require('jsonwebtoken');
const cartOperations = require('../middleware/cartOperations');


const calcSubtotal = async (productId, quantity) => {
    const product = await Product.findById(productId);
    const price = product.price.value * quantity;

    return price;
}


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
                
                res.json({ cart, status: true });
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
            if (req.cookies.cartToken) {
                const cartId = req.cookies.cartToken;
                const tempCart = await TempCart.findById(cartId);

                let isProductInCart = false;

                for (const item of tempCart.cartItems) {
                    if (item.product.equals(productId)) {
                        isProductInCart = true;
                        item.quantity += quantity;
        
                        if ( item.quantity < 1 ) {
                            item.quantity = 1;
                        }
                        tempCart.subTotal += await calcSubtotal(productId, quantity);

                        tempCart.save();     
                    }
                }

                if (!isProductInCart) {
                    if ( quantity < 1 ) {
                        quantity = 1;
                    }
                    tempCart.cartItems.push({ product: productId, quantity});
                    
                    tempCart.subTotal += await calcSubtotal(productId, quantity);

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
                
                tempCart.subTotal += await calcSubtotal(productId, quantity);

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

            cart.subTotal -= await calcSubtotal(productId, quantity);

            cart.cartItems.pull({ _id: itemId });

            console.log(cart.cartItems);
            cart.save();

            res.send({ status: true });
        } else if (tempCart) {
            const cart = await TempCart.findById(tempCart);
            const item = cart.cartItems.find(( item ) => {
                return item._id.equals(itemId);
            });

            const quantity = item.quantity;
            const itemId = item.product;

            cart.subTotal -= await calcSubtotal(itemId, quantity);

            cart.cartItems.pull({ _id: itemId });

            console.log(cart.cartItems);
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