const db = require('../config/database');

const Category = {
    // Get all categories
    async findAll() {
        return await db.query('SELECT * FROM categories ORDER BY name');
    },

    // Get category by ID
    async findById(id) {
        const results = await db.query('SELECT * FROM categories WHERE id = ?', [id]);
        return results[0];
    },

    // Create new category
    async create(categoryData) {
        const { name, description } = categoryData;
        const result = await db.query(
            'INSERT INTO categories (name, description) VALUES (?, ?)',
            [name, description]
        );
        return { id: result.insertId, name, description };
    },

    // Update category
    async update(id, categoryData) {
        const { name, description } = categoryData;
        await db.query(
            'UPDATE categories SET name = ?, description = ? WHERE id = ?',
            [name, description, id]
        );
        return { id, name, description };
    },

    // Delete category
    async delete(id) {
        await db.query('DELETE FROM categories WHERE id = ?', [id]);
        return true;
    },

    // Get category with product count
    async findWithProductCount() {
        const sql = `
            SELECT c.*, COUNT(p.id) as product_count
            FROM categories c
            LEFT JOIN products p ON c.id = p.category_id
            GROUP BY c.id
            ORDER BY c.name
        `;
        return await db.query(sql);
    }
};

module.exports = Category;