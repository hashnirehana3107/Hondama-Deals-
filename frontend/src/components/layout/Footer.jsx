import React from 'react';
import { Link } from 'react-router-dom';
import {
    Facebook,
    Twitter,
    Instagram,
    Youtube,
    Mail,
    Phone,
    MapPin,
    ChevronRight,
    Store,
    HeadphonesIcon,
    HelpCircle,
    FileText,
    ShieldCheck,
    ArrowRight,
    Megaphone,
    ClipboardList
} from 'lucide-react';
import './Footer.css';

const QUICK_LINKS = [
    { label: 'Home', to: '/' },
    { label: 'All Categories', to: '/categories' },
    { label: 'Explore Deals', to: '/deals-listing' },
    { label: 'Login', to: '/login' },
    { label: 'Register', to: '/register' },
];

const CUSTOMER_LINKS = [
    { label: 'My Account', to: '/profile' },
    { label: 'My Wishlist', to: '/profile?tab=wishlist' },
    { label: 'Explore Deals', to: '/deals-listing' },
    { label: 'Help Center / Support', to: '/support' },
];

const BUSINESS_LINKS = [
    { label: 'Register as Partner', to: '/register?role=client' },
    { label: 'Business Dashboard', to: '/client/dashboard' },
    { label: 'Manage Store', to: '/client/profile?section=store' },
    { label: 'Partner Policies', to: '/partner-policies' },
    { label: 'How to List Deals', to: '/how-to-list-deals' },
];

const Footer = () => {
    return (
        <footer className="ft-footer">

            {/* ── NEWSLETTER STRIP ── */}
            <div className="ft-newsletter">
                <div className="ft-container ft-newsletter__inner">
                    <div className="ft-newsletter__text">
                        <span className="ft-newsletter__tag"><Megaphone size={16} fill="currentColor" /> STAY UPDATED</span>
                        <h3 className="ft-newsletter__heading">Get the Best Deals Delivered to Your Inbox</h3>
                    </div>
                    <form className="ft-newsletter__form" onSubmit={(e) => e.preventDefault()}>
                        <div className="ft-newsletter__input-group">
                            <input
                                type="email"
                                className="ft-newsletter__input"
                                placeholder="Enter your email address..."
                            />
                            <button type="submit" className="ft-newsletter__btn">
                                Subscribe <ArrowRight size={18} strokeWidth={3} />
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* ── MAIN FOOTER BODY ── */}
            <div className="ft-body">
                <div className="ft-container">
                    <div className="ft-grid">

                        {/* ── Column 1: Brand & App Download ── */}
                        <div className="ft-col ft-col--brand">
                            <Link to="/" className="ft-logo-link">
                                <div className="ft-logo-circle">
                                    <img src="/logo2.png" alt="Hodama Deals" className="ft-logo" />
                                </div>
                            </Link>
                            <p className="ft-brand-desc">
                                Hodama Deals is Sri Lanka's premium deals and offers platform.
                                We connect smart shoppers with the best local deals, exclusive discounts,
                                and exciting offers across restuarants, fashion, hotels and lifestyle.
                            </p>

                            <div className="ft-download">
                                <h4 className="ft-download__title">Download App</h4>
                                <p className="ft-download__subtitle">Save $3 with App New User Only</p>
                                <div className="ft-download__wrap">
                                    <div className="ft-qr-box">
                                        <img src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=https://hodamadeals.lk" alt="QR Code" className="ft-qr" />
                                    </div>
                                    <div className="ft-app-buttons">
                                        <a href="#" className="ft-app-link">
                                            <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Google Play" className="ft-app-img" />
                                        </a>
                                        <a href="#" className="ft-app-link">
                                            <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="App Store" className="ft-app-img ft-app-img--ios" />
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* Social Icons */}
                            <div className="ft-socials">
                                <a href="#" className="ft-social-icon"><Facebook size={16} /></a>
                                <a href="#" className="ft-social-icon"><Twitter size={16} /></a>
                                <a href="#" className="ft-social-icon"><Instagram size={16} /></a>
                                <a href="#" className="ft-social-icon"><Youtube size={16} /></a>
                            </div>
                        </div>

                        {/* ── Column 2: Quick Links ── */}
                        <div className="ft-col">
                            <h3 className="ft-col-title">Quick Links</h3>
                            <div className="ft-col-divider"></div>
                            <ul className="ft-link-list">
                                {QUICK_LINKS.map(({ label, to }) => (
                                    <li key={label}>
                                        <Link to={to} className="ft-link">
                                            <ChevronRight size={14} strokeWidth={4} className="ft-link__arrow" />
                                            {label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* ── Column 3: For Customers & Business ── */}
                        <div className="ft-col">
                            <div className="ft-sub-section">
                                <h3 className="ft-col-title ft-col-title--icon">
                                    <ClipboardList size={18} className="ft-col-icon" /> For Customers
                                </h3>
                                <div className="ft-col-divider"></div>
                                <ul className="ft-link-list">
                                    {CUSTOMER_LINKS.map(({ label, to }) => (
                                        <li key={label}>
                                            <Link to={to} className="ft-link">
                                                <ChevronRight size={14} strokeWidth={4} className="ft-link__arrow" />
                                                {label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="ft-sub-section ft-sub-section--mt">
                                <h3 className="ft-col-title ft-col-title--icon">
                                    <Store size={18} className="ft-col-icon" /> For Business
                                </h3>
                                <div className="ft-col-divider"></div>
                                <ul className="ft-link-list">
                                    {BUSINESS_LINKS.map(({ label, to }) => (
                                        <li key={label}>
                                            <Link to={to} className="ft-link">
                                                <ChevronRight size={14} strokeWidth={4} className="ft-link__arrow" />
                                                {label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* ── Column 4: Support & Contact ── */}
                        <div className="ft-col">
                            <h3 className="ft-col-title ft-col-title--icon">
                                <HeadphonesIcon size={18} className="ft-col-icon" /> Support & Contact
                            </h3>
                            <div className="ft-col-divider"></div>
                            <ul className="ft-link-list ft-link-list--mb">
                                <li className="ft-support-item">
                                    <Link to="/support" className="ft-link">
                                        <HelpCircle size={15} className="ft-support-icon" /> CustomerSupport
                                    </Link>
                                </li>
                                <li className="ft-support-item">
                                    <Link to="/privacy" className="ft-link">
                                        <ShieldCheck size={15} className="ft-support-icon" /> Privacy Policy
                                    </Link>
                                </li>
                                <li className="ft-support-item">
                                    <Link to="/terms" className="ft-link">
                                        <FileText size={15} className="ft-support-icon" /> Terms & Conditions
                                    </Link>
                                </li>
                            </ul>

                            {/* Contact details */}
                            <div className="ft-contact-box">
                                <div className="ft-contact-item">
                                    <span className="ft-contact-item__icon"><Mail size={16} /></span>
                                    <span>support@hodamadeals.lk</span>
                                </div>
                                <div className="ft-contact-item">
                                    <span className="ft-contact-item__icon"><Phone size={16} /></span>
                                    <span>+94111234567</span>
                                </div>
                                <div className="ft-contact-item">
                                    <span className="ft-contact-item__icon"><MapPin size={16} /></span>
                                    <span>124 Kandy Road, Colombo 03, Sri Lanka</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* ── COPYRIGHT BAR ── */}
            <div className="ft-copyright">
                <div className="ft-container ft-copyright__inner">
                    <p className="ft-copyright__text">
                        &copy; 2026 <span className="ft-copyright__brand">Hodama Deals</span> All Rights Reserved.
                    </p>
                    <div className="ft-copyright__links">
                        <Link to="/privacy" className="ft-copyright__link">Privacy Policy</Link>
                        <span className="ft-copyright__pipe">|</span>
                        <Link to="/terms" className="ft-copyright__link">Terms & Conditions</Link>
                    </div>
                </div>
            </div>

        </footer>
    );
};

export default Footer;

