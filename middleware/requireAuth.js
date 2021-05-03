const jwt = require('jsonwebtoken');
const Client = require('../models/Client');

const jwtseed = 'pantofel';

// const handleErrors = () => {

// }

module.exports.requireAuth = (req, res, next) => {
    const token = req.cookies.authToken;

    if(token) {
        jwt.verify(token, jwtseed, (err, decodedToken) => {
            if (err) {
                res.redirect('/account/login');
            } else {
                next();
            }
        });
    } else {
        res.redirect('/account/login');
    }
}

module.exports.checkClient = (req, res, next) => {
    const token = req.cookies.authToken;

    if(token) {
        jwt.verify(token, jwtseed, async (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                res.locals.client = null;
                next();
            } else {
                let client = await Client.findById(decodedToken.id);
                res.locals.client = client;
                // res.locals.client.password = null;
                next();
            }
        });
    }else {
        res.locals.client = null;
        next();
    }
}
