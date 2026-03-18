const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema(
    {
        company: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Company',
            required: [true, 'Company is required'],
        },
        employeeId: {
            type: String,
            required: [true, 'Employee ID is required'],
            trim: true,
        },
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
        },
        phone: {
            type: String,
            required: [true, 'Phone is required'],
            trim: true,
        },
        email: {
            type: String,
            trim: true,
            lowercase: true,
        },
        aadhaarNumber: {
            type: String,
            trim: true,
        },
        panNumber: {
            type: String,
            trim: true,
            uppercase: true,
        },
        address: {
            type: String,
            trim: true,
        },
        designation: {
            type: String,
            required: [true, 'Designation is required'],
            trim: true,
        },
        department: {
            type: String,
            default: 'General',
            trim: true,
        },
        joiningDate: {
            type: Date,
            default: Date.now,
        },
        bankDetails: {
            bankName: { type: String, trim: true },
            accountName: { type: String, trim: true },
            accountNumber: { type: String, trim: true },
            ifscCode: { type: String, trim: true, uppercase: true },
        },
        basicSalary: {
            type: Number,
            default: 0,
            min: 0,
        },
        allowances: {
            type: Number,
            default: 0,
            min: 0,
        },
        deductions: {
            type: Number,
            default: 0,
            min: 0,
        },
        netSalary: {
            type: Number,
            default: 0,
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

staffSchema.index({ company: 1, employeeId: 1 }, { unique: true });
staffSchema.index({ company: 1, name: 1 });
staffSchema.index({ company: 1, isActive: 1 });

module.exports = mongoose.model('Staff', staffSchema);
