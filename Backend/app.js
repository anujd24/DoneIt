// backend/app.js

const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').Strategy;
const User = require('./models/User');
const Todo = require('./models/Todo'); // Add this if you create a Todo model
require('dotenv').config();

const app = express();

// Middleware for handling JSON requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Middleware for handling sessions
app.use(session({
    secret: process.env.SESSION_SECRET || 'secret-key',
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
    callbackURL: `${process.env.BASE_URL}/auth/google/callback`
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

// Auth Routes
app.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

app.get('/auth/google/callback', passport.authenticate('google', {
    failureRedirect: '/login'
}), (req, res) => {
    res.redirect('/todos');  // Redirect to todos page after successful login
});

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
};

// Todo Routes (Add these if you are managing todos)
app.post('/todos', isAuthenticated, async (req, res) => {
    const { title, description, reminder, timer } = req.body;
    try {
        const todo = new Todo({
            userId: req.user.id,
            title,
            description,
            reminder,
            timer
        });
        await todo.save();
        res.status(201).json(todo);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.get('/todos', isAuthenticated, async (req, res) => {
    try {
        const todos = await Todo.find({ userId: req.user.id });
        res.json(todos);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.put('/todos/:id', isAuthenticated, async (req, res) => {
    const { id } = req.params;
    const { title, description, reminder, timer, completed } = req.body;
    try {
        const todo = await Todo.findByIdAndUpdate(id, { title, description, reminder, timer, completed }, { new: true });
        res.json(todo);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.delete('/todos/:id', isAuthenticated, async (req, res) => {
    const { id } = req.params;
    try {
        await Todo.findByIdAndDelete(id);
        res.status(204).end();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
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
