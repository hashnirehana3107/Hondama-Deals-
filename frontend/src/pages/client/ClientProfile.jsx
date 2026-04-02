import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
    LayoutDashboard,
    Package,
    ShoppingBag,
    User,
    LogOut,
    Bell,
    MessageSquare,
    Search,
    Plus,
    Menu,
    X,
    Edit2,
    Shield,
    Image as ImageIcon,
    Save,
    Camera,
    ChevronRight,
    MapPin,
    Smartphone,
    Mail,
    Store,
    Lock,
    Contact,
    Eye,
    EyeOff,
    Home,
    RefreshCw,
    TrendingUp,
    Clock
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import ClientSidebar from '../../components/layout/ClientSidebar';
import ClientTopbar from '../../components/layout/ClientTopbar';
import AlertModal from '../../components/common/AlertModal';
import './ClientProfile.css';

const ClientProfile = () => {
    const { user: authUser, logout } = useAuth();
    const { t } = useLanguage();
    const navigate = useNavigate();

    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [activeTab, setActiveTab] = useState('profile'); // For sidebar highlighting
    const [searchParams] = useSearchParams();
    const storeSectionRef = useRef(null);

    // Deep-linking logic for Store Section
    useEffect(() => {
        const section = searchParams.get('section');
        if (section === 'store' && storeSectionRef.current) {
            setTimeout(() => {
                storeSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
                // Add a temporary highlight class if needed
                storeSectionRef.current.classList.add('section-highlight');
                setTimeout(() => {
                    storeSectionRef.current.classList.remove('section-highlight');
                }, 3000);
            }, 500);
        }
    }, [searchParams]);

    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('hodama_client_user_v1');
        if (saved) return JSON.parse(saved);

        return {
            name: authUser?.name || 'User Name',
            email: authUser?.email || 'user@example.com',
            phone: '077 123 4567',
            role: 'Business Account',
            storeName: '',
            storeDescription: '',
            storeCategory: 'Other',
            storeRating: '0.0',
            storeLink: '',
            address: '',
            city: 'Colombo',
            joinedDate: new Date().getFullYear().toString(),
            profilePic: null,
            storeLogo: null
        };
    });

    // Handle Alert Modal State
    const [alertModal, setAlertModal] = useState({ isOpen: false, type: 'success', message: '', title: '' });

    const triggerAlert = (type, message, title) => {
        setAlertModal({ isOpen: true, type, message, title });
    };

    // Auto-sync basic auth details if missing
    React.useEffect(() => {
        if (authUser && (!user.name || !user.email)) {
            setUser(prev => ({ 
                ...prev, 
                name: authUser.name || prev.name,
                email: authUser.email || prev.email
            }));
        }
    }, [authUser]);

    // Self-Healing: Re-sync Home Request if missed in admin queue
    React.useEffect(() => {
        if (user.isHomeRequested && user.homeRequestStatus === 'Pending') {
            const requests = JSON.parse(localStorage.getItem('hodama_store_requests_v1') || '[]');
            const exists = requests.some(r => r.ownerEmail === user.email);
            
            if (!exists) {
                console.log('Auto-healing: Adding missed home request to admin queue...');
                const reqData = {
                    name: user.storeName || 'Unnamed Store',
                    img: user.storeLogo || "/assets/images/placeholder_store.png",
                    url: user.storeLink || '',
                    ownerEmail: user.email,
                    description: user.storeDescription || '',
                    requestDate: new Date().toLocaleDateString(),
                    status: 'Pending'
                };
                requests.push(reqData);
                localStorage.setItem('hodama_store_requests_v1', JSON.stringify(requests));
                window.dispatchEvent(new Event('storage'));
            }
        }
    }, [user.isHomeRequested, user.homeRequestStatus, user.email, user.storeName, user.storeLogo, user.storeLink, user.storeDescription]);

    // Calculate Live Stats
    const stats = React.useMemo(() => {
        const allDeals = JSON.parse(localStorage.getItem('hodama_deals_v1') || '[]');
        // In a real app, we'd filter by client ID/email. Since this is a prototype:
        const clientDeals = allDeals; 
        
        const activeDeals = clientDeals.filter(d => d.status === 'Active').length;
        const totalViews = clientDeals.reduce((sum, d) => sum + (d.views || 0), 0);
        const totalClicks = Math.floor(totalViews * 1.8); // Simulating clicks > views for demo if needed, or just sum
        
        return {
            active: activeDeals,
            views: totalViews > 1000 ? (totalViews / 1000).toFixed(1) + 'K' : totalViews,
            rating: user.storeRating || '4.8',
            clicks: totalClicks > 1000 ? (totalClicks / 1000).toFixed(1) + 'K' : totalClicks
        };
    }, [user.storeRating]);

    const [passwords, setPasswords] = useState({
        current: '',
        new: '',
        confirm: ''
    });

    const [showPassword, setShowPassword] = useState({
        current: false,
        new: false,
        confirm: false
    });

    const [notifications, setNotifications] = useState({
        orders: true,
        messages: true,
        promos: false
    });

    const profilePicRef = useRef(null);
    const storeLogoRef = useRef(null);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUser(prev => ({ ...prev, [name]: value }));
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswords(prev => ({ ...prev, [name]: value }));
    };

    const togglePasswordVisibility = (field) => {
        setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
    };

    const handleToggleNotify = (key) => {
        setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleImageUpload = (e, type) => {
        const file = e.target.files[0];
        if (file) {
            // Check file size (2MB limit)
            if (file.size > 2 * 1024 * 1024) {
                alert("Image is too large! Please choose an image smaller than 2MB.");
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setUser(prev => ({ ...prev, [type]: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };



    const handleSaveChanges = (e) => {
        e.preventDefault();

        // 1. Save specific store info to global store list for Home Page
        const storedStores = JSON.parse(localStorage.getItem('hodama_all_stores_v1') || '[]');
        const updatedStores = [...storedStores];
        const storeIdx = updatedStores.findIndex(s => s.ownerEmail === user.email);

        const storeData = {
            name: user.storeName,
            img: user.storeLogo || "/assets/images/placeholder_store.png",
            url: user.storeLink,
            rating: user.storeRating || "0.0",
            category: user.storeCategory,
            ownerEmail: user.email,
            description: user.storeDescription,
            isClaimed: true // New flag for the Hybrid approach
        };

        if (storeIdx > -1) {
            updatedStores[storeIdx] = { ...updatedStores[storeIdx], ...storeData };
        } else {
            updatedStores.push(storeData);
        }

        localStorage.setItem('hodama_all_stores_v1', JSON.stringify(updatedStores));

        // 1.1 Store actual home page request in a separate list for Admin
        if (user.isHomeRequested) {
            const requests = JSON.parse(localStorage.getItem('hodama_store_requests_v1') || '[]');
            const reqIdx = requests.findIndex(r => r.ownerEmail === user.email);
            const reqData = {
                ...storeData,
                requestDate: new Date().toLocaleDateString(),
                status: user.homeRequestStatus || 'Pending'
            };
            if (reqIdx > -1) requests[reqIdx] = reqData;
            else requests.push(reqData);
            localStorage.setItem('hodama_store_requests_v1', JSON.stringify(requests));
        }

        // 2. Save current user state
        localStorage.setItem('hodama_client_user_v1', JSON.stringify(user));

        triggerAlert('success', 'Your store profile and business details have been saved successfully.', 'Store Updated!');
    };

    const handleUpdatePassword = (e) => {
        e.preventDefault();
        if (passwords.new !== passwords.confirm) {
            triggerAlert('error', 'The new passwords you entered do not match. Please try again.', 'Update Failed');
            return;
        }
        triggerAlert('success', 'Your account password has been updated successfully. Next time you login, please use your new password.', 'Security Updated!');
        setPasswords({ current: '', new: '', confirm: '' });
    };

    return (
        <div className="client-dashboard-wrapper">
            <ClientSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

            {/* Main Content */}
            <main className="dashboard-main-content">
                <ClientTopbar toggleSidebar={toggleSidebar} />

                <div className="dashboard-view-container profile-scroll-container">
                    <div className="profile-wrapper fade-in">

                        {/* Breadcrumb & Header */}
                        <div className="profile-page-header">
                            <div className="header-info">
                                <h1><User size={28} className="title-icon" /> Profile & Store</h1>
                                <p>Manage your account information and store details.</p>
                            </div>
                        </div>

                        <div className="profile-content-grid">

                            {/* Left Column: Summary & Stats */}
                            <div className="profile-left-col">

                                {/* 2. Client Profile Summary Card */}
                                <div className="profile-summary-card">
                                    <div className="summary-bg-pattern"></div>

                                    <div className="summary-avatar-section">
                                        <div className="summary-avatar" onClick={() => profilePicRef.current.click()}>
                                            <div className="avatar-circle-main">
                                                {user.profilePic ? (
                                                    <img src={user.profilePic} alt="Profile" />
                                                ) : (
                                                    <div className="avatar-initials-circle">
                                                        {user.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'US'}
                                                    </div>
                                                )}
                                                <div className="avatar-edit-overlay">
                                                    <Camera size={20} />
                                                </div>
                                            </div>
                                        </div>
                                        <input type="file" ref={profilePicRef} hidden accept="image/*" onChange={(e) => handleImageUpload(e, 'profilePic')} />

                                        <h2 className="summary-name">{user.name}</h2>
                                        <div className="summary-store-badge">
                                            <ShoppingBag size={14} /> <span>{user.storeName || 'My Store'}</span>
                                        </div>
                                    </div>

                                    <div className="summary-details">
                                        <div className="detail-row">
                                            <div className="icon-box"><Mail size={16} /></div>
                                            <span>{user.email}</span>
                                        </div>
                                        <div className="detail-row">
                                            <div className="icon-box"><Smartphone size={16} /></div>
                                            <span>{user.phone}</span>
                                        </div>
                                        <div className="detail-row">
                                            <div className="icon-box"><MapPin size={16} /></div>
                                            <span>{user.address}</span>
                                        </div>
                                    </div>

                                    <div className="summary-actions">
                                        <button className="summary-btn change-photo-btn" onClick={() => profilePicRef.current.click()}>
                                            <Camera size={16} /> Change Photo
                                        </button>
                                    </div>
                                </div>

                                {/* 6. Client Performance Summary */}
                                <div className="profile-stats-card">
                                    <h3 className="card-title">Store Performance</h3>

                                    <div className="stats-mini-grid">
                                        <div className="stat-mini-box">
                                            <div className="s-icon s-bg-gray"><Package size={20} /></div>
                                            <div className="s-info">
                                                <span className="s-val">{stats.active.toString().padStart(2, '0')}</span>
                                                <span className="s-lbl">Active Deals</span>
                                            </div>
                                        </div>
                                        <div className="stat-mini-box">
                                            <div className="s-icon s-bg-orange"><Eye size={20} /></div>
                                            <div className="s-info">
                                                <span className="s-val">{stats.views}</span>
                                                <span className="s-lbl">Deal Views</span>
                                            </div>
                                        </div>
                                        <div className="stat-mini-box">
                                            <div className="s-icon s-bg-green"><Store size={20} /></div>
                                            <div className="s-info">
                                                <span className="s-val">{stats.rating}</span>
                                                <span className="s-lbl">Rating</span>
                                            </div>
                                        </div>
                                        <div className="stat-mini-box">
                                            <div className="s-icon s-bg-purple"><LayoutDashboard size={20} /></div>
                                            <div className="s-info">
                                                <span className="s-val">{stats.clicks}</span>
                                                <span className="s-lbl">Grab Clicks</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Forms */}
                            <div className="profile-right-col">

                                <form onSubmit={handleSaveChanges} className="profile-forms-wrapper">

                                    {/* 3. Store Information Section */}
                                    <div className="profile-form-card" ref={storeSectionRef}>
                                        <div className="card-header">
                                            <Store size={20} className="text-primary" />
                                            <h3>Store Information</h3>
                                        </div>

                                        <div className="form-grid">
                                            <div className="form-group span-2">
                                                <label>Store Logo</label>
                                                <div className="logo-upload-box" onClick={() => storeLogoRef.current.click()}>
                                                    {user.storeLogo ? (
                                                        <img src={user.storeLogo} alt="Store Logo" className="logo-preview" />
                                                    ) : (
                                                        <div className="logo-placeholder">
                                                            <ImageIcon size={32} />
                                                            <span>Click to upload store logo</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <input type="file" ref={storeLogoRef} hidden accept="image/*" onChange={(e) => handleImageUpload(e, 'storeLogo')} />
                                            </div>

                                            <div className="form-group span-2">
                                                <label>Store Name</label>
                                                <input type="text" name="storeName" value={user.storeName || ''} onChange={handleInputChange} placeholder="e.g. TechZone Store" required />
                                            </div>

                                            <div className="form-group span-2">
                                                <label>Store Category</label>
                                                <select name="storeCategory" value={user.storeCategory} onChange={handleInputChange}>
                                                    <option value="Electronics">Electronics Store</option>
                                                    <option value="Fashion">Fashion Store</option>
                                                    <option value="Home">Home Appliances</option>
                                                    <option value="Beauty">Health & Beauty</option>
                                                    <option value="Sports">Sports & Outdoors</option>
                                                    <option value="Other">Other (Please Specify)</option>
                                                </select>
                                            </div>

                                            <div className="form-group flex-1">
                                                <label>Store Ratings</label>
                                                <input type="text" name="storeRating" value={user.storeRating || ''} onChange={handleInputChange} placeholder="0.0" />
                                            </div>

                                            <div className="form-group flex-1">
                                                <label>Store Link</label>
                                                <input type="text" name="storeLink" value={user.storeLink || ''} onChange={handleInputChange} placeholder="ex: https://lk.example.com/" />
                                            </div>

                                            {user.storeCategory === 'Other' && (
                                                <div className="form-group span-2" style={{ animation: 'fadeIn 0.3s ease' }}>
                                                    <label>Specify Store Category</label>
                                                    <input
                                                        type="text"
                                                        name="customCategory"
                                                        value={user.customCategory || ''}
                                                        onChange={handleInputChange}
                                                        placeholder="Type your category here..."
                                                        required
                                                    />
                                                </div>
                                            )}

                                            <div className="form-group span-2">
                                                <label>Store Description</label>
                                                <textarea name="storeDescription" value={user.storeDescription} onChange={handleInputChange} placeholder="Brief description of your store..."></textarea>
                                            </div>

                                            <div className="form-group span-2">
                                                {!user.isHomeRequested ? (
                                                    <div className="home-request-promo-card">
                                                        <div className="promo-info">
                                                            <Home size={24} className="text-primary" />
                                                            <div>
                                                                <h4>Request Home Page Listing</h4>
                                                                <p>Feature your store on our global homepage and get noticed by all visitors instantly.</p>
                                                            </div>
                                                        </div>
                                                        <button 
                                                            type="button" 
                                                            className="promo-btn-request" 
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                const conf = window.confirm("Do you want to request listing for the Home Page?");
                                                                if(conf) {
                                                                    const updatedUser = {
                                                                        ...user, 
                                                                        isHomeRequested: true, 
                                                                        homeRequestStatus: 'Pending'
                                                                    };
                                                                    setUser(updatedUser);
                                                                    
                                                                    // Immediate Sync to Admin Queue
                                                                    const requests = JSON.parse(localStorage.getItem('hodama_store_requests_v1') || '[]');
                                                                    const reqIdx = requests.findIndex(r => r.ownerEmail === user.email);
                                                                    const reqData = {
                                                                        name: user.storeName,
                                                                        img: user.storeLogo || "/assets/images/placeholder_store.png",
                                                                        url: user.storeLink,
                                                                        ownerEmail: user.email,
                                                                        description: user.storeDescription,
                                                                        requestDate: new Date().toLocaleDateString(),
                                                                        status: 'Pending'
                                                                    };
                                                                    
                                                                    if (reqIdx > -1) requests[reqIdx] = reqData;
                                                                    else requests.push(reqData);
                                                                    
                                                                    localStorage.setItem('hodama_store_requests_v1', JSON.stringify(requests));
                                                                    localStorage.setItem('hodama_client_user_v1', JSON.stringify(updatedUser));

                                                                    // Dispatch event to sync other tabs/components
                                                                    window.dispatchEvent(new Event('storage'));
                                                                    
                                                                    triggerAlert('success', 'Your request for a Home Page Listing has been sent to the Admin for approval.', 'Request Sent!');
                                                                }
                                                            }}
                                                        >
                                                            Request Now
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className={`home-status-banner-mini ${user.homeRequestStatus?.toLowerCase()}`}>
                                                        <Clock size={18} />
                                                        <span>Home Page Promotion: <strong>{user.homeRequestStatus || 'Pending'}</strong></span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>



                                    {/* 4. Contact Information Section */}
                                    <div className="profile-form-card">
                                        <div className="card-header">
                                            <Mail size={20} className="text-primary" />
                                            <h3>Contact Details</h3>
                                        </div>

                                        <div className="form-grid">
                                            <div className="form-group span-2">
                                                <label>Client Name</label>
                                                <input type="text" name="name" value={user.name || ''} onChange={handleInputChange} required />
                                            </div>

                                            <div className="form-group">
                                                <label>Email Address</label>
                                                <input type="email" name="email" value={user.email || ''} onChange={handleInputChange} required />
                                            </div>

                                            <div className="form-group">
                                                <label>Phone Number</label>
                                                <input type="tel" name="phone" value={user.phone || ''} onChange={handleInputChange} required />
                                            </div>

                                            <div className="form-group span-2">
                                                <label>Business Address</label>
                                                <input type="text" name="address" value={user.address || ''} onChange={handleInputChange} placeholder="Street address" required />
                                            </div>

                                            <div className="form-group">
                                                <label>City / District</label>
                                                <select name="city" value={user.city} onChange={handleInputChange}>
                                                    <option value="Colombo">Colombo</option>
                                                    <option value="Gampaha">Gampaha</option>
                                                    <option value="Kandy">Kandy</option>
                                                    <option value="Galle">Galle</option>
                                                    <option value="Negombo">Negombo</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Save Changes Bottom */}
                                    <div className="form-bottom-actions">
                                        <button type="button" className="btn-cancel" onClick={() => navigate('/client/dashboard')}>
                                            <X size={18} /> Cancel
                                        </button>
                                        <button type="submit" className="btn-save-bottom">
                                            <Save size={18} /> Save Changes
                                        </button>
                                    </div>
                                </form>

                                {/* 5. Client Account Settings & Security */}
                                <div className="profile-form-card security-card">
                                    <div className="card-header">
                                        <Lock size={20} className="text-primary" />
                                        <h3>Account Settings & Security</h3>
                                    </div>

                                    <form onSubmit={handleUpdatePassword} className="security-form">
                                        <h4 className="sub-title">Change Password</h4>
                                        <div className="form-grid">
                                            <div className="form-group span-2">
                                                <label>Current Password</label>
                                                <div className="password-input">
                                                    <input
                                                        type={showPassword.current ? 'text' : 'password'}
                                                        name="current"
                                                        value={passwords.current}
                                                        onChange={handlePasswordChange}
                                                        placeholder="Enter current password"
                                                        required
                                                    />
                                                    <button type="button" onClick={() => togglePasswordVisibility('current')}>
                                                        {showPassword.current ? <EyeOff size={18} /> : <Eye size={18} />}
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="form-group flex-1">
                                                <label>New Password</label>
                                                <div className="password-input">
                                                    <input
                                                        type={showPassword.new ? 'text' : 'password'}
                                                        name="new"
                                                        value={passwords.new}
                                                        onChange={handlePasswordChange}
                                                        placeholder="Enter new password"
                                                        required
                                                    />
                                                    <button type="button" onClick={() => togglePasswordVisibility('new')}>
                                                        {showPassword.new ? <EyeOff size={18} /> : <Eye size={18} />}
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="form-group flex-1">
                                                <label>Confirm Password</label>
                                                <div className="password-input">
                                                    <input
                                                        type={showPassword.confirm ? 'text' : 'password'}
                                                        name="confirm"
                                                        value={passwords.confirm}
                                                        onChange={handlePasswordChange}
                                                        placeholder="Confirm new password"
                                                        required
                                                    />
                                                    <button type="button" onClick={() => togglePasswordVisibility('confirm')}>
                                                        {showPassword.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        <button type="submit" className="btn-outline-primary mt-4">Update Password</button>
                                    </form>

                                    {/* Notifications Toggle (Optional modern feature) */}
                                    <div className="notifications-toggle-section">
                                        <h4 className="sub-title">Notifications</h4>
                                        <div className="toggle-list">
                                            <div className="toggle-item" onClick={() => handleToggleNotify('orders')}>
                                                <div className="t-info">
                                                    <p className="t-name">Deal Expiry Alerts</p>
                                                    <p className="t-desc">Get notified when a deal is about to expire</p>
                                                </div>
                                                <div className={`modern-toggle ${notifications.orders ? 'active' : ''}`}></div>
                                            </div>
                                            <div className="toggle-item" onClick={() => handleToggleNotify('messages')}>
                                                <div className="t-info">
                                                    <p className="t-name">Approval Alerts</p>
                                                    <p className="t-desc">Get notified when admin approves your deal</p>
                                                </div>
                                                <div className={`modern-toggle ${notifications.messages ? 'active' : ''}`}></div>
                                            </div>
                                        </div>
                                    </div>

                                </div>

                            </div>
                        </div>

                    </div>
                </div>
            </main>
            {/* CUSTOM ALERT MODAL */}
            <AlertModal 
                isOpen={alertModal.isOpen}
                type={alertModal.type}
                message={alertModal.message}
                title={alertModal.title}
                onClose={() => setAlertModal({ ...alertModal, isOpen: false })}
            />
        </div>
    );
};

export default ClientProfile;

