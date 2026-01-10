const Product = require('../models/Product');

const productController = {
    // Get all products
    async getAllProducts(req, res) {
        try {
            const products = await Product.findAll();
            res.json({
                success: true,
                count: products.length,
                data: products
            });
        } catch (error) {
            console.error('Get products error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error'
            });
        }
    },

    // Get product by ID
    async getProductById(req, res) {
        try {
            const { id } = req.params;
            const product = await Product.findById(id);
            
            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: 'Product not found'
                });
            }
            
            res.json({
                success: true,
                data: product
            });
        } catch (error) {
            console.error('Get product error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error'
            });
        }
    },

    // Get product by code
    async getProductByCode(req, res) {
        try {
            const { code } = req.params;
            const product = await Product.findByCode(code);
            
            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: 'Product not found'
                });
            }
            
            res.json({
                success: true,
                data: product
            });
        } catch (error) {
            console.error('Get product by code error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error'
            });
        }
    },

    // Search product
    async searchProducts(req, res) {
        try {
            const { q } = req.query;
            
            if (!q) {
                return res.status(400).json({
                    success: false,
                    message: 'Search query is required'
                });
            }
            
            const products = await Product.search(q);
            
            res.json({
                success: true,
                count: products.length,
                query: q,
                data: products
            });
        } catch (error) {
            console.error('Search products error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error'
            });
        }
    },

    // Filter by category
    async getProductsByCategory(req, res) {
        try {
            const { categoryId } = req.params;
            const products = await Product.findByCategory(categoryId);
            
            res.json({
                success: true,
                count: products.length,
                category_id: categoryId,
                data: products
            });
        } catch (error) {
            console.error('Get products by category error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error'
            });
        }
    },

    // Get low stock products
    async getLowStockProducts(req, res) {
        try {
            const threshold = req.query.threshold || 10;
            const products = await Product.findLowStock(parseInt(threshold));
            
            res.json({
                success: true,
                count: products.length,
                threshold: threshold,
                data: products
            });
        } catch (error) {
            console.error('Get low stock error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error'
            });
        }
    },

    // Get products by price range
    async getProductsByPriceRange(req, res) {
        try {
            const { min, max } = req.query;
            
            if (!min || !max) {
                return res.status(400).json({
                    success: false,
                    message: 'Min and max price are required'
                });
            }
            
            const minPrice = parseFloat(min);
            const maxPrice = parseFloat(max);
            
            if (isNaN(minPrice) || isNaN(maxPrice)) {
                return res.status(400).json({
                    success: false,
                    message: 'Min and max must be valid numbers'
                });
            }
            
            const products = await Product.findByPriceRange(minPrice, maxPrice);
            
            res.json({
                success: true,
                count: products.length,
                price_range: { min: minPrice, max: maxPrice },
                data: products
            });
        } catch (error) {
            console.error('Get products by price range error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error'
            });
        }
    },

    // Create new product
    async createProduct(req, res) {
        try {
            const {
                product_code,
                name,
                category_id,
                price,
                stock,
                description,
                specifications
            } = req.body;
            
            // Validation
            if (!product_code || !name || !price) {
                return res.status(400).json({
                    success: false,
                    message: 'Product code, name, and price are required'
                });
            }
            
            // Check if product code already exists
            const existingProduct = await Product.findByCode(product_code);
            if (existingProduct) {
                return res.status(400).json({
                    success: false,
                    message: 'Product code already exists'
                });
            }
            
            const product = await Product.create({
                product_code,
                name,
                category_id: category_id || null,
                price: parseFloat(price),
                stock: parseInt(stock) || 0,
                description: description || '',
                specifications: specifications || {}
            });
            
            res.status(201).json({
                success: true,
                message: 'Product created successfully',
                data: product
            });
        } catch (error) {
            console.error('Create product error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error'
            });
        }
    },

    // Update product
    async updateProduct(req, res) {
        try {
            const { id } = req.params;
            const updateData = req.body;
            
            // Check if product exists
            const existingProduct = await Product.findById(id);
            if (!existingProduct) {
                return res.status(404).json({
                    success: false,
                    message: 'Product not found'
                });
            }
            
            // Check if new product code conflicts with other products
            if (updateData.product_code && updateData.product_code !== existingProduct.product_code) {
                const productWithCode = await Product.findByCode(updateData.product_code);
                if (productWithCode && productWithCode.id !== parseInt(id)) {
                    return res.status(400).json({
                        success: false,
                        message: 'Product code already used by another product'
                    });
                }
            }
            
            // Convert data types
            if (updateData.price) updateData.price = parseFloat(updateData.price);
            if (updateData.stock) updateData.stock = parseInt(updateData.stock);
            if (updateData.specifications && typeof updateData.specifications === 'object') {
                updateData.specifications = JSON.stringify(updateData.specifications);
            }
            
            const product = await Product.update(id, updateData);
            
            res.json({
                success: true,
                message: 'Product updated successfully',
                data: product
            });
        } catch (error) {
            console.error('Update product error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error'
            });
        }
    },

    // Update product stock
    async updateProductStock(req, res) {
        try {
            const { id } = req.params;
            const { stock_change, reason } = req.body;
            
            if (stock_change === undefined) {
                return res.status(400).json({
                    success: false,
                    message: 'Stock change value is required'
                });
            }
            
            const change = parseInt(stock_change);
            if (isNaN(change)) {
                return res.status(400).json({
                    success: false,
                    message: 'Stock change must be a valid number'
                });
            }
            
            // Check if product exists
            const existingProduct = await Product.findById(id);
            if (!existingProduct) {
                return res.status(404).json({
                    success: false,
                    message: 'Product not found'
                });
            }
            
            const product = await Product.updateStock(id, change, reason || 'Manual adjustment');
            
            res.json({
                success: true,
                message: 'Product stock updated successfully',
                data: product
            });
        } catch (error) {
            console.error('Update stock error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error'
            });
        }
    },

    // Delete product
    async deleteProduct(req, res) {
        try {
            const { id } = req.params;
            
            // Check if product exists
            const existingProduct = await Product.findById(id);
            if (!existingProduct) {
                return res.status(404).json({
                    success: false,
                    message: 'Product not found'
                });
            }
            
            // Check if product has stock
            if (existingProduct.stock > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Cannot delete product with existing stock. Clear stock first.'
                });
            }
            
            await Product.delete(id);
            
            res.json({
                success: true,
                message: 'Product deleted successfully'
            });
        } catch (error) {
            console.error('Delete product error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error'
            });
        }
    },

    // Get product statistics
    async getStatistics(req, res) {
        try {
            const stats = await Product.getStatistics();
            const lowStock = await Product.findLowStock(10);
            
            res.json({
                success: true,
                data: {
                    total_products: stats.total_products || 0,
                    total_value: stats.total_value || 0,
                    average_price: stats.average_price || 0,
                    total_stock: stats.total_stock || 0,
                    low_stock_count: lowStock.length
                }
            });
        } catch (error) {
            console.error('Get statistics error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error'
            });
        }
    }
};

module.exports = productController;