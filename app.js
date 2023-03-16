//jshint esversion:6
require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');

const mongodbUrl = process.env.MONGODB_LINK;

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

mongoose.connect(mongodbUrl, {useNewUrlParser: true});

app.route('/')
    .get((req, res) => {
        res.render('home');
    })   

app.route('/write-post')
    .get((req, res) => {
    res.render('write-post');
    })
    .post((req, res) => {
        res.render('write-post');
    });

app.route('/register')
    .get((req, res) => {
    res.render('register');
    })
    .post((req, res) => {
        res.render('register');
    });

app.route('/sign-in')
    .get((req, res) => {
    res.render('sign-in');
    })
    .post((req, res) => {
        res.render('sign-in');
    });


app.listen(3000, function() {
    console.log('App is running on port 3000.');
});