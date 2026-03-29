const checkPermission = (moduleName, action) => (req, res, next) => {
  // Non-staff roles (admin, superadmin, manager, accountant, viewer) bypass permission check
  const bypassRoles = ['admin', 'superadmin', 'manager', 'accountant', 'viewer'];
  if (bypassRoles.includes(req.user.role)) {
    return next();
  }

  const permissions = req.user.permissions;

  if (!permissions || !Array.isArray(permissions) || permissions.length === 0) {
    return res.status(403).json({
      success: false,
      message: "Permission denied. No permissions defined for your account.",
    });
  }

  const permission = permissions.find((p) => p.module === moduleName);

  if (!permission || !permission[action]) {
    return res.status(403).json({
      success: false,
      message: `Permission denied. Requires '${action}' on '${moduleName}'`,
    });
  }

  next();
};

module.exports = { checkPermission };
