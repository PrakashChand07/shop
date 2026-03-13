const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { getCategories, getCategory, createCategory, updateCategory, deleteCategory } = require('../controllers/category.controller');
const { protect, authorize } = require('../middleware/auth');
const tenantFilter = require('../middleware/tenantFilter');
const validate = require('../middleware/validate');

router.use(protect, tenantFilter);

router.route('/')
    .get(getCategories)
    .post(
        authorize('admin', 'manager'),
        [
            body('name').notEmpty().withMessage('Category name is required'),
        ],
        validate,
        createCategory
    );

router.route('/:id')
    .get(getCategory)
    .put(authorize('admin', 'manager'), updateCategory)
    .delete(authorize('admin'), deleteCategory);

module.exports = router;
