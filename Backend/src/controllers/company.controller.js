const Company = require('../models/Company');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const cloudinary = require('../config/cloudinary');

// @desc    Register new company + create admin user
// @route   POST /api/company/register
// @access  Public
const registerCompany = async (req, res, next) => {
    try {
        const { companyName, companyEmail, industryType, phone, adminName, adminEmail, adminPassword } = req.body;

        // Check if company email already exists
        const existingCompany = await Company.findOne({ email: companyEmail.toLowerCase() });
        if (existingCompany) {
            return res.status(400).json({ success: false, message: 'Company email already registered.' });
        }

        // Check if admin email already exists
        const existingUser = await User.findOne({ email: adminEmail.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Admin email already registered.' });
        }

        // Create company
        const company = await Company.create({
            name: companyName,
            email: companyEmail,
            industryType: industryType || 'pharmacy',
            phone,
        });

        // Create admin user for company
        const admin = await User.create({
            name: adminName,
            email: adminEmail,
            password: adminPassword,
            role: 'admin',
            company: company._id,
        });

        const token = generateToken(admin._id, company._id);

        res.status(201).json({
            success: true,
            message: 'Company registered successfully.',
            data: {
                company: {
                    _id: company._id,
                    name: company.name,
                    email: company.email,
                    industryType: company.industryType,
                    plan: company.plan,
                },
                user: {
                    _id: admin._id,
                    name: admin.name,
                    email: admin.email,
                    role: admin.role,
                },
                token,
            },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get company profile
// @route   GET /api/company/profile
// @access  Private
const getCompanyProfile = async (req, res, next) => {
    try {
        const company = await Company.findById(req.companyId);
        if (!company) {
            return res.status(404).json({ success: false, message: 'Company not found.' });
        }
        res.status(200).json({ success: true, data: company });
    } catch (error) {
        next(error);
    }
};

// @desc    Update company profile
// @route   PUT /api/company/profile
// @access  Private (Admin)
const updateCompanyProfile = async (req, res, next) => {
    try {
        const allowed = [
            'name', 'email', 'phone', 'website', 'address',
            'gstin', 'panNumber', 'invoicePrefix', 'currency',
            'financialYearStart', 'bankDetails', 'defaultTerms',
        ];

        // If email is being updated, check if it already exists
        if (req.body.email) {
            const existing = await Company.findOne({ email: req.body.email.toLowerCase(), _id: { $ne: req.companyId } });
            if (existing) {
                return res.status(400).json({ success: false, message: 'Company email already registered.' });
            }
        }

        const updates = {};
        allowed.forEach((field) => {
            if (req.body[field] !== undefined) updates[field] = req.body[field];
        });

        const company = await Company.findByIdAndUpdate(req.companyId, updates, {
            new: true,
            runValidators: true,
        });
        res.status(200).json({ success: true, message: 'Company profile updated.', data: company });
    } catch (error) {
        next(error);
    }
};

// @desc    Upload company logo
// @route   POST /api/company/logo
// @access  Private (Admin)
const uploadLogo = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded.' });
        }

        // Delete old logo from Cloudinary if exists
        const company = await Company.findById(req.companyId);
        if (company.logo) {
            const publicId = company.logo.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(`billing-saas/logos/${publicId}`).catch(() => { });
        }

        const updated = await Company.findByIdAndUpdate(
            req.companyId,
            { logo: req.file.path },
            { new: true }
        );
        res.status(200).json({ success: true, message: 'Logo uploaded.', data: { logo: updated.logo } });
    } catch (error) {
        next(error);
    }
};

// @desc    Upload company signature
// @route   POST /api/company/signature
// @access  Private (Admin)
const uploadSignature = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded.' });
        }

        // Delete old signature from Cloudinary if exists
        const company = await Company.findById(req.companyId);
        if (company.signature) {
            const publicId = company.signature.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(`billing-saas/signatures/${publicId}`).catch(() => { });
        }

        const updated = await Company.findByIdAndUpdate(
            req.companyId,
            { signature: req.file.path },
            { new: true }
        );
        res.status(200).json({ success: true, message: 'Signature uploaded.', data: { signature: updated.signature } });
    } catch (error) {
        next(error);
    }
};

// @desc    Upload company seal
// @route   POST /api/company/seal
// @access  Private (Admin)
const uploadSeal = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded.' });
        }

        // Delete old seal from Cloudinary if exists
        const company = await Company.findById(req.companyId);
        if (company.seal) {
            const publicId = company.seal.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(`billing-saas/seals/${publicId}`).catch(() => { });
        }

        const updated = await Company.findByIdAndUpdate(
            req.companyId,
            { seal: req.file.path },
            { new: true }
        );
        res.status(200).json({ success: true, message: 'Seal uploaded.', data: { seal: updated.seal } });
    } catch (error) {
        next(error);
    }
};

// @desc    Invite/create a user in the company
// @route   POST /api/company/users
// @access  Private (Admin)
const inviteUser = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;

        const existing = await User.findOne({ email: email.toLowerCase(), company: req.companyId });
        if (existing) {
            return res.status(400).json({ success: false, message: 'User with this email already exists in your company.' });
        }

        const user = await User.create({
            name,
            email,
            password,
            role: role || 'staff',
            company: req.companyId,
        });

        res.status(201).json({
            success: true,
            message: 'User created successfully.',
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all users in company
// @route   GET /api/company/users
// @access  Private (Admin)
const getCompanyUsers = async (req, res, next) => {
    try {
        const { page = 1, limit = 20, role, isActive } = req.query;
        const query = { company: req.companyId };
        if (role) query.role = role;
        if (isActive !== undefined) query.isActive = isActive === 'true';

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const total = await User.countDocuments(query);
        const users = await User.find(query)
            .select('-password')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        res.status(200).json({
            success: true,
            data: users,
            pagination: { total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)), limit: parseInt(limit) },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update user in company
// @route   PUT /api/company/users/:userId
// @access  Private (Admin)
const updateCompanyUser = async (req, res, next) => {
    try {
        const { role, isActive } = req.body;
        const user = await User.findOne({ _id: req.params.userId, company: req.companyId });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }
        if (role) user.role = role;
        if (isActive !== undefined) user.isActive = isActive;
        await user.save();
        res.status(200).json({ success: true, message: 'User updated.', data: user });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete user from company
// @route   DELETE /api/company/users/:userId
// @access  Private (Admin)
const deleteCompanyUser = async (req, res, next) => {
    try {
        const user = await User.findOne({ _id: req.params.userId, company: req.companyId });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }
        if (user._id.toString() === req.user._id.toString()) {
            return res.status(400).json({ success: false, message: 'You cannot delete your own account.' });
        }
        await user.deleteOne();
        res.status(200).json({ success: true, message: 'User deleted successfully.' });
    } catch (error) {
        next(error);
    }
};

// @desc    Remove company logo or signature
// @route   DELETE /api/company/:type (logo or signature)
// @access  Private (Admin)
const deleteLogoOrSignature = async (req, res, next) => {
    try {
        const { type } = req.params;
        if (!['logo', 'signature', 'seal'].includes(type)) {
            return res.status(400).json({ success: false, message: 'Invalid type.' });
        }

        const company = await Company.findById(req.companyId);
        if (company && company[type]) {
            const publicId = company[type].split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(`billing-saas/${type}s/${publicId}`).catch(() => { });
            
            // Update company
            company[type] = null;
            await company.save();
        }

        res.status(200).json({ success: true, message: `${type} removed successfully.` });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    registerCompany,
    getCompanyProfile,
    updateCompanyProfile,
    uploadLogo,
    uploadSignature,
    uploadSeal,
    deleteLogoOrSignature,
    inviteUser,
    getCompanyUsers,
    updateCompanyUser,
    deleteCompanyUser,
};
