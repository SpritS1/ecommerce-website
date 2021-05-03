const mongoose = require('mongoose');
const Product = require('../models/Product');

module.exports.product_get = async (req, res) => {
    try {
        await Product.find({}, (error, products) => {
            res.render('products', { products });
        })
    } catch (error) {
        console.log(error);
        res.status(400).send({ error });
    }
};

module.exports.product_post = async (req, res) => {
    const { name, category, subcategory, description, quantity, price, color, imageUrl } = req.body;

    try {
        await Product.create({ name, category, subcategory, description, quantity, price, color, imageUrl });
        res.status(201).json({ status: true });
    } catch (error) {
        console.log(error);
        res.status(400).send({ error });
    }
};
