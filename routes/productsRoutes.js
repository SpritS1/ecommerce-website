const express = require('express');
const productController = require('../controlers/productController');

const router = express.Router();

router.get('/products', productController.product_get);

router.post('/products', productController.product_post);


module.exports = router;