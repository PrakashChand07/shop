const express = require("express");
const router = express.Router();
const {
  createRole,
  getRoles,
  updateRole,
  deleteRole,
  updatePermissions,
  getDepartments,
  getDeptDefault,
  upsertDeptDefault,
} = require("../controllers/roleController");
const { protect } = require("../middleware/auth");
const { checkPermission } = require("../middleware/permissionMiddleware");

router.use(protect);

// ── Static routes first (before /:id param routes) ───────────────────────────
router.get("/departments", getDepartments);
router.get("/department-default/:department", getDeptDefault);
router.put("/department-default/:department", checkPermission("Role", "canUpdate"), upsertDeptDefault);

// ── Role CRUD ─────────────────────────────────────────────────────────────────
router.post("/", checkPermission("Role", "canCreate"), createRole);
router.get("/", checkPermission("Role", "canRead"), getRoles);
router.put("/:id", checkPermission("Role", "canUpdate"), updateRole);
router.patch("/:id/permissions", checkPermission("Role", "canUpdate"), updatePermissions);
router.delete("/:id", checkPermission("Role", "canDelete"), deleteRole);

module.exports = router;
