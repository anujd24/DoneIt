// backend/routes/todos.js
const express = require('express');
const Todo = require('../models/Todo.js');
const authMiddleware = require('../middleware/auth.js'); // Import the middleware
const router = express.Router();

router.use(authMiddleware); // Apply middleware to all routes in this file

router.post('/', async (req, res) => {
    const { title, description, dueDate, priority, category, subtasks } = req.body;
    try {
        const todo = await Todo.create({ title, description, dueDate, priority, category, subtasks, userId: req.userId });
        res.status(201).json(todo);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const todos = await Todo.find({ userId: req.userId });
        res.json(todos);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const todo = await Todo.findOneAndUpdate({ _id: id, userId: req.userId }, req.body, { new: true });
        res.json(todo);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await Todo.findOneAndDelete({ _id: id, userId: req.userId });
        res.json({ message: 'Todo deleted' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
