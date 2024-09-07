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
        type: Number, 
        default: 0 
    },
    completed: { 
        type: Boolean, 
        default: false 
    },
}, { timestamps: true }); 


const Todo = mongoose.model('Todo', todoSchema);

module.exports = Todo;
