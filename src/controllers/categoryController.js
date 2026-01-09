const Category = require('../models/Category');

const categoryController = {
    // Get all categories
    async getAllCategories(req, res) {
        try {
            const categories = await Category.findAll();
            res.json({
                success: true,
                count: categories.length,
                data: categories
            });
        } catch (error) {
            console.error('Get categories error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error'
            });
        }
    },

    // Get categories with product count
    async getCategoriesWithCount(req, res) {
        try {
            const categories = await Category.findWithProductCount();
            res.json({
                success: true,
                data: categories
            });
        } catch (error) {
            console.error('Get categories with count error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error'
            });
        }
    },

    // Get category by ID
    async getCategoryById(req, res) {
        try {
            const { id } = req.params;
            const category = await Category.findById(id);
            
            if (!category) {
                return res.status(404).json({
                    success: false,
                    message: 'Category not found'
                });
            }
            
            res.json({
                success: true,
                data: category
            });
        } catch (error) {
            console.error('Get category error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error'
            });
        }
    },

    // Create new category
    async createCategory(req, res) {
        try {
            const { name, description } = req.body;
            
            if (!name) {
                return res.status(400).json({
                    success: false,
                    message: 'Category name is required'
                });
            }
            
            const category = await Category.create({ name, description });
            
            res.status(201).json({
                success: true,
                message: 'Category created successfully',
                data: category
            });
        } catch (error) {
            console.error('Create category error:', error);
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({
                    success: false,
                    message: 'Category name already exists'
                });
            }
            res.status(500).json({
                success: false,
                message: 'Server error'
            });
        }
    },

    // Update category
    async updateCategory(req, res) {
        try {
            const { id } = req.params;
            const { name, description } = req.body;
            
            // Check if category exists
            const existingCategory = await Category.findById(id);
            if (!existingCategory) {
                return res.status(404).json({
                    success: false,
                    message: 'Category not found'
                });
            }
            
            const category = await Category.update(id, { name, description });
            
            res.json({
                success: true,
                message: 'Category updated successfully',
                data: category
            });
        } catch (error) {
            console.error('Update category error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error'
            });
        }
    },

    // Delete category
    async deleteCategory(req, res) {
        try {
            const { id } = req.params;
            
            // Check if category exists
            const existingCategory = await Category.findById(id);
            if (!existingCategory) {
                return res.status(404).json({
                    success: false,
                    message: 'Category not found'
                });
            }
            
            await Category.delete(id);
            
            res.json({
                success: true,
                message: 'Category deleted successfully'
            });
        } catch (error) {
            console.error('Delete category error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error'
            });
        }
    }
};

module.exports = categoryController;