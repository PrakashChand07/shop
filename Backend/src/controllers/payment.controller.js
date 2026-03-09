const Payment = require('../models/Payment');

const getPagination = (query) => {
    const page = Math.max(1, parseInt(query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 20));
    const skip = (page - 1) * limit;
    return { page, limit, skip };
};

// @desc    Get all payments
// @route   GET /api/payments
// @access  Private
const getPayments = async (req, res, next) => {
    try {
        const { page, limit, skip } = getPagination(req.query);
        const { status, invoice, customer, paymentMethod, sort = 'paymentDate', order = 'desc' } = req.query;

        const filter = { company: req.companyId };
        if (status) filter.status = status;
        if (invoice) filter.invoice = invoice;
        if (customer) filter.customer = customer;
        if (paymentMethod) filter.paymentMethod = paymentMethod;

        const sortObj = { [sort]: order === 'asc' ? 1 : -1 };
        const total = await Payment.countDocuments(filter);
        const payments = await Payment.find(filter)
            .populate('invoice', 'invoiceNumber grandTotal status')
            .populate('customer', 'name email companyName')
            .populate('recordedBy', 'name email')
            .sort(sortObj)
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            success: true,
            data: payments,
            pagination: { total, page, pages: Math.ceil(total / limit), limit },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single payment
// @route   GET /api/payments/:id
// @access  Private
const getPayment = async (req, res, next) => {
    try {
        const payment = await Payment.findOne({ _id: req.params.id, company: req.companyId })
            .populate('invoice', 'invoiceNumber grandTotal status')
            .populate('customer', 'name email companyName');
        if (!payment) {
            return res.status(404).json({ success: false, message: 'Payment not found.' });
        }
        res.status(200).json({ success: true, data: payment });
    } catch (error) {
        next(error);
    }
};

// @desc    Record payment
// @route   POST /api/payments
// @access  Private
const createPayment = async (req, res, next) => {
    try {
        const payment = await Payment.create({
            ...req.body,
            company: req.companyId,
            recordedBy: req.user._id,
        });
        await payment.populate([
            { path: 'invoice', select: 'invoiceNumber grandTotal' },
            { path: 'customer', select: 'name email' },
        ]);
        res.status(201).json({ success: true, message: 'Payment recorded.', data: payment });
    } catch (error) {
        next(error);
    }
};

// @desc    Update payment status
// @route   PATCH /api/payments/:id/status
// @access  Private (Admin)
const updatePaymentStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const payment = await Payment.findOneAndUpdate(
            { _id: req.params.id, company: req.companyId },
            { status },
            { new: true, runValidators: true }
        );
        if (!payment) {
            return res.status(404).json({ success: false, message: 'Payment not found.' });
        }
        res.status(200).json({ success: true, message: `Payment status updated to ${status}.`, data: payment });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete payment
// @route   DELETE /api/payments/:id
// @access  Private (Admin)
const deletePayment = async (req, res, next) => {
    try {
        const payment = await Payment.findOneAndDelete({ _id: req.params.id, company: req.companyId });
        if (!payment) {
            return res.status(404).json({ success: false, message: 'Payment not found.' });
        }
        res.status(200).json({ success: true, message: 'Payment deleted.' });
    } catch (error) {
        next(error);
    }
};

// @desc    Payment stats
// @route   GET /api/payments/stats
// @access  Private
const getPaymentStats = async (req, res, next) => {
    try {
        const methodStats = await Payment.aggregate([
            { $match: { company: req.companyId, status: 'completed' } },
            { $group: { _id: '$paymentMethod', count: { $sum: 1 }, total: { $sum: '$amount' } } },
        ]);

        const totalRevenue = await Payment.aggregate([
            { $match: { company: req.companyId, status: 'completed' } },
            { $group: { _id: null, total: { $sum: '$amount' } } },
        ]);

        res.status(200).json({
            success: true,
            data: {
                byMethod: methodStats,
                totalRevenue: totalRevenue[0]?.total || 0,
            },
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { getPayments, getPayment, createPayment, updatePaymentStatus, deletePayment, getPaymentStats };
