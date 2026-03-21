const Invoice = require('../models/Invoice');
const Company = require('../models/Company');

const getPagination = (query) => {
    const page = Math.max(1, parseInt(query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 20));
    const skip = (page - 1) * limit;
    return { page, limit, skip };
};

// @desc    Get all invoices
// @route   GET /api/invoices
// @access  Private
const getInvoices = async (req, res, next) => {
    try {
        const { page, limit, skip } = getPagination(req.query);
        const { status, customer, type, search, gstType, sort = 'createdAt', order = 'desc' } = req.query;

        const filter = { company: req.companyId };
        if (status) filter.status = status;
        if (customer) filter.customer = customer;
        if (type) filter.type = type;
        if (search) filter.invoiceNumber = { $regex: search, $options: 'i' };
        if (gstType === 'gst') filter.totalTax = { $gt: 0 };
        else if (gstType === 'nongst') filter.totalTax = { $eq: 0 };

        const sortObj = { [sort]: order === 'asc' ? 1 : -1 };
        const total = await Invoice.countDocuments(filter);
        const invoices = await Invoice.find(filter)
            .populate('customer', 'name email phone companyName')
            .populate('createdBy', 'name email')
            .sort(sortObj)
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            success: true,
            data: invoices,
            pagination: { total, page, pages: Math.ceil(total / limit), limit },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single invoice (full data for UI invoice view)
// @route   GET /api/invoices/:id
// @access  Private
const getInvoice = async (req, res, next) => {
    try {
        const invoice = await Invoice.findOne({ _id: req.params.id, company: req.companyId })
            .populate('customer', 'name email phone companyName gstin panNumber address')
            .populate('lineItems.product', 'name sku')
            .populate('createdBy', 'name email');

        if (!invoice) {
            return res.status(404).json({ success: false, message: 'Invoice not found.' });
        }
        res.status(200).json({ success: true, data: invoice });
    } catch (error) {
        next(error);
    }
};

// @desc    Create invoice
// @route   POST /api/invoices
// @access  Private
const createInvoice = async (req, res, next) => {
    try {
        // Snap company data at the time of invoice creation
        const company = await Company.findById(req.companyId);
        const companySnapshot = {
            name: company.name,
            email: company.email,
            phone: company.phone,
            logo: company.logo,
            address: company.address,
            gstin: company.gstin,
            panNumber: company.panNumber,
            bankDetails: company.bankDetails,
        };

        const invoice = await Invoice.create({
            ...req.body,
            company: req.companyId,
            companySnapshot,
            createdBy: req.user._id,
        });

        // Reduce product stock automatically
        if (invoice.type === 'invoice' && invoice.lineItems && invoice.lineItems.length > 0) {
            const Product = require('../models/Product');
            for (const item of invoice.lineItems) {
                if (item.product) {
                    await Product.findByIdAndUpdate(item.product, {
                        $inc: { stock: -item.quantity }
                    });
                }
            }
        }

        await invoice.populate('customer', 'name email phone companyName');
        res.status(201).json({ success: true, message: 'Invoice created.', data: invoice });
    } catch (error) {
        next(error);
    }
};

// @desc    Update invoice
// @route   PUT /api/invoices/:id
// @access  Private
const updateInvoice = async (req, res, next) => {
    try {
        const invoice = await Invoice.findOne({ _id: req.params.id, company: req.companyId });
        if (!invoice) {
            return res.status(404).json({ success: false, message: 'Invoice not found.' });
        }
        if (invoice.status === 'paid') {
            return res.status(400).json({ success: false, message: 'Cannot edit a paid invoice.' });
        }

        // Disallow changing company
        delete req.body.company;
        delete req.body.companySnapshot;
        delete req.body.invoiceNumber;

        Object.assign(invoice, req.body);
        await invoice.save();
        res.status(200).json({ success: true, message: 'Invoice updated.', data: invoice });
    } catch (error) {
        next(error);
    }
};

// @desc    Update invoice status
// @route   PATCH /api/invoices/:id/status
// @access  Private
const updateInvoiceStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const invoice = await Invoice.findOneAndUpdate(
            { _id: req.params.id, company: req.companyId },
            { status },
            { new: true, runValidators: true }
        );
        if (!invoice) {
            return res.status(404).json({ success: false, message: 'Invoice not found.' });
        }
        res.status(200).json({ success: true, message: `Invoice marked as ${status}.`, data: invoice });
    } catch (error) {
        next(error);
    }
};

// @desc    Convert quotation to invoice
// @route   POST /api/invoices/:id/convert
// @access  Private
const convertToInvoice = async (req, res, next) => {
    try {
        const quotation = await Invoice.findOne({
            _id: req.params.id,
            company: req.companyId,
            type: 'quotation',
        });
        if (!quotation) {
            return res.status(404).json({ success: false, message: 'Quotation not found.' });
        }

        const company = await Company.findById(req.companyId);
        const companySnapshot = {
            name: company.name, email: company.email, phone: company.phone,
            logo: company.logo, address: company.address, gstin: company.gstin,
            panNumber: company.panNumber, bankDetails: company.bankDetails,
        };

        const newInvoice = await Invoice.create({
            company: req.companyId,
            type: 'invoice',
            customer: quotation.customer,
            lineItems: quotation.lineItems,
            discount: quotation.discount,
            discountType: quotation.discountType,
            isIgst: quotation.isIgst,
            dueDate: req.body.dueDate || quotation.dueDate,
            notes: quotation.notes,
            termsAndConditions: quotation.termsAndConditions,
            companySnapshot,
            convertedFrom: quotation._id,
            createdBy: req.user._id,
        });

        await quotation.updateOne({ status: 'cancelled' });
        res.status(201).json({ success: true, message: 'Quotation converted to invoice.', data: newInvoice });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete invoice
// @route   DELETE /api/invoices/:id
// @access  Private (Admin)
const deleteInvoice = async (req, res, next) => {
    try {
        const invoice = await Invoice.findOne({ _id: req.params.id, company: req.companyId });
        if (!invoice) {
            return res.status(404).json({ success: false, message: 'Invoice not found.' });
        }
        if (invoice.status === 'paid') {
            return res.status(400).json({ success: false, message: 'Cannot delete a paid invoice.' });
        }
        await invoice.deleteOne();
        res.status(200).json({ success: true, message: 'Invoice deleted.' });
    } catch (error) {
        next(error);
    }
};

// @desc    Invoice stats
// @route   GET /api/invoices/stats
// @access  Private
const getInvoiceStats = async (req, res, next) => {
    try {
        const stats = await Invoice.aggregate([
            { $match: { company: req.companyId, type: 'invoice' } },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 },
                    totalAmount: { $sum: '$grandTotal' },
                },
            },
        ]);

        const formatted = {};
        stats.forEach((s) => {
            formatted[s._id] = { count: s.count, total: s.totalAmount };
        });

        res.status(200).json({ success: true, data: formatted });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getInvoices,
    getInvoice,
    createInvoice,
    updateInvoice,
    updateInvoiceStatus,
    convertToInvoice,
    deleteInvoice,
    getInvoiceStats,
};
