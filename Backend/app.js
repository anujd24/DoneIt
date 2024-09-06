// backend/app.js

const express = require('express');
const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const User = require('./models/User');
const Todo = require('./models/Todo'); // Add this if you create a Todo model
require('dotenv').config();

const app = express();

// Middleware for handling JSON requests
app.use(express.json());


// MongoDB connection
mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB connection error:', err));


// Auth Routes


// Middleware to check if user is authenticated

const isAuthenticated = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });

    try {
        const decoded = verifyToken(token);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

// Todo Routes (Add these if you are managing todos)
// Todo Routes
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
