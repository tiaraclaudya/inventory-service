const userServiceClient = require('./../utils/apiclient');

const userIntegrationController = {
    // Get all users dari user service
    async getAllUsers(req, res) {
        try {
            console.log('Fetching all user from User Service...');
            
            const response = await userServiceClient.authClient.get('/api/users/');
            
            res.json({
                success: true,
                message: 'Users fetched from User Service',
                data: response.data.data,
                count: response.data.count,
                source: 'user-service'
            });
            
        } catch (error) {
            console.error('Error fetching users:', error.message);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch users from User Service',
                error: error.message,
                suggestion: 'Make sure User Service is running on port 3001'
            });
        }
    },
    
    // Get user by ID dari user service
    async getUserById(req, res) {
        try {
            const userId = req.params.id;
            console.log(`Fetching user ${userId} from User Service...`);
            
            const response = await userServiceClient.authClient.get(`/api/users/${userId}`);
            
            res.json({
                success: true,
                message: `User ${userId} fetched successfully`,
                data: response.data.data,
                source: 'user-service'
            });
            
        } catch (error) {
            console.error(`Error fetching user ${req.params.id}:`, error.message);
            
            if (error.response?.status === 404) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found in User Service'
                });
            }
            
            res.status(500).json({
                success: false,
                message: 'Failed to fetch user from User Service',
                error: error.message
            });
        }
    },
    
    // Search users di user service
    async searchUsers(req, res) {
        try {
            const { q } = req.query;
            
            if (!q) {
                return res.status(400).json({
                    success: false,
                    message: 'Search query (q) is required'
                });
            }
            
            console.log(`Searching users for: "${q}" in User Service...`);
            
            const response = await userServiceClient.get('/api/users/search', {
                params: { q }
            });
            
            res.json({
                success: true,
                message: `Search results for "${q}"`,
                query: q,
                data: response.data.data,
                count: response.data.count,
                source: 'user-service'
            });
            
        } catch (error) {
            console.error('Error searching users:', error.message);
            res.status(500).json({
                success: false,
                message: 'Failed to search users in User Service',
                error: error.message
            });
        }
    },
    
    // Create user di user service (proxy)
    async createUser(req, res) {
        try {
            const userData = req.body;
            console.log('Creating user in User Service...', userData);
            
            const response = await userServiceClient.authClient.post('/api/users', userData);
            
            res.status(201).json({
                success: true,
                message: 'User created in User Service',
                data: response.data.data,
                source: 'user-service'
            });
            
        } catch (error) {
            console.error('Error creating user:', error.message);
            
            if (error.response?.status === 400) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation error in User Service',
                    errors: error.response.data.errors
                });
            }
            
            res.status(500).json({
                success: false,
                message: 'Failed to create user in User Service',
                error: error.message
            });
        }
    },
    
    // Update user di user service (proxy)
    async updateUser(req, res) {
        try {
            const userId = req.params.id;
            const updateData = req.body;
            
            console.log(`Updating user ${userId} in User Service...`);
            
            const response = await userServiceClient.authClient.put(`/api/users/${userId}`, updateData);
            
            res.json({
                success: true,
                message: `User ${userId} updated successfully`,
                data: response.data.data,
                source: 'user-service'
            });
            
        } catch (error) {
            console.error(`Error updating user ${req.params.id}:`, error.message);
            
            if (error.response?.status === 404) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found in User Service'
                });
            }
            
            res.status(500).json({
                success: false,
                message: 'Failed to update user in User Service',
                error: error.message
            });
        }
    },
    
    // Delete user di user service (proxy)
    async deleteUser(req, res) {
        try {
            const userId = req.params.id;
            console.log(`Deleting user ${userId} from User Service...`);
            
            const response = await userServiceClient.authClient.delete(`/api/users/${userId}`);
            
            res.json({
                success: true,
                message: response.data.message || `User ${userId} deleted`,
                source: 'user-service'
            });
            
        } catch (error) {
            console.error(`Error deleting user ${req.params.id}:`, error.message);
            
            if (error.response?.status === 404) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found in User Service'
                });
            }
            
            res.status(500).json({
                success: false,
                message: 'Failed to delete user in User Service',
                error: error.message
            });
        }
    },
    
    // Get user info untuk product (contoh: siapa yang membuat produk)
    async getUserForProduct(req, res) {
        try {
            const { userId } = req.params;
            const productId = req.params.productId;
            
            console.log(`Getting user ${userId} for product ${productId}...`);
            
            // 1. Get user data dari user service
            const userResponse = await userServiceClient.get(`/api/users/${userId}`);
            
            // 2. Get product data dari inventory service sendiri
            const product = await getProductFromDatabase(productId);
            
            // 3. Gabungkan data
            res.json({
                success: true,
                message: `User and product data`,
                data: {
                    product: product,
                    creator: userResponse.data.data
                },
                sources: {
                    user: 'user-service',
                    product: 'inventory-service'
                }
            });
            
        } catch (error) {
            console.error('Error getting user for product:', error.message);
            res.status(500).json({
                success: false,
                message: 'Failed to get user and product data',
                error: error.message
            });
        }
    },
    
    // Health check user service
    async checkUserServiceHealth(req, res) {
        try {
            const response = await userServiceClient.get('/health');
            
            res.json({
                success: true,
                message: 'User Service is healthy',
                user_service: response.data,
                inventory_service: {
                    status: 'OK',
                    service: 'Inventory Service'
                }
            });
            
        } catch (error) {
            console.error('User Service health check failed:', error.message);
            res.status(503).json({
                success: false,
                message: 'User Service is not available',
                inventory_service: {
                    status: 'OK',
                    service: 'Inventory Service'
                },
                user_service: {
                    status: 'DOWN',
                    error: error.message
                }
            });
        }
    }
};

// Helper function (ganti dengan model product Anda)
async function getProductFromDatabase(productId) {
    // Contoh data, ganti dengan query database
    return {
        id: productId,
        name: 'Sample Product',
        price: 100000,
        stock: 50
    };
}

module.exports = userIntegrationController;