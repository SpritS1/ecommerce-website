const express = require('express');
const mongoose = require('mongoose');
const pug = require('pug');
const cookieParser = require('cookie-parser');
const {checkClient, requireAuth} = require('./middleware/requireAuth');

const app = express();

// view engine
app.set('view engine', 'pug');
app.set('views', './views');

// static files and middleware
app.use(express.static('./public'));
app.use(express.urlencoded({ extended: true }));

//  parse json to js
app.use(express.json());

// cookie-parser
app.use(cookieParser());

// router
const authRoutes = require('./routes/authRoutes');
const productsRoutes = require('./routes/productsRoutes');
const cartRoutes = require('./routes/cartRoutes');

// routes
app.get('*', checkClient);

app.get('/', (req, res) => {
    res.render('index');
})

app.use(productsRoutes);

app.use(authRoutes);

app.use(cartRoutes);


// 404 page
app.use((req, res) => {
    res.render('404', {title: '404'});
})


module.exports = app;