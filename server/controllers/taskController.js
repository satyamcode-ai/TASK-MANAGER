const Task = require('../models/Task');
const User = require('../models/User');

// @desc    Get tasks
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res) => {
    const tasks = await Task.find({ user: req.user.id });
    res.status(200).json(tasks);
};

// @desc    Set task
// @route   POST /api/tasks
// @access  Private
const setTask = async (req, res) => {
    if (!req.body.title) {
        res.status(400);
        throw new Error('Please add a title field');
    }

    const task = await Task.create({
        user: req.user.id,
        title: req.body.title,
        description: req.body.description,
        dueDate: req.body.dueDate,
        priority: req.body.priority,
        status: req.body.status,
    });

    res.status(200).json(task);
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
    const task = await Task.findById(req.params.id);

    if (!task) {
        res.status(400);
        throw new Error('Task not found');
    }

    // Check for user
    if (!req.user) {
        res.status(401);
        throw new Error('User not found');
    }

    // Make sure the logged in user matches the task user
    if (task.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User not authorized');
    }

    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    });

    res.status(200).json(updatedTask);
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res) => {
    const task = await Task.findById(req.params.id);

    if (!task) {
        res.status(400);
        throw new Error('Task not found');
    }

    // Check for user
    if (!req.user) {
        res.status(401);
        throw new Error('User not found');
    }

    // Make sure the logged in user matches the task user
    if (task.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User not authorized');
    }

    await task.deleteOne();

    res.status(200).json({ id: req.params.id });
};

module.exports = {
    getTasks,
    setTask,
    updateTask,
    deleteTask,
};
