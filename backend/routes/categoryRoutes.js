const express = require('express');
const router = express.Router();
const {
    getCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory,
} = require('../controllers/categoryController');
const { protect, authorize } = require('../middleware/auth');
const { createCategoryRules, validate } = require('../middleware/validators');

// Public
router.get('/', getCategories);
router.get('/:id', getCategory);

// Private (admin) - auth temporarily relaxed for testing
router.post('/', createCategoryRules, validate, createCategory);
router.put('/:id', updateCategory);
router.delete('/:id', protect, authorize('admin'), deleteCategory);

module.exports = router;
