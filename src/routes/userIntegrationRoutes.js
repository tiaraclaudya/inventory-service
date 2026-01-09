const express = require('express');
const router = express.Router();
const userIntegrationController = require('../controllers/userIntegrationController');

// PROXY ROUTES ke User Service
router.get('/user', userIntegrationController.getAllUsers);
router.get('/user/search', userIntegrationController.searchUsers);
router.get('/user/:id', userIntegrationController.getUserById);
router.post('/user', userIntegrationController.createUser);
router.put('/user/:id', userIntegrationController.updateUser);
router.delete('/user/:id', userIntegrationController.deleteUser);

// CUSTOM INTEGRATION ROUTES
router.get('/products/:productId/creator/:userId', userIntegrationController.getUserForProduct);
router.get('/health/user-service', userIntegrationController.checkUserServiceHealth);

// Info route
router.get('/', (req, res) => {
    res.json({
        service: 'Inventory Service - User Integration',
        description: 'Proxy and integration routes to User Service',
        user_service_url: 'http://localhost:3001',
        endpoints: {
            // Proxy routes
            get_all_users: 'GET /api/user-integration/users',
            get_user: 'GET /api/user-integration/users/:id',
            search_users: 'GET /api/user-integration/users/search?q=keyword',
            create_user: 'POST /api/user-integration/users',
            update_user: 'PUT /api/user-integration/users/:id',
            delete_user: 'DELETE /api/user-integration/users/:id',
            
            // Integration routes
            user_for_product: 'GET /api/user-integration/products/:productId/creator/:userId',
            health_check: 'GET /api/user-integration/health/user-service'
        },
        note: 'These routes proxy requests to User Service running on port 3001'
    });
});

module.exports = router;