const Todo = require('../models/Todo');

// Create a new todo
exports.createTodo = async (req, res) => {
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
};

// Get todos for authenticated user
exports.getTodos = async (req, res) => {
    try {
        const todos = await Todo.find({ userId: req.user.id });
        res.json(todos);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Update a todo
exports.updateTodo = async (req, res) => {
    const { id } = req.params;
    const { title, description, reminder, timer, completed } = req.body;
    try {
        const todo = await Todo.findByIdAndUpdate(id, { title, description, reminder, timer, completed }, { new: true });
        res.json(todo);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a todo
exports.deleteTodo = async (req, res) => {
    const { id } = req.params;
    try {
        await Todo.findByIdAndDelete(id);
        res.status(204).end();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
