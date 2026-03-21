const Customer = require('../models/Customer');

// Pagination helper
const getPagination = (query) => {
    const page = Math.max(1, parseInt(query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 20));
    const skip = (page - 1) * limit;
    return { page, limit, skip };
};

// @desc    Get all customers (with pagination + search)
// @route   GET /api/customers
// @access  Private
const getCustomers = async (req, res, next) => {
    try {
        const { page, limit, skip } = getPagination(req.query);
        const { status, search, sort = 'createdAt', order = 'desc' } = req.query;

        const filter = { company: req.companyId };
        if (status) filter.status = status;
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { companyName: { $regex: search, $options: 'i' } },
                { phone: { $regex: search, $options: 'i' } },
            ];
        }

        const sortObj = { [sort]: order === 'asc' ? 1 : -1 };
        const total = await Customer.countDocuments(filter);
        const customers = await Customer.find(filter)
            .populate('createdBy', 'name email')
            .sort(sortObj)
            .skip(skip)
            .limit(limit)
            .lean();

        // Calculate total purchases per customer
        const Invoice = require('../models/Invoice');
        const customerIds = customers.map(c => c._id);
        const totals = await Invoice.aggregate([
            { $match: { customer: { $in: customerIds }, type: 'invoice', status: { $ne: 'cancelled' } } },
            { $group: { _id: '$customer', totalPurchases: { $sum: '$grandTotal' } } }
        ]);

        const totalsMap = totals.reduce((acc, curr) => {
            acc[curr._id.toString()] = curr.totalPurchases;
            return acc;
        }, {});

        const customersWithTotals = customers.map(c => ({
            ...c,
            totalPurchases: totalsMap[c._id.toString()] || 0
        }));

        res.status(200).json({
            success: true,
            data: customersWithTotals,
            pagination: { total, page, pages: Math.ceil(total / limit), limit },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single customer
// @route   GET /api/customers/:id
// @access  Private
const getCustomer = async (req, res, next) => {
    try {
        const customer = await Customer.findOne({ _id: req.params.id, company: req.companyId })
            .populate('createdBy', 'name email');
        if (!customer) {
            return res.status(404).json({ success: false, message: 'Customer not found.' });
        }
        res.status(200).json({ success: true, data: customer });
    } catch (error) {
        next(error);
    }
};

// @desc    Create customer
// @route   POST /api/customers
// @access  Private
const createCustomer = async (req, res, next) => {
    try {
        const customer = await Customer.create({
            ...req.body,
            company: req.companyId,
            createdBy: req.user._id,
        });
        res.status(201).json({ success: true, message: 'Customer created.', data: customer });
    } catch (error) {
        next(error);
    }
};

// @desc    Update customer
// @route   PUT /api/customers/:id
// @access  Private
const updateCustomer = async (req, res, next) => {
    try {
        const customer = await Customer.findOneAndUpdate(
            { _id: req.params.id, company: req.companyId },
            req.body,
            { new: true, runValidators: true }
        );
        if (!customer) {
            return res.status(404).json({ success: false, message: 'Customer not found.' });
        }
        res.status(200).json({ success: true, message: 'Customer updated.', data: customer });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete customer
// @route   DELETE /api/customers/:id
// @access  Private (Admin)
const deleteCustomer = async (req, res, next) => {
    try {
        const customer = await Customer.findOneAndDelete({ _id: req.params.id, company: req.companyId });
        if (!customer) {
            return res.status(404).json({ success: false, message: 'Customer not found.' });
        }
        res.status(200).json({ success: true, message: 'Customer deleted.' });
    } catch (error) {
        next(error);
    }
};

module.exports = { getCustomers, getCustomer, createCustomer, updateCustomer, deleteCustomer };
