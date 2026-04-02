import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../utils/api';
import {
    ChevronRight,
    Headphones,
    Package,
    RefreshCw,
    MessageSquare,
    AlertTriangle,
    Search,
    Mail,
    Phone,
    HelpCircle,
    ShoppingBag,
    History,
    FileText,
    Upload,
    CheckCircle,
    Plus,
    X,
    MessageCircle,
    CreditCard,
    ArrowRight,
    Store,
    User,
    ArrowLeft,
    Clock,
    Send,
    Tag,
    Truck
} from 'lucide-react';
import axios from 'axios';
import './CustomerSupport.css';
import SupportHub from '../../components/common/SupportHub';


const CustomerSupport = () => {
    const navigate = useNavigate();
    const { user, loading: authLoading } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        category: 'Deal Inquiry',
        dealId: '',
        message: ''
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef(null);

    const [supportTickets, setSupportTickets] = useState([]);

    // Pre-fill user data when logged in
    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                name: user.name || '',
                email: user.email || ''
            }));
        }
    }, [user]);



    const validateForm = () => {
        const errors = {};
        if (!formData.name.trim()) errors.name = "Full name is required";
        if (!formData.email.trim()) {
            errors.email = "Email address is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            errors.email = "Please enter a valid email address";
        }
        if (!formData.message.trim() || formData.message.length < 10) {
            errors.message = "Please describe your issue (min 10 characters)";
        }
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const triggerFileSelect = () => {
        fileInputRef.current.click();
    };

    const removeFile = (e) => {
        e.stopPropagation();
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            const res = await api.post('/support', {
                fullName: formData.name,
                email: formData.email,
                category: formData.category,
                dealId: formData.dealId,
                description: formData.message,
                attachments: selectedFile ? [selectedFile.name] : [] 
            });

            if (res.data.success) {
                setFormSubmitted(true);
                // Keep the name/email if user is still logged in
                setFormData(prev => ({ ...prev, message: '', dealId: '' }));
                setSelectedFile(null);
                setFormErrors({});
                
                fetchUserTickets();
                
                setTimeout(() => {
                    setFormSubmitted(false);
                }, 5000);
            }
        } catch (err) {
            console.error("Support Submission Error:", err);
            alert(err.response?.data?.message || "Something went wrong while submitting your request.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const getStatusClass = (status) => {
        if (status === 'Open') return 'pending';
        if (status === 'In Progress') return 'progress';
        if (status === 'Resolved' || status === 'Closed') return 'resolved';
        return 'pending';
    };

    const quickHelpCards = [
        { title: "Deal Inquiries", desc: "Ask about specific deals or offers", icon: <Tag size={32} /> },
        { title: "Partnership", desc: "List your business on Hodama Deals", icon: <Store size={32} /> },
        { title: "Account Support", desc: "Login or registration help", icon: <User size={32} /> },
        { title: "Report a Problem", desc: "Report incorrect or expired deals", icon: <AlertTriangle size={32} /> }
    ];

    const faqItems = [
        {
            q: "How can I use a deal?",
            a: "Simply find a deal you like, click on it, and show the offer page or code to the merchant at the physical store location."
        },
        {
            q: "How do I list my business?",
            a: "Click on 'Become a Partner' button in the register page. Fill in your business details and our team will verify your account."
        },
        {
            q: "Is it free for businesses?",
            a: "We offer a 6-month free introductory period for all new partners. After that, a flexible monthly subscription applies."
        },
        {
            q: "What if a deal is in-accurate?",
            a: "Please use the 'Report a Problem' option in the support form and provide the Deal ID. We will investigate and update it immediately."
        }
    ];

    return (
        <div className="csp-page-wrapper">
            <div className="csp-container">
                <div className="premium-header-container">
                    <Link to="/" className="back-btn-square">
                        <div className="back-btn-circle-inner">
                            <ArrowLeft size={16} strokeWidth={3} />
                        </div>
                    </Link>
                    <div className="premium-header-content">
                        <div className="premium-header-title-row">
                            <h1 className="p-header-title"><Headphones size={28} /> Customer Support</h1>
                            <span className="p-header-badge">HELP CENTER</span>
                        </div>
                        <p className="p-header-subtitle">Need help? Our support team is here to assist you.</p>
                    </div>
                </div>

                {/* 3. Quick Help Cards Section */}
                <section className="csp-quick-help-section">
                    <div className="csp-quick-help-grid">
                        {quickHelpCards.map((card, idx) => (
                            <div key={idx} className="csp-help-card" onClick={() => document.getElementById('csp-support-form').scrollIntoView({ behavior: 'smooth' })}>
                                <div className="csp-card-icon">{card.icon}</div>
                                <h3 className="csp-card-title">{card.title}</h3>
                                <p className="csp-card-desc">{card.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 4. Search Help Section */}
                <section className="csp-search-section">
                    <div className="csp-search-bar">
                        <input
                            type="text"
                            placeholder="Search help topics..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button className="csp-search-btn">Search</button>
                    </div>
                </section>

                {/* 5. Contact Support Form Section */}
                <section className="csp-form-section" id="csp-support-form">
                    <div className="csp-section-header">
                        <h2 className="csp-section-title">Submit a Support Request</h2>
                    </div>
                    <div className="csp-form-card">
                        {formSubmitted ? (
                            <div className="csp-success-message">
                                <CheckCircle size={48} style={{ marginBottom: '16px' }} />
                                <p>Your request has been submitted.</p>
                                <p style={{ fontSize: '0.9rem', fontWeight: '500' }}>Our support team will contact you soon.</p>
                            </div>
                        ) : (
                            <form className="csp-form-grid" onSubmit={handleFormSubmit}>
                                <div className="csp-form-group">
                                    <label>Full Name</label>
                                    <input
                                        type="text"
                                        placeholder="Enter your name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        readOnly={!!user}
                                        style={{ 
                                            borderColor: formErrors.name ? '#e11d48' : '',
                                            backgroundColor: !!user ? '#f8fafc' : 'white',
                                            cursor: !!user ? 'not-allowed' : 'text'
                                        }}
                                    />
                                    {formErrors.name && <span className="csp-form-error">{formErrors.name}</span>}
                                </div>
                                <div className="csp-form-group">
                                    <label>Email Address</label>
                                    <input
                                        type="email"
                                        placeholder="Enter your email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        readOnly={!!user}
                                        style={{ 
                                            borderColor: formErrors.email ? '#e11d48' : '',
                                            backgroundColor: !!user ? '#f8fafc' : 'white',
                                            cursor: !!user ? 'not-allowed' : 'text'
                                        }}
                                    />
                                    {formErrors.email && <span className="csp-form-error">{formErrors.email}</span>}
                                </div>
                                <div className="csp-form-group">
                                    <label>Issue Category</label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    >
                                        <option>Deal Inquiry</option>
                                        <option>Partnership</option>
                                        <option>Account Support</option>
                                        <option>Report a Problem</option>
                                        <option>Other</option>
                                    </select>
                                </div>
                                <div className="csp-form-group">
                                    <label>Deal ID (Optional)</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. DEAL1234"
                                        value={formData.dealId}
                                        onChange={(e) => setFormData({ ...formData, dealId: e.target.value })}
                                    />
                                </div>
                                <div className="csp-form-group csp-span-2">
                                    <label>How can we help?</label>
                                    <textarea
                                        placeholder="Describe your issue in detail..."
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        style={{ borderColor: formErrors.message ? '#e11d48' : '' }}
                                    ></textarea>
                                    {formErrors.message && <span className="csp-form-error">{formErrors.message}</span>}
                                </div>
                                <div className="csp-form-group csp-span-2">
                                    <label>Attachments (Optional)</label>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        style={{ display: 'none' }}
                                        accept="image/*,.pdf,.doc,.docx"
                                    />
                                    <div className="csp-file-trigger" onClick={triggerFileSelect}>
                                        {selectedFile ? (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', justifyContent: 'center' }}>
                                                <FileText size={24} color="#143ae6" />
                                                <div style={{ textAlign: 'left' }}>
                                                    <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: '700', color: '#1e293b' }}>{selectedFile.name}</p>
                                                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>{(selectedFile.size / 1024).toFixed(1)} KB</p>
                                                </div>
                                                <button
                                                    onClick={removeFile}
                                                    style={{ marginLeft: 'auto', background: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        ) : (
                                            <>
                                                <Upload size={24} color="#64748b" />
                                                <span>Click to upload image or screenshot</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <div className="csp-span-2">
                                    <button type="submit" className="csp-submit-btn">Submit Request</button>
                                </div>
                            </form>
                        )}
                    </div>
                </section>
                




                {/* 7. Contact Options Section */}
                <section className="csp-contact-options">
                    <div className="csp-contact-card">
                        <div className="csp-contact-icon"><Mail size={24} /></div>
                        <div className="csp-contact-info">
                            <p>Email Support</p>
                            <h4>support@hodamadeals.lk</h4>
                        </div>
                    </div>
                    <div className="csp-contact-card">
                        <div className="csp-contact-icon"><Phone size={24} /></div>
                        <div className="csp-contact-info">
                            <p>Phone Support</p>
                            <h4>+94 77 123 4567</h4>
                        </div>
                    </div>
                    <div className="csp-contact-card">
                        <div className="csp-contact-icon"><MessageCircle size={24} /></div>
                        <div className="csp-contact-info">
                            <p>Live Chat</p>
                            <h4>Start Live Chat</h4>
                        </div>
                    </div>
                </section>

                {/* 8. FAQ Section */}
                <section className="csp-faq-section">
                    <div className="csp-section-header">
                        <h2 className="csp-section-title">Frequently Asked Questions</h2>
                    </div>
                    <div className="csp-faq-list">
                        {faqItems.map((item, idx) => (
                            <details key={idx} className="csp-faq-item">
                                <summary className="csp-faq-summary">
                                    {item.q}
                                    <ChevronRight size={20} strokeWidth={3} className="csp-faq-arrow" />
                                </summary>
                                <div className="csp-faq-content">
                                    <p>{item.a}</p>
                                </div>
                            </details>
                        ))}
                    </div>
                </section>

                {/* 9. Help Links Section */}
                <section className="csp-links-section">
                    <div className="csp-links-grid">
                        <Link to="/deals-listing" className="csp-link-item">
                            <History size={24} />
                            <span>Browse Deals</span>
                        </Link>
                        <Link to="/register?role=client" className="csp-link-item">
                            <Store size={24} />
                            <span>Partner With Us</span>
                        </Link>
                        <Link to="/messages" className="csp-link-item">
                            <MessageSquare size={24} />
                            <span>Inbound Inquiries</span>
                        </Link>
                        <Link to="/profile" className="csp-link-item">
                            <User size={24} />
                            <span>Account Settings</span>
                        </Link>
                    </div>
                </section>


            </div>
        </div>
    );
};

export default CustomerSupport;
