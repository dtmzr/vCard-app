'use strict';

const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const routes = require('./routes/routes');


// Config
const PORT = 8080;
const HOST = '0.0.0.0';
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;


// App
const app = express();

mongoose.connect('mongodb://db:27017', {
    user: DB_USER,
    pass: DB_PASSWORD,
});
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Connected to db!');
});

app.use(bodyParser());

app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', require('ejs-locals'))
app.set('view engine', 'ejs');

app.use('/public', express.static(path.join(__dirname, 'public')));


// Routes
app.use(routes);

// Binding
app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);