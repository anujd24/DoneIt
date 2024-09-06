const express = require('express');
const { isAuthenticated } = require('../middlewares/auth');
const { createTodo, getTodos, updateTodo, deleteTodo } = require('../controllers/todoController');
const router = express.Router();

router.post('/todos', isAuthenticated, createTodo);
router.get('/todos', isAuthenticated, getTodos);
router.put('/todos/:id', isAuthenticated, updateTodo);
router.delete('/todos/:id', isAuthenticated, deleteTodo);

module.exports = router;
