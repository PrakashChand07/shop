const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
    {
        company: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Company',
            required: [true, 'Company is required'],
        },
        name: {
            type: String,
            required: [true, 'Category name is required'],
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    },
    {
        timestamps: true,
    }
);

// Indexes
categorySchema.index({ company: 1, createdAt: -1 });
categorySchema.index({ company: 1, name: 1 });
categorySchema.index({ company: 1, isActive: 1 });

module.exports = mongoose.model('Category', categorySchema);
