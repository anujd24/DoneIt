const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const todoRoutes = require('./routes/todos');

const app = express();

// Middleware for handling JSON requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the frontend directory
app.use(express.static(path.join(__dirname, '../frontend')));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Root route to serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "../Frontend/todo.html"));
});

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api', todoRoutes);

// Catch-all route to serve the frontend application for any other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../Frontend/todo.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
