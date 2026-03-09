const mongoose = require('mongoose');

// Line item sub-schema (GST-compliant)
const lineItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        default: null,
    },
    description: {
        type: String,
        required: [true, 'Item description is required'],
        trim: true,
    },
    hsnCode: { type: String, trim: true },
    sacCode: { type: String, trim: true },
    quantity: {
        type: Number,
        required: [true, 'Quantity is required'],
        min: [0.01, 'Quantity must be greater than 0'],
    },
    unit: { type: String, default: 'pcs' },
    unitPrice: {
        type: Number,
        required: [true, 'Unit price is required'],
        min: [0, 'Unit price cannot be negative'],
    },
    taxRate: {
        type: Number,
        default: 18, // GST %
        min: 0,
        max: 100,
    },
    cgst: { type: Number, default: 0 },
    sgst: { type: Number, default: 0 },
    igst: { type: Number, default: 0 },
    taxAmount: { type: Number, default: 0 },
    subtotal: { type: Number, default: 0 }, // qty * unitPrice before tax
    total: { type: Number, default: 0 },   // subtotal + tax
});

const invoiceSchema = new mongoose.Schema(
    {
        company: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Company',
            required: [true, 'Company is required'],
        },
        invoiceNumber: {
            type: String,
            trim: true,
        },
        type: {
            type: String,
            enum: ['invoice', 'quotation', 'credit_note', 'debit_note'],
            default: 'invoice',
        },
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Customer',
            required: [true, 'Customer is required'],
        },
        // Snapshot of company info at time of invoice (for PDF view)
        companySnapshot: {
            name: String,
            email: String,
            phone: String,
            logo: String,
            address: {
                street: String,
                city: String,
                state: String,
                pincode: String,
                country: String,
            },
            gstin: String,
            panNumber: String,
            bankDetails: {
                bankName: String,
                accountNumber: String,
                ifscCode: String,
                accountHolderName: String,
                upiId: String,
            },
        },
        lineItems: [lineItemSchema],
        subtotal: { type: Number, default: 0 },
        totalCgst: { type: Number, default: 0 },
        totalSgst: { type: Number, default: 0 },
        totalIgst: { type: Number, default: 0 },
        totalTax: { type: Number, default: 0 },
        discount: { type: Number, default: 0, min: 0 },
        discountType: { type: String, enum: ['fixed', 'percent'], default: 'fixed' },
        grandTotal: { type: Number, default: 0 },
        currency: { type: String, default: 'INR' },
        isIgst: {
            type: Boolean,
            default: false, // true for interstate (IGST), false for same-state (CGST+SGST)
        },
        status: {
            type: String,
            enum: ['draft', 'sent', 'paid', 'overdue', 'cancelled'],
            default: 'draft',
        },
        issueDate: { type: Date, default: Date.now },
        dueDate: { type: Date, required: [true, 'Due date is required'] },
        notes: { type: String },
        termsAndConditions: { type: String },
        convertedFrom: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Invoice',
            default: null, // if converted from quotation
        },
        createdBy: {
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
invoiceSchema.index({ company: 1, createdAt: -1 });
invoiceSchema.index({ company: 1, status: 1 });
invoiceSchema.index({ company: 1, customer: 1 });
invoiceSchema.index({ company: 1, type: 1 });
invoiceSchema.index({ company: 1, dueDate: 1 });
invoiceSchema.index(
    { company: 1, invoiceNumber: 1 },
    { unique: true, sparse: true }
);

// --- Pre-save hook: auto invoice number + totals ---
invoiceSchema.pre('save', async function (next) {
    // Auto-generate invoice number (per company sequential)
    if (!this.invoiceNumber && this.type === 'invoice') {
        const Company = mongoose.model('Company');
        const company = await Company.findByIdAndUpdate(
            this.company,
            { $inc: { nextInvoiceNumber: 1 } },
            { new: false } // returns old doc (before increment)
        );
        const prefix = company.invoicePrefix || 'INV';
        const num = company.nextInvoiceNumber;
        const year = new Date().getFullYear();
        this.invoiceNumber = `${prefix}-${year}-${String(num).padStart(4, '0')}`;
    }

    // Calculate totals
    let subtotal = 0;
    let totalCgst = 0;
    let totalSgst = 0;
    let totalIgst = 0;
    let totalTax = 0;

    this.lineItems.forEach((item) => {
        const itemSubtotal = parseFloat((item.quantity * item.unitPrice).toFixed(2));
        const itemTaxAmount = parseFloat(((itemSubtotal * item.taxRate) / 100).toFixed(2));

        if (this.isIgst) {
            item.igst = itemTaxAmount;
            item.cgst = 0;
            item.sgst = 0;
            totalIgst += itemTaxAmount;
        } else {
            const half = parseFloat((itemTaxAmount / 2).toFixed(2));
            item.cgst = half;
            item.sgst = half;
            item.igst = 0;
            totalCgst += half;
            totalSgst += half;
        }

        item.taxAmount = itemTaxAmount;
        item.subtotal = itemSubtotal;
        item.total = parseFloat((itemSubtotal + itemTaxAmount).toFixed(2));
        subtotal += itemSubtotal;
        totalTax += itemTaxAmount;
    });

    // Apply discount
    let discountAmount = 0;
    if (this.discountType === 'percent') {
        discountAmount = parseFloat(((subtotal * this.discount) / 100).toFixed(2));
    } else {
        discountAmount = this.discount || 0;
    }

    this.subtotal = parseFloat(subtotal.toFixed(2));
    this.totalCgst = parseFloat(totalCgst.toFixed(2));
    this.totalSgst = parseFloat(totalSgst.toFixed(2));
    this.totalIgst = parseFloat(totalIgst.toFixed(2));
    this.totalTax = parseFloat(totalTax.toFixed(2));
    this.grandTotal = parseFloat((subtotal + totalTax - discountAmount).toFixed(2));

    next();
});

module.exports = mongoose.model('Invoice', invoiceSchema);
