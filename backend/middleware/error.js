/**
 * Custom error handler middleware
 */
export const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;

    // Log to console for dev
    console.error(err);

    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
        const message = 'Resource not found';
        error.message = message;
        error.statusCode = 404;
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
        const message = 'Duplicate field value entered';
        error.message = message;
        error.statusCode = 400;
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map((val) => val.message);
        error.message = message;
        error.statusCode = 400;
    }

    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || 'Server Error',
    });
};

/**
 * Handle 404 routes
 */
export const notFound = (req, res, next) => {
    // Only trigger 404 for API routes, ignore static assets
    if (req.originalUrl.startsWith('/api')) {
        const error = new Error(`Not Found - ${req.originalUrl}`);
        res.status(404);
        next(error);
    } else {
        // For non-API routes, just send a simple 404
        res.status(404).json({
            success: false,
            message: 'Route not found'
        });
    }
};

