import React from 'react';
import { Shield, Lock, Eye, Users, FileLock, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import './PrivacyPolicy.css';

const PrivacyPolicy = () => {
    return (
        <div className="pol-wrapper">
            <div className="pol-container">
                
                {/* ── HEADER ── */}
                <div className="premium-header-container">
                    <Link to="/" className="back-btn-square">
                        <div className="back-btn-circle-inner">
                            <ArrowLeft size={16} strokeWidth={3} />
                        </div>
                    </Link>
                    <div className="premium-header-content">
                        <div className="premium-header-title-row">
                            <h1 className="p-header-title"><Shield size={28} /> Privacy Policy</h1>
                            <span className="p-header-badge">LEAD PROTECTION</span>
                        </div>
                        <p className="p-header-subtitle">Your privacy is our priority. Learn how we protect and manage your personal data.</p>
                    </div>
                </div>

                <div className="pol-content-box fade-in">
                    <section className="pol-section">
                        <div className="pol-icon-row">
                            <Lock size={22} className="pol-main-icon" />
                            <h3>1. Information We Collect</h3>
                        </div>
                        <p>We collect information that you provide directly to us when you register for an account, list a deal, or contact our support team. This may include:</p>
                        <ul>
                            <li>Name, email address, and phone number.</li>
                            <li>Business details (for Partners).</li>
                            <li>Device information and IP addresses for security purposes.</li>
                        </ul>
                    </section>

                    <section className="pol-section">
                        <div className="pol-icon-row">
                            <Eye size={22} className="pol-main-icon" />
                            <h3>2. How We Use Your Information</h3>
                        </div>
                        <p>Your data helps us provide a better experience on Hodama Deals. We use it to:</p>
                        <ul>
                            <li>Verify accounts and prevent fraudulent activities.</li>
                            <li>Personalize the deals shown to you based on your interests.</li>
                            <li>Communicate important updates regarding your deals or account.</li>
                        </ul>
                    </section>

                    <section className="pol-section">
                        <div className="pol-icon-row">
                            <Users size={22} className="pol-main-icon" />
                            <h3>3. Disclosure to Third Parties</h3>
                        </div>
                        <p>We do not sell your personal data. However, we may share non-personal analytics with business partners to help them improve their offers. Personal data is only shared when required by law or to facilitate a deal redemption.</p>
                    </section>

                    <section className="pol-section">
                        <div className="pol-icon-row">
                            <FileLock size={22} className="pol-main-icon" />
                            <h3>4. Your Rights & Control</h3>
                        </div>
                        <p>You have full control over your data. You can update your profile, manage notification settings, or request account deletion at any time through your dashboard.</p>
                    </section>

                    <footer className="pol-footer-note">
                        <p>Last Updated: April 02, 2026. For further questions, contact <strong>privacy@hodamadeals.lk</strong></p>
                    </footer>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
