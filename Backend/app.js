// backend/index.js
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const todoRoutes = require('./routes/todos');
require('dotenv').config();


const app = express();
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/todos', todoRoutes);

mongoose.connect(process.env.MONGODB_URI);

app.listen(300, () => console.log('Server running on port 3000'));
