const mongoose = require('mongoose');

const salaryPaymentSchema = new mongoose.Schema(
    {
        company: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Company',
            required: [true, 'Company is required'],
        },
        staff: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Staff',
            required: [true, 'Staff reference is required'],
        },
        employeeId: {
            type: String,
            required: true,
        },
        staffName: {
            type: String,
            required: true,
        },
        month: {
            type: String,
            enum: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            required: true,
        },
        year: {
            type: Number,
            required: true,
        },
        basicSalary: {
            type: Number,
            required: true,
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
            required: true,
        },
        paymentDate: {
            type: Date,
            default: Date.now,
        },
        paymentMode: {
            type: String,
            enum: ['bank_transfer', 'cash', 'cheque', 'upi'],
            required: true,
        },
        transactionId: {
            type: String,
            trim: true,
        },
        status: {
            type: String,
            enum: ['pending', 'paid', 'hold'],
            default: 'paid',
        },
        recordedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

// Indexes mapping
salaryPaymentSchema.index({ company: 1, staff: 1 });
salaryPaymentSchema.index({ company: 1, month: 1, year: 1 });
salaryPaymentSchema.index({ company: 1, paymentDate: -1 });

module.exports = mongoose.model('SalaryPayment', salaryPaymentSchema);
