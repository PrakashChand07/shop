const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema(
    {
        company: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Company',
            required: [true, 'Company is required'],
        },
        name: {
            type: String,
            required: [true, 'Supplier name is required'],
            trim: true,
        },
        contactPerson: {
            type: String,
            required: [true, 'Contact person is required'],
            trim: true,
        },
        email: {
            type: String,
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
        },
        phone: {
            type: String,
            required: [true, 'Phone number is required'],
            trim: true,
        },
        gstNumber: {
            type: String,
            trim: true,
            uppercase: true,
        },
        address: {
            type: String,
            required: [true, 'Address is required'],
            trim: true,
        },
        outstanding: {
            type: Number,
            default: 0,
        },
        totalPurchases: {
            type: Number,
            default: 0,
        },
        status: {
            type: String,
            enum: ['active', 'inactive'],
            default: 'active',
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
supplierSchema.index({ company: 1, createdAt: -1 });
supplierSchema.index({ company: 1, status: 1 });
supplierSchema.index({ company: 1, name: 1 });
// email unique per company (allow null)
supplierSchema.index(
    { company: 1, email: 1 },
    { unique: true, sparse: true }
);

module.exports = mongoose.model('Supplier', supplierSchema);
