import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Heart,
    Search,
    User,
    ChevronDown,
    Menu,
    X,
    LayoutDashboard,
    Store,
    LogOut,
    HeadphonesIcon,
    Tag,
    Smartphone,
    Shirt,
    Home,
    MessageSquare,
    ShoppingBag,
    Car,
    Dumbbell,
    Baby,
    Laptop,
    ChevronRight,
    Globe,
    Sparkles,
    Languages,
    Check,
    Scissors,
    Utensils,
    Hotel,
    ShoppingCart,
    Flame,
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext.jsx';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useWishlist } from '../../contexts/WishlistContext.jsx';
import './Header.css';

// --- MOCK COUNTS ---
const WISHLIST_COUNT = 5;

// Language config
const LANGUAGES = [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'si', label: 'Sinhala', native: 'සිංහල' },
];

const SpaIcon = ({ size = 24, className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        {/* Right leaf (solid) */}
        <path d="M12 11c0-3 2-4 4-5 2 0 3.5 1.5 2.5 3.5-1 2.5-4 3-6.5 1.5z" fill="currentColor" stroke="none" />
        {/* Center stem */}
        <path d="M12 11c0-3.5 1-5 2-7" />
        {/* Left leaf (outline) */}
        <path d="M10 10C7.5 10.5 5.5 9.5 5.5 7.5S7 4.5 9 4.5c0 2.5 0.5 4 1 5.5z" />

        {/* Hand */}
        <path d="M3 21h2.5v-4.5c0-1.5 1-2.5 2.5-2.5s2 1 3 1.5l3.5 1.5 6-2c1-.5 2 0 2 1.5s-1.5 2.5-3 3.5L11.5 21H3z" />
        {/* Inner palm line */}
        <path d="M15 15l-3.5-1.5" />
    </svg>
);

const Header = () => {
    const navigate = useNavigate();
    const { language, setLanguage, t } = useLanguage();
    const { user, logout } = useAuth();
    const { wishlist } = useWishlist();

    const [searchQuery, setSearchQuery] = useState('');
    const [isCatDropdownOpen, setIsCatDropdownOpen] = useState(false);
    const [activeCategory, setActiveCategory] = useState(null);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMobileCatOpen, setIsMobileCatOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    const catRef = useRef(null);
    const profileRef = useRef(null);
    const langRef = useRef(null);

    const currentLang = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];

    // Categories — translated
    const CATEGORIES = [
        {
            key: 'salon',
            icon: Scissors,
            path: '/category/salon'
        },
        {
            key: 'restaurant',
            icon: Utensils,
            path: '/category/restaurant'
        },
        {
            key: 'hotel',
            icon: Hotel,
            path: '/category/hotel'
        },
        {
            key: 'electronics',
            icon: Smartphone,
            path: '/category/electronics'
        },
        {
            key: 'healthBeauty',
            icon: Sparkles,
            path: '/category/health-beauty'
        },
        {
            key: 'groceries',
            icon: ShoppingCart,
            path: '/category/groceries'
        },
        {
            key: 'spa',
            icon: SpaIcon,
            path: '/category/spa'
        },
        {
            key: 'fashion',
            icon: Shirt,
            path: '/category/fashion'
        }
    ];

    // Sticky scroll shadow
    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close dropdowns on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (catRef.current && !catRef.current.contains(e.target)) setIsCatDropdownOpen(false);
            if (profileRef.current && !profileRef.current.contains(e.target)) setIsProfileDropdownOpen(false);
            if (langRef.current && !langRef.current.contains(e.target)) setIsLangDropdownOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isMobileMenuOpen]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/deals-listing?search=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    const handleLangSelect = (code) => {
        setLanguage(code);
        setIsLangDropdownOpen(false);
    };

    const handleLogout = () => {
        logout();
        setIsProfileDropdownOpen(false);
        setIsMobileMenuOpen(false);
        navigate('/login');
    };

    return (
        <>
            <header className={`hd-header${isScrolled ? ' hd-header--scrolled' : ''}`}>

                {/* ── LEVEL 1 · TOP INFO BAR ── */}
                <div className="hd-topbar">
                    <div className="hd-container">
                        <div className="hd-topbar__left">
                            <Link to="/deals" className="hd-topbar__link">
                                <Store size={15} />
                                Deal on Hondama Deals
                            </Link>
                            <span className="hd-topbar__divider" />
                            <span className="hd-topbar__text">
                                Sign Up to receive a discount today
                            </span>
                        </div>
                        <div className="hd-topbar__right">
                            <Link to="/support" className="hd-topbar__link">
                                <HeadphonesIcon size={15} />
                                Customer Support
                            </Link>
                            <span className="hd-topbar__divider" />
                            {user ? (
                                <span className="hd-topbar__link hd-topbar__link--highlight">
                                    {t('hiUser', user.name)}
                                </span>
                            ) : (
                                <>
                                    <Link to="/login" className="hd-topbar__link hd-topbar__link--highlight">Login</Link>
                                    <span className="hd-topbar__divider" />
                                    <Link to="/register" className="hd-topbar__link hd-topbar__link--highlight">Register</Link>
                                </>
                            )}

                            {/* ── LANGUAGE SELECTOR ── */}
                            <span className="hd-topbar__divider" />
                            <div className="hd-lang" ref={langRef}>
                                <button
                                    className="hd-lang__trigger hd-topbar__link"
                                    onClick={() => setIsLangDropdownOpen((v) => !v)}
                                    aria-expanded={isLangDropdownOpen}
                                    aria-label="Select language"
                                >
                                    <Globe size={15} />
                                    <span className="hd-lang__current">
                                        English
                                    </span>
                                    <ChevronDown
                                        size={13}
                                        className={`hd-chevron${isLangDropdownOpen ? ' hd-chevron--open' : ''}`}
                                    />
                                </button>

                                {isLangDropdownOpen && (
                                    <div className="hd-lang__dropdown">
                                        {LANGUAGES.map((lang) => (
                                            <button
                                                key={lang.code}
                                                className={`hd-lang__option${language === lang.code ? ' hd-lang__option--active' : ''}`}
                                                onClick={() => handleLangSelect(lang.code)}
                                            >
                                                <Languages size={14} className="hd-lang__flag-icon" />
                                                <span className="hd-lang__name">{lang.native}</span>
                                                {language === lang.code && (
                                                    <span className="hd-lang__check"><Check size={12} /></span>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── LEVEL 2 · MAIN NAVBAR ── */}
                <div className="hd-mainbar">
                    <div className="hd-container hd-mainbar__inner">

                        {/* Mobile: Hamburger */}
                        <button
                            className="hd-hamburger"
                            onClick={() => setIsMobileMenuOpen(true)}
                            aria-label="Open menu"
                        >
                            <Menu size={24} />
                        </button>

                        {/* Logo */}
                        <Link to="/" className="hd-logo">
                            <img src="/logo.png" alt="Hodama Deals" className="hd-logo__img" />
                        </Link>

                        {/* Categories Dropdown */}
                        <div className="hd-categories" ref={catRef}>
                            <button
                                className="hd-categories__btn"
                                onClick={() => setIsCatDropdownOpen((v) => !v)}
                                aria-expanded={isCatDropdownOpen}
                            >
                                <Menu size={20} strokeWidth={3} />
                                <span>Categories</span>
                                <ChevronDown size={18} strokeWidth={3} className={`hd-chevron${isCatDropdownOpen ? ' hd-chevron--open' : ''}`} />
                            </button>

                            {isCatDropdownOpen && (
                                <div className="hd-cat-dropdown-mega" onMouseLeave={() => setActiveCategory(null)}>
                                    <div className="hd-cat-menu-main">
                                        {CATEGORIES.map((cat) => {
                                            const Icon = cat.icon;
                                            return (
                                                <div
                                                    key={cat.key}
                                                    className={`hd-cat-dropdown__item ${activeCategory === cat.key ? 'active' : ''} ${cat.isHot ? 'is-hot' : ''}`}
                                                    onMouseEnter={() => setActiveCategory(cat.key)}
                                                    onClick={() => {
                                                        setIsCatDropdownOpen(false);
                                                        setActiveCategory(null);
                                                        navigate(cat.path);
                                                    }}
                                                >
                                                    <Icon size={16} className="hd-cat-dropdown__icon" />
                                                    <span>{t(cat.key).charAt(0).toUpperCase() + t(cat.key).slice(1)}</span>
                                                    {(cat.sub?.length > 0 || cat.subGroups?.length > 0) && <ChevronRight size={14} className="mega-arrow" />}
                                                </div>
                                            );
                                        })}
                                    </div>
                                    {/* Subcategories Panel */}
                                    {activeCategory && CATEGORIES.find(c => c.key === activeCategory) && (
                                        (CATEGORIES.find(c => c.key === activeCategory).subGroups?.length > 0) ? (
                                            <div className="hd-cat-menu-sub">
                                                <h4 className="mega-sub-title">{t(activeCategory)}</h4>
                                                <div className="mega-sub-multi">
                                                    {CATEGORIES.find(c => c.key === activeCategory).subGroups.map((group, gIdx) => (
                                                        <div key={`group-${gIdx}`} className="mega-sub-column">
                                                            {group.title && (
                                                                <span className="mega-sub-group-title">{group.title}</span>
                                                            )}
                                                            <ul>
                                                                {group.items.map((sub, idx) => (
                                                                    <li key={idx}>
                                                                        <Link
                                                                            to={sub.path}
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                setIsCatDropdownOpen(false);
                                                                                setActiveCategory(null);
                                                                            }}
                                                                        >
                                                                            {sub.name}
                                                                        </Link>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ) : (
                                            CATEGORIES.find(c => c.key === activeCategory).sub?.length > 0 && (
                                                <div className="hd-cat-menu-sub">
                                                    <h4 className="mega-sub-title">{t(activeCategory)}</h4>
                                                    <ul>
                                                        {CATEGORIES.find(c => c.key === activeCategory).sub.map((sub, idx) => (
                                                            <li key={idx}>
                                                                <Link
                                                                    to={sub.path}
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setIsCatDropdownOpen(false);
                                                                        setActiveCategory(null);
                                                                    }}
                                                                >
                                                                    {sub.name}
                                                                </Link>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )
                                        )
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Search Bar */}
                        <form className="hd-search" onSubmit={handleSearch}>
                            <input
                                type="text"
                                className="hd-search__input"
                                placeholder="Search for deals, salons, restaurants..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button type="submit" className="hd-search__btn" aria-label="Search">
                                <Search size={24} />
                            </button>
                        </form>

                        {/* Right Actions */}
                        <div className="hd-actions">

                            {/* Wishlist */}
                            <Link to="/wishlist" className="hd-action-icon" aria-label={t('wishlist')}>
                                <div className="hd-action-icon-wrapper">
                                    <Heart size={26} strokeWidth={1.5} />
                                    <span className="hd-badge">{wishlist.length}</span>
                                </div>
                                <span className="hd-action-label">Wishlist</span>
                            </Link>


                            {/* Profile / Login Register Solid */}
                            {user ? (
                                <div className="hd-profile" ref={profileRef}>
                                    <button
                                        className="hd-login-register-btn hd-profile__trigger"
                                        onClick={() => setIsProfileDropdownOpen((v) => !v)}
                                        aria-expanded={isProfileDropdownOpen}
                                    >
                                        <User size={20} fill="currentColor" />
                                        <span>Account</span>
                                        <ChevronDown size={16} className={`hd-chevron${isProfileDropdownOpen ? ' hd-chevron--open' : ''}`} />
                                    </button>
                                    {isProfileDropdownOpen && (
                                        <div className="hd-profile-dropdown">
                                            <div className="hd-profile-dropdown__header">
                                                <span className="hd-profile-dropdown__name">{user.name}</span>
                                                <span className="hd-profile-dropdown__role">
                                                    {(!user || user.role === 'User' || user.role === 'Buyer' || user.role === 'user' || user.role === 'buyer') 
                                                        ? 'USER ACCOUNT' 
                                                        : (user.role === 'Client' || user.role === 'Seller' || user.role === 'seller' || user.role === 'Business Account' || user.role === 'Partner' 
                                                            ? 'BUSINESS ACCOUNT' 
                                                            : user.role.toUpperCase())}
                                                </span>
                                            </div>
                                            {/* Business Panel - Visible to all business roles */}
                                            {(user.role === 'Business Account' || user.role === 'Client' || user.role === 'Seller' || user.role === 'Partner' || user.role === 'seller') && (
                                                <Link to="/client/dashboard" className="hd-profile-dropdown__item" onClick={() => setIsProfileDropdownOpen(false)}>
                                                    <Store size={15} /> My Business Panel
                                                </Link>
                                            )}

                                            {/* My Profile - Visible to regular users AND upgraded partners (Sellers/Partners) */}
                                            {(!user.role || user.role === 'User' || user.role === 'Buyer' || user.role === 'user' || user.role === 'buyer' || user.role === 'Seller' || user.role === 'Partner' || user.role === 'seller') && (
                                                <Link to="/profile" className="hd-profile-dropdown__item" onClick={() => setIsProfileDropdownOpen(false)}>
                                                    <User size={15} /> My Profile
                                                </Link>
                                            )}

                                            {/* Admin Panel */}
                                            {user.role === 'Admin' && (
                                                <Link to="/admin/dashboard" className="hd-profile-dropdown__item" onClick={() => setIsProfileDropdownOpen(false)}>
                                                    <Store size={15} /> Admin Panel
                                                </Link>
                                            )}

                                            {/* Store Settings - Visible to business roles */}
                                            {(user.role === 'Business Account' || user.role === 'Client' || user.role === 'Seller' || user.role === 'Partner' || user.role === 'seller') && (
                                                <Link to="/client/profile" className="hd-profile-dropdown__item" onClick={() => setIsProfileDropdownOpen(false)}>
                                                    <User size={15} /> Store Settings
                                                </Link>
                                            )}
                                            <div className="hd-profile-dropdown__divider" />
                                            <button className="hd-profile-dropdown__item hd-profile-dropdown__item--danger" onClick={handleLogout}>
                                                <LogOut size={15} /> {t('logout')}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <Link to="/login" className="hd-login-register-btn">
                                    <User size={20} />
                                    <span>Login/ Register</span>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* ── MOBILE SIDEBAR OVERLAY ── */}
            {isMobileMenuOpen && (
                <div className="hd-overlay" onClick={() => setIsMobileMenuOpen(false)} />
            )}
            <aside className={`hd-sidebar${isMobileMenuOpen ? ' hd-sidebar--open' : ''}`}>
                <div className="hd-sidebar__header">
                    <img src="/logo2.png" alt="Hodama Deals" className="hd-sidebar__logo" />
                    <button className="hd-sidebar__close" onClick={() => setIsMobileMenuOpen(false)} aria-label="Close menu">
                        <X size={22} />
                    </button>
                </div>



                {/* Mobile Profile / Auth */}
                <div className="hd-sidebar__section hd-sidebar__section--auth">
                    {user ? (
                        <div className="hd-sidebar__profile-info hd-sidebar__profile-info--highlighted">
                            <div className="hd-avatar">
                                <User size={20} />
                            </div>
                            <div>
                                <div className="hd-sidebar__profile-name">{user.name}</div>
                            <div className="hd-sidebar__profile-role">
                                {(!user || user.role === 'User' || user.role === 'Buyer' || user.role === 'user' || user.role === 'buyer') 
                                    ? 'USER ACCOUNT' 
                                    : (user.role === 'Client' || user.role === 'Seller' || user.role === 'seller' || user.role === 'Business Account' || user.role === 'Partner' 
                                        ? 'BUSINESS ACCOUNT' 
                                        : user.role.toUpperCase())}
                            </div>
                            </div>
                        </div>
                    ) : (
                        <div className="hd-sidebar__auth">
                            <Link to="/login" className="hd-sidebar__auth-btn hd-sidebar__auth-btn--primary" onClick={() => setIsMobileMenuOpen(false)}>{t('login')}</Link>
                            <Link to="/register" className="hd-sidebar__auth-btn hd-sidebar__auth-btn--outline" onClick={() => setIsMobileMenuOpen(false)}>{t('register')}</Link>
                        </div>
                    )}
                </div>

                {/* Mobile Language Selector */}
                <div className="hd-sidebar__section">
                    <div className="hd-sidebar__section-title hd-sidebar__section-title--static">
                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Globe size={14} /> Language / භාෂාව
                        </span>
                    </div>
                    <div className="hd-sidebar__section-content">
                        <div className="hd-sidebar__lang-row">
                            {LANGUAGES.map((lang) => (
                                <button
                                    key={lang.code}
                                    className={`hd-sidebar__lang-btn${language === lang.code ? ' hd-sidebar__lang-btn--active' : ''}`}
                                    onClick={() => { setLanguage(lang.code); }}
                                >
                                    <Languages size={15} />
                                    <span>{lang.native}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Mobile Categories */}
                <div className="hd-sidebar__section">
                    <button
                        className="hd-sidebar__section-title"
                        onClick={() => setIsMobileCatOpen((v) => !v)}
                    >
                        <span>{t('categories')}</span>
                        <ChevronDown size={16} className={`hd-chevron${isMobileCatOpen ? ' hd-chevron--open' : ''}`} />
                    </button>
                    {isMobileCatOpen && (
                        <div className="hd-sidebar__cat-list">
                            {CATEGORIES.map((cat) => {
                                const Icon = cat.icon;
                                return (
                                    <Link key={cat.key} to={cat.path} className="hd-sidebar__cat-item" onClick={() => setIsMobileMenuOpen(false)}>
                                        <Icon size={16} />
                                        {t(cat.key).charAt(0).toUpperCase() + t(cat.key).slice(1)}
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Mobile Quick Links */}
                <div className="hd-sidebar__section">
                    <div className="hd-sidebar__section-title hd-sidebar__section-title--static">{t('quickLinks')}</div>

                    <Link to="/register?role=client" className="hd-sidebar__nav-link" onClick={() => setIsMobileMenuOpen(false)}><Store size={15} /> Create Business Account</Link>
                    <Link to="/support" className="hd-sidebar__nav-link" onClick={() => setIsMobileMenuOpen(false)}><HeadphonesIcon size={15} /> {t('customerSupport')}</Link>
                    {user && (
                        <>
                            {/* Mobile Dashboard Links */}
                            {(user.role === 'Business Account' || user.role === 'Client' || user.role === 'Seller' || user.role === 'Partner' || user.role === 'seller') && (
                                <Link to="/client/dashboard" className="hd-sidebar__nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                                    <Store size={15} /> My Business Panel
                                </Link>
                            )}

                            {(!user.role || user.role === 'User' || user.role === 'Buyer' || user.role === 'user' || user.role === 'buyer' || user.role === 'Seller' || user.role === 'Partner' || user.role === 'seller') && (
                                <Link to="/profile" className="hd-sidebar__nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                                    <User size={15} /> My Profile
                                </Link>
                            )}

                            {(user.role === 'Business Account' || user.role === 'Client' || user.role === 'Seller' || user.role === 'Partner' || user.role === 'seller') && (
                                <Link to="/client/profile" className="hd-sidebar__nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                                    <User size={15} /> Store Settings
                                </Link>
                            )}

                            {user.role === 'Admin' && (
                                <Link to="/admin/dashboard" className="hd-sidebar__nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                                    <Store size={15} /> Admin Panel
                                </Link>
                            )}
                            <button className="hd-sidebar__nav-link hd-sidebar__nav-link--danger" onClick={handleLogout}><LogOut size={15} /> {t('logout')}</button>
                        </>
                    )}
                </div>
            </aside>

            {/* Spacer so content doesn't hide under sticky header */}
            <div className="hd-header-spacer" />
        </>
    );
};

export default Header;

