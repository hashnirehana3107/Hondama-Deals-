const express = require('express');
const router = express.Router();
const {
    createTicket,
    getUserTickets,
    getSingleTicket,
    addTicketReply,
    getAllTickets,
    updateTicketStatus,
    deleteTicket
} = require('../controllers/supportController');
const { protect, authorize } = require('../middleware/auth');

// ── 1. Admin Endpoints (Highest Priority to avoid matching conflicts) ──

// GET /api/support/admin/all
router.get('/admin/all', protect, authorize('admin'), getAllTickets);

// PUT /api/support/:id/status
router.put('/:id/status', protect, authorize('admin'), updateTicketStatus);

// DELETE /api/support/:id
router.delete('/:id', protect, authorize('admin'), deleteTicket);

// ── 2. User Endpoints ──

// POST /api/support/
router.post('/', protect, createTicket);

// GET /api/support/
router.get('/', protect, getUserTickets);

// GET /api/support/:id
router.get('/:id', protect, getSingleTicket);

// POST /api/support/:id/reply
router.post('/:id/reply', protect, addTicketReply);

// ── 3. Diagnostic Endpoint ──
router.get('/health-check', (req, res) => res.json({ status: 'ok', route: 'support' }));

module.exports = router;
