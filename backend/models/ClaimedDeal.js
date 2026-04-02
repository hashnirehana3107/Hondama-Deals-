const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
    deal: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Deal',
        required: true,
    },
    title: String,
    thumbnail: String,
    quantity: {
        type: Number,
        required: true,
        min: [1, 'Quantity must be at least 1'],
    },
    price: {
        type: Number,
        required: true,
    },
});

const OrderSchema = new mongoose.Schema(
    {
        orderNumber: {
            type: String,
            unique: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'User is required'],
        },
        items: [OrderItemSchema],

        // ── Pricing ──
        subtotal: {
            type: Number,
            required: true,
            min: 0,
        },
        discount: {
            type: Number,
            default: 0,
        },
        deliveryFee: {
            type: Number,
            default: 0,
        },
        total: {
            type: Number,
            required: true,
            min: 0,
        },
        currency: {
            type: String,
            default: 'LKR',
        },

        // ── Shipping ──
        shippingAddress: {
            name: { type: String, required: true },
            phone: { type: String, required: true },
            street: String,
            city: String,
            province: String,
            postalCode: String,
            country: { type: String, default: 'Sri Lanka' },
        },

        // ── Payment ──
        paymentMethod: {
            type: String,
            enum: ['cod', 'card', 'bank_transfer', 'online'],
            default: 'cod',
        },
        paymentStatus: {
            type: String,
            enum: ['pending', 'paid', 'failed', 'refunded'],
            default: 'pending',
        },
        paidAt: Date,

        // ── Order Status ──
        status: {
            type: String,
            enum: [
                'pending',
                'confirmed',
                'processing',
                'shipped',
                'delivered',
                'cancelled',
                'returned',
            ],
            default: 'pending',
        },
        statusHistory: [
            {
                status: String,
                timestamp: { type: Date, default: Date.now },
                note: String,
            },
        ],

        // ── Tracking ──
        trackingNumber: String,
        deliveredAt: Date,
        cancelledAt: Date,
        cancelReason: String,

        // ── Notes ──
        notes: String,
    },
    {
        timestamps: true,
    }
);

// ── Auto-generate order number ──
OrderSchema.pre('save', async function (next) {
    if (!this.orderNumber) {
        const count = await mongoose.model('Order').countDocuments();
        const pad = String(count + 1).padStart(6, '0');
        this.orderNumber = `HD-${pad}`;
    }
    next();
});

// ── Indexes ──
OrderSchema.index({ user: 1, createdAt: -1 });
OrderSchema.index({ status: 1 });

module.exports = mongoose.model('Order', OrderSchema);
