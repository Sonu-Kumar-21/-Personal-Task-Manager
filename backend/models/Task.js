const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true,
        default: ''
    },
    dueDate: {
        type: String, 
        default: null
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Low'
    },
    category: {
        type: String,
        enum: ['General', 'Work', 'Personal', 'Health', 'Shopping'],
        default: 'General'
    },
    completed: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
        transform: function (doc, ret) {
            ret.id = ret._id.toString(); 
            delete ret._id; 
            delete ret.__v; 
        }
    }
});

module.exports = mongoose.model('Task', taskSchema);
