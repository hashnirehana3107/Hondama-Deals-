const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Category name is required'],
            unique: true,
            trim: true,
        },
        slug: {
            type: String,
            unique: true,
        },
        description: {
            type: String,
            default: '',
        },
        icon: {
            type: String,
            default: '',
        },
        image: {
            type: String,
            default: '',
        },
        color: {
            type: String,
            default: '#1B3BFF',
        },
        badge: {
            type: String,
            default: 'SPECIAL OFFERS',
        },
        subtitle: {
            type: String,
            default: 'Amazing deals waiting for you',
        },
        enablePriceFilter: {
            type: Boolean,
            default: true,
        },
        enableRatingFilter: {
            type: Boolean,
            default: true,
        },
        enableLocationFilter: {
            type: Boolean,
            default: true,
        },
        customFilters: [
            {
                title: { type: String, required: true },
                options: { type: [String], default: [] },
            }
        ],
        subcategories: [
            {
                name: { type: String, required: true, trim: true },
                slug: String,
            },
        ],
        isActive: {
            type: Boolean,
            default: true,
        },
        sortOrder: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// ── Auto-generate slug ──
CategorySchema.pre('save', function (next) {
    if (this.isModified('name') || !this.slug) {
        this.slug = this.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    }

    // Generate slugs for subcategories
    if (this.subcategories && this.subcategories.length > 0) {
        this.subcategories.forEach((sub) => {
            if (!sub.slug && sub.name) {
                sub.slug = sub.name
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/(^-|-$)/g, '');
            }
        });
    }
    next();
});

// ── Virtual: deal count ──
CategorySchema.virtual('dealCount', {
    ref: 'Deal',
    localField: '_id',
    foreignField: 'category',
    count: true,
});

module.exports = mongoose.model('Category', CategorySchema);
