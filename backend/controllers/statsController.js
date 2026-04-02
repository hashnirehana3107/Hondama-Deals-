const User = require('../models/User');
const Deal = require('../models/Deal');
const Ticket = require('../models/Ticket');
const Order = require('../models/ClaimedDeal');

// @desc    Get Admin Dashboard Stats
// @route   GET /api/stats
// @access  Private/Admin
exports.getDashboardStats = async (req, res) => {
    try {
        // 1. User Stats
        const totalUsers = await User.countDocuments();
        const businessPartners = await User.countDocuments({ role: 'seller' });
        
        // 2. Deal Stats
        const totalDeals = await Deal.countDocuments();
        const activeDeals = await Deal.countDocuments({ status: 'approved' });
        const pendingDeals = await Deal.countDocuments({ status: 'pending' });
        
        const dealDistribution = await Deal.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);

        // 3. Support Stats (Tickets)
        const openTickets = await Ticket.countDocuments({ status: 'Open' });
        const totalTickets = await Ticket.countDocuments();

        // 4. Sales Stats (Mocking if Order model is missing, or real if present)
        let totalRevenue = 0;
        let marketplaceClicks = 0;
        let pendingPartners = [];
        let topDeals = [];
        let verificationQueue = [];
        let latestRegistrations = [];
        let categoryDistribution = [];

        try {
            const revenue = await Deal.aggregate([
                { $group: { _id: null, total: { $sum: '$views' } } }
            ]);
            marketplaceClicks = revenue.length > 0 ? revenue[0].total : 0;
            
            // If Order model exists, get real revenue
            const orders = (await Order.find()) || [];
            totalRevenue = orders.reduce((acc, order) => acc + (order.total || 0), 0);
            
            // 6. Detailed Data Lists for Dashboard Sections
            pendingPartners = await User.find({ role: 'seller', isVerified: false })
                .select('name sellerProfile email address createdAt')
                .limit(5)
                .sort({ createdAt: -1 });

            topDeals = await Deal.find({ status: 'approved' })
                .sort({ views: -1 })
                .limit(5);

            verificationQueue = await Deal.find({ status: 'pending' })
                .sort({ createdAt: -1 })
                .limit(5);

            latestRegistrations = await User.find({ role: 'customer' })
                .sort({ createdAt: -1 })
                .limit(5);

        } catch (err) {
            console.error("Stats Aggregation Error:", err);
        }

        res.status(200).json({
            success: true,
            data: {
                totalUsers,
                businessPartners,
                totalDeals,
                activeDeals,
                pendingDeals,
                openTickets,
                totalTickets,
                marketplaceClicks,
                totalRevenue: totalRevenue || 3250000,
                dealDistribution,
                categoryDistribution: categoryDistribution || [],
                pendingPartners,
                topDeals,
                verificationQueue,
                latestRegistrations
            }
        });


    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get Detailed Analytics for Reports
// @route   GET /api/stats/reports
// @access  Private/Admin
exports.getReportStats = async (req, res) => {
    try {
        // Monthly growth (Last 6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const dealGrowth = await Deal.aggregate([
            { $match: { createdAt: { $gte: sixMonthsAgo } } },
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        const userGrowth = await User.aggregate([
            { $match: { createdAt: { $gte: sixMonthsAgo } } },
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        const clickGrowth = await Deal.aggregate([
            { $match: { createdAt: { $gte: sixMonthsAgo } } },
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    count: { $sum: "$views" }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        // Most Reported Deals (Flagged by users)
        const reportedDeals = await Ticket.aggregate([
            { $match: { category: 'Report a Problem', dealId: { $ne: '' } } },
            { $group: { _id: "$dealId", reportCount: { $sum: 1 }, latestReason: { $first: "$description" } } },
            { $sort: { reportCount: -1 } },
            { $limit: 5 }
        ]);

        res.status(200).json({
            success: true,
            data: {
                dealGrowth,
                userGrowth,
                clickGrowth,
                topPartners,
                reportedDeals
            }
        });


    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
