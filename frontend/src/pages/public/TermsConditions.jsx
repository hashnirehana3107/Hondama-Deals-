import React from 'react';
import { FileText, Scale, AlertCircle, ShoppingBag, Store, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import './TermsConditions.css';

const TermsConditions = () => {
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
                            <h1 className="p-header-title"><FileText size={28} /> Terms & Conditions</h1>
                            <span className="p-header-badge">PLATFORM RULES</span>
                        </div>
                        <p className="p-header-subtitle">Guidelines for using our platform as a customer or business partner.</p>
                    </div>
                </div>

                <div className="pol-content-box fade-in">
                    <section className="pol-section">
                        <div className="pol-icon-row">
                            <Scale size={22} className="pol-main-icon" />
                            <h3>1. Acceptance of Terms</h3>
                        </div>
                        <p>By accessing or using Hodama Deals, you agree to comply with and be bound by these legal terms. If you do not agree, please refrain from using our services.</p>
                    </section>

                    <section className="pol-section">
                        <div className="pol-icon-row">
                            <ShoppingBag size={22} className="pol-main-icon" />
                            <h3>2. Customer Usage</h3>
                        </div>
                        <p>Customers can browse and redeem deals for free. You agree to provide accurate information when registering and not to exploit any system vulnerabilities for unauthorized offers.</p>
                    </section>

                    <section className="pol-section">
                        <div className="pol-icon-row">
                            <Store size={22} className="pol-main-icon" />
                            <h3>3. Business Partnership</h3>
                        </div>
                        <p>Partners are responsible for the accuracy of their listed deals. Hodama Deals reserves the right to remove any content that is misleading or violates our quality standards without prior notice.</p>
                    </section>

                    <section className="pol-section">
                        <div className="pol-icon-row">
                            <AlertCircle size={22} className="pol-main-icon" />
                            <h3>4. Limitation of Liability</h3>
                        </div>
                        <p>Hodama Deals is a connector between businesses and customers. We are not liable for any disputes regarding the actual products or services redeemed at merchant locations.</p>
                    </section>

                    <footer className="pol-footer-note">
                        <p>Last Updated: April 02, 2026. For further questions, contact <strong>legal@hodamadeals.lk</strong></p>
                    </footer>
                </div>
            </div>
        </div>
    );
};

export default TermsConditions;
