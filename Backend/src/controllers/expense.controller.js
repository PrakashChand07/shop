const Expense = require('../models/Expense');

const getPagination = (query) => {
    const page = Math.max(1, parseInt(query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 20));
    const skip = (page - 1) * limit;
    return { page, limit, skip };
};

// @desc    Get all expenses
// @route   GET /api/expenses
// @access  Private
const getExpenses = async (req, res, next) => {
    try {
        const { page, limit, skip } = getPagination(req.query);
        const { category, search, from, to, paymentMethod, sort = 'date', order = 'desc' } = req.query;

        const filter = { company: req.companyId };
        if (category) filter.category = category;
        if (paymentMethod) filter.paymentMethod = paymentMethod;
        if (search) {
            filter.$or = [
                { description: { $regex: search, $options: 'i' } },
                { vendor: { $regex: search, $options: 'i' } },
            ];
        }
        if (from || to) {
            filter.date = {};
            if (from) filter.date.$gte = new Date(from);
            if (to) filter.date.$lte = new Date(to);
        }

        const sortObj = { [sort]: order === 'asc' ? 1 : -1 };
        const total = await Expense.countDocuments(filter);
        const expenses = await Expense.find(filter)
            .populate('recordedBy', 'name email')
            .sort(sortObj)
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            success: true,
            data: expenses,
            pagination: { total, page, pages: Math.ceil(total / limit), limit },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single expense
// @route   GET /api/expenses/:id
// @access  Private
const getExpense = async (req, res, next) => {
    try {
        const expense = await Expense.findOne({ _id: req.params.id, company: req.companyId })
            .populate('recordedBy', 'name email');
        if (!expense) {
            return res.status(404).json({ success: false, message: 'Expense not found.' });
        }
        res.status(200).json({ success: true, data: expense });
    } catch (error) {
        next(error);
    }
};

// @desc    Create expense
// @route   POST /api/expenses
// @access  Private
const createExpense = async (req, res, next) => {
    try {
        // If receipt file uploaded via multer
        const receiptUrl = req.file ? req.file.path : req.body.receipt;
        const expense = await Expense.create({
            ...req.body,
            receipt: receiptUrl,
            company: req.companyId,
            recordedBy: req.user._id,
        });
        res.status(201).json({ success: true, message: 'Expense recorded.', data: expense });
    } catch (error) {
        next(error);
    }
};

// @desc    Update expense
// @route   PUT /api/expenses/:id
// @access  Private
const updateExpense = async (req, res, next) => {
    try {
        const expense = await Expense.findOneAndUpdate(
            { _id: req.params.id, company: req.companyId },
            req.body,
            { new: true, runValidators: true }
        );
        if (!expense) {
            return res.status(404).json({ success: false, message: 'Expense not found.' });
        }
        res.status(200).json({ success: true, message: 'Expense updated.', data: expense });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete expense
// @route   DELETE /api/expenses/:id
// @access  Private (Admin/Manager)
const deleteExpense = async (req, res, next) => {
    try {
        const expense = await Expense.findOneAndDelete({ _id: req.params.id, company: req.companyId });
        if (!expense) {
            return res.status(404).json({ success: false, message: 'Expense not found.' });
        }
        res.status(200).json({ success: true, message: 'Expense deleted.' });
    } catch (error) {
        next(error);
    }
};

// @desc    Expense stats by category
// @route   GET /api/expenses/stats
// @access  Private
const getExpenseStats = async (req, res, next) => {
    try {
        const { from, to } = req.query;
        const match = { company: req.companyId };
        if (from || to) {
            match.date = {};
            if (from) match.date.$gte = new Date(from);
            if (to) match.date.$lte = new Date(to);
        }

        const stats = await Expense.aggregate([
            { $match: match },
            { $group: { _id: '$category', count: { $sum: 1 }, total: { $sum: '$amount' } } },
            { $sort: { total: -1 } },
        ]);

        const totalExpense = await Expense.aggregate([
            { $match: match },
            { $group: { _id: null, total: { $sum: '$amount' } } },
        ]);

        res.status(200).json({
            success: true,
            data: {
                byCategory: stats,
                totalExpense: totalExpense[0]?.total || 0,
            },
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { getExpenses, getExpense, createExpense, updateExpense, deleteExpense, getExpenseStats };
