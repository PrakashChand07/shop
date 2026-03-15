const mongoose = require('mongoose');

const purchaseOrderItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: [true, 'Product is required'],
    },
    quantity: {
        type: Number,
        required: [true, 'Quantity is required'],
        min: [1, 'Quantity cannot be less than 1'],
    },
    unit: {
        type: String,
        default: 'pcs',
    },
});

const purchaseOrderSchema = new mongoose.Schema(
    {
        company: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Company',
            required: [true, 'Company is required'],
        },
        poNumber: {
            type: String,
            required: [true, 'PO Number is required'],
            trim: true,
        },
        supplier: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Supplier',
            required: [true, 'Supplier is required'],
        },
        orderDate: {
            type: Date,
            required: [true, 'Order date is required'],
            default: Date.now,
        },
        expectedDelivery: {
            type: Date,
        },
        amount: {
            type: Number,
            required: [true, 'Total amount is required'],
        },
        items: [purchaseOrderItemSchema],
        status: {
            type: String,
            enum: ['pending', 'approved', 'completed', 'paid', 'cancelled'],
            default: 'pending',
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
purchaseOrderSchema.index({ company: 1, createdAt: -1 });
purchaseOrderSchema.index({ company: 1, poNumber: 1 }, { unique: true });
purchaseOrderSchema.index({ company: 1, status: 1 });

module.exports = mongoose.model('PurchaseOrder', purchaseOrderSchema);
