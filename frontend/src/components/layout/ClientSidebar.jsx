import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
    LayoutGrid, 
    Tag, 
    Plus, 
    User, 
    LogOut, 
    Home,
    X,
    Image as ImageIcon,
    Palette,
    LifeBuoy
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../utils/api';
import './ClientSidebar.css';


const ClientSidebar = ({ isOpen, toggleSidebar }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path) => {
        if (path === '/client/dashboard' && location.pathname === '/client/dashboard' && !location.search.includes('tab=support')) return true;
        if (path !== '/client/dashboard' && location.pathname.startsWith(path)) return true;
        return false;
    };

    const [supportCount, setSupportCount] = React.useState(0);
    const [designUpdate, setDesignUpdate] = React.useState(0);

    const fetchCounts = async () => {
        try {
            // 1. Support Tickets with Admin Reply
            const res = await api.get('/support');
            if (res.data.success) {
                // Count tickets where the last reply is from Admin (simulating unread)
                const unread = res.data.data.filter(t => {
                    if (t.replies.length > 0) {
                        return t.replies[t.replies.length - 1].sender === 'Admin';
                    }
                    return false;
                }).length;
                setSupportCount(unread);
            }

            // 2. Design Request Status (Sync from LocalStorage)
            const designs = JSON.parse(localStorage.getItem('hodama_banner_requests_v1') || '[]');
            setDesignUpdate(designs.filter(d => d.type?.includes('Design Request') && d.isReadClient === false).length);
        } catch (e) {

            console.error("Client badge sync error");
        }
    };

    React.useEffect(() => {
        fetchCounts();
        const interval = setInterval(fetchCounts, 60000); // Check every minute
        return () => clearInterval(interval);
    }, []);


    return (
        <aside className={`client-sidebar-new ${isOpen ? 'expanded' : 'collapsed'}`}>
            <div className="sidebar-header-new">
                <div className="brand-logo-circle">
                    <img src="/logo2.png" alt="Hodama Deals" />
                </div>
                <button className="sidebar-mobile-close" onClick={toggleSidebar}>
                    <X size={20} />
                </button>
            </div>

            <nav className="sidebar-nav-new">
                <button 
                    className={`nav-item-new ${isActive('/client/dashboard') ? 'active' : ''}`}
                    onClick={() => navigate('/client/dashboard')}
                >
                    <LayoutGrid size={22} className="nav-icon" />
                    <span>Dashboard</span>
                </button>

                <button 
                    className={`nav-item-new ${isActive('/client/manage-deals') ? 'active' : ''}`}
                    onClick={() => navigate('/client/manage-deals')}
                >
                    <Tag size={22} className="nav-icon" />
                    <span>Manage Deals</span>
                </button>

                <button 
                    className={`nav-item-new ${isActive('/client/add-deal') ? 'active' : ''}`}
                    onClick={() => navigate('/client/add-deal')}
                >
                    <Plus size={22} className="nav-icon" />
                    <span>Add New Deal</span>
                </button>

                <button 
                    className={`nav-item-new ${isActive('/client/banner-promotions') ? 'active' : ''}`}
                    onClick={() => navigate('/client/banner-promotions')}
                >
                    <ImageIcon size={22} className="nav-icon" />
                    <span>Banner Promotions</span>
                </button>

                <button 
                    className={`nav-item-new ${isActive('/client/design-support') ? 'active' : ''}`}
                    onClick={() => navigate('/client/design-support')}
                >
                    <Palette size={22} className="nav-icon" />
                    <span>Design Support</span>
                    {designUpdate > 0 && <span className="sidebar-badge">{designUpdate}</span>}
                </button>

                <button 
                    className={`nav-item-new ${isActive('/client/dashboard') && location.search.includes('tab=support') ? 'active' : ''}`}
                    onClick={() => navigate('/client/dashboard?tab=support')}
                >
                    <LifeBuoy size={22} className="nav-icon" />
                    <span>Support Hub</span>
                    {supportCount > 0 && <span className="sidebar-badge">{supportCount}</span>}
                </button>


                <button 
                    className={`nav-item-new ${isActive('/client/profile') ? 'active' : ''}`}
                    onClick={() => navigate('/client/profile')}
                >
                    <User size={22} className="nav-icon" />
                    <span>Profile & Store</span>
                </button>
            </nav>

            <div className="sidebar-footer-new">
                <button className="nav-item-new logout-item" onClick={handleLogout}>
                    <LogOut size={22} className="nav-icon" />
                    <span>Logout</span>
                </button>
                <button className="nav-item-new home-item" onClick={() => navigate('/')}>
                    <Home size={22} className="nav-icon" />
                    <span>Go to Home</span>
                </button>
            </div>
        </aside>
    );
};

export default ClientSidebar;
