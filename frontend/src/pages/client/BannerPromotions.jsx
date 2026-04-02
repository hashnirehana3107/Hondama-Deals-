import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Image as ImageIcon, 
    Upload, 
    Send, 
    Clock, 
    CheckCircle2, 
    XCircle, 
    Info, 
    ChevronRight,
    LayoutDashboard,
    Plus,
    Palette,
    MessageSquare,
    X,
    UploadCloud,
    Calendar
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import ClientSidebar from '../../components/layout/ClientSidebar';
import ClientTopbar from '../../components/layout/ClientTopbar';
import './BannerPromotions.css';

const BannerPromotions = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    // Form States
    const [description, setDescription] = useState('');
    const [bannerImage, setBannerImage] = useState(null);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [redirectUrl, setRedirectUrl] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Requests State
    const [requests, setRequests] = useState([]);

    // Chat States
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [activeChatId, setActiveChatId] = useState(null);
    const [chatText, setChatText] = useState('');

    const handleSendMessage = () => {
        if (!chatText.trim() || !activeChatId) return;
        
        const updated = requests.map(req => {
            if (req.id === activeChatId) {
                const newMsg = { sender: 'user', text: chatText, date: 'Just now' };
                return { ...req, history: [...(req.history || []), newMsg] };
            }
            return req;
        });

        setRequests(updated);
        localStorage.setItem('hodama_banner_requests_v1', JSON.stringify(updated));
        setChatText('');
    };

    const handleReviewAction = (id, newStatus, feedback = null) => {
        const updated = requests.map(req => {
            if (req.id === id) {
                return { 
                    ...req, 
                    status: newStatus === 'Approved' ? 'Approved' : 'Designing', 
                    designFeedback: feedback,
                    // If approved, move final design to real image
                    image: newStatus === 'Approved' ? req.finalDesign : req.image
                };
            }
            return req;
        });
        localStorage.setItem('hodama_banner_requests_v1', JSON.stringify(updated));
        setRequests(updated);
        alert(newStatus === 'Approved' ? 'Design approved! It will go live during your chosen dates.' : 'Feedback sent to Design Team.');
    };

    useEffect(() => {
        const fetchRequests = () => {
            const stored = JSON.parse(localStorage.getItem('hodama_banner_requests_v1') || '[]');
            setRequests(stored);
        };
        fetchRequests();

        const handleStorage = (e) => {
            if (e.key === 'hodama_banner_requests_v1') {
                fetchRequests();
            }
        };

        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, []);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Check file size (e.g. 1MB limit for localStorage safety)
            if (file.size > 1024 * 1024) {
                alert("File is too large! Please upload an image smaller than 1MB for database stability.");
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setBannerImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        if (!description || !startDate || !endDate || !bannerImage) {
            alert("Please fill in all required fields and upload an image.");
            setIsSubmitting(false);
            return;
        }

        const newRequest = {
            id: `BR${Math.floor(1000 + Math.random() * 9000)}`,
            user: user?.name || 'Client',
            email: user?.email || 'client@hodamadeals.lk',
            type: 'Banner Submission',
            description,
            image: bannerImage,
            finalDesign: null,
            designFeedback: null,
            startDate,
            endDate,
            redirectUrl,
            status: 'Pending',
            date: new Date().toLocaleDateString(),
            timestamp: new Date().toISOString()
        };

        // Cleanup old/expired requests to save space before adding new one
        const now = new Date();
        const cleanedRequests = requests.filter(req => {
            if (req.endDate) {
                const end = new Date(req.endDate);
                end.setHours(23, 59, 59, 999);
                return now <= end; // Keep if not expired
            }
            return true;
        });

        const updatedRequests = [newRequest, ...cleanedRequests];
        
        try {
            localStorage.setItem('hodama_banner_requests_v1', JSON.stringify(updatedRequests));
            
            // Mock delay
            setTimeout(() => {
                setRequests(updatedRequests);
                setIsSubmitting(false);
                setDescription('');
                setBannerImage(null);
                setStartDate('');
                setEndDate('');
                setRedirectUrl('');
                alert('Request submitted successfully! Admin will review it soon.');
            }, 1000);
        } catch (err) {
            console.error("Storage failed:", err);
            setIsSubmitting(false);
            if (err.name === 'QuotaExceededError' || err.message.includes('quota')) {
                alert("The browser storage is full (5MB Limit). Some of your older or large banner images might be taking up too much space. Please clear your site cache or upload much smaller images.");
            } else {
                alert("Something went wrong while saving. Please try again.");
            }
        }
    };

    return (
        <div className="client-dashboard-wrapper">
            <ClientSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            
            <main className="dashboard-main-content">
                <ClientTopbar toggleSidebar={toggleSidebar} />
                
                <div className="dashboard-view-container mp-scroll-container">
                    <div className="mp-wrapper fade-in">
                        
                        {/* Breadcrumb */}
                        <div className="mp-breadcrumb">
                            <span onClick={() => navigate('/client/dashboard')}>Dashboard</span>
                            <ChevronRight size={14} />
                            <span className="current">Banner Promotions</span>
                        </div>

                        {/* Page Header */}
                        <div className="mp-page-header">
                            <div>
                                <h1><ImageIcon size={28} /> Banner Promotions</h1>
                                <p>Boost your visibility by placing professional banners on our homepage.</p>
                            </div>
                        </div>

                        <div className="bp-grid">
                            {/* Form Section */}
                            <div className="bp-form-card">
                                <h3><Plus size={20} /> Submit Your Banner</h3>
                                <p className="bp-form-intro">Upload your pre-designed banner here to be featured on our homepage Carousel.</p>
                                <form onSubmit={handleSubmit}>
                                    <div className="mp-form-group">
                                        <label>Banner Title / Placement Note</label>
                                        <input 
                                            type="text"
                                            className="mp-form-input"
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            placeholder="e.g. Summer Sale Banner - Top Carousel"
                                        />
                                    </div>

                                    <div className="mp-form-group">
                                        <label>Redirect URL (Optional)</label>
                                        <input 
                                            type="text"
                                            className="mp-form-input"
                                            value={redirectUrl}
                                            onChange={(e) => setRedirectUrl(e.target.value)}
                                            placeholder="e.g. /category/fashion or a deal ID"
                                        />
                                    </div>

                                    <div className="mp-form-group">
                                        <label>Upload Banner Image</label>
                                        <div className="bp-upload-box" onClick={() => document.getElementById('banner-input').click()}>
                                            {bannerImage ? (
                                                <img src={bannerImage} alt="Preview" className="bp-preview" />
                                            ) : (
                                                <div className="bp-upload-placeholder">
                                                    <ImageIcon size={40} />
                                                    <span>Click to upload banner</span>
                                                    <small>Recommended size: 1200 x 400px (PNG, JPG)</small>
                                                </div>
                                            )}
                                            <input 
                                                id="banner-input"
                                                type="file" 
                                                hidden 
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                            />
                                        </div>
                                    </div>

                                    <div className="mp-form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                                        <div className="mp-form-group" style={{ marginBottom: 0 }}>
                                            <label>Start Date</label>
                                            <input 
                                                type="date"
                                                className="mp-form-input"
                                                value={startDate}
                                                onChange={(e) => setStartDate(e.target.value)}
                                            />
                                        </div>
                                        <div className="mp-form-group" style={{ marginBottom: 0 }}>
                                            <label>End Date</label>
                                            <input 
                                                type="date"
                                                className="mp-form-input"
                                                value={endDate}
                                                onChange={(e) => setEndDate(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <button type="submit" className="bp-btn-submit" disabled={isSubmitting}>
                                        {isSubmitting ? 'Submitting...' : <><Send size={18} /> Submit Banner for Review</>}
                                    </button>
                                </form>
                            </div>

                            {/* Status Tracking Section */}
                            <div className="bp-status-card">
                                <h3><Clock size={20} /> Promotion Status</h3>
                                <div className="bp-status-list">
                                    {requests.filter(req => req.type?.toLowerCase().includes('banner')).length === 0 && (
                                        <div className="bp-empty-state">
                                            <Info size={40} />
                                            <p>No active banner promotion requests found.</p>
                                        </div>
                                    )}
                                    {requests.filter(req => req.type?.toLowerCase().includes('banner')).map(req => (
                                        <div key={req.id} className="bp-request-item">
                                            <div className="bp-request-header">
                                                <span className="bp-req-id">{req.id}</span>
                                                <span className={`bp-status-badge ${req.status.toLowerCase()}`}>
                                                    {req.status === 'Pending' && <Clock size={12} />}
                                                    {req.status === 'Approved' && <CheckCircle2 size={12} />}
                                                    {req.status === 'Rejected' && <XCircle size={12} />}
                                                    {req.status}
                                                </span>
                                            </div>
                                            <div className="bp-request-body">
                                                <div className="bp-req-type">
                                                    <Upload size={14} />
                                                    {req.type}
                                                </div>
                                                <p className="bp-req-desc">{req.description}</p>
                                                <div className="bp-req-period" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#64748b', marginBottom: '8px' }}>
                                                    <Calendar size={12} />
                                                    <span>{req.startDate} — {req.endDate}</span>
                                                </div>
                                                <span className="bp-req-date">{req.date}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </main>

            {/* Chat Modal */}
            {isChatOpen && activeChatId && (
                <div className="ap-modal-overlay" onClick={() => setIsChatOpen(false)} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(15,23,42,0.6)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center', backdropFilter: 'blur(8px)' }}>
                    <div className="ap-modal-content" onClick={e => e.stopPropagation()} style={{ backgroundColor: 'white', borderRadius: '24px', width: '600px', maxWidth: '95%', height: '600px', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
                        <header style={{ padding: '20px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ backgroundColor: '#eff6ff', padding: '8px', borderRadius: '8px', color: '#2563eb' }}><MessageSquare size={20} /></div>
                                <div>
                                    <h4 style={{ margin: 0, fontSize: '16px', color: '#0f172a' }}>Chat with Design Team</h4>
                                    <span style={{ fontSize: '12px', color: '#64748b' }}>Request ID: {activeChatId}</span>
                                </div>
                            </div>
                            <button onClick={() => setIsChatOpen(false)} style={{ background: '#f1f5f9', border: 'none', cursor: 'pointer', padding: '8px', borderRadius: '50%', color: '#64748b' }}><X size={18} /></button>
                        </header>

                        <div style={{ flex: 1, padding: '20px', overflowY: 'auto', backgroundColor: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <div className="chat-welcome" style={{ textAlign: 'center', padding: '20px', color: '#64748b', fontSize: '14px' }}>
                                <p>You can discuss your banner design, colors, and layout directly with our designers here.</p>
                            </div>
                            
                            {requests.find(r => r.id === activeChatId)?.history?.map((msg, i) => (
                                <div key={i} style={{ 
                                    alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                                    backgroundColor: msg.sender === 'user' ? '#2563eb' : 'white',
                                    color: msg.sender === 'user' ? 'white' : '#0f172a',
                                    padding: '12px 16px',
                                    borderRadius: msg.sender === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                                    maxWidth: '80%',
                                    boxShadow: msg.sender === 'user' ? 'none' : '0 2px 4px rgba(0,0,0,0.05)'
                                }}>
                                    <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.5' }}>{msg.text}</p>
                                    <small style={{ fontSize: '10px', display: 'block', marginTop: '4px', opacity: 0.8 }}>{msg.date}</small>
                                </div>
                            ))}
                        </div>

                        <div style={{ padding: '20px', borderTop: '1px solid #f1f5f9', display: 'flex', gap: '12px' }}>
                            <input 
                                type="text"
                                value={chatText}
                                onChange={e => setChatText(e.target.value)}
                                onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
                                placeholder="Type your reply to designers..."
                                style={{ flex: 1, padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '14px' }}
                            />
                            <button 
                                onClick={handleSendMessage}
                                style={{ backgroundColor: '#2563eb', color: 'white', border: 'none', padding: '0 20px', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600' }}
                            >
                                <Send size={18} />
                                Send
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BannerPromotions;
