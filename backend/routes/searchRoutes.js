const express = require('express');
const router = express.Router();
const { adminSearch } = require('../controllers/searchController');
const { protect } = require('../middleware/auth');

// Global search (Admin)
router.get('/admin', protect, adminSearch);

module.exports = router;
