import React from 'react';
import { ShieldCheck, FileText, Lock, Users, AlertCircle, Info, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import './PartnerPolicies.css';

const PartnerPolicies = () => {
    return (
        <div className="pp-wrapper">
            <div className="pp-container">
                {/* ── HEADER ── */}
                <div className="premium-header-container">
                    <Link to="/" className="back-btn-square">
                        <div className="back-btn-circle-inner">
                            <ArrowLeft size={16} strokeWidth={3} />
                        </div>
                    </Link>
                    <div className="premium-header-content">
                        <div className="premium-header-title-row">
                            <h1 className="p-header-title">Partner Policies & Guidelines</h1>
                            <span className="p-header-badge">BUSINESS PARTNER PROGRAM</span>
                        </div>
                        <p className="p-header-subtitle">
                            Comprehensive guidelines to ensure a transparent, safe, and premium 
                            experience for all Hodama Deals business partners.
                        </p>
                    </div>
                </div>

                <div className="pp-grid">
                    {/* ── POLICY SECTION 1: CONTENT QUALITY ── */}
                    <section className="pp-card">
                        <div className="pp-icon-box"><ShieldCheck size={28} color="#1b3bff" /></div>
                        <h3>Deal Content & Accuracy</h3>
                        <p>All deals listed must be accurate and up-to-date. Misleading prices or images are strictly prohibited.</p>
                        <ul className="pp-list">
                            <li>Images must be of high resolution and professional quality.</li>
                            <li>Descriptions must clearly state terms and conditions of the offer.</li>
                            <li>Pricing must include all taxes unless explicitly stated otherwise.</li>
                        </ul>
                    </section>

                    {/* ── POLICY SECTION 2: ETHICAL CONDUCT ── */}
                    <section className="pp-card">
                        <div className="pp-icon-box"><Users size={28} color="#d63384" /></div>
                        <h3>Ethical Business Conduct</h3>
                        <p>Partners are expected to maintain professional integrity when interacting with customers and the platform.</p>
                        <ul className="pp-list">
                            <li>No unauthorized data collection from platform users.</li>
                            <li>Honoring all valid deals presented by customers during the promotional period.</li>
                            <li>Prompt and professional response to customer inquiries or complaints.</li>
                        </ul>
                    </section>

                    {/* ── POLICY SECTION 3: DATA PRIVACY ── */}
                    <section className="pp-card">
                        <div className="pp-icon-box"><Lock size={28} color="#0d9488" /></div>
                        <h3>Data Security & Privacy</h3>
                        <p>We prioritize the protection of both partner and customer data as per national regulations.</p>
                        <ul className="pp-list">
                            <li>Partner login credentials must remain confidential.</li>
                            <li>Transaction data is used solely for analytics and improvement purposes.</li>
                            <li>Hodama Deals does not share your business secrets with third parties.</li>
                        </ul>
                    </section>

                    {/* ── POLICY SECTION 4: COMPLIANCE ── */}
                    <section className="pp-card">
                        <div className="pp-icon-box"><AlertCircle size={28} color="#f59e0b" /></div>
                        <h3>Compliance & Discrepancies</h3>
                        <p>Guidelines for resolving issues and maintaining platform standards.</p>
                        <ul className="pp-list">
                            <li>Failure to comply may result in temporary account suspension.</li>
                            <li>Any discrepancies in deal redemption must be reported within 24 hours.</li>
                            <li>We reserve the right to remove non-compliant content without prior notice.</li>
                        </ul>
                    </section>
                </div>

                {/* ── CALL TO ACTION ── */}
                <div className="pp-infobox">
                    <div className="pp-info-icon"><Info size={24} /></div>
                    <div className="pp-info-text">
                        <h4>Need Further Clarification?</h4>
                        <p>Our partnership support team is available 24/7 to help you understand these policies better. Contact us at <strong>partners@hodamadeals.lk</strong></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PartnerPolicies;
