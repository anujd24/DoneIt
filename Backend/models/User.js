// backend/models/User.js

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    googleId: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    todos: [
        {
            title: String,
            description: String,
            reminder: Date,
            timer: Number
        }
    ]
});

module.exports = mongoose.model('User', UserSchema);
