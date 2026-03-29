const express = require("express");
const router = express.Router();
const {
  getCompanyUsers,
  createCompanyUser,
  updateCompanyUser,
  deleteCompanyUser,
} = require("../controllers/users.controller");
const { protect } = require("../middleware/auth");
const { checkPermission } = require("../middleware/permissionMiddleware");

router.use(protect);

router.get("/", checkPermission("User", "canRead"), getCompanyUsers);
router.post("/", checkPermission("User", "canCreate"), createCompanyUser);
router.put("/:id", checkPermission("User", "canUpdate"), updateCompanyUser);
router.delete("/:id", checkPermission("User", "canDelete"), deleteCompanyUser);

module.exports = router;
