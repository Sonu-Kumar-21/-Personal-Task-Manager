const express = require('express');
const { getTasks, saveTasks } = require('../data/store');

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

// GET all tasks (with optional search query)
router.get('/', async (req, res) => {
    const { search } = req.query;
    try {
        let tasks = await getTasks();
        if (search) {
            tasks = tasks.filter(task => 
                task.title.toLowerCase().includes(search.toLowerCase())
            );
        }
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
});

// POST a new task
router.post('/', validateTask, async (req, res) => {
    const { title, description, dueDate, priority, category } = req.body;
    
    if (!title) {
        return res.status(400).json({ error: 'Title is required' });
    }

    try {
        const tasks = await getTasks();
        const newTask = {
            id: Date.now().toString(), 
            title: title.trim(),
            description: description ? String(description).trim() : '',
            dueDate: dueDate || null,
            priority: priority || 'Low',
            category: category || 'General',
            completed: false,
            createdAt: new Date().toISOString()
        };
        
        tasks.push(newTask);
        await saveTasks(tasks);
        
        res.status(201).json(newTask);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create task' });
    }
});

// PUT update an existing task
router.put('/:id', validateTask, async (req, res) => {
    const { id } = req.params;
    const { title, description, dueDate, completed, priority, category } = req.body;

    try {
        const tasks = await getTasks();
        const taskIndex = tasks.findIndex(t => t.id === id);
        
        if (taskIndex === -1) {
            return res.status(404).json({ error: 'Task not found' });
        }

        const currentTask = tasks[taskIndex];
        
        const updatedTask = {
            ...currentTask,
            title: title !== undefined ? title.trim() : currentTask.title,
            description: description !== undefined ? String(description).trim() : currentTask.description,
            dueDate: dueDate !== undefined ? dueDate : currentTask.dueDate,
            completed: completed !== undefined ? Boolean(completed) : currentTask.completed,
            priority: priority !== undefined ? priority : currentTask.priority,
            category: category !== undefined ? category : currentTask.category
        };

        tasks[taskIndex] = updatedTask;
        await saveTasks(tasks);
        
        res.json(updatedTask);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update task' });
    }
});

// DELETE a task
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const tasks = await getTasks();
        const filteredTasks = tasks.filter(t => t.id !== id);
        
        if (tasks.length === filteredTasks.length) {
            return res.status(404).json({ error: 'Task not found' });
        }

        await saveTasks(filteredTasks);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete task' });
    }
});

module.exports = router;
