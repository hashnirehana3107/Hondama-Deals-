const Ticket = require('../models/Ticket');
const sendEmail = require('../utils/sendEmail');

// @desc    Create new support ticket

// @route   POST /api/support
// @access  Private
exports.createTicket = async (req, res, next) => {
    try {
        const { fullName, email, category, dealId, description, attachments } = req.body;

        if (!fullName || !email || !category || !description) {
            return res.status(400).json({ success: false, message: 'Please fill out all required fields.' });
        }

        const ticket = await Ticket.create({
            user: req.user.id,
            fullName,
            email,
            category,
            dealId,
            description,
            attachments: attachments || []
        });

        res.status(201).json({
            success: true,
            message: 'Support request submitted successfully.',
            data: ticket
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get user's tickets
// @route   GET /api/support
// @access  Private
exports.getUserTickets = async (req, res, next) => {
    try {
        const tickets = await Ticket.find({ user: req.user.id }).sort('-createdAt');
        
        res.status(200).json({
            success: true,
            data: tickets
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single ticket
// @route   GET /api/support/:id
// @access  Private
exports.getSingleTicket = async (req, res, next) => {
    try {
        const ticket = await Ticket.findById(req.params.id);

        if (!ticket) {
            return res.status(404).json({ success: false, message: 'Ticket not found.' });
        }

        // Make sure user owns ticket or is admin
        if (ticket.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, message: 'Not authorized to view this ticket.' });
        }

        res.status(200).json({
            success: true,
            data: ticket
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Add a reply to a ticket
// @route   POST /api/support/:id/reply
// @access  Private
exports.addTicketReply = async (req, res, next) => {
    try {
        const { message } = req.body;
        const ticket = await Ticket.findById(req.params.id);

        if (!ticket) {
            return res.status(404).json({ success: false, message: 'Ticket not found.' });
        }

        // Determine sender
        const isOwner = ticket.user.toString() === req.user.id;
        const isAdmin = req.user.role === 'admin';

        if (!isOwner && !isAdmin) {
            return res.status(401).json({ success: false, message: 'Not authorized.' });
        }

        const reply = {
            sender: isAdmin ? 'Admin' : 'User',
            message
        };

        ticket.replies.push(reply);

        // If user replies to a closed ticket, reopen it
        if (!isAdmin && ticket.status === 'Closed') {
            ticket.status = 'Open';
        } 
        // If admin replies, status can visually change to In Progress
        else if (isAdmin && ticket.status === 'Open') {
            ticket.status = 'In Progress';
        }

        await ticket.save();

        // ── Real Email Integration ──
        // If Admin replies, send an actual email notification to the user
        if (isAdmin) {
            try {
                const emailHtml = `
                    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 12px; padding: 25px; background-color: #ffffff;">
                        <div style="text-align: center; border-bottom: 2px solid #0056D2; padding-bottom: 15px; margin-bottom: 20px;">
                            <h1 style="color: #0056D2; margin: 0; font-size: 24px;">HODAMA <span style="color: #FFC107;">DEALS</span></h1>
                            <p style="color: #64748b; margin: 5px 0 0; font-size: 14px;">Customer Support Team</p>
                        </div>
                        <h2 style="color: #1e293b; font-size: 20px; border-bottom: 1px solid #f1f5f9; padding-bottom: 10px;">Support Ticket #${ticket._id.toString().substring(0, 8).toUpperCase()} - New Reply</h2>
                        <p style="color: #475569; line-height: 1.6;">Hello <strong>${ticket.fullName}</strong>,</p>
                        <p style="color: #475569; line-height: 1.6;">Our support team has just replied to your support request (${ticket.category}).</p>
                        
                        <div style="background-color: #f8fafc; border-left: 4px solid #0056D2; padding: 15px; margin: 20px 0; font-style: italic; color: #1e293b;">
                            "${message}"
                        </div>
                        
                        <p style="color: #475569; line-height: 1.6;">You can view the full history and reply back by logging into your dashboard or visiting our <a href="http://localhost:5173/support" style="color: #0056D2; text-decoration: none; font-weight: 600;">Support Center</a>.</p>
                        
                        <div style="margin-top: 30px; border-top: 1px solid #f1f5f9; padding-top: 20px; font-size: 12px; color: #94a3b8; text-align: center;">
                            <p>&copy; 2026 Hodama Deals Marketplace. All rights reserved.</p>
                            <p>This is an automated notification. Please do not reply directly to this email.</p>
                        </div>
                    </div>
                `;

                await sendEmail({
                    email: ticket.email,
                    subject: `Hodama Deals - Support Reply (#${ticket._id.toString().substring(0, 8).toUpperCase()})`,
                    html: emailHtml
                });
                console.log(`Support email successfully sent to ${ticket.email}`);
            } catch (err) {
                console.error("Failed to send support email notification:", err);
                // We don't fail the entire request just because email failed
            }
        }

        res.status(200).json({
            success: true,
            data: ticket
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Get all support tickets (Admin ONLY)
// @route   GET /api/support/admin/all
// @access  Private/Admin
exports.getAllTickets = async (req, res, next) => {
    try {
        const tickets = await Ticket.find().sort('-createdAt');
        console.log(`Backend: Found ${tickets.length} support tickets in database.`);
        
        res.status(200).json({
            success: true,
            data: tickets
        });
    } catch (error) {

        next(error);
    }
};

// @desc    Update ticket status (Admin ONLY)
// @route   PUT /api/support/:id/status
// @access  Private/Admin
exports.updateTicketStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const ticket = await Ticket.findById(req.params.id);

        if (!ticket) {
            return res.status(404).json({ success: false, message: 'Ticket not found.' });
        }

        ticket.status = status;
        await ticket.save();

        res.status(200).json({
            success: true,
            data: ticket
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete a ticket (Admin ONLY)
// @route   DELETE /api/support/:id
// @access  Private/Admin
exports.deleteTicket = async (req, res, next) => {
    try {
        const ticket = await Ticket.findById(req.params.id);

        if (!ticket) {
            return res.status(404).json({ success: false, message: 'Ticket not found.' });
        }

        await ticket.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Ticket deleted successfully.'
        });
    } catch (error) {
        next(error);
    }
};

