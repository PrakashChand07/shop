const Category = require('../models/Category');

const getPagination = (query) => {
    const page = Math.max(1, parseInt(query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 20));
    const skip = (page - 1) * limit;
    return { page, limit, skip };
};

// @desc    Get all categories
// @route   GET /api/categories
// @access  Private
const getCategories = async (req, res, next) => {
    try {
        const { page, limit, skip } = getPagination(req.query);
        const { search, isActive, sort = 'createdAt', order = 'desc' } = req.query;

        const filter = { company: req.companyId };
        if (isActive !== undefined) filter.isActive = isActive === 'true';
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
            ];
        }

        const sortObj = { [sort]: order === 'asc' ? 1 : -1 };
        const total = await Category.countDocuments(filter);
        const categories = await Category.find(filter)
            .sort(sortObj)
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            success: true,
            data: categories,
            pagination: { total, page, pages: Math.ceil(total / limit), limit },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single category
// @route   GET /api/categories/:id
// @access  Private
const getCategory = async (req, res, next) => {
    try {
        const category = await Category.findOne({ _id: req.params.id, company: req.companyId });
        if (!category) {
            return res.status(404).json({ success: false, message: 'Category not found.' });
        }
        res.status(200).json({ success: true, data: category });
    } catch (error) {
        next(error);
    }
};

// @desc    Create category
// @route   POST /api/categories
// @access  Private (Admin/Manager)
const createCategory = async (req, res, next) => {
    try {
        const category = await Category.create({
            ...req.body,
            company: req.companyId,
            createdBy: req.user._id,
        });
        res.status(201).json({ success: true, message: 'Category created.', data: category });
    } catch (error) {
        next(error);
    }
};

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private (Admin/Manager)
const updateCategory = async (req, res, next) => {
    try {
        const category = await Category.findOneAndUpdate(
            { _id: req.params.id, company: req.companyId },
            req.body,
            { new: true, runValidators: true }
        );
        if (!category) {
            return res.status(404).json({ success: false, message: 'Category not found.' });
        }
        res.status(200).json({ success: true, message: 'Category updated.', data: category });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private (Admin)
const deleteCategory = async (req, res, next) => {
    try {
        const category = await Category.findOneAndDelete({ _id: req.params.id, company: req.companyId });
        if (!category) {
            return res.status(404).json({ success: false, message: 'Category not found.' });
        }
        res.status(200).json({ success: true, message: 'Category deleted.' });
    } catch (error) {
        next(error);
    }
};

module.exports = { getCategories, getCategory, createCategory, updateCategory, deleteCategory };
