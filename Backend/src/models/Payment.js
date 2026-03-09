const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
    {
        company: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Company',
            required: [true, 'Company is required'],
        },
        invoice: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Invoice',
            required: [true, 'Invoice reference is required'],
        },
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Customer',
            required: [true, 'Customer reference is required'],
        },
        amount: {
            type: Number,
            required: [true, 'Payment amount is required'],
            min: [0.01, 'Amount must be greater than 0'],
        },
        currency: {
            type: String,
            default: 'INR',
        },
        paymentDate: {
            type: Date,
            default: Date.now,
        },
        paymentMethod: {
            type: String,
            enum: ['cash', 'bank_transfer', 'upi', 'cheque', 'card', 'other'],
            required: [true, 'Payment method is required'],
        },
        transactionId: {
            type: String,
            trim: true,
        },
        status: {
            type: String,
            enum: ['pending', 'completed', 'failed', 'refunded'],
            default: 'completed',
        },
        notes: {
            type: String,
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

// Indexes
paymentSchema.index({ company: 1, paymentDate: -1 });
paymentSchema.index({ company: 1, status: 1 });
paymentSchema.index({ company: 1, invoice: 1 });
paymentSchema.index({ company: 1, customer: 1 });
paymentSchema.index({ company: 1, createdAt: -1 });

// Auto-update invoice status when payment is completed
paymentSchema.post('save', async function () {
    if (this.status === 'completed') {
        const Invoice = mongoose.model('Invoice');
        const invoice = await Invoice.findById(this.invoice);
        if (invoice) {
            const Payment = mongoose.model('Payment');
            const totalPaid = await Payment.aggregate([
                { $match: { invoice: this.invoice, status: 'completed' } },
                { $group: { _id: null, total: { $sum: '$amount' } } },
            ]);
            const paidAmount = totalPaid[0]?.total || 0;
            if (paidAmount >= invoice.grandTotal) {
                await Invoice.findByIdAndUpdate(this.invoice, { status: 'paid' });
            }
        }
    }
});

module.exports = mongoose.model('Payment', paymentSchema);
