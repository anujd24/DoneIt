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
    dueDate: { 
        type: Date 
    },
    priority: { 
        type: String, 
        enum: ['low', 'medium', 'high'], // You can adjust priorities as needed
        default: 'medium'
    },
    category: { 
        type: String 
    },
    subtasks: [{ 
        title: String, 
        completed: { 
            type: Boolean, 
            default: false 
        } 
    }],
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
