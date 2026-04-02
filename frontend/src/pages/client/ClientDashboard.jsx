import React, { useState, useEffect, useMemo } from 'react';
import {
    LayoutDashboard,
    Package,
    Tag,
    Plus,
    User,
    LogOut,
    Bell,
    Search,
    Menu,
    X,
    Home,
    Eye,
    TrendingUp,
    BarChart,
    Clock,
    TrendingUp as ChartIcon,
    BarChart3,
    AlertCircle,
    ArrowRight,
    CheckCircle2,
    HelpCircle
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ClientSidebar from '../../components/layout/ClientSidebar';
import ClientTopbar from '../../components/layout/ClientTopbar';
import SupportHub from '../../components/common/SupportHub';
import './ClientDashboard.css';

const ClientDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    // Data States
    const [deals, setDeals] = useState([]);
    const [banners, setBanners] = useState([]);
    const [analytics, setAnalytics] = useState({});
    const [isProfileComplete, setIsProfileComplete] = useState(true);
    const [isSetupModalOpen, setIsSetupModalOpen] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const currentView = searchParams.get('tab') || 'overview';
    
    // Form State for Setup Modal
    const [formData, setFormData] = useState({
        storeName: '',
        storeCategory: 'Electronics',
        storeRating: '4.8',
        storeLink: '',
        storeDescription: '',
        storeLogo: null
    });

    useEffect(() => {
        const fetchDashboardData = () => {
            const userName = user?.name || 'Client';
            
            // 1. Fetch Deals
            const storedDeals = JSON.parse(localStorage.getItem('hodama_all_deals_v1') || '[]');
            setDeals(storedDeals);

            // 2. Fetch Banners
            const storedBanners = JSON.parse(localStorage.getItem('hodama_banner_requests_v1') || '[]');
            setBanners(storedBanners);

            // 3. Fetch Analytics
            const storedAnalytics = JSON.parse(localStorage.getItem('hodama_analytics_v1') || '{}');
            setAnalytics(storedAnalytics);

            // 4. Check Profile Completion & Sync Status with Admin Queue
            const clientProfile = JSON.parse(localStorage.getItem('hodama_client_user_v1') || '{}');
            
            // REAL-TIME SYNC: Check if request still exists in Admin queue
            const adminRequests = JSON.parse(localStorage.getItem('hodama_store_requests_v1') || '[]');
            const myRequest = adminRequests.find(r => r.ownerEmail === clientProfile.email);
            
            if (!myRequest) {
                // If it was deleted by admin or never sent, reset to None
                if (clientProfile.homeRequestStatus !== 'None') {
                    clientProfile.isHomeRequested = false;
                    clientProfile.homeRequestStatus = 'None';
                    localStorage.setItem('hodama_client_user_v1', JSON.stringify(clientProfile));
                }
            } else {
                // If status changed by admin, update client local status
                if (myRequest.status !== clientProfile.homeRequestStatus) {
                    clientProfile.homeRequestStatus = myRequest.status;
                    localStorage.setItem('hodama_client_user_v1', JSON.stringify(clientProfile));
                }
            }

            const hasRequested = clientProfile.homeRequestStatus && clientProfile.homeRequestStatus !== 'None';
            setIsProfileComplete(hasRequested || (clientProfile.storeName && clientProfile.storeLogo));
            
            if (clientProfile.storeName) {
                setFormData(prev => ({
                    ...prev,
                    storeName: clientProfile.storeName,
                    storeCategory: clientProfile.storeCategory || 'Electronics',
                    storeRating: clientProfile.storeRating || '4.8',
                    storeLink: clientProfile.storeLink || '',
                    storeDescription: clientProfile.storeDescription || '',
                    storeLogo: clientProfile.storeLogo || null
                }));
            }

            // 5. Success Notification Check
            if (clientProfile.homeRequestStatus === 'Approved' && !clientProfile.hasSeenApprovalNotif) {
                alert("🎉 Congratulations! Your store has been approved and is now live on the Home Page!");
                clientProfile.hasSeenApprovalNotif = true;
                localStorage.setItem('hodama_client_user_v1', JSON.stringify(clientProfile));
            }
        };

        fetchDashboardData();
        window.addEventListener('storage', fetchDashboardData);
        return () => window.removeEventListener('storage', fetchDashboardData);
    }, [user?.name]);

    // Derived Stats
    const stats = useMemo(() => {
        const liveCount = deals.filter(d => d.status === 'Active' || d.status === 'Live').length;
        const totalViews = deals.reduce((sum, d) => sum + (parseInt(d.views) || 0), 0);
        const promoCount = banners.filter(b => b.status === 'Approved').length;

        return [
            { label: 'Live Deals', value: liveCount.toString(), trend: '+2', icon: <Tag size={20} />, color: '#71717a' },
            { label: 'Deal Views', value: totalViews.toLocaleString(), trend: '+5%', icon: <Eye size={20} />, color: '#ed8936' },
            { label: 'Total Deals', value: deals.length.toString(), trend: '+1', icon: <BarChart3 size={20} />, color: '#48bb78' },
            { label: 'Active Promotions', value: promoCount.toString().padStart(2, '0'), trend: 'Hot', icon: <Clock size={20} />, color: '#9f7aea' },
        ];
    }, [deals, banners]);

    // Chart Data (Last 10 days)
    const chartData = useMemo(() => {
        const data = [];
        for (let i = 9; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            const label = date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
            data.push({
                label: label,
                value: analytics[dateStr]?.clicks || 0
            });
        }
        return data;
    }, [analytics]);

    const todayStr = new Date().toISOString().split('T')[0];
    const todayClicks = analytics[todayStr]?.clicks || 0;

    const latestDeals = deals.slice(0, 5);
    const topPerforming = [...deals].sort((a, b) => (parseInt(b.views) || 0) - (parseInt(a.views) || 0)).slice(0, 3);

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleLogoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Check file size (2MB limit)
            if (file.size > 2 * 1024 * 1024) {
                alert("Image is too large! Please choose an image smaller than 2MB.");
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, storeLogo: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSetupSubmit = (e) => {
        e.preventDefault();
        
        const clientProfile = JSON.parse(localStorage.getItem('hodama_client_user_v1') || '{}');
        const updatedProfile = {
            ...clientProfile,
            ...formData,
            isHomeRequested: true,
            homeRequestStatus: 'Pending'
        };

        // 1. Save User Profile
        localStorage.setItem('hodama_client_user_v1', JSON.stringify(updatedProfile));

        // 2. Add to Global Stores List
        const storedStores = JSON.parse(localStorage.getItem('hodama_all_stores_v1') || '[]');
        const storeData = {
            name: formData.storeName,
            img: formData.storeLogo || "/assets/images/placeholder_store.png",
            url: formData.storeLink,
            rating: formData.storeRating,
            category: formData.storeCategory,
            ownerEmail: updatedProfile.email,
            description: formData.storeDescription,
            isClaimed: true,
            status: 'Pending'
        };
        const updatedStores = [...storedStores.filter(s => s.ownerEmail !== updatedProfile.email), storeData];
        localStorage.setItem('hodama_all_stores_v1', JSON.stringify(updatedStores));

        // 3. Add to Requests List
        const requests = JSON.parse(localStorage.getItem('hodama_store_requests_v1') || '[]');
        const reqData = {
            ...storeData,
            requestDate: new Date().toLocaleDateString(),
            status: 'Pending'
        };
        const updatedRequests = [...requests.filter(r => r.ownerEmail !== updatedProfile.email), reqData];
        localStorage.setItem('hodama_store_requests_v1', JSON.stringify(updatedRequests));

        setIsSetupModalOpen(false);
        setIsProfileComplete(true);
        alert("Store setup submitted! Your request is now pending admin approval for the Home Page.");
    };

    return (
        <div className="client-dashboard-wrapper">
            <ClientSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

            <main className="dashboard-main-content">
                <ClientTopbar toggleSidebar={toggleSidebar} />

                {/* Profile Setup Notification */}
                {!isProfileComplete && (
                    <div className="onboarding-banner fade-in">
                        <div className="onboarding-icon">
                            <AlertCircle size={24} />
                        </div>
                        <div className="onboarding-text">
                            <h3>Complete Your Store Profile!</h3>
                            <p>Your store and deals won't be fully visible to customers until you add your store name, logo, and other details. Let's get you set up!</p>
                        </div>
                        <button className="onboarding-action-btn" onClick={() => setIsSetupModalOpen(true)}>
                            <span>Complete Setup</span>
                            <ArrowRight size={18} />
                        </button>
                    </div>
                )}

                {/* Approval Notification Banner */}
                {JSON.parse(localStorage.getItem('hodama_client_user_v1') || '{}').homeRequestStatus === 'Approved' && (
                    <div className="approval-banner fade-in">
                        <div className="approval-icon">
                            <CheckCircle2 size={24} />
                        </div>
                        <div className="approval-text">
                            <h3>Store Approved!</h3>
                            <p>Your store is now featured on the "Top Stores For You" section on the Home Page.</p>
                        </div>
                        <button className="view-home-btn" onClick={() => window.open('/', '_blank')}>
                            <span>View Home Page</span>
                            <Home size={18} />
                        </button>
                    </div>
                )}
                
                {currentView === 'overview' ? (
                <div className="dashboard-view-container">

                    {/* Welcome Banner */}
                    <div className="welcome-banner fade-in">
                        <div className="welcome-info">
                            <h1>👋 Welcome back, {user?.name?.split(' ')[0] || 'John Deo'}</h1>
                            <p>Manage your deals and connect with potential customers.</p>
                        </div>
                        <div className="today-summary">
                            <span className="label">Today's Deal Clicks</span>
                            <span className="value">{todayClicks}</span>
                        </div>
                    </div>

                    {/* Stats Row */}
                    <div className="stats-container fade-in">
                        {stats.map((stat, idx) => (
                            <div key={idx} className="stat-card">
                                <div className="stat-card-inner">
                                    <div className="stat-info">
                                        <p className="stat-label">{stat.label}</p>
                                        <h3 className="stat-value">{stat.value}</h3>
                                        <div className="stat-meta">
                                            <span className={`trend-indicator ${stat.trend === 'Hot' ? 'hot' : 'positive'}`}>
                                                {stat.trend}
                                            </span>
                                            <span className="meta-text">performance</span>
                                        </div>
                                    </div>
                                    <div className="stat-icon-box" style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
                                        {stat.icon}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="dashboard-grid-main fade-in">
                        {/* Analytics Section */}
                        <div className="analytics-section">
                            <div className="section-header">
                                <h3>Deal Views Over Time</h3>
                                <div className="chart-actions">
                                    <button className="chart-tab active">Daily</button>
                                    <button className="chart-tab">Weekly</button>
                                </div>
                            </div>
                            <div className="chart-box">
                                <div className="chart-viz">
                                    {chartData.map((data, i) => (
                                        <div key={i} className="chart-bar-wrapper">
                                            <div className="chart-bar" style={{ height: `${data.value}%` }}></div>
                                            <span className="bar-label">{data.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="quick-actions-section">
                            <h3>Quick Actions</h3>
                            <div className="actions-grid">
                                <div className="action-tile" onClick={() => navigate('/client/add-deal')}>
                                    <div className="tile-icon p-bg"><Plus size={20} /></div>
                                    <span>Add Deal</span>
                                </div>
                                <div className="action-tile" onClick={() => navigate('/client/manage-deals')}>
                                    <div className="tile-icon y-bg"><Tag size={20} /></div>
                                    <span>Manage Deals</span>
                                </div>
                                <div className="action-tile" onClick={() => navigate('/client/profile')}>
                                    <div className="tile-icon g-bg"><User size={20} /></div>
                                    <span>Profile</span>
                                </div>
                                <div className="action-tile" onClick={() => setSearchParams({ tab: 'support' })}>
                                    <div className="tile-icon pur-bg"><HelpCircle size={20} /></div>
                                    <span>Support Hub</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="dashboard-grid-sub fade-in">
                        {/* Latest Live Deals */}
                        <div className="recent-deals-card">
                            <div className="section-header">
                                <h3>Latest Live Deals</h3>
                                <button className="text-btn" onClick={() => navigate('/client/manage-deals')}>View All</button>
                            </div>
                             <table className="client-table">
                                <thead>
                                    <tr>
                                        <th>DEAL REF</th>
                                        <th>DEAL TITLE</th>
                                        <th>CATEGORY</th>
                                        <th>PRICE</th>
                                        <th>STATUS</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {latestDeals.length === 0 && (
                                        <tr><td colSpan="5" style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>No deals found</td></tr>
                                    )}
                                    {latestDeals.map(deal => (
                                        <tr key={deal.id}>
                                            <td>#{deal.id.toString().slice(-6)}</td>
                                            <td>
                                                <div className="deal-cell" style={{ cursor: 'pointer' }} onClick={() => window.open(`/deal/${deal.id}`, '_blank')}>
                                                    <img src={deal.img || deal.image} alt={deal.name} className="deal-thumb" />
                                                    <span style={{ fontWeight: 800, color: '#2563eb' }}>{deal.name}</span>
                                                </div>
                                            </td>
                                            <td>{deal.category}</td>
                                            <td>{deal.price}</td>
                                            <td><span className={`badge ${deal.status?.toLowerCase() || 'active'}`}>{deal.status || 'Active'}</span></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Top Performing Deals */}
                        <div className="top-selling-card">
                            <div className="section-header">
                                <h3>Highest Performing Deals</h3>
                            </div>
                             <div className="top-products-list">
                                {topPerforming.length === 0 && (
                                    <div style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>No data available</div>
                                )}
                                {topPerforming.map(deal => (
                                    <div key={deal.id} className="top-product-item">
                                        <img src={deal.img || deal.image} alt={deal.name} />
                                        <div className="tp-info">
                                            <span className="tp-name">{deal.name}</span>
                                            <span className="tp-sold">Grab Clicks: {deal.views || 0}</span>
                                        </div>
                                        <div className="tp-growth-badge">
                                            <TrendingUp size={14} /> +{(Math.random() * 20).toFixed(1)}%
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                ) : (
                    <div className="dashboard-view-container">
                        <div className="view-header-back" style={{ marginBottom: '20px' }}>
                            <button className="back-link-btn" onClick={() => setSearchParams({})} style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '8px', color: '#2563eb', fontWeight: '800', cursor: 'pointer' }}>
                                <ArrowRight size={18} style={{ transform: 'rotate(180deg)' }} /> Back to Overview
                            </button>
                        </div>
                        <SupportHub type="client" />
                    </div>
                )}
            </main>

            {/* Setup Modal */}
            {isSetupModalOpen && (
                <div className="setup-modal-overlay" onClick={() => setIsSetupModalOpen(false)}>
                    <div className="setup-modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <div className="header-icon-box"><Plus size={24} /></div>
                            <div className="header-text">
                                <h2>Setup Your Store</h2>
                                <p>Fill in these details to request listing on the Home Page.</p>
                            </div>
                            <button className="close-btn" onClick={() => setIsSetupModalOpen(false)}><X size={20} /></button>
                        </div>

                        <form onSubmit={handleSetupSubmit} className="setup-form">
                            <div className="form-row-img">
                                <div className="img-upload-wrap" onClick={() => document.getElementById('setupLogo').click()}>
                                    {formData.storeLogo ? (
                                        <img src={formData.storeLogo} alt="Logo" className="preview-logo" />
                                    ) : (
                                        <div className="placeholder-logo">
                                            <TrendingUp size={24} />
                                            <span>Add Logo</span>
                                        </div>
                                    )}
                                </div>
                                <input type="file" id="setupLogo" hidden accept="image/*" onChange={handleLogoUpload} />
                                <div className="img-text">
                                    <h4>Store Logo</h4>
                                    <p>Circular logo recommended for best look on Home Page.</p>
                                </div>
                            </div>

                            <div className="form-grid-setup">
                                <div className="form-group-setup">
                                    <label>Store Name</label>
                                    <input type="text" name="storeName" value={formData.storeName} onChange={handleFormChange} placeholder="e.g. Arpico Supercentre" required />
                                </div>
                                <div className="form-group-setup">
                                    <label>Store Category</label>
                                    <select name="storeCategory" value={formData.storeCategory} onChange={handleFormChange}>
                                        <option value="Electronics">Electronics</option>
                                        <option value="Fashion">Fashion</option>
                                        <option value="Health & Beauty">Health & Beauty</option>
                                        <option value="Restaurant">Restaurant</option>
                                        <option value="Hotel">Hotel</option>
                                        <option value="Groceries">Groceries</option>
                                        <option value="Salon">Salon</option>
                                        <option value="Spa">Spa</option>
                                    </select>
                                </div>
                                <div className="form-group-setup">
                                    <label>Store Website Link</label>
                                    <input type="text" name="storeLink" value={formData.storeLink} onChange={handleFormChange} placeholder="https://..." />
                                </div>
                                <div className="form-group-setup">
                                    <label>Store Rating (Initial)</label>
                                    <input type="text" name="storeRating" value={formData.storeRating} onChange={handleFormChange} placeholder="4.8" />
                                </div>
                                <div className="form-group-setup span-full">
                                    <label>Brief Description</label>
                                    <textarea name="storeDescription" value={formData.storeDescription} onChange={handleFormChange} placeholder="Tell customers about your store..."></textarea>
                                </div>
                            </div>

                            <div className="modal-footer-setup">
                                <button type="button" className="btn-secondary-setup" onClick={() => setIsSetupModalOpen(false)}>Cancel</button>
                                <button type="submit" className="btn-primary-setup">Submit Request</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClientDashboard;

