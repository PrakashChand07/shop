const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { getCustomers, getCustomer, createCustomer, updateCustomer, deleteCustomer } = require('../controllers/customer.controller');
const { protect, authorize } = require('../middleware/auth');
const tenantFilter = require('../middleware/tenantFilter');
const validate = require('../middleware/validate');

router.use(protect, tenantFilter);

router.route('/')
    .get(getCustomers)
    .post(
        [body('name').notEmpty().withMessage('Customer name is required')],
        validate,
        createCustomer
    );

router.route('/:id')
    .get(getCustomer)
    .put(updateCustomer)
    .delete(authorize('admin', 'manager'), deleteCustomer);

module.exports = router;
