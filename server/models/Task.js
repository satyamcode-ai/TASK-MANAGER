const mongoose = require('mongoose');

const taskSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        title: {
            type: String,
            required: [true, 'Please add a text value'],
        },
        description: {
            type: String,
        },
        dueDate: {
            type: Date,
        },
        status: {
            type: String,
            enum: ['pending', 'completed'],
            default: 'pending',
        },
        priority: {
            type: String,
            enum: ['low', 'medium', 'high'],
            default: 'low',
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Task', taskSchema);
