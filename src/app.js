const express = require('express');
const cors = require('cors');

// Import routes
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const userIntegrationRoutes = require('./routes/userIntegrationRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/product', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/user', userIntegrationRoutes);

// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        service: 'Inventory Service',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        service: 'Electronic Inventory Service',
        version: '1.0.0',
        description: 'Microservice untuk mengelola inventory barang elektronik',
        endpoints: {
            products: {
                get_all: 'GET /api/product',
                get_by_id: 'GET /api/product/:id',
                get_by_code: 'GET /api/product/code/:code',
                search: 'GET /api/product/search?q=keyword',
                low_stock: 'GET /api/product/low-stock?threshold=10',
                by_category: 'GET /api/product/category/:categoryId',
                by_price: 'GET /api/product/price-range?min=0&max=1000000',
                statistics: 'GET /api/product/statistics',
                create: 'POST /api/product',
                update: 'PUT /api/product/:id',
                update_stock: 'PATCH /api/product/:id/stock',
                delete: 'DELETE /api/product/:id'
            },
            categories: {
                get_all: 'GET /api/categories',
                get_with_count: 'GET /api/categories/with-count',
                get_by_id: 'GET /api/categories/:id',
                create: 'POST /api/categories',
                update: 'PUT /api/categories/:id',
                delete: 'DELETE /api/categories/:id'
            },
            health: 'GET /health'
        }
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint not found',
        path: req.originalUrl,
        method: req.method
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Server Error:', err.stack);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

module.exports = app;