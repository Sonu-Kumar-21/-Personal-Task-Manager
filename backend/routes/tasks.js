const express = require('express');
const Task = require('../models/Task');

const router = express.Router();

const VALID_PRIORITIES = ['Low', 'Medium', 'High'];
const VALID_CATEGORIES = ['General', 'Work', 'Personal', 'Health', 'Shopping'];

// Validation Middleware
const validateTask = (req, res, next) => {
    const { title, priority, category } = req.body;
    
    if (title !== undefined && (typeof title !== 'string' || title.trim() === '')) {
        return res.status(400).json({ error: 'Title must be a non-empty string' });
    }
    if (priority !== undefined && !VALID_PRIORITIES.includes(priority)) {
        return res.status(400).json({ error: `Priority must be one of: ${VALID_PRIORITIES.join(', ')}` });
    }
    if (category !== undefined && !VALID_CATEGORIES.includes(category)) {
        return res.status(400).json({ error: `Category must be one of: ${VALID_CATEGORIES.join(', ')}` });
    }
    next();
};

// GET all tasks
router.get('/', async (req, res) => {
    const { search } = req.query;
    try {
        let query = {};
        if (search) {
            query.title = { $regex: search, $options: 'i' };
        }
        // Sort by creation date descending to match original behavior
        const tasks = await Task.find(query).sort({ createdAt: -1 });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
});

// POST a new task
router.post('/', validateTask, async (req, res) => {
    const { title, description, dueDate, priority, category } = req.body;
    
    if (!title) return res.status(400).json({ error: 'Title is required' });

    try {
        const newTask = await Task.create({
            title: title.trim(),
            description: description ? String(description).trim() : '',
            dueDate: dueDate || null,
            priority: priority || 'Low',
            category: category || 'General'
        });
        res.status(201).json(newTask);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create task' });
    }
});

// PUT update a task
router.put('/:id', validateTask, async (req, res) => {
    const { id } = req.params;
    
    try {
        const updatedTask = await Task.findByIdAndUpdate(
            id,
            { $set: req.body },
            { new: true, runValidators: true }
        );
        
        if (!updatedTask) return res.status(404).json({ error: 'Task not found' });
        res.json(updatedTask);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update task' });
    }
});

// DELETE a task
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const deletedTask = await Task.findByIdAndDelete(id);
        if (!deletedTask) return res.status(404).json({ error: 'Task not found' });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete task' });
    }
});

module.exports = router;
