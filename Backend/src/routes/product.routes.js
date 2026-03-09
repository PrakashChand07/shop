const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { getProducts, getProduct, createProduct, updateProduct, deleteProduct, getCategories } = require('../controllers/product.controller');
const { protect, authorize } = require('../middleware/auth');
const tenantFilter = require('../middleware/tenantFilter');
const validate = require('../middleware/validate');

router.use(protect, tenantFilter);

// GET /api/products/categories
router.get('/categories', getCategories);

router.route('/')
    .get(getProducts)
    .post(
        authorize('admin', 'manager'),
        [
            body('name').notEmpty().withMessage('Product name is required'),
            body('unitPrice').isFloat({ min: 0 }).withMessage('Valid unit price is required'),
        ],
        validate,
        createProduct
    );

router.route('/:id')
    .get(getProduct)
    .put(authorize('admin', 'manager'), updateProduct)
    .delete(authorize('admin'), deleteProduct);

module.exports = router;
