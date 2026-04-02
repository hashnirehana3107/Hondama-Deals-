import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Palette,
    Clock, 
    CheckCircle2, 
    XCircle, 
    Info, 
    ChevronRight,
    MessageSquare,
    X,
    UploadCloud,
    Calendar,
    Send
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import ClientSidebar from '../../components/layout/ClientSidebar';
import ClientTopbar from '../../components/layout/ClientTopbar';
import './BannerPromotions.css'; // Reusing the same CSS

const DesignSupport = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    // Form States
    const [designDetails, setDesignDetails] = useState('');
    const [designFiles, setDesignFiles] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Requests State
    const [requests, setRequests] = useState([]);

    // Chat States
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [activeChatId, setActiveChatId] = useState(null);
    const [chatText, setChatText] = useState('');

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

    const handleSendMessage = () => {
        if (!chatText.trim() || !activeChatId) return;
        
        const updated = requests.map(req => {
            if (req.id === activeChatId) {
                const newMsg = { sender: 'user', text: chatText, date: 'Just now' };
                return { 
                    ...req, 
                    history: [...(req.history || []), newMsg],
                    isReadAdmin: false, // New message for admin
                    isReadClient: true  // Client just sent/viewed it
                };
            }
            return req;
        });

        setRequests(updated);
        localStorage.setItem('hodama_banner_requests_v1', JSON.stringify(updated));
        setChatText('');
    };

    // Mark as read when chat is opened
    useEffect(() => {
        if (isChatOpen && activeChatId) {
            const updated = requests.map(req => {
                if (req.id === activeChatId) {
                    return { ...req, isReadClient: true };
                }
                return req;
            });
            setRequests(updated);
            localStorage.setItem('hodama_banner_requests_v1', JSON.stringify(updated));
        }
    }, [isChatOpen, activeChatId]);


    const handleReviewAction = (id, newStatus, feedback = null) => {
        const updated = requests.map(req => {
            if (req.id === id) {
                return { 
                    ...req, 
                    status: newStatus === 'Approved' ? 'Approved' : 'Designing', 
                    designFeedback: feedback,
                    image: newStatus === 'Approved' ? req.finalDesign : req.image
                };
            }
            return req;
        });
        localStorage.setItem('hodama_banner_requests_v1', JSON.stringify(updated));
        setRequests(updated);
        alert(newStatus === 'Approved' ? 'Design approved! It will go live during your chosen dates.' : 'Feedback sent to Design Team.');
    };

    const handleDesignSupportSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const readFilesAsBase64 = async (files) => {
            const promises = Array.from(files).map((file) => {
                return new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        resolve({ name: file.name, data: reader.result });
                    };
                    reader.readAsDataURL(file);
                });
            });
            return Promise.all(promises);
        };

        const processedAssets = designFiles.length > 0 ? await readFilesAsBase64(designFiles) : [];

        const existingTickets = JSON.parse(localStorage.getItem('hodamaAdminSupportTickets_v3') || '[]');
        const newTicket = {
            id: 'TCK' + Math.floor(1000 + Math.random() * 9000),
            user: user?.name || 'Client',
            email: user?.email || 'client@hodamadeals.lk',
            type: 'Design Team Support',
            message: designDetails,
            status: 'Open',
            date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
            attachment: designFiles.length > 0 ? `${designFiles.length} file(s)` : null,
        };
        localStorage.setItem('hodamaAdminSupportTickets_v3', JSON.stringify([newTicket, ...existingTickets]));
        
        const bannerReq = {
            id: `BR-DS-${Math.floor(1000 + Math.random() * 9000)}`,
            user: user?.name || 'Client',
            email: user?.email || 'client@hodamadeals.lk',
            type: 'Design Request (via Support)',
            description: designDetails,
            image: null,
            rawAssets: processedAssets, 
            finalDesign: null,
            designFeedback: null,
            startDate,
            endDate,
            redirectUrl: '',
            status: 'Designing',
            date: new Date().toLocaleDateString(),
            timestamp: new Date().toISOString(),
            isReadAdmin: false, // New for admin
            isReadClient: true  // Seen by client (author)
        };

        
        try {
            const updatedRequests = [bannerReq, ...requests];
            localStorage.setItem('hodama_banner_requests_v1', JSON.stringify(updatedRequests));
            setRequests(updatedRequests);
            
            setTimeout(() => {
                setIsSubmitting(false);
                setDesignDetails('');
                setDesignFiles([]);
                setStartDate('');
                setEndDate('');
                alert('Your design request has been sent! Our team will handle the rest.');
            }, 500);
        } catch (err) {
            console.error("Storage failed:", err);
            setIsSubmitting(false);
            if (err.name === 'QuotaExceededError' || err.message.includes('quota')) {
                alert("The browser storage is full. Please clear cache or select fewer files.");
            } else {
                alert("Something went wrong while saving. Please try again.");
            }
        }
    };

    const designRequests = requests.filter(req => req.type.includes('Design Request'));

    return (
        <div className="client-dashboard-wrapper">
            <ClientSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            
            <main className="dashboard-main-content">
                <ClientTopbar toggleSidebar={toggleSidebar} />
                
                <div className="dashboard-view-container mp-scroll-container">
                    <div className="mp-wrapper fade-in">
                        
                        <div className="mp-breadcrumb">
                            <span onClick={() => navigate('/client/dashboard')}>Dashboard</span>
                            <ChevronRight size={14} />
                            <span className="current">Design Support</span>
                        </div>

                        <div className="mp-page-header">
                            <div>
                                <h1><Palette size={28} /> Design Team Support</h1>
                                <p>Let our professionals create amazing banners and graphical content for your deals.</p>
                            </div>
                        </div>

                        {/* DESIGNS FOR REVIEW SECTION */}
                        {designRequests.some(r => r.status === 'In Review') && (
                            <section className="bp-review-section fade-in" style={{ marginBottom: '40px', background: '#f8fafc', padding: '30px', borderRadius: '24px', border: '1px solid #e2e8f0' }}>
                                <h2 style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '20px', color: '#1e3a8a', marginBottom: '20px' }}>
                                    <Clock size={24} style={{ color: '#3b82f6' }} /> Designs For Review
                                </h2>
                                <div className="bp-review-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '25px' }}>
                                    {designRequests.filter(r => r.status === 'In Review').map(req => (
                                        <div key={req.id} className="bp-review-card" style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
                                            <div style={{ height: '180px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <img src={req.finalDesign} alt="Design Review" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                            </div>
                                            <div style={{ padding: '20px' }}>
                                                <h4 style={{ margin: '0 0 10px 0', color: '#0f172a' }}>{req.description}</h4>
                                                <div style={{ display: 'flex', gap: '10px' }}>
                                                    <button 
                                                        onClick={() => handleReviewAction(req.id, 'Approved')}
                                                        style={{ flex: 1, padding: '10px', background: '#16a34a', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}
                                                    >
                                                        Approve Design
                                                    </button>
                                                    <button 
                                                        onClick={() => {
                                                            const fb = window.prompt("Tell us what to change:");
                                                            if (fb) handleReviewAction(req.id, 'Changes Requested', fb);
                                                        }}
                                                        style={{ flex: 1, padding: '10px', background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}
                                                    >
                                                        Request Changes
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        <div className="bp-grid">
                            {/* Request Form Section */}
                            <div className="bp-form-card">
                                <h3><MessageSquare size={20} /> Request a Design</h3>
                                <p className="bp-form-intro">Provide your details and raw assets. We will handle the rest.</p>
                                
                                <form onSubmit={handleDesignSupportSubmit}>
                                    <div className="mp-form-group">
                                        <label>Deal Details & Instructions</label>
                                        <textarea 
                                            required
                                            value={designDetails}
                                            onChange={e => setDesignDetails(e.target.value)}
                                            placeholder="Tell us about the deal, prices, and any specific preferences..."
                                            className="mp-form-input"
                                            style={{ minHeight: '120px', resize: 'vertical' }}
                                        />
                                    </div>

                                    <div className="mp-form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                                        <div className="mp-form-group" style={{ marginBottom: 0 }}>
                                            <label>Start Date</label>
                                            <input 
                                                type="date" 
                                                required
                                                value={startDate}
                                                onChange={e => setStartDate(e.target.value)}
                                                className="mp-form-input"
                                            />
                                        </div>
                                        <div className="mp-form-group" style={{ marginBottom: 0 }}>
                                            <label>End Date</label>
                                            <input 
                                                type="date" 
                                                required
                                                value={endDate}
                                                onChange={e => setEndDate(e.target.value)}
                                                className="mp-form-input"
                                            />
                                        </div>
                                    </div>

                                    <div className="mp-form-group">
                                        <label style={{ display: 'block', fontSize: '15px', fontWeight: '600', marginBottom: '10px', color: '#334155' }}>Raw Images / Logos</label>
                                        <div style={{ border: '2px dashed #cbd5e1', padding: '30px 20px', textAlign: 'center', borderRadius: '12px', backgroundColor: '#f8fafc', cursor: 'pointer' }}>
                                            <input 
                                                type="file" 
                                                multiple 
                                                onChange={e => setDesignFiles(Array.from(e.target.files))}
                                                style={{ display: 'none' }}
                                                id="raw-files-bp"
                                            />
                                            <label htmlFor="raw-files-bp" style={{ cursor: 'pointer', color: '#3b82f6', fontWeight: '600', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
                                                <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '50%', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}><UploadCloud size={32} /></div>
                                                <span>Click to browse files (Photos, Logos, Docs)</span>
                                            </label>
                                            {designFiles.length > 0 && (
                                                <div style={{ marginTop: '20px', fontSize: '15px', color: '#10b981', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                                                    <CheckCircle2 size={20} /> {designFiles.length} file(s) selected
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <button type="submit" className="bp-btn-submit" disabled={isSubmitting}>
                                        {isSubmitting ? 'Sending...' : 'Send Request to Design Team'}
                                    </button>
                                </form>
                            </div>

                            {/* Status Tracking Section */}
                            <div className="bp-status-card">
                                <h3><Clock size={20} /> Design Requests Status</h3>
                                <div className="bp-status-list">
                                    {designRequests.length === 0 && (
                                        <div className="bp-empty-state">
                                            <Info size={40} />
                                            <p>No active design requests found.</p>
                                        </div>
                                    )}
                                    {designRequests.map(req => (
                                        <div key={req.id} className="bp-request-item">
                                            <div className="bp-request-header">
                                                <span className="bp-req-id">{req.id}</span>
                                                <span className={`bp-status-badge ${req.status.toLowerCase().replace(' ', '-')}`}>
                                                    {req.status === 'Pending' && <Clock size={12} />}
                                                    {req.status === 'Approved' && <CheckCircle2 size={12} />}
                                                    {req.status === 'Rejected' && <XCircle size={12} />}
                                                    {req.status}
                                                </span>
                                            </div>
                                            <div className="bp-request-body">
                                                <div className="bp-req-type">
                                                    <Palette size={14} />
                                                    {req.type}
                                                </div>
                                                <p className="bp-req-desc">{req.description}</p>
                                                <div className="bp-req-period" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#64748b', marginBottom: '8px' }}>
                                                    <Calendar size={12} />
                                                    <span>{req.startDate} — {req.endDate}</span>
                                                </div>
                                                <span className="bp-req-date">{req.date}</span>
                                            </div>
                                            <div className="bp-req-actions" style={{ display: 'flex', gap: '10px' }}>
                                                <button 
                                                    onClick={() => { setActiveChatId(req.id); setIsChatOpen(true); }}
                                                    style={{ background: '#f1f5f9', border: 'none', padding: '10px', borderRadius: '10px', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                                    title="Chat with designers"
                                                >
                                                    <MessageSquare size={18} />
                                                </button>
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

export default DesignSupport;
