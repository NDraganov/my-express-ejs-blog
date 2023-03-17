//jshint esversion:6
require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');

const mongodbUrl = process.env.MONGODB_LINK;

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {}
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(mongodbUrl, {useNewUrlParser: true});

const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    username: String,
    password: String
});

userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model('User', userSchema);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.route('/')
    .get((req, res) => {

        res.render('home');

    })   

app.route('/register')
    .get((req, res) => {

        res.render('register');

    })
    .post((req, res) => {

        User.register({username: req.body.username}, req.body.password)
            .then((user) => {
                passport.authenticate('local')(req, res, () => {
                    res.redirect('/write-post');
                });
            })
            .catch((err) => {
                res.send(err);
                res.redirect('/register')
            });
        
    });

app.route('/sign-in')
    .get((req, res) => {

        res.render('sign-in');

    })
    .post((req, res) => {

        const user = new User({
            username: req.body.username,
            password: req.body.password
        });

        req.login(user, (err) => {
            if(err) {
                res.send(err);
            } else {
                passport.authenticate('local')(req, res, () => {
                    res.redirect('/write-post');
                });
            }
        })
        
    });

app.route('/write-post')
    .get((req, res) => {

        if(req.isAuthenticated()) {
            res.render('write-post');
        } else {
            res.redirect('/sign-in');
        }

    })
    .post((req, res) => {

        res.render('write-post');

    });


app.listen(3000, function() {
    console.log('App is running on port 3000.');
});