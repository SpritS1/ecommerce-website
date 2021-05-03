const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { isEmail } = require('validator');
const Product = require('./Product');


const clientSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Email required"],
        unique: true,
        lowercase: true,
        validate: [isEmail , 'Email not valid']
    },

    password: {
        type: String,
        required: [true, 'Password required'],
        minLength: [6, 'Password too short']
    },
    firstname: {
        type: String,
        required: [true, 'Firstname required']
    },
    surname: {
        type: String,
        required: [true, 'Surname required']
    },
    phone: {
        type: String,
        required: [true, 'Phone required'],
        unique: true,
        minLength: 9,
        maxLength: 10,
    },
    city: {
        type: String,
        required: [true, 'City required']
    },
    shoppingCartId: { type: mongoose.Schema.Types.ObjectId }
});

clientSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

clientSchema.statics.login = async function (email, password) {
    const client = await this.findOne({ email });

    if (client) {
        const auth = await bcrypt.compare(password, client.password)
        if (auth) {
            return client;
        } 
        let error = new Error;
        error.name = 'passwordError';
        error.message = 'Wrong password';
        throw error;
    } 
    let error = new Error;
    error.name = 'emailError';
    error.message = 'Wrong email';
    throw error;
}

const Client = mongoose.model('Client', clientSchema);

module.exports = Client;