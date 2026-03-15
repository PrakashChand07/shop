const express = require('express');
const router = express.Router();
const { 
    getPurchaseOrders, 
    getPurchaseOrder, 
    createPurchaseOrder, 
    updatePurchaseOrder, 
    deletePurchaseOrder 
} = require('../controllers/purchaseOrder.controller');
const { protect, authorize } = require('../middleware/auth');
const tenantFilter = require('../middleware/tenantFilter');

router.use(protect, tenantFilter);

router.route('/')
    .get(getPurchaseOrders)
    .post(authorize('admin', 'manager'), createPurchaseOrder);

router.route('/:id')
    .get(getPurchaseOrder)
    .put(authorize('admin', 'manager'), updatePurchaseOrder)
    .delete(authorize('admin'), deletePurchaseOrder);

module.exports = router;
