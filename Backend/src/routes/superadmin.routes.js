const express = require('express');
const router = express.Router();
const {
    getAllCompanies, getCompanyById, toggleCompanyStatus,
    updateCompanyPlan, deleteCompany, getPlatformStats, getAllUsers,
} = require('../controllers/superadmin.controller');
const { protect, authorize } = require('../middleware/auth');

// All superadmin routes: auth + role check
// NO tenant filter — superadmin sees everything
router.use(protect, authorize('superadmin'));

router.get('/stats', getPlatformStats);
router.get('/companies', getAllCompanies);
router.get('/companies/:id', getCompanyById);
router.patch('/companies/:id/toggle', toggleCompanyStatus);
router.patch('/companies/:id/plan', updateCompanyPlan);
router.delete('/companies/:id', deleteCompany);
router.get('/users', getAllUsers);

module.exports = router;
