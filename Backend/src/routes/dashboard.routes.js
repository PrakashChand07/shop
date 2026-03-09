const express = require('express');
const router = express.Router();
const { getDashboardStats, getRecentActivity, getRevenueChart, getTopCustomers } = require('../controllers/dashboard.controller');
const { protect } = require('../middleware/auth');
const tenantFilter = require('../middleware/tenantFilter');

router.use(protect, tenantFilter);

router.get('/stats', getDashboardStats);
router.get('/recent-activity', getRecentActivity);
router.get('/revenue-chart', getRevenueChart);
router.get('/top-customers', getTopCustomers);

module.exports = router;
