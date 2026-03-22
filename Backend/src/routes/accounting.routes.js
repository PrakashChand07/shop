const express = require('express');
const router = express.Router();
const { getAccountingData } = require('../controllers/accounting.controller');
const { protect } = require('../middleware/auth');
const tenantFilter = require('../middleware/tenantFilter');

router.use(protect, tenantFilter);

router.get('/', getAccountingData);

module.exports = router;
