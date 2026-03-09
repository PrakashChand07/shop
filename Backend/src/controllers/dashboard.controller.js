const Invoice = require('../models/Invoice');
const Payment = require('../models/Payment');
const Customer = require('../models/Customer');
const Expense = require('../models/Expense');
const AuditLog = require('../models/AuditLog');

// @desc    Dashboard summary stats
// @route   GET /api/dashboard/stats
// @access  Private
const getDashboardStats = async (req, res, next) => {
    try {
        const cId = req.companyId;

        // Revenue this month
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const [
            totalRevenue,
            monthRevenue,
            invoiceStats,
            totalCustomers,
            totalExpense,
        ] = await Promise.all([
            // All-time revenue
            Payment.aggregate([
                { $match: { company: cId, status: 'completed' } },
                { $group: { _id: null, total: { $sum: '$amount' } } },
            ]),
            // This month revenue
            Payment.aggregate([
                { $match: { company: cId, status: 'completed', paymentDate: { $gte: startOfMonth } } },
                { $group: { _id: null, total: { $sum: '$amount' } } },
            ]),
            // Invoice status counts
            Invoice.aggregate([
                { $match: { company: cId, type: 'invoice' } },
                { $group: { _id: '$status', count: { $sum: 1 }, total: { $sum: '$grandTotal' } } },
            ]),
            // Customer count
            Customer.countDocuments({ company: cId, status: 'active' }),
            // Total expenses
            Expense.aggregate([
                { $match: { company: cId } },
                { $group: { _id: null, total: { $sum: '$amount' } } },
            ]),
        ]);

        // Format invoice stats
        const invoiceFormatted = {};
        invoiceStats.forEach((s) => { invoiceFormatted[s._id] = { count: s.count, total: s.total }; });

        res.status(200).json({
            success: true,
            data: {
                totalRevenue: totalRevenue[0]?.total || 0,
                monthRevenue: monthRevenue[0]?.total || 0,
                totalExpense: totalExpense[0]?.total || 0,
                netProfit: (totalRevenue[0]?.total || 0) - (totalExpense[0]?.total || 0),
                totalCustomers,
                invoices: invoiceFormatted,
            },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Recent activity
// @route   GET /api/dashboard/recent-activity
// @access  Private
const getRecentActivity = async (req, res, next) => {
    try {
        const limit = Math.min(50, parseInt(req.query.limit) || 10);
        const logs = await AuditLog.find({ company: req.companyId })
            .populate('user', 'name email avatar')
            .sort({ createdAt: -1 })
            .limit(limit);
        res.status(200).json({ success: true, data: logs });
    } catch (error) {
        next(error);
    }
};

// @desc    Monthly revenue chart data (last 12 months)
// @route   GET /api/dashboard/revenue-chart
// @access  Private
const getRevenueChart = async (req, res, next) => {
    try {
        const twelveMonthsAgo = new Date();
        twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 11);
        twelveMonthsAgo.setDate(1);
        twelveMonthsAgo.setHours(0, 0, 0, 0);

        const data = await Payment.aggregate([
            {
                $match: {
                    company: req.companyId,
                    status: 'completed',
                    paymentDate: { $gte: twelveMonthsAgo },
                },
            },
            {
                $group: {
                    _id: {
                        year: { $year: '$paymentDate' },
                        month: { $month: '$paymentDate' },
                    },
                    total: { $sum: '$amount' },
                    count: { $sum: 1 },
                },
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } },
        ]);

        res.status(200).json({ success: true, data });
    } catch (error) {
        next(error);
    }
};

// @desc    Top customers by revenue
// @route   GET /api/dashboard/top-customers
// @access  Private
const getTopCustomers = async (req, res, next) => {
    try {
        const limit = Math.min(20, parseInt(req.query.limit) || 5);
        const data = await Payment.aggregate([
            { $match: { company: req.companyId, status: 'completed' } },
            { $group: { _id: '$customer', totalPaid: { $sum: '$amount' }, count: { $sum: 1 } } },
            { $sort: { totalPaid: -1 } },
            { $limit: limit },
            {
                $lookup: {
                    from: 'customers',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'customer',
                },
            },
            { $unwind: '$customer' },
            {
                $project: {
                    customer: { name: 1, email: 1, companyName: 1 },
                    totalPaid: 1,
                    count: 1,
                },
            },
        ]);
        res.status(200).json({ success: true, data });
    } catch (error) {
        next(error);
    }
};

module.exports = { getDashboardStats, getRecentActivity, getRevenueChart, getTopCustomers };
