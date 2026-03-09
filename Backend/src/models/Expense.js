const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema(
    {
        company: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Company',
            required: [true, 'Company is required'],
        },
        category: {
            type: String,
            required: [true, 'Category is required'],
            enum: [
                'office_supplies',
                'rent',
                'utilities',
                'salaries',
                'marketing',
                'travel',
                'software',
                'hardware',
                'maintenance',
                'taxes',
                'insurance',
                'other',
            ],
        },
        amount: {
            type: Number,
            required: [true, 'Amount is required'],
            min: [0.01, 'Amount must be greater than 0'],
        },
        description: {
            type: String,
            trim: true,
        },
        date: {
            type: Date,
            required: [true, 'Date is required'],
            default: Date.now,
        },
        vendor: {
            type: String,
            trim: true,
        },
        paymentMethod: {
            type: String,
            enum: ['cash', 'bank_transfer', 'upi', 'cheque', 'card', 'other'],
            default: 'other',
        },
        receipt: {
            type: String, // Cloudinary URL
            default: null,
        },
        notes: {
            type: String,
            trim: true,
        },
        recordedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    },
    {
        timestamps: true,
    }
);

// Indexes
expenseSchema.index({ company: 1, date: -1 });
expenseSchema.index({ company: 1, category: 1 });
expenseSchema.index({ company: 1, createdAt: -1 });

module.exports = mongoose.model('Expense', expenseSchema);
