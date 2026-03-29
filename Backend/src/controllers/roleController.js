const Role = require("../models/Role");
const DepartmentDefault = require("../models/DepartmentDefault");
const bcrypt = require("bcryptjs");
const { ModuleName } = require("../common/enums/module.enum");
const { Department } = require("../common/enums/department.enum");

// ─── Helper: get companyId reliably from req.user ────────────────────────────
// Handles both User-model admins (user.company._id) and Role-model staff (user.companyId)
const getCompanyId = (user) =>
  user.companyId || user.company?._id || user.company || null;

// ─── Hardcoded fallback: ALL TRUE — used only if no dept default exists ────────
const generateDefaultPermissions = () =>
  Object.values(ModuleName).map((module) => ({
    module,
    canRead: true,
    canCreate: true,
    canUpdate: true,
    canDelete: true,
    isVisible: true,
  }));

// ─── CREATE ───────────────────────────────────────────────────────────────────
exports.createRole = async (req, res) => {
  try {
    const { roleName, email, password, department, permissions } = req.body;
    const companyId = getCompanyId(req.user);

    if (!companyId) {
      return res.status(400).json({ success: false, message: "Company not found for this user." });
    }

    const existingRole = await Role.findOne({ email: email.toLowerCase() });
    if (existingRole) {
      return res.status(400).json({ success: false, message: "Email already in use." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Priority:
    //  1. permissions passed in request body (rarely happens)
    //  2. department's saved defaults
    //  3. global fallback (all true)
    let finalPermissions = permissions && permissions.length > 0 ? permissions : null;

    if (!finalPermissions && department) {
      const deptDefault = await DepartmentDefault.findOne({ companyId, department });
      if (deptDefault && deptDefault.permissions?.length > 0) {
        finalPermissions = deptDefault.permissions;
      }
    }

    if (!finalPermissions) {
      finalPermissions = generateDefaultPermissions();
    }

    const role = await Role.create({
      companyId,
      roleName,
      email,
      password: hashedPassword,
      department,
      permissions: finalPermissions,
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      data: {
        _id: role._id,
        roleName: role.roleName,
        email: role.email,
        department: role.department,
        permissions: role.permissions,
        isActive: role.isActive,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── GET ALL ──────────────────────────────────────────────────────────────────
exports.getRoles = async (req, res) => {
  try {
    const companyId = getCompanyId(req.user);
    const roles = await Role.find({ companyId }).select("-password").sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: roles });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── UPDATE BASIC INFO ────────────────────────────────────────────────────────
exports.updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const companyId = getCompanyId(req.user);
    const { password, ...updateData } = req.body;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    const role = await Role.findOneAndUpdate(
      { _id: id, companyId },
      updateData,
      { new: true }
    ).select("-password");

    if (!role) {
      return res.status(404).json({ success: false, message: "Role not found." });
    }

    res.status(200).json({ success: true, data: role });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── DELETE ───────────────────────────────────────────────────────────────────
exports.deleteRole = async (req, res) => {
  try {
    const { id } = req.params;
    const companyId = getCompanyId(req.user);
    const role = await Role.findOneAndDelete({ _id: id, companyId });

    if (!role) {
      return res.status(404).json({ success: false, message: "Role not found." });
    }
    res.status(200).json({ success: true, message: "Role deleted successfully." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── UPDATE INDIVIDUAL STAFF PERMISSIONS — PATCH /api/roles/:id/permissions ──
exports.updatePermissions = async (req, res) => {
  try {
    const { id } = req.params;
    const companyId = getCompanyId(req.user);
    const { permissions } = req.body;

    const role = await Role.findOneAndUpdate(
      { _id: id, companyId },
      { permissions },
      { new: true }
    ).select("-password");

    if (!role) {
      return res.status(404).json({ success: false, message: "Role not found." });
    }

    res.status(200).json({ success: true, data: role });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── GET UNIQUE DEPARTMENTS (static defaults + dynamic ones from DB) ──────────
exports.getDepartments = async (req, res) => {
  try {
    const companyId = getCompanyId(req.user);

    const dbDepts = await Role.distinct("department", { companyId });
    const staticDepts = Object.values(Department);
    const merged = Array.from(new Set([...staticDepts, ...dbDepts])).filter(Boolean);

    res.status(200).json({ success: true, data: merged });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── GET DEPARTMENT DEFAULT PERMISSIONS — GET /api/roles/department-default/:dept
exports.getDeptDefault = async (req, res) => {
  try {
    const companyId = getCompanyId(req.user);
    const { department } = req.params;

    const record = await DepartmentDefault.findOne({ companyId, department });

    // If no saved default, return the hardcoded all-true defaults
    const permissions =
      record && record.permissions?.length > 0
        ? record.permissions
        : generateDefaultPermissions();

    res.status(200).json({ success: true, data: { department, permissions } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── SAVE/UPDATE DEPARTMENT DEFAULT PERMISSIONS — PUT /api/roles/department-default/:dept
exports.upsertDeptDefault = async (req, res) => {
  try {
    const companyId = getCompanyId(req.user);
    const { department } = req.params;
    const { permissions } = req.body;

    const record = await DepartmentDefault.findOneAndUpdate(
      { companyId, department },
      { companyId, department, permissions },
      { upsert: true, new: true }
    );

    res.status(200).json({ success: true, data: record });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
