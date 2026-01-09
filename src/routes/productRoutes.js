const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// GET /api/product - Get all products
router.get('/', productController.getAllProducts);

// GET /api/product/search - Search products
router.get('/search', productController.searchProducts);

// GET /api/product/low-stock - Get low stock products
router.get('/low-stock', productController.getLowStockProducts);

// GET /api/product/price-range - Get products by price range
router.get('/price-range', productController.getProductsByPriceRange);

// GET /api/product/statistics - Get statistics
router.get('/statistics', productController.getStatistics);

// GET /api/product/category/:categoryId - Get products by category
router.get('/category/:categoryId', productController.getProductsByCategory);

// GET /api/product/:id - Get product by ID
router.get('/:id', productController.getProductById);

// GET /api/product/code/:code - Get product by code
router.get('/code/:code', productController.getProductByCode);

// POST /api/product - Create new product
router.post('/', productController.createProduct);

// PUT /api/product/:id - Update product
router.put('/:id', productController.updateProduct);

// PATCH /api/product/:id/stock - Update product stock
router.patch('/:id/stock', productController.updateProductStock);

// DELETE /api/product/:id - Delete product
router.delete('/:id', productController.deleteProduct);

module.exports = router;