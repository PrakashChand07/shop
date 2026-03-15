const Product = require('../models/Product');

const getPagination = (query) => {
    const page = Math.max(1, parseInt(query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 20));
    const skip = (page - 1) * limit;
    return { page, limit, skip };
};

// @desc    Get all products
// @route   GET /api/products
// @access  Private
const getProducts = async (req, res, next) => {
    try {
        const { page, limit, skip } = getPagination(req.query);
        const { search, category, isActive, sort = 'createdAt', order = 'desc' } = req.query;

        const filter = { company: req.companyId };
        if (category) filter.category = category;
        if (isActive !== undefined) filter.isActive = isActive === 'true';
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { sku: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
            ];
        }

        const sortObj = { [sort]: order === 'asc' ? 1 : -1 };
        const total = await Product.countDocuments(filter);
        const products = await Product.find(filter)
            .sort(sortObj)
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            success: true,
            data: products,
            pagination: { total, page, pages: Math.ceil(total / limit), limit },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Private
const getProduct = async (req, res, next) => {
    try {
        const product = await Product.findOne({ _id: req.params.id, company: req.companyId });
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found.' });
        }
        res.status(200).json({ success: true, data: product });
    } catch (error) {
        next(error);
    }
};

// @desc    Create product
// @route   POST /api/products
// @access  Private (Admin/Manager)
const createProduct = async (req, res, next) => {
    try {
        const payload = { ...req.body };
        if (payload.sku === '') {
            payload.sku = undefined;
        }

        const product = await Product.create({
            ...payload,
            company: req.companyId,
            createdBy: req.user._id,
        });
        res.status(201).json({ success: true, message: 'Product created.', data: product });
    } catch (error) {
        next(error);
    }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private (Admin/Manager)
const updateProduct = async (req, res, next) => {
    try {
        const payload = { ...req.body };
        const updateOperation = { $set: payload };
        
        if (payload.sku === '') {
            delete payload.sku;
            updateOperation.$unset = { sku: 1 };
        }

        const product = await Product.findOneAndUpdate(
            { _id: req.params.id, company: req.companyId },
            updateOperation,
            { new: true, runValidators: true }
        );
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found.' });
        }
        res.status(200).json({ success: true, message: 'Product updated.', data: product });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private (Admin)
const deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findOneAndDelete({ _id: req.params.id, company: req.companyId });
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found.' });
        }
        res.status(200).json({ success: true, message: 'Product deleted.' });
    } catch (error) {
        next(error);
    }
};

// @desc    Get product categories in company
// @route   GET /api/products/categories
// @access  Private
const getCategories = async (req, res, next) => {
    try {
        const categories = await Product.distinct('category', {
            company: req.companyId,
            category: { $ne: null },
        });
        res.status(200).json({ success: true, data: categories });
    } catch (error) {
        next(error);
    }
};

module.exports = { getProducts, getProduct, createProduct, updateProduct, deleteProduct, getCategories };
