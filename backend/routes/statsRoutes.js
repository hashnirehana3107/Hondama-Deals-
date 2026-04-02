const express = require('express');
const router = express.Router();
const { getDashboardStats, getReportStats } = require('../controllers/statsController');
const { protect, authorize } = require('../middleware/auth');

// All routes require authentication and admin role
router.use(protect);
router.use(authorize('admin'));

// @desc    Dashboard Summary Stats
router.get('/', getDashboardStats);

// @desc    Detailed Analytics for Reports
router.get('/reports', getReportStats);

module.exports = router;
