const Order = require('../models/ClaimedDeal');
const Deal = require('../models/Deal');

// ═══════════════════════════════════════════
// @desc    Create a new order
// @route   POST /api/orders
// @access  Private
// ═══════════════════════════════════════════
exports.createOrder = async (req, res, next) => {
    try {
        const { items, shippingAddress, paymentMethod, notes } = req.body;

        // Validate and calculate prices from deal data
        let subtotal = 0;
        const orderItems = [];

        for (const item of items) {
            const deal = await Deal.findById(item.deal);
            if (!deal) {
                return res.status(404).json({
                    success: false,
                    message: `Deal not found: ${item.deal}`,
                });
            }

            if (deal.stock !== -1 && deal.stock < item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `Insufficient stock for "${deal.title}"`,
                });
            }

            const itemTotal = deal.dealPrice * item.quantity;
            subtotal += itemTotal;

            orderItems.push({
                deal: deal._id,
                title: deal.title,
                thumbnail: deal.thumbnail,
                quantity: item.quantity,
                price: deal.dealPrice,
            });

            // Decrement stock
            if (deal.stock !== -1) {
                deal.stock -= item.quantity;
                deal.totalSold += item.quantity;
                await deal.save();
            }
        }

        const deliveryFee = subtotal >= 5000 ? 0 : 350; // Free delivery over LKR 5000
        const total = subtotal + deliveryFee;

        const order = await Order.create({
            user: req.user.id,
            items: orderItems,
            subtotal,
            deliveryFee,
            total,
            shippingAddress,
            paymentMethod: paymentMethod || 'cod',
            notes,
            statusHistory: [{ status: 'pending', note: 'Order placed' }],
        });

        res.status(201).json({
            success: true,
            order,
        });
    } catch (error) {
        next(error);
    }
};

// ═══════════════════════════════════════════
// @desc    Get logged-in user's orders
// @route   GET /api/orders/my-orders
// @access  Private
// ═══════════════════════════════════════════
exports.getMyOrders = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, status } = req.query;
        const filter = { user: req.user.id };
        if (status) filter.status = status;

        const skip = (Number(page) - 1) * Number(limit);

        const [orders, total] = await Promise.all([
            Order.find(filter)
                .populate('items.deal', 'title thumbnail slug')
                .sort('-createdAt')
                .skip(skip)
                .limit(Number(limit)),
            Order.countDocuments(filter),
        ]);

        res.status(200).json({
            success: true,
            count: orders.length,
            total,
            totalPages: Math.ceil(total / Number(limit)),
            currentPage: Number(page),
            orders,
        });
    } catch (error) {
        next(error);
    }
};

// ═══════════════════════════════════════════
// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
// ═══════════════════════════════════════════
exports.getOrder = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('items.deal', 'title thumbnail slug images')
            .populate('user', 'name email phone');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found',
            });
        }

        // Only owner or admin can view
        if (
            order.user._id.toString() !== req.user.id &&
            req.user.role !== 'admin'
        ) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view this order',
            });
        }

        res.status(200).json({
            success: true,
            order,
        });
    } catch (error) {
        next(error);
    }
};

// ═══════════════════════════════════════════
// @desc    Update order status (Admin)
// @route   PUT /api/orders/:id/status
// @access  Private (admin)
// ═══════════════════════════════════════════
exports.updateOrderStatus = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found',
            });
        }

        const { status, note } = req.body;

        order.status = status;
        order.statusHistory.push({
            status,
            note: note || `Status changed to ${status}`,
        });

        // Handle specific status actions
        if (status === 'delivered') {
            order.deliveredAt = Date.now();
            order.paymentStatus = 'paid';
            order.paidAt = Date.now();
        }

        if (status === 'cancelled') {
            order.cancelledAt = Date.now();
            order.cancelReason = note || 'Cancelled by admin';
        }

        await order.save();

        res.status(200).json({
            success: true,
            order,
        });
    } catch (error) {
        next(error);
    }
};

// ═══════════════════════════════════════════
// @desc    Cancel an order (by customer)
// @route   PUT /api/orders/:id/cancel
// @access  Private
// ═══════════════════════════════════════════
exports.cancelOrder = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found',
            });
        }

        if (order.user.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized',
            });
        }

        // Can only cancel pending or confirmed orders
        if (!['pending', 'confirmed'].includes(order.status)) {
            return res.status(400).json({
                success: false,
                message: 'This order cannot be cancelled at its current stage',
            });
        }

        order.status = 'cancelled';
        order.cancelledAt = Date.now();
        order.cancelReason = req.body.reason || 'Cancelled by customer';
        order.statusHistory.push({
            status: 'cancelled',
            note: order.cancelReason,
        });

        await order.save();

        res.status(200).json({
            success: true,
            message: 'Order cancelled successfully',
            order,
        });
    } catch (error) {
        next(error);
    }
};

// ═══════════════════════════════════════════
// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Private (admin)
// ═══════════════════════════════════════════
exports.getAllOrders = async (req, res, next) => {
    try {
        const { page = 1, limit = 20, status, sort = '-createdAt' } = req.query;
        const filter = {};
        if (status) filter.status = status;

        const skip = (Number(page) - 1) * Number(limit);

        const [orders, total] = await Promise.all([
            Order.find(filter)
                .populate('user', 'name email')
                .populate('items.deal', 'title')
                .sort(sort)
                .skip(skip)
                .limit(Number(limit)),
            Order.countDocuments(filter),
        ]);

        res.status(200).json({
            success: true,
            count: orders.length,
            total,
            totalPages: Math.ceil(total / Number(limit)),
            currentPage: Number(page),
            orders,
        });
    } catch (error) {
        next(error);
    }
};
