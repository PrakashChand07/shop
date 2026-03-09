const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { getPayments, getPayment, createPayment, updatePaymentStatus, deletePayment, getPaymentStats } = require('../controllers/payment.controller');
const { protect, authorize } = require('../middleware/auth');
const tenantFilter = require('../middleware/tenantFilter');
const validate = require('../middleware/validate');

router.use(protect, tenantFilter);

router.get('/stats', getPaymentStats);

router.route('/')
    .get(getPayments)
    .post(
        [
            body('invoice').notEmpty().withMessage('Invoice is required'),
            body('customer').notEmpty().withMessage('Customer is required'),
            body('amount').isFloat({ min: 0.01 }).withMessage('Valid amount is required'),
            body('paymentMethod').notEmpty().withMessage('Payment method is required'),
        ],
        validate,
        createPayment
    );

router.route('/:id')
    .get(getPayment)
    .delete(authorize('admin'), deletePayment);

router.patch('/:id/status', authorize('admin'), updatePaymentStatus);

module.exports = router;
