const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema(
    {
        company: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Company',
            default: null,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        action: {
            type: String,
            required: true,
            enum: [
                'CREATE',
                'UPDATE',
                'DELETE',
                'LOGIN',
                'LOGOUT',
                'STATUS_CHANGE',
                'PAID',
                'SENT',
                'CANCELLED',
            ],
        },
        module: {
            type: String,
            required: true,
            enum: [
                'invoice',
                'payment',
                'customer',
                'product',
                'expense',
                'user',
                'company',
                'auth',
            ],
        },
        documentId: {
            type: mongoose.Schema.Types.ObjectId,
            default: null,
        },
        description: {
            type: String,
        },
        ip: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

// Indexes
auditLogSchema.index({ company: 1, createdAt: -1 });
auditLogSchema.index({ company: 1, module: 1 });
auditLogSchema.index({ company: 1, user: 1 });

module.exports = mongoose.model('AuditLog', auditLogSchema);
