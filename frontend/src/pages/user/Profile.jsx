import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    ArrowLeft, User, Package, Truck, Heart, MapPin,
    Bell, Settings, LogOut, ChevronRight,
    Clock, HelpCircle, CreditCard, ShoppingBag,
    Eye, Trash2, Plus, Edit2, List, Shield, EyeOff, LayoutDashboard, Store, Sparkles, History, BadgePercent, Wallet
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { useWishlist } from '../../contexts/WishlistContext';
import DesignCard from '../../components/common/DesignCard';
import StoreCard from '../../components/common/StoreCard';
import CategoryCard from '../../components/common/CategoryCard';
import AlertModal from '../../components/common/AlertModal';
import SupportHub from '../../components/common/SupportHub';
import './Profile.css';

const Profile = () => {
    const { t } = useLanguage();
    const { user, logout, becomeSeller } = useAuth();
    const { wishlist } = useWishlist();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('overview');

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    // Mock Deals Data
    const allDeals = [
        { id: 101, name: "LUV Perfume Duo", price: "6,000", oldPrice: "7,000", img: "/assets/images/luv_perfume_duo.png", badge: "10% OFF", storeName: "Luv Esence", storeImg: "/assets/images/luvLogo.png", rating: "4.6", ratingCount: "15", location: "Luv Esence, Sri Lanka", dealType: "SALE", category: "Health & Beauty" },
        { id: 102, name: "Fruit Paradise Wellness & Beauty Collection", price: "15,900", oldPrice: "27,000", img: "/assets/images/spaceylonOffer.png", badge: "50% Off", storeName: "Spa Ceylon", storeImg: "/assets/images/spaceylonLogo.png", rating: "5.0", ratingCount: "18", location: "Spa Ceylon, Sri Lanka", dealType: "SALE", category: "Health & Beauty" },
        { id: 103, name: "HAIR REALAXING|REBONDING|STRAIGHT", price: "9,500", oldPrice: "12,500", img: "/assets/images/salon2.png", badge: "40% OFF", storeName: "The Station Hair & Beauty", storeImg: "/assets/images/stationHairBeauty.png", rating: "4.5", ratingCount: "220", location: "Battaramulla", dealType: "OFFER", category: "Salon" },
        { id: 104, name: "10 pc Hot & Crispy Chicken", price: "3,900", oldPrice: "4,950", img: "/assets/images/KFC1.png", badge: "20% Off", storeName: "KFC", storeImg: "/assets/images/KFCLogo.png", rating: "4.8", ratingCount: "100", location: "KFC, Sri Lanka", dealType: "LIMITED OFFER", category: "Restaurant" },
        { id: 202, name: "Enjoy 25% OFF on 2L tubs at Baskin Robbins", price: "6,900", oldPrice: "9,200", img: "/assets/images/BR1.png", badge: "12% Off", storeName: "Baskin Robbins", storeImg: "/assets/images/BaskinRobbinsLogo.png", rating: "4.9", ratingCount: "67", location: "Baskin Robbins, Sri Lanka", dealType: "OFFER", category: "Restaurant" },
        { id: 303, name: "The Best Korean Skin Care Products Offer", price: "Total Bill: 20% OFF", img: "/assets/images/Skin1.png", badge: "20% OFF", storeName: "Cosmetics.lk", storeImg: "/assets/images/Cosmetics.png", rating: "4.5", ratingCount: "12", location: "Cosmetics.lk", dealType: "OFFER", category: "Health & Beauty" }
    ];

    const [recommendedDeals, setRecommendedDeals] = useState([]);
    const [recentStores, setRecentStores] = useState([]);
    const [exploredCount, setExploredCount] = useState(0);
    const [lovedCategories, setLovedCategories] = useState([]);

    // Custom Alert State
    const [alertModal, setAlertModal] = useState({ isOpen: false, type: 'success', message: '', title: '', onConfirm: null, buttonText: '' });

    // Partner Logic (Backend Connection)
    const [partnerForm, setPartnerForm] = useState({ businessName: '', category: '', websiteLink: '' });
    const [regMessage, setRegMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleBecomePartner = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setRegMessage(null);
        try {
            await becomeSeller(partnerForm);
            setIsLoading(false);
            
            // Auto-save registration details for the Client Dashboard to pick up
            const initialClientData = {
                name: user?.name,
                email: user?.email,
                storeName: partnerForm.businessName,
                storeCategory: partnerForm.category,
                storeLink: partnerForm.websiteLink,
                joinedDate: new Date().getFullYear().toString()
            };
            localStorage.setItem('hodama_client_user_v1', JSON.stringify(initialClientData));

            triggerAlert('success', 'Congratulations! Your store has been approved and is now live on the platform.', 'Account Upgraded!');
            setTimeout(() => {
                navigate('/client/dashboard');
            }, 2500);
        } catch (error) {
            setIsLoading(false);
            triggerAlert('error', error.message, 'Registration Failed');
        }
    };

    React.useEffect(() => {
        // Fetch tracking from local storage or mock
        const userHistory = JSON.parse(localStorage.getItem('hd_deal_history') || '[]');
        const count = localStorage.getItem('hd_deals_explored_count') || '0';
        setExploredCount(count);

        const interactedCategories = userHistory.map(h => h.category);

        // If no history, default to some popular categories user interacts with
        const targetCategories = interactedCategories.length > 0
            ? [...new Set(interactedCategories)]
            : ['Health & Beauty', 'Restaurant', 'Salon'];

        // Get deals dynamically based on these targeted categories
        const filtered = allDeals.filter(d => targetCategories.includes(d.category)).slice(0, 3);
        setRecommendedDeals(filtered);

        // Fetch Recent Stores
        const storedStores = JSON.parse(localStorage.getItem('hd_recent_stores') || '[]');
        if (storedStores.length > 0) {
            setRecentStores(storedStores.slice(0, 4));
        } else {
            // Default Stores
            setRecentStores([
                { name: "Spa Ceylon", img: "/assets/images/spaceylonLogo.png", url: "#", rating: "5.0", category: "Health & Beauty", dealsCount: 12 },
                { name: "KFC", img: "/assets/images/KFCLogo.png", url: "#", rating: "4.8", category: "Restaurant", dealsCount: 8 },
                { name: "Singer", img: "/assets/images/SingerLogo.png", url: "#", rating: "4.5", category: "Electronics", dealsCount: 20 },
                { name: "Domino's Pizza", img: "/assets/images/DominosLogo.png", url: "#", rating: "4.4", category: "Restaurant", dealsCount: 5 }
            ]);
        }

        // Categories You Love
        const allCategoryData = [
            { name: 'Health & Beauty', image: '/assets/images/Health&BeautyCat.png', icon: '/assets/images/Health&Beauty.png', color: '#be185d', slug: 'health-beauty' },
            { name: 'Restaurant', image: '/assets/images/RestaurantCat.png', icon: '/assets/images/Restaurant.png', color: '#c2410c', slug: 'restaurant' },
            { name: 'Fashion', image: '/assets/images/FashionCat.jpg', icon: '/assets/images/Fashion.png', color: '#047857', slug: 'fashion' },
            { name: 'Electronics', image: '/assets/images/ElectronicsCat.png', icon: '/assets/images/electronics.png', color: '#76a81e', slug: 'electronics' },
            { name: 'Hotel', image: '/assets/images/HotelCat.png', icon: '/assets/images/Hotel.png', color: '#6d28d9', slug: 'hotel' },
            { name: 'Groceries', image: '/assets/images/GroceriesCat.png', icon: '/assets/images/Groceries.png', color: '#b45309', slug: 'groceries' },
            { name: 'Salon', image: '/assets/images/SalonCat.png', icon: '/assets/images/Salon.png', color: '#be123c', slug: 'salon' },
            { name: 'Spa', image: '/assets/images/spaCat.png', icon: '/assets/images/Spa.png', color: '#10b981', slug: 'spa' },
        ];
        const storedHistory = JSON.parse(localStorage.getItem('hd_deal_history') || '[]');
        const uniqueCats = [...new Set(storedHistory.map(h => h.category))];
        const matchedCats = allCategoryData.filter(c => uniqueCats.includes(c.name));
        setLovedCategories(matchedCats.length > 0 ? matchedCats.slice(0, 4) : allCategoryData.slice(0, 4));
    }, []);

    const [personalInfo, setPersonalInfo] = useState({
        name: user?.name || 'Kiara Fernando',
        phone: '077 123 4567',
        gender: 'female',
        bio: ''
    });

    const [notifications, setNotifications] = useState({
        orders: true,
        promos: true,
        deals: false,
        security: true
    });

    const [wishlistCount, setWishlistCount] = useState(2);

    const [showCurrentPass, setShowCurrentPass] = useState(false);
    const [showNewPass, setShowNewPass] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);


    const [addresses, setAddresses] = useState([]);
    const [isAddrModalOpen, setIsAddrModalOpen] = useState(false);
    const [editingAddrId, setEditingAddrId] = useState(null);
    const [addrForm, setAddrForm] = useState({
        type: '', name: '', text: '', phone: '', isDefault: false
    });

    const handleAddAddress = () => {
        setEditingAddrId(null);
        setAddrForm({ type: 'Home', name: user?.name || '', text: '', phone: '', isDefault: false });
        setIsAddrModalOpen(true);
    };

    const handleEditAddress = (id) => {
        const addr = addresses.find(a => a.id === id);
        if (addr) {
            setEditingAddrId(id);
            setAddrForm({ ...addr });
            setIsAddrModalOpen(true);
        }
    };

    const handleSaveAddress = (e) => {
        e.preventDefault();
        triggerAlert('success', 'Your new address has been saved to your address book.', 'Address Saved!');
        setIsAddrModalOpen(false);
    };

    const handleDeleteAddress = (id) => {
        triggerAlert(
            'confirm', 
            'Are you sure you want to delete this address from your profile? This action cannot be undone.', 
            'Delete Address?',
            () => {
                setAddresses(addresses.filter(a => a.id !== id));
                setAlertModal(prev => ({ ...prev, isOpen: false }));
            },
            'DELETE NOW'
        );
    };

    const fileInputRef = useRef(null);
    const [profilePic, setProfilePic] = useState(null);

    const handleAvatarClick = () => {
        fileInputRef.current.click();
    };

    const handlePfpChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePic(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const triggerAlert = (type, message, title, onConfirm, buttonText) => {
        setAlertModal({ isOpen: true, type, message, title, onConfirm, buttonText });
    };

    const handleUpdateProfile = (e) => {
        e.preventDefault();
        triggerAlert('success', 'Your profile information has been successfully updated.', 'Profile Updated!');
    };

    const handlePasswordUpdate = (e) => {
        e.preventDefault();
        triggerAlert('success', 'Your password has been changed successfully. Please keep it safe!', 'Security Updated!');
    };


    const handleToggleNotify = (key) => {
        setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const summaryStats = [
        { label: 'DEALS EXPLORED', value: exploredCount.toString(), icon: <Eye size={28} />, color: '#3ee6a6', action: null },
        { label: 'WISHLIST ITEMS', value: wishlistCount, icon: <Heart size={28} />, color: '#fca5a5', action: null },
    ];

    return (
        <div className="modern-profile-hub">
            <div className="container">
                <button onClick={() => navigate(-1)} className="back-btn-square" style={{ marginBottom: '24px' }}>
                    <div className="back-btn-circle-inner">
                        <ArrowLeft size={16} strokeWidth={3} />
                    </div>
                </button>
                <div className="profile-grid">
                    {/* Sidebar Navigation */}
                    <aside className="profile-sidebar">
                        {/* Desktop: full header card */}
                        <div className="profile-header-card">
                            <div className="avatar-wrapper" onClick={handleAvatarClick} style={{ cursor: 'pointer' }}>
                                <img src={profilePic || `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=3b82f6&color=fff`} alt="Profile" />
                                <button className="edit-pfp"><Edit2 size={12} /></button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    style={{ display: 'none' }}
                                    accept="image/*"
                                    onChange={handlePfpChange}
                                />
                            </div>
                            <div className="user-meta">
                                <h3>{user?.name || 'Kiara Fernando'}</h3>
                                <div className="user-badge">
                                    {(!user || user.role === 'User' || user.role === 'Buyer' || user.role === 'user' || user.role === 'buyer')
                                        ? 'USER ACCOUNT'
                                        : (user.role === 'Client' || user.role === 'Seller' || user.role === 'seller' || user.role === 'Business Account' || user.role === 'Partner'
                                            ? 'BUSINESS ACCOUNT'
                                            : user.role.toUpperCase())}
                                </div>
                                <p className="member-since">Member since 2026</p>
                            </div>
                        </div>

                        {/* Mobile: compact user bar above tabs */}
                        <div className="profile-mobile-topbar">
                            <img
                                src={profilePic || `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=3b82f6&color=fff`}
                                alt="Profile"
                                className="profile-mobile-avatar"
                                onClick={handleAvatarClick}
                            />
                            <div className="profile-mobile-info">
                                <span className="profile-mobile-name">{user?.name || 'User'}</span>
                                <span className="profile-mobile-badge">
                                    {(!user || user.role === 'User' || user.role === 'user' || user.role === 'Buyer' || user.role === 'buyer') ? 'User Account' : 'Business Account'}
                                </span>
                            </div>
                        </div>

                        <nav className="profile-nav">
                            <button className={activeTab === 'overview' ? 'active' : ''} onClick={() => setActiveTab('overview')}>
                                <LayoutDashboard size={18} /> {t('overview')}
                            </button>
                            <button className={activeTab === 'info' ? 'active' : ''} onClick={() => setActiveTab('info')}>
                                <User size={18} /> Personal Info
                            </button>
                            <button className={activeTab === 'wishlist' ? 'active' : ''} onClick={() => setActiveTab('wishlist')}>
                                <Heart size={18} /> Wishlist
                            </button>
                            <button className={activeTab === 'security' ? 'active' : ''} onClick={() => setActiveTab('security')}>
                                <Shield size={18} /> Security
                            </button>
                            <hr />
                            <button className={activeTab === 'partner' ? 'active upgrade-client-btn' : 'upgrade-client-btn'} onClick={() => setActiveTab('partner')}>
                                <Store size={18} /> Partner
                            </button>
                            <button className={activeTab === 'support' ? 'active' : ''} onClick={() => setActiveTab('support')}>
                                <HelpCircle size={18} /> Support
                            </button>
                            <button className="logout-btn" onClick={handleLogout}><LogOut size={18} /> Logout</button>
                        </nav>

                        <div className="profile-support-box">
                            <HelpCircle size={28} />
                            <h4>Need a Help</h4>
                            <div className="support-actions">
                                <button onClick={() => navigate('/support')}>Contact Us</button>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="profile-main">
                        {/* Tab Switcher Logic */}

                        {activeTab === 'overview' && (
                            <div className="profile-view-section">
                                <header className="profile-hero">
                                    <div className="welcome-box">
                                        <h1>{t('dashWelcome', user?.name?.split(' ')[0] || 'Kiara')}</h1>
                                        <p>Manage your account and discover exclusive deals.</p>
                                    </div>
                                    <div className="quick-actions">
                                        <button className="icon-btn" onClick={() => setActiveTab('notifications')}><Bell size={20} /></button>
                                        <button className="icon-btn" onClick={() => setActiveTab('info')}><Settings size={20} /></button>
                                    </div>
                                </header>

                                <div className="profile-stats-row">
                                    {summaryStats.map((stat, idx) => (
                                        <div key={idx} className="stat-card profile-stat-card" onClick={stat.action ? stat.action : undefined} style={{ '--accent-color': stat.color, cursor: stat.action ? 'pointer' : 'default' }}>
                                            <div className="icon-circle profile-stat-icon">{stat.icon}</div>
                                            <div className="stat-label-box">
                                                <span className="label">{stat.label}</span>
                                                <span className="value">{stat.value}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>




                                {/* Recommended for You */}
                                <div className="recent-orders-card">
                                    <div className="head flex justify-between items-center" style={{ marginBottom: '24px' }}>
                                        <h3 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '10px', color: '#1e293b', fontWeight: '800', margin: 0 }}>
                                            <BadgePercent size={24} color="#1d4ed8" strokeWidth={2.5} /> Recommended for You
                                        </h3>
                                        <Link to="/deals-listing" style={{ color: '#2563eb', fontWeight: 'bold', fontSize: '0.95rem' }}>Explore All</Link>
                                    </div>
                                    <div className="profile-deals-grid">
                                        {recommendedDeals.map(deal => <DesignCard key={deal.id} deal={deal} />)}
                                    </div>
                                </div>

                                {/* Categories You Love */}
                                <div className="tracking-card">
                                    <div className="head flex justify-between items-center" style={{ marginBottom: '24px' }}>
                                        <h3 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '10px', color: '#1e293b', fontWeight: '800', margin: 0 }}>
                                            <Sparkles size={24} color="#f59e0b" strokeWidth={2.5} /> Categories You Love
                                        </h3>
                                        <Link to="/categories" style={{ color: '#2563eb', fontWeight: 'bold', fontSize: '0.95rem' }}>All Categories</Link>
                                    </div>
                                    <div className="profile-categories-grid">
                                        {lovedCategories.map((cat, idx) => (
                                            <CategoryCard
                                                key={idx}
                                                category={cat}
                                                onClick={() => navigate(`/category/${cat.slug}`)}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* Recently Viewed Section */}
                                <div className="tracking-card">
                                    <div className="head flex justify-between items-center" style={{ marginBottom: '24px' }}>
                                        <h3 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '10px', color: '#1e293b', fontWeight: '800', margin: 0 }}>
                                            <Store size={24} color="#3b82f6" strokeWidth={2.5} /> Recently Viewed Stores
                                        </h3>
                                    </div>
                                    <div className="profile-stores-grid">
                                        {recentStores.map((store, idx) => (
                                            <StoreCard key={idx} store={store} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'info' && (
                            <div className="profile-edit-section">
                                <div className="section-head">
                                    <h2>Personal Information</h2>
                                    <p>Update your name, contact details and other basic info.</p>
                                </div>
                                <form className="modern-form" onSubmit={handleUpdateProfile}>
                                    <div className="form-grid">
                                        <div className="input-field">
                                            <label>Full Name</label>
                                            <input
                                                type="text"
                                                value={personalInfo.name}
                                                onChange={(e) => setPersonalInfo({ ...personalInfo, name: e.target.value })}
                                            />
                                        </div>
                                        <div className="input-field">
                                            <label>Email Address</label>
                                            <input type="email" defaultValue={user?.email || 'hashni@example.com'} disabled />
                                        </div>
                                        <div className="input-field">
                                            <label>Phone Number</label>
                                            <input
                                                type="tel"
                                                value={personalInfo.phone}
                                                onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
                                            />
                                        </div>
                                        <div className="input-field">
                                            <label>Gender</label>
                                            <select
                                                value={personalInfo.gender}
                                                onChange={(e) => setPersonalInfo({ ...personalInfo, gender: e.target.value })}
                                            >
                                                <option value="male">Male</option>
                                                <option value="female">Female</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>
                                        <div className="input-field span-full">
                                            <label>Bio (Optional)</label>
                                            <textarea
                                                placeholder="Tell us something about yourself..."
                                                value={personalInfo.bio}
                                                onChange={(e) => setPersonalInfo({ ...personalInfo, bio: e.target.value })}
                                            ></textarea>
                                        </div>
                                    </div>
                                    <div className="form-buttons">
                                        <button type="submit" className="save-btn shadow-blue">Update Profile</button>
                                        <button type="button" className="cancel-btn" onClick={() => setPersonalInfo({ name: user?.name, phone: '077 123 4567', gender: 'female', bio: '' })}>Reset</button>
                                    </div>
                                </form>
                            </div>
                        )}



                        {activeTab === 'wishlist' && (
                            <div className="profile-wishlist-section">
                                <div className="section-head flex justify-between items-center">
                                    <div>
                                        <h2>My Wishlist</h2>
                                        <p>Deals you have saved for later from the platform.</p>
                                    </div>
                                    <button className="add-new-btn border-blue cursor-pointer bg-white text-blue-600 border border-blue-600" onClick={() => navigate('/wishlist')} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '8px', fontWeight: 'bold' }}>Manage Page <ChevronRight size={16}/></button>
                                </div>
                                
                                {wishlist.length === 0 ? (
                                    <div className="empty-state-box" style={{ 
                                        marginTop: '40px', 
                                        padding: '60px 40px', 
                                        borderRadius: '24px', 
                                        background: '#f8fafc', 
                                        border: '2px dashed #cbd5e1',
                                        textAlign: 'center' 
                                    }}>
                                        <div className="icon-circle" style={{ margin: '0 auto 24px', background: '#fef2f2', color: '#ef4444', width: '80px', height: '80px' }}>
                                            <Heart size={32} />
                                        </div>
                                        <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1e293b', marginBottom: '12px' }}>Your Wishlist Is Empty</h3>
                                        <p style={{ color: '#64748b', fontSize: '1.05rem', marginBottom: '32px' }}>You haven't saved any deals yet. Browse our latest offers and save your favorites!</p>
                                        <button 
                                            onClick={() => navigate('/deals')} 
                                            className="save-btn shadow-blue" 
                                            style={{ width: 'auto', padding: '16px 40px' }}
                                        >
                                            BROWSE DEALS
                                        </button>
                                    </div>
                                ) : (
                                    <div className="wishlist-grid">
                                        {wishlist.map(deal => (
                                            <DesignCard key={deal.id} deal={deal} />
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'security' && (
                            <div className="profile-security-section">
                                <div className="section-head">
                                    <h2>Security Settings</h2>
                                    <p>Manage your password and account security settings.</p>
                                </div>
                                <div className="security-content">
                                    <div className="security-card main-security">
                                        <h3 className="mb-4 font-bold flex items-center gap-2"><Shield size={18} className="text-blue-500" /> Change Password</h3>
                                        <form className="pass-form space-y-4 max-w-md" onSubmit={handlePasswordUpdate}>
                                            <div className="input-box">
                                                <label>Current Password</label>
                                                <div className="relative">
                                                    <input type={showCurrentPass ? "text" : "password"} placeholder="••••••••" required />
                                                    <button type="button" className="pass-toggle-btn" onClick={() => setShowCurrentPass(!showCurrentPass)}>
                                                        {showCurrentPass ? <Eye size={18} /> : <EyeOff size={18} />}
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="input-box">
                                                <label>New Password</label>
                                                <div className="relative">
                                                    <input type={showNewPass ? "text" : "password"} placeholder="Minimum 8 characters" required minLength={8} />
                                                    <button type="button" className="pass-toggle-btn" onClick={() => setShowNewPass(!showNewPass)}>
                                                        {showNewPass ? <Eye size={18} /> : <EyeOff size={18} />}
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="input-box">
                                                <label>Confirm New Password</label>
                                                <div className="relative">
                                                    <input type={showConfirmPass ? "text" : "password"} placeholder="Re-type new password" required />
                                                    <button type="button" className="pass-toggle-btn" onClick={() => setShowConfirmPass(!showConfirmPass)}>
                                                        {showConfirmPass ? <Eye size={18} /> : <EyeOff size={18} />}
                                                    </button>
                                                </div>
                                            </div>
                                            <button type="submit" className="update-pass-btn mt-4">Update Password</button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'notifications' && (
                            <div className="profile-notifications-section">
                                <div className="section-head">
                                    <h2>Notification Preferences</h2>
                                    <p>Select the kinds of notifications you get about activities on Hodama Deals.</p>
                                </div>
                                <div className="notify-switches-container">
                                    <div className={`switch-card ${notifications.promos ? 'active' : ''}`} onClick={() => handleToggleNotify('promos')}>
                                        <div className="switch-info">
                                            <h4>Promotional Emails</h4>
                                            <p>Stay updated on flash sales, new arrivals and limited deals.</p>
                                        </div>
                                        <div className="toggle-pill"></div>
                                    </div>
                                    <div className={`switch-card ${notifications.deals ? 'active' : ''}`} onClick={() => handleToggleNotify('deals')}>
                                        <div className="switch-info">
                                            <h4>Deals Alerts</h4>
                                            <p>Get alerted when prices drop on items in your wishlist.</p>
                                        </div>
                                        <div className="toggle-pill"></div>
                                    </div>
                                    <div className={`switch-card ${notifications.security ? 'active' : ''}`} onClick={() => handleToggleNotify('security')}>
                                        <div className="switch-info">
                                            <h4>Account Security</h4>
                                            <p>Important alerts regarding your account logins and security changes.</p>
                                        </div>
                                        <div className="toggle-pill"></div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'partner' && (
                            <div className="profile-edit-section fade-in">
                                <div className="section-head">
                                    <h2>Become a Business Partner</h2>
                                    <p>Upgrade to a Business account to start posting and managing your own deals.</p>
                                </div>

                                {/* IF ALREADY A PARTNER */}
                                {(user?.role === 'Seller' || user?.role === 'seller' || user?.role === 'Client' || user?.role === 'Business Account' || user?.role === 'Partner' || (user?.role === 'Admin')) ? (
                                    <div className="already-partner-box" style={{
                                        marginTop: '40px',
                                        padding: '40px',
                                        borderRadius: '24px',
                                        background: '#f8fafc',
                                        border: '2px dashed #cbd5e1',
                                        textAlign: 'center'
                                    }}>
                                        <div className="icon-circle" style={{ margin: '0 auto 24px', background: '#dcfce7', color: '#10b981', width: '80px', height: '80px' }}>
                                            <Store size={32} />
                                        </div>
                                        <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1e293b', marginBottom: '12px' }}>You are a Business Partner!</h3>
                                        <p style={{ color: '#64748b', fontSize: '1.05rem', marginBottom: '32px' }}>Your account is already registered as a business account. You can manage your deals and store settings from your panel.</p>
                                        <button
                                            onClick={() => navigate('/client/dashboard')}
                                            className="save-btn shadow-blue"
                                            style={{ width: 'auto', padding: '16px 40px' }}
                                        >
                                            GO TO MY BUSINESS PANEL
                                        </button>
                                    </div>
                                ) : (
                                    /* ELSE SHOW REGISTRATION FORM */
                                    <>
                                        {regMessage && (
                                            <div className={`message-banner ${regMessage.type}`} style={{
                                                padding: '15px', borderRadius: '8px', marginBottom: '20px',
                                                backgroundColor: regMessage.type === 'error' ? '#FFF5F5' : '#F0FFF4',
                                                color: regMessage.type === 'error' ? '#C53030' : '#2F855A',
                                                textAlign: 'center', fontWeight: '600'
                                            }}>
                                                {regMessage.text}
                                            </div>
                                        )}

                                        <form className="modern-form" onSubmit={handleBecomePartner}>
                                            <div className="form-grid">
                                                <div className="input-field">
                                                    <label>Business Name</label>
                                                    <input
                                                        type="text"
                                                        placeholder="Your Store/Business Name"
                                                        required
                                                        value={partnerForm.businessName}
                                                        onChange={e => setPartnerForm({ ...partnerForm, businessName: e.target.value })}
                                                    />
                                                </div>
                                                <div className="input-field">
                                                    <label>Business Category</label>
                                                    <select
                                                        required
                                                        value={partnerForm.category}
                                                        onChange={e => setPartnerForm({ ...partnerForm, category: e.target.value })}
                                                    >
                                                        <option value="" disabled>Select category</option>
                                                        <option value="salon">Salon</option>
                                                        <option value="restaurant">Restaurant</option>
                                                        <option value="hotel">Hotel</option>
                                                        <option value="electronics">Electronics</option>
                                                        <option value="healthBeauty">Health & Beauty</option>
                                                        <option value="groceries">Groceries</option>
                                                        <option value="spa">Spa</option>
                                                        <option value="fashion">Fashion</option>
                                                        <option value="other">Other Services</option>
                                                    </select>
                                                </div>
                                                <div className="input-field span-full">
                                                    <label>Website Link (Optional)</label>
                                                    <input
                                                        type="url"
                                                        placeholder="https://yourwebsite.com"
                                                        value={partnerForm.websiteLink}
                                                        onChange={e => setPartnerForm({ ...partnerForm, websiteLink: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-buttons mt-6" style={{ marginTop: '20px' }}>
                                                <button type="submit" className="save-btn shadow-blue" style={{ width: '100%', padding: '14px', fontSize: '1rem', fontWeight: "bold" }} disabled={isLoading}>
                                                    {isLoading ? 'Processing...' : 'UPGRADE TO SELLER ACCOUNT'}
                                                </button>
                                            </div>
                                        </form>
                                    </>
                                )}
                            </div>
                        )}

                        {activeTab === 'support' && (
                            <div className="profile-support-section">
                                <div className="section-head">
                                    <h2>Support Hub</h2>
                                    <p>Track your queries, tickets and get help from our expert team.</p>
                                </div>
                                <div className="profile-support-hub-wrapper">
                                    <SupportHub type="user" />
                                </div>
                            </div>
                        )}
                    </main>
                </div>
            </div>
            {/* CUSTOM ALERT MODAL */}
            <AlertModal 
                isOpen={alertModal.isOpen}
                type={alertModal.type}
                message={alertModal.message}
                title={alertModal.title}
                onConfirm={alertModal.onConfirm}
                buttonText={alertModal.buttonText}
                onClose={() => setAlertModal({ ...alertModal, isOpen: false })}
            />
        </div>
    );
};

export default Profile;
