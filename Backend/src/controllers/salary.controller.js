const SalaryPayment = require('../models/SalaryPayment');
const Staff = require('../models/Staff');

// @desc    Process a salary payment
// @route   POST /api/salary
// @access  Private
const processSalary = async (req, res, next) => {
    try {
        const { staffId, month, year, paymentMode, transactionId, status, paymentDate } = req.body;

        const staff = await Staff.findOne({ _id: staffId, company: req.companyId });
        if (!staff) {
            return res.status(404).json({ success: false, message: 'Staff member not found.' });
        }

        // Duplicate check for same month/year? 
        // We can allow multiple if it's partial or re-run, but let's keep it simple.
        const existing = await SalaryPayment.findOne({ staff: staff._id, month, year, status: 'paid' });
        if (existing && status === 'paid') {
            return res.status(400).json({ success: false, message: `Salary for ${month} ${year} is already paid to this staff.` });
        }

        const payload = {
            company: req.companyId,
            staff: staff._id,
            employeeId: staff.employeeId,
            staffName: staff.name,
            month,
            year: Number(year),
            basicSalary: staff.basicSalary,
            allowances: staff.allowances,
            deductions: staff.deductions,
            netSalary: staff.netSalary,
            paymentDate: paymentDate || Date.now(),
            paymentMode,
            transactionId: transactionId || null,
            status: status || 'paid',
            recordedBy: req.user._id,
        };

        const payment = await SalaryPayment.create(payload);

        // Optionally record as an Expense here if you have tightly integrated finances.
        // const Expense = require('../models/Expense');
        // await Expense.create({
        //     company: req.companyId,
        //     category: 'salaries',
        //     amount: staff.netSalary,
        //     description: `Salary for ${staff.name} - ${month} ${year}`,
        //     date: payment.paymentDate,
        //     paymentMethod: paymentMode === 'bank_transfer' ? 'bank_transfer' : paymentMode === 'upi' ? 'upi' : 'cash',
        //     recordedBy: req.user._id,
        // });

        res.status(201).json({ success: true, data: payment });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all salary payments for company
// @route   GET /api/salary
// @access  Private
const getSalaries = async (req, res, next) => {
    try {
        const { month, year } = req.query;
        let query = { company: req.companyId };

        if (month) query.month = month;
        if (year) query.year = Number(year);

        const payments = await SalaryPayment.find(query).sort({ paymentDate: -1, createdAt: -1 });

        res.status(200).json({ success: true, count: payments.length, data: payments });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    processSalary,
    getSalaries,
};
