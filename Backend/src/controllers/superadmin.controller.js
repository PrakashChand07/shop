const Company = require('../models/Company');
const User = require('../models/User');
const Invoice = require('../models/Invoice');
const Payment = require('../models/Payment');

const getPagination = (query) => {
    const page = Math.max(1, parseInt(query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 20));
    const skip = (page - 1) * limit;
    return { page, limit, skip };
};

// @desc    Get all companies
// @route   GET /api/superadmin/companies
const getAllCompanies = async (req, res, next) => {
    try {
        const { page, limit, skip } = getPagination(req.query);
        const { search, plan, isActive } = req.query;

        const filter = {};
        if (plan) filter.plan = plan;
        if (isActive !== undefined) filter.isActive = isActive === 'true';
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
            ];
        }

        const total = await Company.countDocuments(filter);
        const companies = await Company.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            success: true,
            data: companies,
            pagination: { total, page, pages: Math.ceil(total / limit), limit },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single company details
// @route   GET /api/superadmin/companies/:id
const getCompanyById = async (req, res, next) => {
    try {
        const company = await Company.findById(req.params.id);
        if (!company) return res.status(404).json({ success: false, message: 'Company not found.' });

        const userCount = await User.countDocuments({ company: company._id });
        const invoiceCount = await Invoice.countDocuments({ company: company._id });

        res.status(200).json({ success: true, data: { company, userCount, invoiceCount } });
    } catch (error) {
        next(error);
    }
};

// @desc    Toggle company active status
// @route   PATCH /api/superadmin/companies/:id/toggle
const toggleCompanyStatus = async (req, res, next) => {
    try {
        const company = await Company.findById(req.params.id);
        if (!company) return res.status(404).json({ success: false, message: 'Company not found.' });

        company.isActive = !company.isActive;
        await company.save();
        res.status(200).json({
            success: true,
            message: `Company ${company.isActive ? 'activated' : 'deactivated'}.`,
            data: { _id: company._id, name: company.name, isActive: company.isActive },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update company plan
// @route   PATCH /api/superadmin/companies/:id/plan
const updateCompanyPlan = async (req, res, next) => {
    try {
        const { plan, planExpiry } = req.body;
        const company = await Company.findByIdAndUpdate(
            req.params.id,
            { plan, planExpiry },
            { new: true, runValidators: true }
        );
        if (!company) return res.status(404).json({ success: false, message: 'Company not found.' });
        res.status(200).json({ success: true, message: 'Plan updated.', data: company });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete company (and all its data)
// @route   DELETE /api/superadmin/companies/:id
const deleteCompany = async (req, res, next) => {
    try {
        const company = await Company.findById(req.params.id);
        if (!company) return res.status(404).json({ success: false, message: 'Company not found.' });

        // Delete all related data
        await Promise.all([
            User.deleteMany({ company: company._id }),
            Invoice.deleteMany({ company: company._id }),
            Payment.deleteMany({ company: company._id }),
            company.deleteOne(),
        ]);

        res.status(200).json({ success: true, message: 'Company and all associated data deleted.' });
    } catch (error) {
        next(error);
    }
};

// @desc    Platform-wide stats
// @route   GET /api/superadmin/stats
const getPlatformStats = async (req, res, next) => {
    try {
        const [totalCompanies, activeCompanies, totalUsers, totalInvoices, totalRevenue] = await Promise.all([
            Company.countDocuments(),
            Company.countDocuments({ isActive: true }),
            User.countDocuments({ role: { $ne: 'superadmin' } }),
            Invoice.countDocuments({ type: 'invoice' }),
            Payment.aggregate([
                { $match: { status: 'completed' } },
                { $group: { _id: null, total: { $sum: '$amount' } } },
            ]),
        ]);

        res.status(200).json({
            success: true,
            data: {
                totalCompanies,
                activeCompanies,
                inactiveCompanies: totalCompanies - activeCompanies,
                totalUsers,
                totalInvoices,
                totalRevenue: totalRevenue[0]?.total || 0,
            },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all users (platform)
// @route   GET /api/superadmin/users
const getAllUsers = async (req, res, next) => {
    try {
        const { page, limit, skip } = getPagination(req.query);
        const { search, role } = req.query;
        const filter = { role: { $ne: 'superadmin' } };
        if (role) filter.role = role;
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
            ];
        }

        const total = await User.countDocuments(filter);
        const users = await User.find(filter)
            .select('-password')
            .populate('company', 'name email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            success: true,
            data: users,
            pagination: { total, page, pages: Math.ceil(total / limit), limit },
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllCompanies,
    getCompanyById,
    toggleCompanyStatus,
    updateCompanyPlan,
    deleteCompany,
    getPlatformStats,
    getAllUsers,
};
