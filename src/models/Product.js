const db = require('../config/database');

const Product = {
    // Get all products with category info
    async findAll() {
        const sql = `
            SELECT p.*, c.name as category_name 
            FROM product p
            LEFT JOIN categories c ON p.category_id = c.id
            ORDER BY p.name
        `;
        return await db.query(sql);
    },

    // Get product by ID
    async findById(id) {
        const sql = `
            SELECT p.*, c.name as category_name 
            FROM product p
            LEFT JOIN categories c ON p.category_id = c.id
            WHERE p.id = ?
        `;
        const results = await db.query(sql, [id]);
        return results[0];
    },

    // Get product by product code
    async findByCode(product_code) {
        const sql = `
            SELECT p.*, c.name as category_name 
            FROM product p
            LEFT JOIN categories c ON p.category_id = c.id
            WHERE p.product_code = ?
        `;
        const results = await db.query(sql, [product_code]);
        return results[0];
    },

    // Search products
    async search(query) {
        const searchTerm = `%${query}%`;
        const sql = `
            SELECT p.*, c.name as category_name 
            FROM product p
            LEFT JOIN categories c ON p.category_id = c.id
            WHERE p.name LIKE ? OR p.product_code LIKE ? OR p.description LIKE ?
            ORDER BY p.name
        `;
        return await db.query(sql, [searchTerm, searchTerm, searchTerm]);
    },

    // Filter by category
    async findByCategory(category_id) {
        const sql = `
            SELECT p.*, c.name as category_name 
            FROM product p
            LEFT JOIN categories c ON p.category_id = c.id
            WHERE p.category_id = ?
            ORDER BY p.name
        `;
        return await db.query(sql, [category_id]);
    },

    // Create new product
    async create(productData) {
        const {
            product_code,
            name,
            category_id,
            price,
            stock,
            description,
            specifications
        } = productData;

        const result = await db.query(
            `INSERT INTO product 
            (product_code, name, category_id, price, stock, description, specifications) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [product_code, name, category_id, price, stock, description, 
             JSON.stringify(specifications)]
        );

        return { id: result.insertId, ...productData };
    },

    // Update product
    async update(id, productData) {
        const {
            product_code,
            name,
            category_id,
            price,
            stock,
            description,
            specifications
        } = productData;

        await db.query(
            `UPDATE product SET 
            product_code = ?, name = ?, category_id = ?, price = ?, stock = ?, 
            description = ?, specifications = ?
            WHERE id = ?`,
            [product_code, name, category_id, price, stock, description,
             JSON.stringify(specifications), id]
        );

        return { id, ...productData };
    },

    // Update stock
    async updateStock(id, stockChange) {
        await db.query(
            'UPDATE products SET stock = stock + ? WHERE id = ?',
            [stockChange, id]
        );
        const product = await this.findById(id);
        return product;
    },

    // Delete product
    async delete(id) {
        await db.query('DELETE FROM product WHERE id = ?', [id]);
        return true;
    },

    // Get low stock products
    async findLowStock(threshold = 10) {
        const sql = `
            SELECT p.*, c.name as category_name 
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            WHERE p.stock <= ?
            ORDER BY p.stock
        `;
        return await db.query(sql, [threshold]);
    },

    // Get products by price range
    async findByPriceRange(minPrice, maxPrice) {
        const sql = `
            SELECT p.*, c.name as category_name 
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            WHERE p.price BETWEEN ? AND ?
            ORDER BY p.price
        `;
        return await db.query(sql, [minPrice, maxPrice]);
    },

    // Get statistics
    async getStatistics() {
        const sql = `
            SELECT 
                COUNT(*) as total_products,
                SUM(stock) as total_stock,
                SUM(price * stock) as total_value,
                AVG(price) as average_price,
                MIN(price) as min_price,
                MAX(price) as max_price
            FROM products
        `;
        return await db.query(sql);
    }
};

module.exports = Product;