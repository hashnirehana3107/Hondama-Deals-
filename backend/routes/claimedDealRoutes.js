const express = require('express');
const router = express.Router();
const {
    createOrder,
    getMyOrders,
    getOrder,
    updateOrderStatus,
    cancelOrder,
    getAllOrders,
} = require('../controllers/claimedDealController');
const { protect, authorize } = require('../middleware/auth');
const { createOrderRules, validate } = require('../middleware/validators');

// Private (customer)
router.post('/', protect, createOrderRules, validate, createOrder);
router.get('/my-orders', protect, getMyOrders);
router.get('/:id', protect, getOrder);
router.put('/:id/cancel', protect, cancelOrder);

// Private (admin)
router.get('/', protect, authorize('admin'), getAllOrders);
router.put('/:id/status', protect, authorize('admin'), updateOrderStatus);

module.exports = router;
