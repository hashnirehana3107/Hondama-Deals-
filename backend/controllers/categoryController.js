const Category = require('../models/Category');

// ═══════════════════════════════════════════
// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
// ═══════════════════════════════════════════
exports.getCategories = async (req, res, next) => {
    try {
        // Remove isActive: true limitation so admin can see all categories
        const categories = await Category.find()
            .populate('dealCount')
            .sort('sortOrder');

        res.status(200).json({
            success: true,
            count: categories.length,
            categories,
        });
    } catch (error) {
        next(error);
    }
};

// ═══════════════════════════════════════════
// @desc    Get single category
// @route   GET /api/categories/:id
// @access  Public
// ═══════════════════════════════════════════
exports.getCategory = async (req, res, next) => {
    try {
        let category;

        if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
            category = await Category.findById(req.params.id).populate('dealCount');
        } else {
            category = await Category.findOne({ slug: req.params.id }).populate('dealCount');
        }

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found',
            });
        }

        res.status(200).json({
            success: true,
            category,
        });
    } catch (error) {
        next(error);
    }
};

exports.createCategory = async (req, res, next) => {
    try {
        console.log('=== CREATE CATEGORY ===');
        console.log('req.body.customFilters:', JSON.stringify(req.body.customFilters));
        
        const category = await Category.create(req.body);
        
        console.log('SAVED category.customFilters:', JSON.stringify(category.customFilters));

        res.status(201).json({
            success: true,
            category,
        });
    } catch (error) {
        next(error);
    }
};

// ═══════════════════════════════════════════
// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Private (admin)
// ═══════════════════════════════════════════
exports.updateCategory = async (req, res, next) => {
    try {
        console.log('=== UPDATE CATEGORY ===');
        console.log('req.body.customFilters:', JSON.stringify(req.body.customFilters));

        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found',
            });
        }

        // Explicitly set all fields from req.body
        const fieldsToUpdate = [
            'name', 'description', 'icon', 'image', 'color',
            'enablePriceFilter', 'enableRatingFilter', 'enableLocationFilter',
            'isActive', 'sortOrder', 'customFilters', 'subcategories'
        ];

        fieldsToUpdate.forEach(field => {
            if (req.body[field] !== undefined) {
                category[field] = req.body[field];
            }
        });

        await category.save();

        console.log('SAVED category.customFilters:', JSON.stringify(category.customFilters));

        res.status(200).json({
            success: true,
            category,
        });
    } catch (error) {
        next(error);
    }
};

// ═══════════════════════════════════════════
// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private (admin)
// ═══════════════════════════════════════════
exports.deleteCategory = async (req, res, next) => {
    try {
        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found',
            });
        }

        await category.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Category deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};
