const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { login, getMe, changePassword, updateProfile, uploadAvatar } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth');
const { uploadAvatar: multerAvatar } = require('../middleware/upload');
const validate = require('../middleware/validate');

// POST /api/auth/login
router.post(
    '/login',
    [
        body('email').isEmail().withMessage('Enter a valid email'),
        body('password').notEmpty().withMessage('Password is required'),
    ],
    validate,
    login
);

// GET /api/auth/me
router.get('/me', protect, getMe);

// PUT /api/auth/profile
router.put('/profile', protect, updateProfile);

// POST /api/auth/avatar
router.post('/avatar', protect, multerAvatar.single('avatar'), uploadAvatar);

// PUT /api/auth/change-password
router.put(
    '/change-password',
    protect,
    [
        body('currentPassword').notEmpty().withMessage('Current password is required'),
        body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
    ],
    validate,
    changePassword
);

module.exports = router;
