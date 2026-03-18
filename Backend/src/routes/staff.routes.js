const express = require('express');
const {
    getStaff,
    getStaffById,
    createStaff,
    updateStaff,
    deleteStaff,
    toggleStaffStatus,
} = require('../controllers/staff.controller');
const { protect } = require('../middleware/auth');
const tenantFilter = require('../middleware/tenantFilter');

const router = express.Router();

// Apply auth middleware to all routes
router.use(protect);
router.use(tenantFilter);

router.route('/')
    .get(getStaff)
    .post(createStaff);

router.route('/:id')
    .get(getStaffById)
    .put(updateStaff)
    .delete(deleteStaff);

router.route('/:id/toggle-status')
    .patch(toggleStaffStatus);

module.exports = router;
