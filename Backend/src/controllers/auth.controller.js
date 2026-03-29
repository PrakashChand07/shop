const User = require('../models/User');
const Role = require('../models/Role');
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generateToken');

// @desc    Login user (Admin/Staff from User model OR Role-based staff from Role model)
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // --- Try User model first (admin, superadmin, etc.) ---
        const user = await User.findOne({ email: email.toLowerCase() })
            .select('+password')
            .populate('company', 'name email phone address gstin panNumber logo signature seal currency invoicePrefix isActive plan industryType');

        if (user) {
            if (!user.isActive) {
                return res.status(401).json({ success: false, message: 'Your account has been deactivated.' });
            }
            if (user.role !== 'superadmin' && user.company && !user.company.isActive) {
                return res.status(403).json({ success: false, message: 'Your company has been deactivated. Contact support.' });
            }

            const isMatch = await user.comparePassword(password);
            if (!isMatch) {
                return res.status(401).json({ success: false, message: 'Invalid email or password.' });
            }

            const token = generateToken(user._id, user.company?._id || null);

            return res.status(200).json({
                success: true,
                message: 'Logged in successfully.',
                data: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    avatar: user.avatar,
                    role: user.role,
                    permissions: [],  // Admin has no permission restrictions
                    company: user.company,
                    token,
                },
            });
        }

        // --- Try Role model (staff accounts created by admin) ---
        const roleAccount = await Role.findOne({ email: email.toLowerCase() })
            .select('+password')
            .populate('companyId', 'name email phone address gstin panNumber logo signature seal currency invoicePrefix isActive plan industryType');

        if (!roleAccount) {
            return res.status(401).json({ success: false, message: 'Invalid email or password.' });
        }

        if (!roleAccount.isActive) {
            return res.status(401).json({ success: false, message: 'Your account has been deactivated.' });
        }

        if (roleAccount.companyId && !roleAccount.companyId.isActive) {
            return res.status(403).json({ success: false, message: 'Your company has been deactivated. Contact support.' });
        }

        const isRoleMatch = await bcrypt.compare(password, roleAccount.password);
        if (!isRoleMatch) {
            return res.status(401).json({ success: false, message: 'Invalid email or password.' });
        }

        // Use companyId._id as company for token generation
        const token = generateToken(roleAccount._id, roleAccount.companyId?._id || null);

        return res.status(200).json({
            success: true,
            message: 'Logged in successfully.',
            data: {
                _id: roleAccount._id,
                name: roleAccount.roleName,
                email: roleAccount.email,
                role: 'staff',  // Assign fixed role for role-based accounts
                permissions: roleAccount.permissions,
                department: roleAccount.department,
                company: roleAccount.companyId,
                token,
            },
        });

    } catch (error) {
        next(error);
    }
};

    // @desc    Get current logged-in user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
    try {
        // If req.user.role === 'staff', it's a Role-based account (already populated by middleware)
        if (req.user.role === 'staff') {
            return res.status(200).json({
                success: true,
                data: {
                    _id: req.user._id,
                    name: req.user.name,
                    email: req.user.email,
                    role: req.user.role,
                    permissions: req.user.permissions,
                    company: req.user.company,
                }
            });
        }

        const user = await User.findById(req.user._id)
            .select('-password')
            .populate('company', 'name email phone address gstin panNumber logo signature seal currency invoicePrefix plan planExpiry isActive industryType');
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        next(error);
    }
};

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
const changePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user._id).select('+password');
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Current password is incorrect.' });
        }
        user.password = newPassword;
        await user.save();
        res.status(200).json({ success: true, message: 'Password changed successfully.' });
    } catch (error) {
        next(error);
    }
};

// @desc    Update own profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res, next) => {
    try {
        const { name, phone } = req.body;
        const user = await User.findByIdAndUpdate(
            req.user._id,
            { name, phone },
            { new: true, runValidators: true }
        ).select('-password');
        res.status(200).json({ success: true, message: 'Profile updated.', data: user });
    } catch (error) {
        next(error);
    }
};

// @desc    Upload own avatar
// @route   POST /api/auth/avatar
// @access  Private
const uploadAvatar = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded.' });
        }
        const user = await User.findByIdAndUpdate(
            req.user._id,
            { avatar: req.file.path },
            { new: true }
        ).select('-password');
        res.status(200).json({ success: true, message: 'Avatar uploaded.', data: { avatar: user.avatar } });
    } catch (error) {
        next(error);
    }
};

module.exports = { login, getMe, changePassword, updateProfile, uploadAvatar };
