import React, { useState, useEffect } from 'react';
import { useNavigate, Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
    LayoutDashboard,
    Users,
    Store,
    Package,
    ShoppingBag,
    RefreshCw,
    Headphones,
    BarChart3,
    Settings,
    LogOut,
    Menu,
    X,
    Bell,
    User,
    Search,
    ChevronDown,
    ChevronRight,
    Warehouse,
    ClipboardList,
    Truck,
    MapPin,
    Paintbrush,
    LayoutGrid,
    Home,
    MessageSquare,
    Clock,
    AlertCircle,
    CheckCircle
} from 'lucide-react';
import api from '../../utils/api';
import './AdminLayout.css';



const AdminLayout = () => {
    const { user, logout, loading } = useAuth();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const location = useLocation();


    useEffect(() => {
        if (!loading) {
            // Only admins should access this layout
            if (!user || user.role?.toLowerCase() !== 'admin') {
                navigate('/login');
            }
        }
    }, [user, loading, navigate]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const [expandedMenus, setExpandedMenus] = useState(['operations']); // Operations expanded by default

    const [notifs, setNotifs] = useState([]);
    const [totalNotifCount, setTotalNotifCount] = useState(0);
    const [pendingRequests, setPendingRequests] = useState(0);
    const [pendingDesigns, setPendingDesigns] = useState(0);
    const [openTickets, setOpenTickets] = useState(0);

    // Global Search State
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearchLoading, setIsSearchLoading] = useState(false);
    const [showSearchDropdown, setShowSearchDropdown] = useState(false);

    // Debounced Search Call
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (searchQuery.length > 2) {
                setIsSearchLoading(true);
                try {
                    const res = await api.get(`/search/admin?query=${searchQuery}`);
                    if (res.data.success) {
                        setSearchResults(res.data.results);
                        setShowSearchDropdown(true);
                    }
                } catch (e) {
                    console.error("Search Error:", e);
                } finally {
                    setIsSearchLoading(false);
                }
            } else {
                setSearchResults([]);
                setShowSearchDropdown(false);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [searchQuery]);


    const fetchLiveStats = async () => {
        try {
            // 1. Sync Home Requests Badge
            const requests = JSON.parse(localStorage.getItem('hodama_store_requests_v1') || '[]');
            const pHome = requests.filter(r => r.status === 'Pending').length;
            setPendingRequests(pHome);

            // 2. Sync Design Requests Badge
            const designs = JSON.parse(localStorage.getItem('hodama_banner_requests_v1') || '[]');
            const pDesign = designs.filter(d => d.type?.includes('Design Request') && d.isReadAdmin === false).length;
            setPendingDesigns(pDesign);

            // 3. Fetch Real Stats (Deals, Partners, Tickets)
            const [supportRes, statsRes] = await Promise.all([
                api.get('/support/admin/all'),
                api.get('/stats')
            ]);
            
            let pTickets = 0;
            let pDeals = 0;
            let pPartners = 0;

            if (supportRes.data.success) {
                pTickets = supportRes.data.data.filter(t => t.status === 'Open').length;
                setOpenTickets(pTickets);
            }

            if (statsRes.data.success) {
                pDeals = statsRes.data.data.pendingDeals || 0;
                pPartners = statsRes.data.data.pendingPartners?.length || 0;
            }

            // Consolidate into a notification list
            const combinedNotifs = [];
            if (pPartners > 0) combinedNotifs.push({ id: 'p', title: 'New Partner Requests', desc: `${pPartners} businesses are waiting for verification`, type: 'partner', icon: <Store size={16} />, path: '/admin/clients' });
            if (pDeals > 0) combinedNotifs.push({ id: 'd', title: 'Pending Deal Approvals', desc: `${pDeals} new deals require your review`, type: 'deal', icon: <Package size={16} />, path: '/admin/manage-deals' });
            if (pTickets > 0) combinedNotifs.push({ id: 's', title: 'Unresolved Support Tickets', desc: `${pTickets} messages need your attention`, type: 'support', icon: <Headphones size={16} />, path: '/admin/support' });
            if (pDesign > 0) combinedNotifs.push({ id: 'dr', title: 'Design Requests', desc: `${pDesign} clients requested banner designs`, type: 'design', icon: <Paintbrush size={16} />, path: '/admin/design-requests' });
            if (pHome > 0) combinedNotifs.push({ id: 'hr', title: 'Home Banner Requests', desc: `${pHome} requests for store feature promo`, type: 'home', icon: <Home size={16} />, path: '/admin/home-requests' });

            setNotifs(combinedNotifs);
            setTotalNotifCount(pPartners + pDeals + pTickets + pDesign + pHome);

        } catch (e) {
            console.error("Layout Sync Error:", e);
        }
    };


    useEffect(() => {
        fetchLiveStats();
        // Sync every 30 seconds for badges
        const interval = setInterval(fetchLiveStats, 30000);
        window.addEventListener('storage', fetchLiveStats);
        return () => {
            clearInterval(interval);
            window.removeEventListener('storage', fetchLiveStats);
        };
    }, []);


    const navItems = [
        { name: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
        { 
            name: 'Home Requests', 
            path: '/admin/home-requests', 
            icon: <Home size={20} />,
            badge: pendingRequests > 0 ? pendingRequests : null 
        },
        { name: 'Manage Users', path: '/admin/users', icon: <Users size={20} /> },
        { name: 'Manage Partners', path: '/admin/clients', icon: <Store size={20} /> },
        { name: 'Manage Deals', path: '/admin/manage-deals', icon: <Package size={20} /> },
        { name: 'Manage Categories', path: '/admin/categories', icon: <LayoutGrid size={20} /> },
        { name: 'Banner Promotions', path: '/admin/banners', icon: <ShoppingBag size={20} /> },
        { 
            name: 'Design Requests', 
            path: '/admin/design-requests', 
            icon: <Paintbrush size={20} />,
            badge: pendingDesigns > 0 ? pendingDesigns : null
        },
        { 
            name: 'Customer Support', 
            path: '/admin/support', 
            icon: <Headphones size={20} />,
            badge: openTickets > 0 ? openTickets : null
        },
        { name: 'Reports', path: '/admin/reports', icon: <BarChart3 size={20} /> },
    ];


    useEffect(() => {
        navItems.forEach(item => {
            if (item.subItems && item.subItems.some(sub => location.pathname === sub.path)) {
                if (!expandedMenus.includes(item.id)) {
                    setExpandedMenus(prev => [...prev, item.id]);
                }
            }
        });
    }, [location.pathname]);

    const toggleMenu = (menuId) => {
        setExpandedMenus(prev =>
            prev.includes(menuId)
                ? prev.filter(id => id !== menuId)
                : [...prev, menuId]
        );
    };

    return (
        <div className={`adlay-wrapper ${isSidebarOpen ? '' : 'sidebar-collapsed'}`}>
            {/* Sidebar Navigation */}
            <aside className="adlay-sidebar">
                <div className="adlay-logo-container">
                    <img src="/logo-admin.png" alt="Hodama Deals" className="adlay-logo" onError={(e) => e.target.style.display = 'none'} />
                    <span className="adlay-logo-text">Admin Panel</span>
                </div>

                <nav className="adlay-nav">
                    {navItems.map((item) => (
                        <div key={item.name || item.id} className="adlay-nav-group">
                            {item.subItems ? (
                                <>
                                    <button
                                        className={`adlay-nav-link adlay-menu-parent ${expandedMenus.includes(item.id) ? 'expanded' : ''}`}
                                        onClick={() => toggleMenu(item.id)}
                                    >
                                        <span className="adlay-nav-icon">{item.icon}</span>
                                        <span className="adlay-nav-name">{item.name}</span>
                                        <span className="adlay-menu-arrow">
                                            {expandedMenus.includes(item.id) ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                                        </span>
                                    </button>
                                    <div className={`adlay-sub-menu ${expandedMenus.includes(item.id) ? 'open' : ''}`}>
                                        {item.subItems.map((sub) => (
                                            <Link
                                                key={sub.name}
                                                to={sub.path}
                                                className={`adlay-sub-nav-link ${location.pathname === sub.path ? 'active' : ''}`}
                                            >
                                                <span className="adlay-sub-nav-icon">{sub.icon}</span>
                                                <span className="adlay-sub-nav-name">{sub.name}</span>
                                            </Link>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <Link
                                    to={item.path}
                                    className={`adlay-nav-link ${location.pathname === item.path ? 'active' : ''}`}
                                >
                                    <span className="adlay-nav-icon">{item.icon}</span>
                                    <span className="adlay-nav-name">{item.name}</span>
                                    {item.badge && <span className="adlay-badge-sidebar">{item.badge}</span>}
                                </Link>
                            )}
                        </div>
                    ))}

                    <button className="adlay-nav-link adlay-logout mt-auto" onClick={handleLogout}>
                        <span className="adlay-nav-icon"><LogOut size={20} /></span>
                        <span className="adlay-nav-name">Logout</span>
                    </button>
                </nav>
            </aside>

            {/* Main Content Area */}
            <main className="adlay-main">
                {/* Top Navbar */}
                <header className="adlay-navbar">
                    <div className="adlay-nav-left">
                        <button className="adlay-menu-toggle" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                        <div className="adlay-search-box">
                            <Search size={18} />
                            <input 
                                type="text" 
                                placeholder="Search for deals, users or categories..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => searchQuery.length > 2 && setShowSearchDropdown(true)}
                            />
                            {isSearchLoading && <RefreshCw size={14} className="animate-spin adlay-search-loader" />}
                            
                            {/* Search Dropdown */}
                            {showSearchDropdown && (
                                <>
                                    <div className="adlay-search-backdrop" onClick={() => setShowSearchDropdown(false)} />
                                    <div className="adlay-search-dropdown animate-fade-in">
                                        {searchResults.length > 0 ? (
                                            <div className="adlay-search-results">
                                                {searchResults.map((res) => (
                                                    <Link 
                                                        key={`${res.type}-${res.id}`} 
                                                        to={res.path} 
                                                        className="adlay-search-item"
                                                        onClick={() => {
                                                            setSearchQuery('');
                                                            setShowSearchDropdown(false);
                                                        }}
                                                    >
                                                        <div className={`adlay-search-icon ${res.type}`}>
                                                            {res.type === 'user' && <User size={16} />}
                                                            {res.type === 'deal' && <Package size={16} />}
                                                            {res.type === 'category' && <LayoutGrid size={16} />}
                                                        </div>
                                                        <div className="adlay-search-info">
                                                            <div className="adlay-search-title">{res.title}</div>
                                                            <div className="adlay-search-subtitle">{res.subtitle}</div>
                                                        </div>
                                                        <div className="adlay-search-type">{res.type}</div>
                                                    </Link>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="adlay-search-empty">
                                                <Search size={24} />
                                                <p>No results found for "{searchQuery}"</p>
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="adlay-nav-right">
                        <div className="adlay-notif-container">
                            <button className={`adlay-nav-btn ${isNotifOpen ? 'active' : ''}`} onClick={() => setIsNotifOpen(!isNotifOpen)}>
                                <Bell size={20} />
                                {totalNotifCount > 0 && <span className="adlay-badge">{totalNotifCount}</span>}
                            </button>

                            {isNotifOpen && (
                                <div className="adlay-notif-dropdown adlay-shadow-lg animate-fade-in">
                                    <div className="adlay-dropdown-header">
                                        <h3>System Notifications</h3>
                                        <span className="adlay-total-badge">{totalNotifCount} New</span>
                                    </div>
                                    <div className="adlay-dropdown-list">
                                        {notifs.length > 0 ? notifs.map(n => (
                                            <Link key={n.id} to={n.path} className="adlay-dropdown-item" onClick={() => setIsNotifOpen(false)}>
                                                <div className={`adlay-dropdown-icon ${n.type}`}>
                                                    {n.icon}
                                                </div>
                                                <div className="adlay-dropdown-body">
                                                    <h4 className="adlay-dropdown-title">{n.title}</h4>
                                                    <p className="adlay-dropdown-desc">{n.desc}</p>
                                                </div>
                                                <ChevronRight size={14} className="adlay-dropdown-arrow" />
                                            </Link>
                                        )) : (
                                            <div className="adlay-dropdown-empty">
                                                <CheckCircle size={32} />
                                                <p>All caught up!</p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="adlay-dropdown-footer">
                                        <button onClick={() => { navigate('/admin/dashboard'); setIsNotifOpen(false); }}>Go to Dashboard</button>
                                    </div>
                                </div>
                            )}
                        </div>
                        <Link to="/admin/settings" className="adlay-nav-btn" title="Settings">
                            <Settings size={20} />
                        </Link>
                        <div className="adlay-user-profile">
                            <div className="adlay-user-info">
                                <span className="adlay-user-name">Hashni Rehana</span>
                                <span className="adlay-user-role">Super Admin</span>
                            </div>
                            <div className="adlay-user-avatar">HR</div>
                        </div>
                    </div>

                </header>

                <div className="adlay-content-body">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
