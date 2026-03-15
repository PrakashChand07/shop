const PurchaseOrder = require('../models/PurchaseOrder');

const getPagination = (query) => {
    const page = Math.max(1, parseInt(query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 20));
    const skip = (page - 1) * limit;
    return { page, limit, skip };
};

// @desc    Get all purchase orders
// @route   GET /api/purchase-orders
// @access  Private
const getPurchaseOrders = async (req, res, next) => {
    try {
        const { page, limit, skip } = getPagination(req.query);
        const { search, status, supplier, sort = 'createdAt', order = 'desc' } = req.query;

        const filter = { company: req.companyId };
        if (status) filter.status = status;
        if (supplier) filter.supplier = supplier;
        if (search) {
            filter.$or = [
                { poNumber: { $regex: search, $options: 'i' } },
            ];
        }

        const sortObj = { [sort]: order === 'asc' ? 1 : -1 };
        const total = await PurchaseOrder.countDocuments(filter);
        const purchaseOrders = await PurchaseOrder.find(filter)
            .populate('supplier', 'name email phone')
            .populate('items.product', 'name sku hsnCode')
            .sort(sortObj)
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            success: true,
            data: purchaseOrders,
            pagination: { total, page, pages: Math.ceil(total / limit), limit },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single PO
// @route   GET /api/purchase-orders/:id
// @access  Private
const getPurchaseOrder = async (req, res, next) => {
    try {
        const po = await PurchaseOrder.findOne({ _id: req.params.id, company: req.companyId })
            .populate('supplier', 'name email phone address gstNumber')
            .populate('items.product', 'name sku hsnCode rate sellingPrice');

        if (!po) {
            return res.status(404).json({ success: false, message: 'Purchase order not found.' });
        }
        res.status(200).json({ success: true, data: po });
    } catch (error) {
        next(error);
    }
};

// @desc    Create PO
// @route   POST /api/purchase-orders
// @access  Private
const createPurchaseOrder = async (req, res, next) => {
    try {
        const payload = {
            ...req.body,
            company: req.companyId,
            createdBy: req.user._id,
        };

        // Ensure unique PO per company
        if (!payload.poNumber) {
            payload.poNumber = `PO-${Date.now().toString().slice(-6)}`;
        }

        const newPo = await PurchaseOrder.create(payload);
        res.status(201).json({ success: true, message: 'Purchase Order created.', data: newPo });
    } catch (error) {
        next(error);
    }
};

// @desc    Update PO
// @route   PUT /api/purchase-orders/:id
// @access  Private
const updatePurchaseOrder = async (req, res, next) => {
    try {
        const payload = { ...req.body };
        // prevent moving to another company
        delete payload.company;

        const updatedPo = await PurchaseOrder.findOneAndUpdate(
            { _id: req.params.id, company: req.companyId },
            payload,
            { new: true, runValidators: true }
        );

        if (!updatedPo) {
            return res.status(404).json({ success: false, message: 'Purchase order not found.' });
        }
        res.status(200).json({ success: true, message: 'Purchase Order updated.', data: updatedPo });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete PO
// @route   DELETE /api/purchase-orders/:id
// @access  Private
const deletePurchaseOrder = async (req, res, next) => {
    try {
        const deletedPo = await PurchaseOrder.findOneAndDelete({ _id: req.params.id, company: req.companyId });
        if (!deletedPo) {
            return res.status(404).json({ success: false, message: 'Purchase order not found.' });
        }
        res.status(200).json({ success: true, message: 'Purchase Order deleted.' });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getPurchaseOrders, getPurchaseOrder, createPurchaseOrder, updatePurchaseOrder, deletePurchaseOrder
};
