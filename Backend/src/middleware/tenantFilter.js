/**
 * Tenant Filter Middleware
 * Ensures every query is automatically scoped to req.user.company.
 * SuperAdmin bypasses this filter.
 */
const tenantFilter = (req, res, next) => {
    // SuperAdmin sees everything — bypass tenant filter
    if (req.user && req.user.role === 'superadmin') {
        return next();
    }

    // All other users must belong to a company
    if (!req.user || !req.user.company) {
        return res.status(403).json({
            success: false,
            message: 'No company associated with this account.',
        });
    }

    // Attach company to request for use in controllers
    req.companyId = req.user.company;
    next();
};

module.exports = tenantFilter;
