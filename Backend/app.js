// backend/app.js

const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('./models/User');
require('dotenv').config();

const app = express();

// MongoDB connection
mongoose.connect('mongodb+srv://anujd24:GkTYCfHDWEwzmVIn@ad.tqrvfcl.mongodb.net/', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log(err));

// Middleware for handling sessions
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true,
}));

// Passport.js middleware
app.use(passport.initialize());
app.use(passport.session());

// Passport Google OAuth strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/auth/google/callback'

}, async (accessToken, refreshToken, profile, done) => {
    const { id, displayName, emails } = profile;
    const email = emails[0].value;
    
    try {
        let user = await User.findOne({ googleId: id });
        if (!user) {
            user = new User({ googleId: id, name: displayName, email });
            await user.save();
        }
        done(null, user);
    } catch (error) {
        done(error);
    }
}));

// Serialization and Deserialization
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

// Routes

// Auth Routes
app.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

app.get('/auth/google/callback', passport.authenticate('google', {
    failureRedirect: '/login'
}), (req, res) => {
    res.redirect('/');  // Redirect to home after successful login
});

// Check if user is logged in
const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
};

// Protected route - only accessible to logged-in users
app.get('/todos', isAuthenticated, (req, res) => {
    res.send(`Welcome ${req.user.name}, here are your todos.`);
});

// Logout
app.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) { return next(err); }
        res.redirect('/');
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
