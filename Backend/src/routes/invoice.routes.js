const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
    getInvoices, getInvoice, createInvoice, updateInvoice,
    updateInvoiceStatus, convertToInvoice, deleteInvoice, getInvoiceStats,
} = require('../controllers/invoice.controller');
const { protect, authorize } = require('../middleware/auth');
const tenantFilter = require('../middleware/tenantFilter');
const validate = require('../middleware/validate');

router.use(protect, tenantFilter);

// GET /api/invoices/stats
router.get('/stats', getInvoiceStats);

router.route('/')
    .get(getInvoices)
    .post(
        [
            body('customer').notEmpty().withMessage('Customer is required'),
            body('dueDate').notEmpty().withMessage('Due date is required'),
            body('lineItems').isArray({ min: 1 }).withMessage('At least one line item is required'),
        ],
        validate,
        createInvoice
    );

router.route('/:id')
    .get(getInvoice)
    .put(updateInvoice)
    .delete(authorize('admin'), deleteInvoice);

router.patch('/:id/status', updateInvoiceStatus);
router.post('/:id/convert', convertToInvoice);

module.exports = router;
