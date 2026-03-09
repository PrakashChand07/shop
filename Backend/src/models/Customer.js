const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema(
    {
        company: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Company',
            required: [true, 'Company is required'],
        },
        name: {
            type: String,
            required: [true, 'Customer name is required'],
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
            trim: true,
        },
        companyName: {
            type: String,
            trim: true,
        },
        gstin: {
            type: String,
            trim: true,
            uppercase: true,
        },
        panNumber: {
            type: String,
            trim: true,
            uppercase: true,
        },
        address: {
            street: { type: String, trim: true },
            city: { type: String, trim: true },
            state: { type: String, trim: true },
            pincode: { type: String, trim: true },
            country: { type: String, default: 'India' },
        },
        status: {
            type: String,
            enum: ['active', 'inactive'],
            default: 'active',
        },
        notes: {
            type: String,
            trim: true,
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
customerSchema.index({ company: 1, createdAt: -1 });
customerSchema.index({ company: 1, status: 1 });
customerSchema.index({ company: 1, name: 1 });
// email unique per company (allow null)
customerSchema.index(
    { company: 1, email: 1 },
    { unique: true, sparse: true }
);

module.exports = mongoose.model('Customer', customerSchema);
