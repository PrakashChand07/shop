const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

// ── Company Logo ─────────────────────────────────────────
const logoStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'billing-saas/logos',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'svg'],
        transformation: [{ width: 400, height: 400, crop: 'limit' }],
    },
});

// ── User Avatar ───────────────────────────────────────────
const avatarStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'billing-saas/avatars',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        transformation: [{ width: 200, height: 200, crop: 'fill', gravity: 'face' }],
    },
});

// ── Expense Receipt ───────────────────────────────────────
const receiptStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'billing-saas/receipts',
        allowed_formats: ['jpg', 'jpeg', 'png', 'pdf', 'webp'],
    },
});

// ── Company Signature ───────────────────────────────────────
const signatureStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'billing-saas/signatures',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'svg'],
        transformation: [{ width: 300, height: 150, crop: 'limit' }],
    },
});

// ── Company Seal ───────────────────────────────────────
const sealStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'billing-saas/seals',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'svg'],
        transformation: [{ width: 300, height: 300, crop: 'limit' }],
    },
});

// File size limit: 5MB
const fileSizeLimit = 5 * 1024 * 1024;

const uploadLogo = multer({ storage: logoStorage, limits: { fileSize: fileSizeLimit } });
const uploadAvatar = multer({ storage: avatarStorage, limits: { fileSize: fileSizeLimit } });
const uploadReceipt = multer({ storage: receiptStorage, limits: { fileSize: fileSizeLimit } });
const uploadSignature = multer({ storage: signatureStorage, limits: { fileSize: fileSizeLimit } });
const uploadSeal = multer({ storage: sealStorage, limits: { fileSize: fileSizeLimit } });

module.exports = { uploadLogo, uploadAvatar, uploadReceipt, uploadSignature, uploadSeal };
