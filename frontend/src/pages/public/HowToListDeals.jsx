import React from 'react';
import { UserPlus, LayoutDashboard, PlusCircle, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import './HowToListDeals.css';

const HowToListDeals = () => {
    const steps = [
        {
            icon: <UserPlus size={32} color="#1b3bff" />,
            title: "Join the Network",
            desc: "Register as a Business Partner and create your store profile with verified business details."
        },
        {
            icon: <LayoutDashboard size={32} color="#d63384" />,
            title: "Access Dashboard",
            desc: "Log in to your dedicated Partner Dashboard to manage your store, deals, and analytics."
        },
        {
            icon: <PlusCircle size={32} color="#0d1f8b" />,
            title: "Create Your Deal",
            desc: "Fill in deal details including high-quality images, original price, discounted price, and offer terms."
        },
        {
            icon: <CheckCircle size={32} color="#10b981" />,
            title: "Go Live & Grow",
            desc: "Once submitted, your deal will be live for thousands of shoppers. Track performance and optimize your sales."
        }
    ];

    return (
        <div className="hld-wrapper">
            <div className="hld-container">
                {/* ── HERO SECTION ── */}
                <div className="premium-header-container">
                    <Link to="/" className="back-btn-square">
                        <div className="back-btn-circle-inner">
                            <ArrowLeft size={16} strokeWidth={3} />
                        </div>
                    </Link>
                    <div className="premium-header-content">
                        <div className="premium-header-title-row">
                            <h1 className="p-header-title">How to List Deals</h1>
                            <span className="p-header-badge">STEP-BY-STEP GUIDE</span>
                        </div>
                        <p className="p-header-subtitle">
                           Grow your business with Hodama Deals. Follow our simple process to start listing your exclusive offers today.
                        </p>
                    </div>
                </div>

                {/* ── STEPS GRID ── */}
                <div className="hld-steps-grid">
                    {steps.map((step, index) => (
                        <div key={index} className="hld-step-card">
                            <div className="hld-step-number">{index + 1}</div>
                            <div className="hld-step-icon">{step.icon}</div>
                            <h3>{step.title}</h3>
                            <p>{step.desc}</p>
                        </div>
                    ))}
                </div>

                {/* ── WHY JOIN SECTION ── */}
                <div className="hld-features-box">
                    <div className="hld-features-header">
                        <h2>Why Partner with Us?</h2>
                        <p>Join Sri Lanka's fastest-growing deals platform and experience the difference.</p>
                    </div>
                    <div className="hld-features-list">
                        <div className="hld-feature">
                            <div className="hld-dot"></div>
                            <div>
                                <strong>Massive Reach</strong>
                                <p>Get visibility in front of active shoppers looking for the best local offers.</p>
                            </div>
                        </div>
                        <div className="hld-feature">
                            <div className="hld-dot"></div>
                            <div>
                                <strong>Real-time Analytics</strong>
                                <p>Track how many people viewed and redeemed your deals instantly.</p>
                            </div>
                        </div>
                        <div className="hld-feature">
                            <div className="hld-dot"></div>
                            <div>
                                <strong>Zero Upfront Costs</strong>
                                <p>Listing your business is completely free. We grow only when you grow.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── CTA SECTION ── */}
                <div className="hld-cta-strip">
                    <h3>Ready to take your sales to the next level?</h3>
                    <Link to="/register?role=client" className="hld-main-btn">
                        Get Started Now <ArrowRight size={20} />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default HowToListDeals;
