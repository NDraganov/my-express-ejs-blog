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

const postSchema = new mongoose.Schema({
    title: String,
    content: String
});

userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model('User', userSchema);
const Post = new mongoose.model('Post', postSchema);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.route('/')
    .get((req, res) => {

        
        res.render('home', {isAuthenticated: req.isAuthenticated()});

    });

app.route('/register')
    .get((req, res) => {

        res.render('register', {isAuthenticated: req.isAuthenticated()});

    })
    .post((req, res) => {

        User.register({username: req.body.username, firstName: req.body.firstName, lastName: req.body.lastName}, req.body.password)
            .then((user) => {
                passport.authenticate('local')(req, res, () => {
                    res.redirect('/profile');
                });
            })
            .catch((err) => {
                res.send(err);
                res.redirect('/register')
            });
        
    });

app.route('/sign-in')
    .get((req, res) => {

        res.render('sign-in', {isAuthenticated: req.isAuthenticated()});

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
                    res.redirect('/profile');
                });
            }
        })
        
    });

app.route('/profile')
    .get((req, res) => {

        if(req.isAuthenticated()) {

            Post.find({})
                .then(() => {
                    res.render('profile', {
                        username: req.user.username, 
                        firstName: req.user.firstName, 
                        lastName: req.user.lastName,
                        
                        isAuthenticated: req.isAuthenticated()
                    });
                })
                .catch((err) => {
                    res.send(err);
                })
            
        } else {
            res.redirect('/sign-in');
        }

    })

app.route('/write-post')
    .get((req, res) => {

        if(req.isAuthenticated()) {
            res.render('write-post', {isAuthenticated: req.isAuthenticated()});
        } else {
            res.redirect('/sign-in');
        }

    })
    .post((req, res) => {

        const post = new Post({
            title: req.body.postTitle,
            content: req.body.postContent
        });

        post.save()
            .then(() => {
                res.redirect('/posts');
            })
            .catch((err) => {
                res.send(err);
            })

    });

app.route('/posts')
    .get((req, res) => {

        if(req.isAuthenticated()) {

            Post.find({})
                .then((posts) => {
                    res.render('posts', {
                        posts: posts,
                        isAuthenticated: req.isAuthenticated()
                    });
                })
                .catch((err) => {
                    res.send(err);
                })
            
        } else {
            res.redirect('/sign-in');
        }

    });

app.route('/logout')
    .get((req, res) => {

        req.logout((err) => {
            if(err) {
                return next(err);
            }
        });

        res.redirect('/');
    });


app.listen(3000, function() {
    console.log('App is running on port 3000.');
});