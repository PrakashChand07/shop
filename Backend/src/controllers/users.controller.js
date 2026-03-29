const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { Department } = require("../common/enums/department.enum");

// ─── GET /api/users ─────────────────────────────────────────────────────────
// Returns all company users EXCLUDING superadmin and admin, filtered by companyId
exports.getCompanyUsers = async (req, res) => {
  try {
    const users = await User.find({
      company: req.user.company?._id || req.user.companyId,
      role: { $nin: ["superadmin", "admin"] },
    })
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── POST /api/users ────────────────────────────────────────────────────────
// Create a new company user (staff/manager etc.)
exports.createCompanyUser = async (req, res) => {
  try {
    const { name, email, password, role, department, phone } = req.body;

    const companyId = req.user.company?._id || req.user.companyId;

    // Check email duplicate within company
    const existing = await User.findOne({ email: email.toLowerCase(), company: companyId });
    if (existing) {
      return res.status(400).json({ success: false, message: "Email already in use in your company." });
    }

    const user = await User.create({
      company: companyId,
      name,
      email,
      password,
      role: role || "staff",
      phone: phone || "",
      isActive: true,
    });

    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json({ success: true, data: userResponse });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── PUT /api/users/:id ──────────────────────────────────────────────────────
// Update user basic info
exports.updateCompanyUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role, phone, isActive, password } = req.body;

    const companyId = req.user.company?._id || req.user.companyId;

    const updateData = { name, email, role, phone, isActive };

    // Only update password if provided
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    const user = await User.findOneAndUpdate(
      { _id: id, company: companyId, role: { $nin: ["superadmin", "admin"] } },
      updateData,
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── DELETE /api/users/:id ───────────────────────────────────────────────────
exports.deleteCompanyUser = async (req, res) => {
  try {
    const { id } = req.params;
    const companyId = req.user.company?._id || req.user.companyId;

    const user = await User.findOneAndDelete({
      _id: id,
      company: companyId,
      role: { $nin: ["superadmin", "admin"] },
    });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    res.status(200).json({ success: true, message: "User deleted successfully." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
