const jwt = require('jsonwebtoken');
const User = require('../models/User');

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
        const user = await User.findById(decoded.id)
            .select('-password')
            .populate('company', 'name email logo isActive currency invoicePrefix');

        if (!user || !user.isActive) {
            return res.status(401).json({
                success: false,
                message: 'User not found or account is deactivated.',
            });
        }

        // Check if company is active (skip for superadmin)
        if (user.role !== 'superadmin' && user.company && !user.company.isActive) {
            return res.status(403).json({
                success: false,
                message: 'Your company account has been deactivated. Contact support.',
            });
        }

        req.user = user;
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
