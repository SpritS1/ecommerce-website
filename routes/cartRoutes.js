const express = require('express');
const cartController = require('../controlers/cartController');
const { checkClient } = require('../middleware/requireAuth');

const router = express.Router();

router.get('/cart', checkClient, cartController.cart_get);

router.post('/cart', checkClient, cartController.cart_post);

router.delete('/cart', checkClient, cartController.cart_delete);

module.exports = router;