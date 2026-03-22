const Invoice = require('../models/Invoice');
const Payment = require('../models/Payment');
const Customer = require('../models/Customer');
const Expense = require('../models/Expense');
const Staff = require('../models/Staff');
const Product = require('../models/Product');

// @desc    Dashboard summary stats
// @route   GET /api/dashboard/stats
// @access  Private
const getDashboardStats = async (req, res, next) => {
    try {
        const cId = req.companyId;
        const { year, month } = req.query;

        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        
        let dateFilter = {};
        if (year) {
            const isAllMonths = !month || month === 'all';
            const startDate = new Date(year, isAllMonths ? 0 : parseInt(month) - 1, 1);
            const endDate = new Date(year, isAllMonths ? 12 : parseInt(month), 0, 23, 59, 59);
            dateFilter = {
                createdAt: {
                    $gte: startDate,
                    $lte: endDate
                }
            };
        } else {
            // Default to current month if no filter
            dateFilter = {
                createdAt: {
                    $gte: new Date(now.getFullYear(), now.getMonth(), 1)
                }
            };
        }

        const baseFilter = { company: cId, type: 'invoice' };

        // Fetch aggregation data concurrently
        const [
            todayInvoices,
            filteredInvoices,
            totalCustomers,
            activeStaff,
            totalProducts,
            recentInvoices,
            inventoryStats
        ] = await Promise.all([
            // Today Invoices
            Invoice.find({ ...baseFilter, createdAt: { $gte: startOfToday } }),
            // Filtered Invoices (based on month/year)
            Invoice.find({ ...baseFilter, ...dateFilter }),
            Customer.countDocuments({ company: cId, status: 'active' }),
            Staff.countDocuments({ company: cId, isActive: true }),
            Product.countDocuments({ company: cId }),
            Invoice.find({ ...baseFilter, ...dateFilter }).sort({ createdAt: -1 }).limit(10).populate('customer', 'name companyName'),
            Product.aggregate([
                { $match: { company: cId, isActive: true } },
                { $group: { _id: '$category', totalStock: { $sum: '$stock' } } }
            ])
        ]);

        // Process Today
        const salesStats = {
            today: { gstSales: 0, nonGstSales: 0, totalTax: 0, gstInvoices: 0, nonGstInvoices: 0 },
            filtered: { gstSales: 0, nonGstSales: 0, totalTax: 0, gstInvoices: 0, nonGstInvoices: 0 },
            yearly: { gstSales: 0, nonGstSales: 0 } // Legacy, keep intact if needed
        };

        todayInvoices.forEach(inv => {
            if (inv.totalTax > 0) {
                salesStats.today.gstSales += inv.grandTotal;
                salesStats.today.totalTax += inv.totalTax;
                salesStats.today.gstInvoices += 1;
            } else {
                salesStats.today.nonGstSales += inv.grandTotal;
                salesStats.today.nonGstInvoices += 1;
            }
        });

        filteredInvoices.forEach(inv => {
            if (inv.totalTax > 0) {
                salesStats.filtered.gstSales += inv.grandTotal;
                salesStats.filtered.totalTax += inv.totalTax;
                salesStats.filtered.gstInvoices += 1;
                salesStats.yearly.gstSales += inv.grandTotal; // Assuming yearly for now (should ideally query 1 year)
            } else {
                salesStats.filtered.nonGstSales += inv.grandTotal;
                salesStats.filtered.nonGstInvoices += 1;
                salesStats.yearly.nonGstSales += inv.grandTotal;
            }
        });

        const inventoryData = inventoryStats.map(stat => ({
            name: stat._id ? stat._id.trim() : 'Uncategorized',
            value: stat.totalStock > 0 ? stat.totalStock : 1 // if no stock tracking, at least show product categories by fallback 1
        }));

        res.status(200).json({
            success: true,
            data: {
                salesStats,
                totalCustomers,
                activeStaff,
                totalProducts,
                inventoryData: inventoryData.length ? inventoryData : [{ name: "No products", value: 1 }],
                recentTransactions: recentInvoices.map(inv => ({
                    id: inv._id,
                    invoiceNumber: inv.invoiceNumber,
                    date: inv.createdAt,
                    customerName: inv.customer?.companyName || inv.customer?.name || 'Unknown',
                    amount: inv.grandTotal,
                    status: inv.status
                }))
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

// @desc    Monthly revenue chart data (last 6 months)
// @route   GET /api/dashboard/revenue-chart
// @access  Private
const getRevenueChart = async (req, res, next) => {
    try {
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
        sixMonthsAgo.setDate(1);
        sixMonthsAgo.setHours(0, 0, 0, 0);

        const data = await Invoice.aggregate([
            {
                $match: {
                    company: req.companyId,
                    type: 'invoice',
                    createdAt: { $gte: sixMonthsAgo },
                },
            },
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' },
                    },
                    sales: { $sum: '$grandTotal' },
                },
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } },
        ]);

        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        
        // Generate last 6 months explicitly to show 0 if no sales
        const chart = [];
        for (let i = 5; i >= 0; i--) {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            chart.push({
                monthName: months[d.getMonth()],
                yearStr: d.getFullYear(),
                sales: 0
            });
        }

        // Overwrite 0s with aggregated sales data
        data.forEach(d => {
            const m = months[d._id.month - 1];
            const matched = chart.find(c => c.monthName === m && c.yearStr === d._id.year);
            if (matched) {
                matched.sales = d.sales || 0;
            }
        });

        const formattedData = chart.map(c => ({
            month: c.monthName,
            sales: c.sales
        }));

        res.status(200).json({ success: true, data: formattedData });
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
