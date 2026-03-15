require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./src/config/db');
const errorHandler = require('./src/middleware/errorHandler');

// ── Routes ──────────────────────────────────────────────
const authRoutes = require('./src/routes/auth.routes');
const companyRoutes = require('./src/routes/company.routes');
const customerRoutes = require('./src/routes/customer.routes');
const productRoutes = require('./src/routes/product.routes');
const categoryRoutes = require('./src/routes/category.routes');
const supplierRoutes = require('./src/routes/supplier.routes');
const purchaseOrderRoutes = require('./src/routes/purchaseOrder.routes');
const invoiceRoutes = require('./src/routes/invoice.routes');
const paymentRoutes = require('./src/routes/payment.routes');
const expenseRoutes = require('./src/routes/expense.routes');
const dashboardRoutes = require('./src/routes/dashboard.routes');
const superadminRoutes = require('./src/routes/superadmin.routes');

// Connect to MongoDB
connectDB();

const app = express();

// ── MIDDLEWARE ───────────────────────────────────────────

app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// ── ROUTES ───────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/company', companyRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/purchase-orders', purchaseOrderRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/superadmin', superadminRoutes); // Postman only

// Health check
app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: '🚀 SaaS Billing API is running!',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route '${req.originalUrl}' not found.`,
    });
});

// Global error handler
app.use(errorHandler);

// ── START SERVER ────────────────────────────────────────
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(`\n🚀 Server   : http://localhost:${PORT}`);
    console.log(`🌍 Env      : ${process.env.NODE_ENV}`);
    console.log(`📋 API Base : http://localhost:${PORT}/api`);
    console.log(`❤️  Health  : http://localhost:${PORT}/api/health\n`);
});

process.on('unhandledRejection', (err) => {
    console.error('❌ Unhandled Rejection:', err.message);
    server.close(() => process.exit(1));
});
