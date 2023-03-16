//jshint esversion:6

const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));


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


app.listen(3000, function() {
    console.log('App is running on port 3000.');
})