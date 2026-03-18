const express = require('express');
const {
    processSalary,
    getSalaries,
} = require('../controllers/salary.controller');
const { protect } = require('../middleware/auth');
const tenantFilter = require('../middleware/tenantFilter');

const router = express.Router();

// Apply auth middleware to all routes
router.use(protect);
router.use(tenantFilter);

router.route('/')
    .get(getSalaries)
    .post(processSalary);

module.exports = router;
