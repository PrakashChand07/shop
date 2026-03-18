const Staff = require('../models/Staff');

// @desc    Get all staff
// @route   GET /api/staff
// @access  Private
const getStaff = async (req, res, next) => {
    try {
        const staff = await Staff.find({ company: req.companyId }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: staff.length, data: staff });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single staff
// @route   GET /api/staff/:id
// @access  Private
const getStaffById = async (req, res, next) => {
    try {
        const staff = await Staff.findOne({ _id: req.params.id, company: req.companyId });
        if (!staff) {
            return res.status(404).json({ success: false, message: 'Staff member not found.' });
        }
        res.status(200).json({ success: true, data: staff });
    } catch (error) {
        next(error);
    }
};

// @desc    Create new staff
// @route   POST /api/staff
// @access  Private
const createStaff = async (req, res, next) => {
    try {
        req.body.company = req.companyId;

        // Auto-generate employeeId if not provided
        if (!req.body.employeeId) {
            const count = await Staff.countDocuments({ company: req.companyId });
            req.body.employeeId = `EMP${String(count + 1).padStart(3, '0')}`;
        }

        // Calculate net salary
        const basic = Number(req.body.basicSalary) || 0;
        const allowances = Number(req.body.allowances) || 0;
        const deductions = Number(req.body.deductions) || 0;
        req.body.netSalary = basic + allowances - deductions;

        const staff = await Staff.create(req.body);
        res.status(201).json({ success: true, data: staff });
    } catch (error) {
        // Handle duplicate employeeId error
        if (error.code === 11000 && error.keyPattern.employeeId) {
            return res.status(400).json({ success: false, message: 'Employee ID already exists in this company.' });
        }
        next(error);
    }
};

// @desc    Update staff
// @route   PUT /api/staff/:id
// @access  Private
const updateStaff = async (req, res, next) => {
    try {
        let staff = await Staff.findOne({ _id: req.params.id, company: req.companyId });
        if (!staff) {
            return res.status(404).json({ success: false, message: 'Staff member not found.' });
        }

        // Calculate net salary if salary fields are updated
        const basic = req.body.basicSalary !== undefined ? Number(req.body.basicSalary) : staff.basicSalary;
        const allowances = req.body.allowances !== undefined ? Number(req.body.allowances) : staff.allowances;
        const deductions = req.body.deductions !== undefined ? Number(req.body.deductions) : staff.deductions;
        req.body.netSalary = basic + allowances - deductions;

        staff = await Staff.findOneAndUpdate(
            { _id: req.params.id, company: req.companyId },
            req.body,
            { new: true, runValidators: true }
        );

        res.status(200).json({ success: true, data: staff });
    } catch (error) {
        if (error.code === 11000 && error.keyPattern.employeeId) {
            return res.status(400).json({ success: false, message: 'Employee ID already exists in this company.' });
        }
        next(error);
    }
};

// @desc    Delete staff
// @route   DELETE /api/staff/:id
// @access  Private
const deleteStaff = async (req, res, next) => {
    try {
        const staff = await Staff.findOneAndDelete({ _id: req.params.id, company: req.companyId });
        if (!staff) {
            return res.status(404).json({ success: false, message: 'Staff member not found.' });
        }
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        next(error);
    }
};

// @desc    Toggle staff active status
// @route   PATCH /api/staff/:id/toggle-status
// @access  Private
const toggleStaffStatus = async (req, res, next) => {
    try {
        const staff = await Staff.findOne({ _id: req.params.id, company: req.companyId });
        if (!staff) {
            return res.status(404).json({ success: false, message: 'Staff member not found.' });
        }

        staff.isActive = !staff.isActive;
        await staff.save();

        res.status(200).json({ success: true, data: staff });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getStaff,
    getStaffById,
    createStaff,
    updateStaff,
    deleteStaff,
    toggleStaffStatus,
};
