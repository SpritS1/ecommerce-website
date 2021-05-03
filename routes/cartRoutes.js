const express = require('express');
const cartController = require('../controlers/cartController');

const router = express.Router();

router.get('/cart', cartController.cart_get);

// router.post('/cart', cartController.cart_post);

module.exports = router;