const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;

    console.error('❌ Error:', err);

    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
        error.message = `Resource not found with id: ${err.value}`;
        return res.status(404).json({ success: false, message: error.message });
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
        let field = Object.keys(err.keyValue)[0];
        if (field === 'company' && Object.keys(err.keyValue).length > 1) {
            field = Object.keys(err.keyValue)[1];
        } else if (field === 'company' && typeof err.keyPattern === 'object') {
            const keys = Object.keys(err.keyPattern);
            if (keys.length > 1) field = keys[1];
        }
        error.message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists.`;
        return res.status(400).json({ success: false, message: error.message });
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map((e) => e.message);
        return res.status(400).json({ success: false, message: messages.join(', ') });
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({ success: false, message: 'Invalid token.' });
    }
    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ success: false, message: 'Token expired.' });
    }

    // Default error
    res.status(err.statusCode || 500).json({
        success: false,
        message: error.message || 'Internal Server Error',
    });
};

module.exports = errorHandler;
