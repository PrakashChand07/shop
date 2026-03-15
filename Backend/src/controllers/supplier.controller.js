const Supplier = require('../models/Supplier');

const getPagination = (query) => {
    const page = Math.max(1, parseInt(query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 20));
    const skip = (page - 1) * limit;
    return { page, limit, skip };
};

// @desc    Get all suppliers
// @route   GET /api/suppliers
// @access  Private
const getSuppliers = async (req, res, next) => {
    try {
        const { page, limit, skip } = getPagination(req.query);
        const { search, status, sort = 'createdAt', order = 'desc' } = req.query;

        const filter = { company: req.companyId };
        if (status) filter.status = status;
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { contactPerson: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { phone: { $regex: search, $options: 'i' } },
            ];
        }

        const sortObj = { [sort]: order === 'asc' ? 1 : -1 };
        const total = await Supplier.countDocuments(filter);
        const suppliers = await Supplier.find(filter)
            .sort(sortObj)
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            success: true,
            data: suppliers,
            pagination: { total, page, pages: Math.ceil(total / limit), limit },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single supplier
// @route   GET /api/suppliers/:id
// @access  Private
const getSupplier = async (req, res, next) => {
    try {
        const supplier = await Supplier.findOne({ _id: req.params.id, company: req.companyId });
        if (!supplier) {
            return res.status(404).json({ success: false, message: 'Supplier not found.' });
        }
        res.status(200).json({ success: true, data: supplier });
    } catch (error) {
        next(error);
    }
};

// @desc    Create supplier
// @route   POST /api/suppliers
// @access  Private (Admin/Manager)
const createSupplier = async (req, res, next) => {
    try {
        const supplier = await Supplier.create({
            ...req.body,
            company: req.companyId,
            createdBy: req.user._id,
        });
        res.status(201).json({ success: true, message: 'Supplier created.', data: supplier });
    } catch (error) {
        next(error);
    }
};

// @desc    Update supplier
// @route   PUT /api/suppliers/:id
// @access  Private (Admin/Manager)
const updateSupplier = async (req, res, next) => {
    try {
        const supplier = await Supplier.findOneAndUpdate(
            { _id: req.params.id, company: req.companyId },
            req.body,
            { new: true, runValidators: true }
        );
        if (!supplier) {
            return res.status(404).json({ success: false, message: 'Supplier not found.' });
        }
        res.status(200).json({ success: true, message: 'Supplier updated.', data: supplier });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete supplier
// @route   DELETE /api/suppliers/:id
// @access  Private (Admin)
const deleteSupplier = async (req, res, next) => {
    try {
        const supplier = await Supplier.findOneAndDelete({ _id: req.params.id, company: req.companyId });
        if (!supplier) {
            return res.status(404).json({ success: false, message: 'Supplier not found.' });
        }
        res.status(200).json({ success: true, message: 'Supplier deleted.' });
    } catch (error) {
        next(error);
    }
};

module.exports = { getSuppliers, getSupplier, createSupplier, updateSupplier, deleteSupplier };
