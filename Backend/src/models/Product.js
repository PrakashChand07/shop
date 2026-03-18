const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
    {
        company: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Company',
            required: [true, 'Company is required'],
        },
        name: {
            type: String,
            required: [true, 'Product name is required'],
            trim: true,
        },
        attributes: [
            {
                key: { type: String, trim: true },
                value: { type: String, trim: true },
            }
        ],
        variants: [
            {
                size: { type: String, trim: true },
                color: { type: String, trim: true },
                stock: { type: Number, default: 0, min: 0 },
            }
        ],
        batches: [
            {
                batchNo: { type: String, trim: true },
                expiryDate: { type: Date },
                quantity: { type: Number, default: 0, min: 0 },
            }
        ],
        sku: {
            type: String,
            trim: true,
            uppercase: true,
        },
        description: {
            type: String,
            trim: true,
        },
        purchasePrice: {
            type: Number,
            required: [true, 'Purchase price is required'],
            min: [0, 'Price cannot be negative'],
        },
        sellingPrice: {
            type: Number,
            required: [true, 'Selling price is required'],
            min: [0, 'Price cannot be negative'],
        },
        taxRate: {
            type: Number,
            default: 18, // GST %
            min: 0,
            max: 100,
        },
        hsnCode: {
            type: String,
            trim: true,
        },
        sacCode: {
            type: String,
            trim: true,
        },
        unit: {
            type: String,
            enum: ['pcs', 'kg', 'g', 'litre', 'ml', 'mtr', 'sq.ft', 'hrs', 'days', 'nos', 'box', 'set', 'other'],
            default: 'pcs',
        },
        category: {
            type: String,
            trim: true,
        },
        stock: {
            type: Number,
            default: 0,
            min: 0,
        },
        lowStockAlert: {
            type: Number,
            default: 10,
            min: 0,
        },
        trackInventory: {
            type: Boolean,
            default: false,
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
productSchema.index({ company: 1, createdAt: -1 });
productSchema.index({ company: 1, name: 1 });
productSchema.index({ company: 1, category: 1 });
productSchema.index({ company: 1, isActive: 1 });
// SKU unique per company (sparse since sku is optional)
productSchema.index(
    { company: 1, sku: 1 },
    { unique: true, sparse: true }
);

module.exports = mongoose.model('Product', productSchema);
