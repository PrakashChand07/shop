const mongoose = require('mongoose');

const companySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Company name is required'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Company email is required'],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
        },
        phone: {
            type: String,
            trim: true,
        },
        website: {
            type: String,
            trim: true,
        },
        logo: {
            type: String, // Cloudinary URL
            default: null,
        },
        address: {
            street: { type: String, trim: true },
            city: { type: String, trim: true },
            state: { type: String, trim: true },
            pincode: { type: String, trim: true },
            country: { type: String, default: 'India' },
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
        // Invoice settings
        invoicePrefix: {
            type: String,
            default: 'INV',
            uppercase: true,
            trim: true,
        },
        nextInvoiceNumber: {
            type: Number,
            default: 1,
        },
        currency: {
            type: String,
            default: 'INR',
        },
        financialYearStart: {
            type: String, // e.g. "04-01" (April 1)
            default: '04-01',
        },
        // Bank details for invoice
        bankDetails: {
            bankName: { type: String, trim: true },
            accountNumber: { type: String, trim: true },
            ifscCode: { type: String, trim: true, uppercase: true },
            accountHolderName: { type: String, trim: true },
            upiId: { type: String, trim: true },
        },
        // Terms for invoices
        defaultTerms: {
            type: String,
            default: 'Payment due within 30 days.',
        },
        // Subscription plan
        plan: {
            type: String,
            enum: ['free', 'basic', 'pro', 'enterprise'],
            default: 'free',
        },
        planExpiry: {
            type: Date,
            default: null,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

// Indexes
companySchema.index({ email: 1 }, { unique: true });
companySchema.index({ isActive: 1 });

module.exports = mongoose.model('Company', companySchema);
