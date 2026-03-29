const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Role = require('../models/Role');

// Protect routes — verify JWT
const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Access denied. No token provided.',
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Try User model first
        let user = await User.findById(decoded.id)
            .select('-password')
            .populate('company', 'name email logo isActive currency invoicePrefix industryType');

        if (user) {
            if (!user.isActive) {
                return res.status(401).json({
                    success: false,
                    message: 'User account is deactivated.',
                });
            }
            req.user = user;
            req.user.companyId = user.company?._id || decoded.company;
            return next();
        }

        // Try Role model (staff accounts)
        const roleUser = await Role.findById(decoded.id)
            .select('-password')
            .populate('companyId', 'name email logo isActive currency invoicePrefix industryType');

        if (!roleUser || !roleUser.isActive) {
            return res.status(401).json({
                success: false,
                message: 'User not found or account is deactivated.',
            });
        }

        // Attach role user to req.user with compatible shape
        req.user = {
            _id: roleUser._id,
            name: roleUser.roleName,
            email: roleUser.email,
            role: 'staff',
            permissions: roleUser.permissions,
            company: roleUser.companyId,
            companyId: roleUser.companyId?._id,
            isActive: roleUser.isActive,
        };

        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired token.',
        });
    }
};

// Restrict to specific roles
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Access denied. Role '${req.user.role}' is not authorized.`,
            });
        }
        next();
    };
};

module.exports = { protect, authorize };
