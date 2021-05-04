const express = require('express');
const cartController = require('../controlers/cartController');
const { requireAuth, checkClient } = require('../middleware/requireAuth');

const router = express.Router();

router.get('/cart', requireAuth, checkClient, cartController.cart_get);

router.post('/cart', requireAuth, checkClient, cartController.cart_post);

module.exports = router;