const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { getExpenses, getExpense, createExpense, updateExpense, deleteExpense, getExpenseStats } = require('../controllers/expense.controller');
const { protect, authorize } = require('../middleware/auth');
const tenantFilter = require('../middleware/tenantFilter');
const { uploadReceipt } = require('../middleware/upload');
const validate = require('../middleware/validate');

router.use(protect, tenantFilter);

router.get('/stats', getExpenseStats);

router.route('/')
    .get(getExpenses)
    .post(
        uploadReceipt.single('receipt'),
        [
            body('category').notEmpty().withMessage('Category is required'),
            body('amount').isFloat({ min: 0.01 }).withMessage('Valid amount is required'),
            body('date').notEmpty().withMessage('Date is required'),
        ],
        validate,
        createExpense
    );

router.route('/:id')
    .get(getExpense)
    .put(updateExpense)
    .delete(authorize('admin', 'manager'), deleteExpense);

module.exports = router;
