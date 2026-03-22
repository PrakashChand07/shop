const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
    registerCompany,
    getCompanyProfile,
    updateCompanyProfile,
    uploadLogo,
    uploadSignature,
    uploadSeal,
    inviteUser,
    getCompanyUsers,
    updateCompanyUser,
    deleteCompanyUser,
    deleteLogoOrSignature,
} = require('../controllers/company.controller');
const { protect, authorize } = require('../middleware/auth');
const tenantFilter = require('../middleware/tenantFilter');
const { uploadLogo: multerLogo, uploadSignature: multerSignature, uploadSeal: multerSeal } = require('../middleware/upload');
const validate = require('../middleware/validate');

// POST /api/company/register (Public — creates company + admin)
router.post(
    '/register',
    [
        body('companyName').notEmpty().withMessage('Company name is required'),
        body('companyEmail').isEmail().withMessage('Enter a valid company email'),
        body('adminName').notEmpty().withMessage('Admin name is required'),
        body('adminEmail').isEmail().withMessage('Enter a valid admin email'),
        body('adminPassword').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    ],
    validate,
    registerCompany
);

// All routes below require auth + tenant filter
router.use(protect, tenantFilter);

// GET /PUT /api/company/profile
router.route('/profile')
    .get(getCompanyProfile)
    .put(authorize('admin'), updateCompanyProfile);

// POST /api/company/logo
router.post('/logo', authorize('admin'), multerLogo.single('logo'), uploadLogo);

// POST /api/company/signature
router.post('/signature', authorize('admin'), multerSignature.single('signature'), uploadSignature);

// POST /api/company/seal
router.post('/seal', authorize('admin'), multerSeal.single('seal'), uploadSeal);

// DELETE /api/company/:type (logo or signature or seal)
router.delete('/:type', authorize('admin'), deleteLogoOrSignature);

// GET /POST /api/company/users
router.route('/users')
    .get(authorize('admin'), getCompanyUsers)
    .post(
        authorize('admin'),
        [
            body('name').notEmpty().withMessage('Name is required'),
            body('email').isEmail().withMessage('Enter a valid email'),
            body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
        ],
        validate,
        inviteUser
    );

// PUT /DELETE /api/company/users/:userId
router.route('/users/:userId')
    .put(authorize('admin'), updateCompanyUser)
    .delete(authorize('admin'), deleteCompanyUser);

module.exports = router;
