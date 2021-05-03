const express = require('express');
const authController = require('../controlers/authController');

const router = express.Router();

router.get('/account/register', authController.register_get);

router.post('/account/register', authController.register_post);

router.get('/account/login', authController.login_get);
    
router.post('/account/login', authController.login_post);

router.get('/account/logout', authController.logout);

module.exports = router;