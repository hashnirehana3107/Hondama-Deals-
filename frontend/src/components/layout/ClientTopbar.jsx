import { Menu, Search, Bell, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ClientTopbar = ({ toggleSidebar }) => {
    const { user } = useAuth();
    const navigate = useNavigate();

    return (
        <header className="dashboard-topbar">
            <div className="topbar-left">
                <button className="sidebar-trigger" onClick={toggleSidebar}>
                    <Menu size={20} />
                </button>
                <div className="search-wrapper">
                    <Search size={18} color="#a0aec0" />
                    <input type="text" placeholder="Search Deals ..." />
                </div>
            </div>

            <div className="topbar-right">
                <button className="portal-btn" onClick={() => navigate('/client/notifications')}>
                    <Bell size={20} />
                </button>
                <div className="user-profile-widget" onClick={() => navigate('/client/profile')}>
                    <div className="widget-info">
                        <span className="w-name">{user?.name || 'nethmi Fernando'}</span>
                        <span className="w-role">Business Account</span>
                    </div>
                    <div className="avatar-initials">
                        {user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'NF'}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default ClientTopbar;
