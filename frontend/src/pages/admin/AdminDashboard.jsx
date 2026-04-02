import React, { useState, useEffect } from 'react';
import {
    Users,
    Store,
    Package,
    ShoppingBag,
    TrendingUp,
    RefreshCw,
    ArrowUpRight,
    ArrowDownRight,
    Search,
    Filter,
    Download,
    Eye,
    CheckCircle,
    XCircle,
    Clock,
    MoreVertical,
    Bell,
    AlertCircle,
    MessageSquare
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import './AdminDashboard.css';


const AdminDashboard = () => {
    const navigate = useNavigate();
    const [selectedItem, setSelectedItem] = useState(null);
    const [modalType, setModalType] = useState(null); // 'order', 'client', 'ticket', 'return'
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isExporting, setIsExporting] = useState(false);

    // Local state for approval simulation
    const [localClients, setLocalClients] = useState([
        { name: 'Amal', store: 'Amal Store', date: 'May 10', status: 'Pending', email: 'amal@store.com', phone: '+94 77 121 2121', city: 'Colombo' },
        { name: 'Bimal', store: 'Bimal Gadgets', date: 'May 12', status: 'Approved', email: 'bimal@gadgets.lk', phone: '+94 71 333 4444', city: 'Kandy' },
        { name: 'Nuwan', store: 'Nuwan Tech', date: 'May 15', status: 'Pending', email: 'nuwan@tech.lk', phone: '+94 76 555 6666', city: 'Galle' }
    ]);

    const [homeRequests, setHomeRequests] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('hodama_store_requests_v1') || '[]');
        } catch (e) {
            return [];
        }
    });

    const [bannerRequests, setBannerRequests] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('hodama_banner_requests_v1') || '[]');
        } catch (e) {
            return [];
        }
    });

    // Auto-update home requests if storage changes (multi-tab support)
    useEffect(() => {
        const syncRequests = () => {
            try {
                const updatedHome = JSON.parse(localStorage.getItem('hodama_store_requests_v1') || '[]');
                setHomeRequests(Array.isArray(updatedHome) ? updatedHome : []);
                
                const updatedBanners = JSON.parse(localStorage.getItem('hodama_banner_requests_v1') || '[]');
                setBannerRequests(Array.isArray(updatedBanners) ? updatedBanners : []);
            } catch (e) {
                setHomeRequests([]);
                setBannerRequests([]);
            }
        };
        window.addEventListener('storage', syncRequests);
        return () => window.removeEventListener('storage', syncRequests);
    }, []);
    // Mock Data for statistics
    const [isLoading, setIsLoading] = useState(true);
    const [liveStats, setLiveStats] = useState(null);
    const [chartData, setChartData] = useState([]);
    const [chartTab, setChartTab] = useState('clicks'); // 'clicks', 'traffic', 'growth'
    const [rawReportData, setRawReportData] = useState(null);

    const fetchLiveStats = async () => {
        try {
            setIsLoading(true);
            const [statRes, reportRes] = await Promise.all([
                api.get('/stats'),
                api.get('/stats/reports')
            ]);

            if (statRes.data.success) {
                setLiveStats(statRes.data.data);
            }
            
            if (reportRes.data.success) {
                setRawReportData(reportRes.data.data);
                updateChartDisplay(reportRes.data.data, chartTab);
            }
            
            // Also fetch support tickets for the preview

            const ticketRes = await api.get('/support/admin/all');
            if (ticketRes.data.success) {
                setSupportTickets(ticketRes.data.data.slice(0, 3));
            }
        } catch (err) {
            console.error("Dashboard sync error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const [supportTickets, setSupportTickets] = useState([]);

    useEffect(() => {
        fetchLiveStats();
    }, []);

    const updateChartDisplay = (data, tab) => {
        if (!data) return;
        let growth = [];
        if (tab === 'clicks') growth = data.dealGrowth || [];
        else if (tab === 'traffic') growth = data.clickGrowth || [];
        else growth = data.userGrowth || [];

        const monthNames = ['','J','F','M','A','M','J','J','A','S','O','N','D'];
        
        // Multiplier to make it look decent (e.g., clicks might be 1000, deals might be 10)
        const multiplier = tab === 'traffic' ? 0.05 : 10; 
        
        const formatted = growth.length > 0 
            ? growth.map(g => ({ h: Math.min(95, (g.count * multiplier) + 20), label: monthNames[g._id] })) 
            : [40, 65, 45, 90, 60, 85, 55, 75, 40, 65, 80, 50].map((h, i) => ({ h, label: monthNames[i+1] || '?' }));
            
        setChartData(formatted);
    };

    const handleTabChange = (tab) => {
        setChartTab(tab);
        if (rawReportData) updateChartDisplay(rawReportData, tab);
    };

    const statsOverview = liveStats ? [
        { label: 'Total Users', value: liveStats.totalUsers.toLocaleString(), trend: '+12%', isUp: true, icon: <Users size={24} />, color: '#143ae6' },
        { label: 'Verified Partners', value: liveStats.businessPartners.toLocaleString(), trend: '+5%', isUp: true, icon: <Store size={24} />, color: '#7c3aed' },
        { label: 'Active Deals', value: liveStats.activeDeals.toLocaleString(), trend: '+8%', isUp: true, icon: <Package size={24} />, color: '#10b981' },
        { label: 'Marketplace Clicks', value: liveStats.marketplaceClicks.toLocaleString(), trend: '+15%', isUp: true, icon: <ShoppingBag size={24} />, color: '#f59e0b' },
        { label: 'Est. Revenue', value: `Rs ${liveStats.totalRevenue.toLocaleString()}`, trend: '+20%', isUp: true, icon: <TrendingUp size={24} />, color: '#071356' }
    ] : [];


    const dealOverview = liveStats ? [
        { label: 'Pending Approval', count: liveStats.pendingDeals, color: '#f59e0b', bg: '#fffbeb' },
        { label: 'Active Deals', count: liveStats.activeDeals, color: '#143ae6', bg: '#eff6ff' },
        { label: 'Total Volume', count: liveStats.totalDeals, color: '#7c3aed', bg: '#f5f3ff' },
        { label: 'Open Tickets', count: liveStats.openTickets, color: '#ef4444', bg: '#fef2f2' }
    ] : [];


    const recentPartners = [
        { id: 'PRT1023', partner: 'Amal', store: 'Amal Store', category: 'Electronics', location: 'Colombo', status: 'Pending', date: '10 Mar 2026' },
        { id: 'PRT1024', partner: 'Bimal', store: 'Bimal Gadgets', category: 'Tech', location: 'Kandy', status: 'Approved', date: '09 Mar 2026' },
    ];

    const recentClients = [
        { name: 'Amal', store: 'Amal Store', date: 'May 10', status: 'Pending' },
        { name: 'Bimal', store: 'Bimal Gadgets', date: 'May 12', status: 'Approved' },
        { name: 'Nuwan', store: 'Nuwan Tech', date: 'May 15', status: 'Pending' }
    ];

    const topDeals = [
        { name: 'Headphones Promo', partner: 'TechStore', clicks: 3400, savings: 'Rs 500k', rating: 4.8 },
        { name: 'Smart Watch Offer', partner: 'GadgetHub', clicks: 2100, savings: 'Rs 800k', rating: 4.5 },
        { name: 'Sunglasses Deal', partner: 'FashionHub', clicks: 1800, savings: 'Rs 200k', rating: 4.7 }
    ];

    const verificationRequests = [

        { id: 'VER102', partnerId: 'PRT1023', deal: 'iPhone 14 Promo', partner: 'Amal', status: 'Pending' },
        { id: 'VER103', partnerId: 'PRT1010', deal: 'Samsung S23 Deal', partner: 'Nuwan', status: 'Action Required' }
    ];

    const notifications = [
        { id: 1, title: 'New Partner Request', desc: 'Amal Store is waiting for verification', time: '10 mins ago', type: 'client' },
        { id: 3, title: 'System Healthy', desc: 'All services are running smoothly', time: '1 hour ago', type: 'system' }
    ];

    const handleViewItem = (item, type) => {
        setSelectedItem(item);
        setModalType(type);
        setIsModalOpen(true);
    };

    const handleApproveClient = (name) => {
        setLocalClients(prev => prev.map(s => s.name === name ? { ...s, status: 'Approved' } : s));
    };

    const handleApproveStoreHome = (email) => {
        // 1. Update the request status
        const updatedRequests = homeRequests.map(r => r.ownerEmail === email ? { ...r, status: 'Approved' } : r);
        setHomeRequests(updatedRequests);
        localStorage.setItem('hodama_store_requests_v1', JSON.stringify(updatedRequests));

        // 2. Update the store status in the global list
        const storedStores = JSON.parse(localStorage.getItem('hodama_all_stores_v1') || '[]');
        const updatedStores = storedStores.map(s => s.ownerEmail === email ? { ...s, status: 'Approved' } : s);
        localStorage.setItem('hodama_all_stores_v1', JSON.stringify(updatedStores));

        // 3. Update the client profile status
        const savedUser = JSON.parse(localStorage.getItem('hodama_client_user_v1') || '{}');
        if (savedUser.email === email) {
            savedUser.homeRequestStatus = 'Approved';
            localStorage.setItem('hodama_client_user_v1', JSON.stringify(savedUser));
        }

        alert('Store approved for Home Page listing!');
    };

    const handleExport = () => {
        setIsExporting(true);
        setTimeout(() => {
            setIsExporting(false);
            alert('Report exported successfully!');
        }, 1500);
    };

    return (
        <div className="adash-wrapper animate-fade-in">
            {/* 1. Page Header */}
            <div className="adash-header">
                <div className="adash-header-left">
                    <h1 className="adash-title">Admin Dashboard</h1>
                    <p className="adash-subtitle">Overview of your marketplace performance and system activities</p>
                </div>
                <div className="adash-header-right">
                    <div className="adash-actions">
                        <button className="adash-btn-filter"><Filter size={18} /> Last 30 Days</button>
                        <button
                            className={`adash-btn-primary ${isExporting || isLoading ? 'disabled' : ''}`}
                            onClick={fetchLiveStats}
                            disabled={isLoading}
                        >
                            <RefreshCw size={18} className={isLoading ? "spin" : ""} />
                            {isLoading ? 'Syncing...' : 'Sync Live Stats'}
                        </button>

                    </div>
                </div>
            </div>

            {/* 2. Summary Cards Section */}
            <div className="adash-stats-grid">
                {statsOverview.map((stat, idx) => (

                    <div key={idx} className="adash-stat-card">
                        <div className="adash-stat-icon" style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
                            {stat.icon}
                        </div>
                        <div className="adash-stat-info">
                            <span className="adash-stat-value">{stat.value}</span>
                            <span className="adash-stat-label">{stat.label}</span>
                        </div>
                        <div className={`adash-stat-trend ${stat.isUp ? 'up' : 'down'}`}>
                            {stat.isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                            {stat.trend}
                        </div>
                    </div>
                ))}
            </div>

            <div className="adash-main-content">
                <div className="adash-left-column">
                    {/* 3. Marketplace Analytics Chart */}
                    <div className="adash-card adash-sales-chart-card">
                        <div className="adash-card-header">
                            <h3 className="adash-card-title">Marketplace Performance Overview</h3>
                            <div className="adash-chart-tabs">
                                <button 
                                    className={chartTab === 'clicks' ? 'active' : ''} 
                                    onClick={() => handleTabChange('clicks')}
                                >
                                    Clicks
                                </button>
                                <button 
                                    className={chartTab === 'traffic' ? 'active' : ''} 
                                    onClick={() => handleTabChange('traffic')}
                                >
                                    Traffic
                                </button>
                                <button 
                                    className={chartTab === 'growth' ? 'active' : ''} 
                                    onClick={() => handleTabChange('growth')}
                                >
                                    Partner Growth
                                </button>
                            </div>

                        </div>
                        <div className="adash-chart-placeholder">
                            <div className="adash-bar-chart">
                                {chartData.map((data, i) => (
                                    <div key={i} className="adash-bar-wrapper">
                                        <div className="adash-bar" style={{ height: `${data.h}%`, backgroundColor: i === chartData.length - 1 ? '#143ae6' : '#e2e8f0' }}></div>
                                        <span className="adash-bar-label">{data.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>


                    {/* 4. Deal Overview Section */}
                    <div className="adash-orders-overview-grid">
                        {dealOverview.map((item, idx) => (
                            <div key={idx} className="adash-order-type-card" style={{ backgroundColor: item.bg }}>
                                <div className="adash-order-count" style={{ color: item.color }}>{item.count}</div>
                                <div className="adash-order-label">{item.label}</div>
                            </div>
                        ))}
                    </div>

                    {/* 5. Recent Partners Table */}
                    <div className="adash-card">
                        <div className="adash-card-header">
                            <h3 className="adash-card-title">Pending Partner Verifications</h3>
                            <button className="adash-card-link" onClick={() => navigate('/admin/partners')}>View All Partners</button>
                        </div>
                        <div className="adash-table-container">
                            <table className="adash-table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Business / Store</th>
                                        <th>Location</th>
                                        <th>Date Joined</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {liveStats?.pendingPartners?.map((partner, idx) => (
                                        <tr key={idx}>
                                            <td className="adash-td-dual">
                                                <span className="adash-td-primary">{partner.name}</span>
                                                <span className="adash-td-secondary">{partner.email}</span>
                                            </td>
                                            <td>
                                                <div className="adash-td-dual">
                                                    <span className="adash-td-primary">{partner.sellerProfile?.businessName || 'N/A'}</span>
                                                    <span className="adash-td-secondary">{partner.sellerProfile?.businessType || 'Partner'}</span>
                                                </div>
                                            </td>
                                            <td className="adash-val-bold">{partner.address?.city || 'Sri Lanka'}</td>
                                            <td>{new Date(partner.createdAt).toLocaleDateString()}</td>
                                            <td>
                                                <button className="adash-btn-icon" title="View & Verify" onClick={() => navigate(`/admin/clients?search=${partner.email}`)}>
                                                    <Store size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {(!liveStats?.pendingPartners || liveStats?.pendingPartners.length === 0) && (
                                        <tr><td colSpan="5" style={{ textAlign: 'center', padding: '30px', color: '#94a3b8' }}>No pending partner verifications</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* 7. Top Deals */}
                    <div className="adash-card">
                        <div className="adash-card-header">
                            <h3 className="adash-card-title">Top Performing Deals</h3>
                            <button className="adash-card-link" onClick={() => navigate('/admin/manage-deals')}>Marketplace Insights</button>
                        </div>
                        <div className="adash-table-container">
                            <table className="adash-table">
                                <thead>
                                    <tr>
                                        <th>Deal Title</th>
                                        <th>Partner</th>
                                        <th>Views/Clicks</th>
                                        <th>Price</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {liveStats?.topDeals?.map((deal, idx) => (
                                        <tr key={idx}>
                                            <td className="adash-td-primary">{deal.title}</td>
                                            <td className="adash-td-secondary">{deal.storeName}</td>
                                            <td className="adash-val-bold" style={{ color: 'var(--adlay-primary)' }}>{deal.views?.toLocaleString()} Clicks</td>
                                            <td className="adash-price">Rs {deal.offerPrice?.toLocaleString()}</td>
                                            <td><span className="adash-status-pill approved">Active</span></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="adash-right-column">
                    {/* 11. Home Page Store Listing Requests (Summary View) */}
                    <div className="adash-card">
                        <div className="adash-card-header">
                            <h3 className="adash-card-title">
                                <Store size={20} color="#143ae6" /> Home Requests
                                {homeRequests.filter(r => r?.status === 'Pending').length > 0 && 
                                    <span className="adash-badge-num">
                                        {homeRequests.filter(r => r?.status === 'Pending').length}
                                    </span>
                                }
                            </h3>
                            <button className="adash-card-link" onClick={() => navigate('/admin/home-requests')}>View All</button>
                        </div>
                        <div className="adash-client-list">
                            {(!homeRequests || homeRequests.filter(r => r?.status === 'Pending').length === 0) ? (
                                <p style={{ padding: '10px 0', textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>No new home page requests</p>
                            ) : (
                                homeRequests.filter(r => r?.status === 'Pending').slice(0, 3).map((req, idx) => (
                                    <div key={idx || req.ownerEmail} className="adash-client-item">
                                        <div className="adash-client-info">
                                            <h4>{req?.name || 'Untitled Store'}</h4>
                                            <p>{req?.category || 'General'}</p>
                                        </div>
                                        <div className="adash-client-actions">
                                            <button className="adash-btn-approve" onClick={() => handleApproveStoreHome(req.ownerEmail)}>Approve</button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Pending Banner Promotions (Summary View) */}
                    <div className="adash-card">
                        <div className="adash-card-header">
                            <h3 className="adash-card-title">
                                <ShoppingBag size={20} color="#143ae6" /> Banner Requests
                                {bannerRequests.filter(r => r?.status === 'Pending').length > 0 && 
                                    <span className="adash-badge-num">
                                        {bannerRequests.filter(r => r?.status === 'Pending').length}
                                    </span>
                                }
                            </h3>
                            <button className="adash-card-link" onClick={() => navigate('/admin/banners')}>View All</button>
                        </div>
                        <div className="adash-client-list">
                            {(!bannerRequests || bannerRequests.filter(r => r?.status === 'Pending').length === 0) ? (
                                <p style={{ padding: '10px 0', textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>No new banner requests</p>
                            ) : (
                                bannerRequests.filter(r => r?.status === 'Pending').slice(0, 3).map((req, idx) => (
                                    <div key={idx || req.id} className="adash-client-item">
                                        <div className="adash-client-info" style={{maxWidth: '200px', overflow: 'hidden'}}>
                                            <h4 style={{whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden'}}>{req?.type || 'Banner Promotion'}</h4>
                                            <p style={{whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden'}}>{req?.id || req?.date}</p>
                                        </div>
                                        <div className="adash-client-actions">
                                            <button className="adash-btn-primary" style={{padding: '6px 14px', fontSize: '12px'}} onClick={() => navigate('/admin/banners')}>Review</button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* 7. Design Request Indicators Section */}
                    {/* (Optional: Could place Design/Store Request overview here if needed) */}


                    {/* 6. Recent Partner Section */}
                    <div className="adash-card">
                        <div className="adash-card-header">
                            <h3 className="adash-card-title">New Partner Registrations</h3>
                        </div>
                        <div className="adash-client-list">
                            {liveStats?.latestRegistrations?.map((client, idx) => (
                                <div key={idx} className="adash-client-item">
                                    <div className="adash-client-info" onClick={() => handleViewItem(client, 'partner')} style={{ cursor: 'pointer' }}>
                                        <h4>{client.storeName}</h4>
                                        <p>{client.name} • {new Date(client.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <div className="adash-client-actions">
                                        {client.status === 'Pending' ? (
                                            <button className="adash-btn-approve" onClick={() => handleApproveClient(client.name)}>Approve</button>
                                        ) : (
                                            <span className="adash-status-approved">Verified</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 8. Recent Support Tickets */}
                    <div className="adash-card">
                        <div className="adash-card-header">
                            <h3 className="adash-card-title">Support Tickets</h3>
                        </div>
                        <div className="adash-ticket-list">
                            {supportTickets.map((ticket, idx) => (
                                <div key={idx} className="adash-ticket-item" onClick={() => handleViewItem(ticket, 'ticket')} style={{ cursor: 'pointer' }}>
                                    <div className="adash-ticket-main">
                                        <h4 className="adash-val-bold">{ticket.category || ticket.issue}</h4>
                                        <p>{ticket.fullName || ticket.user} • {ticket._id?.substring(0,8).toUpperCase() || ticket.id}</p>

                                    </div>
                                    <span className={`adash-status-pill ${ticket.status.toLowerCase()}`}>
                                        {ticket.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 9. Deal Verification Queue Section */}
                    <div className="adash-card">
                        <div className="adash-card-header">
                            <h3 className="adash-card-title">Deal Verification Queue</h3>
                            <button className="adash-card-link" onClick={() => navigate('/admin/manage-deals')}>View All</button>
                        </div>
                        <div className="adash-ticket-list">
                            {liveStats?.verificationQueue?.map((deal, idx) => (
                                <div key={idx} className="adash-ticket-item">
                                    <div className="adash-ticket-main" onClick={() => navigate(`/admin/manage-deals?search=${deal.title}`)} style={{ cursor: 'pointer' }}>
                                        <h4>{deal.title}</h4>
                                        <p>{deal.storeName} • Submitted {new Date(deal.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <span className="adash-status-pill pending">Pending</span>
                                </div>
                            ))}
                            {(!liveStats?.verificationQueue || liveStats?.verificationQueue.length === 0) && (
                                <div className="adash-notif-desc" style={{ textAlign: 'center', padding: '10px' }}>No deals awaiting verification</div>
                            )}
                        </div>
                    </div>



                </div>
            </div>

            {/* View Details Modal */}
            {isModalOpen && (
                <div className="adash-modal-overlay" onClick={() => setIsModalOpen(false)}>
                    <div className="adash-modal-content" onClick={e => e.stopPropagation()}>
                        <div className="adash-modal-header">
                            <h3>{modalType?.toUpperCase()} DETAILS</h3>
                            <button className="adash-modal-close" onClick={() => setIsModalOpen(false)}><XCircle size={24} /></button>
                        </div>
                        <div className="adash-modal-body">
                            {modalType === 'client' && (
                                <div className="adash-details-view">
                                    <div className="detail-row"><span>Store Name:</span> <strong>{selectedItem.store}</strong></div>
                                    <div className="detail-row"><span>Client:</span> <strong>{selectedItem.name}</strong></div>
                                    <div className="detail-row"><span>Email:</span> <strong>{selectedItem.email}</strong></div>
                                    <div className="detail-row"><span>Phone:</span> <strong>{selectedItem.phone}</strong></div>
                                    <div className="detail-row"><span>City:</span> <strong>{selectedItem.city}</strong></div>
                                    <div className="detail-row"><span>Joined:</span> <strong>{selectedItem.date}</strong></div>
                                </div>
                            )}
                            {modalType === 'ticket' && (
                                <div className="adash-details-view">
                                    <div className="detail-row"><span>Ticket ID:</span> <strong>{selectedItem.id}</strong></div>
                                    <div className="detail-row"><span>User:</span> <strong>{selectedItem.user}</strong></div>
                                    <div className="detail-row"><span>Issue:</span> <strong>{selectedItem.issue}</strong></div>
                                    <div className="detail-row"><span>Date:</span> <strong>{selectedItem.date}</strong></div>
                                    <div className="detail-row"><span>Status:</span> <span className={`adash-status-pill ${selectedItem.status.toLowerCase()}`}>{selectedItem.status}</span></div>
                                </div>
                            )}
                        </div>
                        <div className="adash-modal-footer">
                            <button className="adash-btn-secondary" onClick={() => setIsModalOpen(false)}>Close</button>
                            {modalType === 'client' && selectedItem.status === 'Pending' && <button className="adash-btn-primary" onClick={() => { handleApproveClient(selectedItem.name); setIsModalOpen(false); }}>Approve Store</button>}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
