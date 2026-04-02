const User = require('../models/User');
const Deal = require('../models/Deal');
const Category = require('../models/Category');

// @desc    Global Search (Users, Deals, Categories)
// @route   GET /api/search/admin
// @access  Private/Admin
exports.adminSearch = async (req, res, next) => {
    try {
        const { query } = req.query;

        if (!query || query.length < 2) {
            return res.status(200).json({
                success: true,
                results: []
            });
        }

        const regex = new RegExp(query, 'i');

        // Parallel search across models
        const [users, deals, categories] = await Promise.all([
            User.find({
                $or: [
                    { name: regex },
                    { email: regex },
                    { phone: regex }
                ]
            }).limit(5).select('name email role avatar'),

            Deal.find({
                $or: [
                    { title: regex },
                    { description: regex },
                    { tags: regex },
                    { storeName: regex }
                ]
            }).limit(5).select('title dealPrice images slug storeName status'),

            Category.find({
                $or: [
                    { name: regex },
                    { description: regex }
                ]
            }).limit(5).select('name slug image color')
        ]);

        // Format results
        const results = [
            ...users.map(u => ({ id: u._id, title: u.name, subtitle: u.email, type: 'user', icon: 'user', path: `/admin/users?id=${u._id}` })),
            ...deals.map(d => ({ id: d._id, title: d.title, subtitle: `${d.storeName || 'Deal'} • LKR ${d.dealPrice} (${d.status})`, type: 'deal', icon: 'package', image: d.images?.[0]?.url, path: `/admin/manage-deals?id=${d._id}` })),
            ...categories.map(c => ({ id: c._id, title: c.name, subtitle: 'Category', type: 'category', icon: 'layout-grid', image: c.image, path: `/admin/categories?id=${c._id}` }))
        ];

        res.status(200).json({
            success: true,
            count: results.length,
            results
        });
    } catch (error) {
        next(error);
    }
};
