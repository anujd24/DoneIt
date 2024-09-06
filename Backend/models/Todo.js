const mongoose = require('mongoose');

// Define the Todo schema
const todoSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    title: { 
        type: String, 
        required: true 
    },
    description: { 
        type: String 
    },
    reminder: { 
        type: Date 
    },
    timer: { 
        type: Number, // Timer in minutes
        default: 0 
    },
    completed: { 
        type: Boolean, 
        default: false 
    },
}, { timestamps: true }); // Automatically add createdAt and updatedAt timestamps

// Create the Todo model
const Todo = mongoose.model('Todo', todoSchema);

module.exports = Todo;
