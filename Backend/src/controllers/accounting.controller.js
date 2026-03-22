const Invoice = require('../models/Invoice');
const PurchaseOrder = require('../models/PurchaseOrder');
const Expense = require('../models/Expense');
const SalaryPayment = require('../models/SalaryPayment');

// @desc    Get accounting summary and transactions
// @route   GET /api/accounting
// @access  Private
const getAccountingData = async (req, res, next) => {
    try {
        const { year, month, page = 1, limit = 10 } = req.query;

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
        }

        const query = { company: req.companyId, ...dateFilter };
        const expenseDateFilter = year ? { date: dateFilter.createdAt } : {};
        const salaryDateFilter = year ? { paymentDate: dateFilter.createdAt } : {};

        // 1. Fetch Invoices (Income)
        const invoices = await Invoice.find(query).sort({ createdAt: -1 });
        
        // 2. Fetch Purchase Orders (Supplier Expense)
        const purchaseOrders = await PurchaseOrder.find(query).sort({ createdAt: -1 }).populate('supplier', 'name');
        
        // 3. Fetch Manual Expenses (Other Expense)
        const expenses = await Expense.find({ company: req.companyId, ...expenseDateFilter }).sort({ date: -1 });

        // 4. Fetch Salaries (Salary Expense)
        const salaries = await SalaryPayment.find({ company: req.companyId, ...salaryDateFilter }).sort({ paymentDate: -1 });

        let totalIncome = 0;
        let totalGST = 0;
        let totalSupplierExpense = 0;
        let totalManualExpense = 0;
        let totalSalaryExpense = 0;
        
        const recentTransactions = [];

        // Calculate Income & GST from Invoices
        invoices.forEach(inv => {
            totalIncome += inv.grandTotal || 0;
            totalGST += inv.totalTax || 0;
            recentTransactions.push({
                type: 'income',
                date: inv.createdAt,
                description: `Sales - Invoice ${inv.invoiceNumber}`,
                category: 'Sales Revenue',
                income: inv.grandTotal || 0,
                expense: 0
            });
        });

        // Calculate Expense from Purchase Orders
        purchaseOrders.forEach(po => {
            totalSupplierExpense += po.amount || 0;
            recentTransactions.push({
                type: 'expense',
                date: po.createdAt,
                description: `Purchase from ${po.supplier ? po.supplier.name : 'Unknown Supplier'}`,
                category: 'Supplier Purchase',
                income: 0,
                expense: po.amount || 0
            });
        });

        // Calculate Expense from Manual Expenses
        expenses.forEach(exp => {
            totalManualExpense += exp.amount || 0;
            recentTransactions.push({
                type: 'expense',
                date: exp.date,
                description: exp.description || 'Manual Expense',
                category: exp.category || 'Other',
                income: 0,
                expense: exp.amount || 0
            });
        });

        // Calculate Expense from Salaries
        salaries.forEach(sal => {
            totalSalaryExpense += sal.netSalary || 0;
            recentTransactions.push({
                type: 'expense',
                date: sal.paymentDate,
                description: `Salary Payment - ${sal.staffName} (${sal.month} ${sal.year})`,
                category: 'Salary',
                income: 0,
                expense: sal.netSalary || 0
            });
        });

        // Total Expense
        const totalExpense = totalSupplierExpense + totalManualExpense + totalSalaryExpense;

        // Sort combined transactions by Date DESC
        recentTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));

        // Group by month for chart
        const monthlyData = {};
        recentTransactions.forEach(t => {
            const d = new Date(t.date);
            const monthName = d.toLocaleString('en-US', { month: 'short' });
            const yearStr = d.getFullYear();
            const key = `${monthName}-${yearStr}`;
            
            if (!monthlyData[key]) {
                monthlyData[key] = { month: monthName, year: yearStr, income: 0, expense: 0, sortKey: new Date(yearStr, d.getMonth(), 1).getTime() };
            }
            monthlyData[key].income += t.income;
            monthlyData[key].expense += t.expense;
        });

        let profitLossData = Object.values(monthlyData).sort((a, b) => a.sortKey - b.sortKey).map(item => ({
            month: item.month,
            income: item.income,
            expense: item.expense
        }));

        // Pagination for recent transactions
        const pageNum = Math.max(1, parseInt(page));
        const limitNum = Math.max(1, parseInt(limit));
        const skip = (pageNum - 1) * limitNum;
        const paginatedTransactions = recentTransactions.slice(skip, skip + limitNum);

        res.status(200).json({
            success: true,
            data: {
                totalIncome,
                totalExpense,
                totalSupplierExpense,
                totalSalaryExpense,
                totalManualExpense,
                totalGST,
                netProfit: totalIncome - totalExpense,
                recentTransactions: paginatedTransactions,
                profitLossData
            },
            pagination: {
                total: recentTransactions.length,
                page: pageNum,
                pages: Math.ceil(recentTransactions.length / limitNum) || 1,
                limit: limitNum
            }
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAccountingData
};
