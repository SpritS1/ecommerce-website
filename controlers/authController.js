const Client = require('../models/Client');
const Cart = require('../models/Cart');
const jwt = require('jsonwebtoken');

// Create JWT tokens
const tokenMaxAge = 60 * 60;

const createToken = (id) => {
    return jwt.sign({ id }, 'pantofel' , { expiresIn: tokenMaxAge });
};

const handleError = (error) => {
    let errors = { email: undefined, password: undefined, firstname: undefined, surname: undefined, phone: undefined, city: undefined };

    // duplicate error code
    if (error.code === 11000) {
        console.log(error);
        if (error.keyValue.email) {
            errors.email = `${error.keyValue.email} is already taken`;
        }
        if (error.keyValue.phone) {
            errors.phone = `${error.keyValue.phone} is already taken`;
        }
        return errors;
    }

    if (error.errors) {
        if (error.errors.email) {
            errors.email = error.errors.email.message;
        }

        if (error.errors.password) {
            errors.password = error.errors.password.message;
        }

        if (error.errors.firstname) {
            errors.firstname = error.errors.firstname.message;
        }

        if (error.errors.surname) {
            errors.surname = error.errors.surname.message;
        }

        if (error.errors.phone) {
            errors.phone = error.errors.phone.message;
        }

        if (error.errors.city) {
            errors.city = error.errors.city.message;
        }
        return errors;        
    } else {
        if (error.name = 'emailError') {
            errors.email = error.message;
        } else if (error.name = 'passwordError') {
            errors.password = error.message;
        }
        return errors;
    }
};

const tempCartToCart = () => {

}

module.exports.register_get = (req, res) => {
    res.render('account/register.pug');
};

module.exports.register_post = async (req, res) => {
    const { email, password, firstname, surname, phone, city } = req.body; 

    try {
        const cart = await Cart.create({}); // Tworzenie koszyka klienta (pusty na poczatku)
        const client = await Client.create({ email, password, firstname, surname, phone, city, shoppingCartId: cart._id });  

        const token = createToken(client._id);
        
        res.cookie('authToken', token, { maxAge: tokenMaxAge * 7000, httpOnly: true });
        res.status(201).json({ client: client._id });
    } catch (error){
        const errors = handleError(error);
        res.status(400).json({ errors });
    }
};

module.exports.login_get = (req, res) => {
    res.render('account/login.pug');
}

module.exports.login_post = async (req, res) => {
    const { email, password } = req.body;

    try {
        const client = await Client.login(email, password);
        const token = createToken(client._id);
        
        res.cookie('authToken', token, { maxAge: tokenMaxAge * 1000, httpOnly: true });
        res.status(200).json({ client: client.email});
    } catch (error) {
        const errors = handleError(error);
        console.log(errors);
        res.status(400).json({errors});
    }
}

module.exports.logout = (req, res) => {
    res.cookie('authToken', '', { maxAge: 1});
    res.redirect('/');
}