import React, { useState, useEffect } from 'react';
import { 
    MessageSquare, 
    Clock, 
    CheckCircle2, 
    AlertCircle, 
    ChevronRight, 
    Palette,
    ArrowRight,
    Search,
    Plus,
    X,
    Send,
    HelpCircle,
    Info,
    History
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../utils/api';
import './SupportHub.css';

const SupportHub = ({ type = 'user' }) => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('tickets'); // 'tickets', 'updates'
    const [tickets, setTickets] = useState([]);
    const [designRequests, setDesignRequests] = useState([]);
    const [homeRequest, setHomeRequest] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedTicket, setSelectedTicket] = useState(null);

    const fetchHubData = async () => {
        setIsLoading(true);
        try {
            // 1. Fetch Home Request Status (Client Only)
            if (type === 'client') {
                const clientProfile = JSON.parse(localStorage.getItem('hodama_client_user_v1') || '{}');
                if (clientProfile.homeRequestStatus && clientProfile.homeRequestStatus !== 'None') {
                    setHomeRequest({
                        id: 'REQ-HOME',
                        name: 'Home Page Listing',
                        status: clientProfile.homeRequestStatus,
                        date: clientProfile.requestDate || 'Recently'
                    });
                }
            }

            // 2. Fetch Support Tickets (API)
            try {
                const res = await api.get('/support');
                if (res.data.success) {
                    setTickets(res.data.data);
                }
            } catch (err) {
                console.warn("Hub: Support API failed, using fallback/empty");
            }

            // 3. Conditional Fetches for Client specific data
            if (type === 'client') {
                const designs = JSON.parse(localStorage.getItem('hodama_banner_requests_v1') || '[]');
                const myDesigns = designs.filter(d => d.email === user?.email);
                setDesignRequests(myDesigns);
            } else {
                setDesignRequests([]);
                setHomeRequest(null);
            }

        } catch (err) {
            console.error("Hub data fetch error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchHubData();
        window.addEventListener('storage', fetchHubData);
        return () => window.removeEventListener('storage', fetchHubData);
    }, [user?.email]);

    const getStatusClass = (status) => {
        const s = status?.toLowerCase() || '';
        if (s.includes('approve') || s === 'resolved' || s === 'closed' || s === 'active') return 'status-resolved';
        if (s.includes('pending') || s.includes('design') || s === 'open' || s === 'in review') return 'status-pending';
        return 'status-other';
    };

    return (
        <div className="support-hub-container fade-in">
            <div className="hub-header">
                <div className="hub-title-section">
                    <h2>Support & Updates Hub</h2>
                    <p>Track your requests, tickets, and professional design updates in one place.</p>
                </div>
                {type === 'client' && (
                    <div className="hub-tabs">
                        <button 
                            className={activeTab === 'tickets' ? 'active' : ''} 
                            onClick={() => setActiveTab('tickets')}
                        >
                            <MessageSquare size={18} /> Support Tickets
                        </button>
                        <button 
                            className={activeTab === 'updates' ? 'active' : ''} 
                            onClick={() => setActiveTab('updates')}
                        >
                            <History size={18} /> All Updates
                        </button>
                    </div>
                )}
            </div>

            <div className="hub-content">
                {isLoading ? (
                    <div className="hub-loading">
                        <div className="spinner"></div>
                        <p>Syncing your hub data...</p>
                    </div>
                ) : (activeTab === 'tickets' || type !== 'client') ? (
                    <div className="hub-tickets-view">
                        <div className="hub-grid">
                            <div className="hub-main-col">
                                {tickets.length === 0 ? (
                                    <div className="hub-empty-state">
                                        <div className="empty-icon"><HelpCircle size={40} /></div>
                                        <h3>No Support Tickets</h3>
                                        <p>You haven't submitted any support requests yet. If you have an issue, our team is here to help.</p>
                                        <button className="hub-action-btn-primary" onClick={() => window.location.href = '/support'}>
                                            <Plus size={18} /> Create New Ticket
                                        </button>
                                    </div>
                                ) : (
                                    <div className="hub-ticket-list">
                                        {tickets.map((ticket, idx) => (
                                            <div key={idx} className="hub-ticket-card">
                                                <div className="ticket-header">
                                                    <span className="ticket-id">#{ticket._id?.substring(0, 8).toUpperCase() || 'TCK-NEW'}</span>
                                                    <span className={`ticket-status ${getStatusClass(ticket.status)}`}>
                                                        {ticket.status}
                                                    </span>
                                                </div>
                                                <h4 className="ticket-category">{ticket.category}</h4>
                                                <div className="ticket-reply-summary">
                                                    {ticket.replies && ticket.replies.length > 0 ? (
                                                        <div className={`latest-reply ${ticket.replies[ticket.replies.length - 1].sender === 'Admin' ? 'from-admin' : ''}`}>
                                                            <strong>{ticket.replies[ticket.replies.length - 1].sender}:</strong>
                                                            <p>{ticket.replies[ticket.replies.length - 1].message.substring(0, 50)}...</p>
                                                        </div>
                                                    ) : (
                                                        <p className="ticket-message">{ticket.description || ticket.message}</p>
                                                    )}
                                                </div>
                                                <div className="ticket-footer">
                                                    <span className="ticket-date">{new Date(ticket.createdAt || ticket.date).toLocaleDateString()}</span>
                                                    <button className="ticket-view-btn" onClick={() => setSelectedTicket(ticket)}>View Response <ChevronRight size={14} /></button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="hub-side-col">
                                <div className="hub-quick-contact">
                                    <h4>Direct Help</h4>
                                    <div className="contact-item">
                                        <div className="contact-icon"><AlertCircle size={20} /></div>
                                        <div className="contact-info">
                                            <span>Email Support</span>
                                            <strong>support@hodamadeals.lk</strong>
                                        </div>
                                    </div>
                                    <div className="contact-item">
                                        <div className="contact-icon"><Palette size={20} /></div>
                                        <div className="contact-info">
                                            <span>Urgent Issues</span>
                                            <strong>+94 77 123 4567</strong>
                                        </div>
                                    </div>
                                    <button className="hub-new-btn" onClick={() => window.location.href = '/support'}>
                                        <Plus size={18} /> New Request
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="hub-updates-view">
                        <div className="hub-updates-list">
                            {/* Tickets Updates for everyone */}
                            {tickets.filter(t => t.status !== 'Open').map((ticket, idx) => (
                                <div key={`t-up-${idx}`} className="hub-update-card">
                                    <div className="update-icon status-update"><MessageSquare size={24} /></div>
                                    <div className="update-body">
                                        <div className="update-header">
                                            <h4>Update on: {ticket.category}</h4>
                                            <span className={`update-status ${getStatusClass(ticket.status)}`}>{ticket.status}</span>
                                        </div>
                                        <p>{ticket.replies && ticket.replies.length > 0 ? 'An agent has replied to your request.' : 'Your support ticket status has been updated.'}</p>
                                        <div className="update-date">{new Date(ticket.createdAt || ticket.date).toLocaleDateString()}</div>
                                    </div>
                                    <div className="update-action">
                                        <button onClick={() => setSelectedTicket(ticket)}><ArrowRight size={18} /></button>
                                    </div>
                                </div>
                            ))}

                            {/* Client Specific Updates */}
                            {type === 'client' && homeRequest && (
                                <div className="hub-update-card">
                                    <div className="update-icon status-update"><AlertCircle size={24} /></div>
                                    <div className="update-body">
                                        <div className="update-header">
                                            <h4>Home Page Listing Update</h4>
                                            <span className={`update-status ${getStatusClass(homeRequest.status)}`}>{homeRequest.status}</span>
                                        </div>
                                        <p>Your request to be featured in the "Top Stores" section has updated its status.</p>
                                        <div className="update-date">{homeRequest.date}</div>
                                    </div>
                                    <div className="update-action">
                                        <button onClick={() => window.location.href = '/client/dashboard'}><ArrowRight size={18} /></button>
                                    </div>
                                </div>
                            )}

                            {type === 'client' && designRequests.map((req, idx) => (
                                <div key={`d-up-${idx}`} className="hub-update-card">
                                    <div className="update-icon design-update"><Palette size={24} /></div>
                                    <div className="update-body">
                                        <div className="update-header">
                                            <h4>Design Progress: {req.id}</h4>
                                            <span className={`update-status ${getStatusClass(req.status)}`}>{req.status}</span>
                                        </div>
                                        <p>{req.status === 'In Review' ? 'A designer has sent a draft for your review.' : `Design request is currently: ${req.status}`}</p>
                                        <div className="update-date">{req.date}</div>
                                    </div>
                                    <div className="update-action">
                                        <button onClick={() => window.location.href = '/client/design-support'}><ArrowRight size={18} /></button>
                                    </div>
                                </div>
                            ))}

                            {designRequests.length === 0 && !homeRequest && tickets.filter(t => t.status !== 'Open').length === 0 && (
                                <div className="hub-empty-state">
                                    <div className="empty-icon"><Info size={40} /></div>
                                    <h3>No Recent Updates</h3>
                                    <p>Your support ticket updates and administrative notifications will appear here.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Conversation Modal */}
            {selectedTicket && (
                <div className="hub-modal-overlay" onClick={() => setSelectedTicket(null)}>
                    <div className="hub-modal-content" onClick={e => e.stopPropagation()}>
                        <header className="hub-modal-header">
                            <div className="modal-title-wrap">
                                <span className={`modal-status-badge ${getStatusClass(selectedTicket.status)}`}>{selectedTicket.status}</span>
                                <h3>{selectedTicket.category}</h3>
                                <p>Ticket ID: #{selectedTicket._id?.substring(0, 10).toUpperCase()}</p>
                            </div>
                            <button className="modal-close-btn" onClick={() => setSelectedTicket(null)}><X size={20} /></button>
                        </header>
                        
                        <div className="hub-modal-messages">
                            <div className="msg-entry user-msg">
                                <div className="msg-meta">
                                    <strong>Original Request</strong>
                                    <span>{new Date(selectedTicket.createdAt).toLocaleString()}</span>
                                </div>
                                <p>{selectedTicket.description || selectedTicket.message}</p>
                            </div>

                            {selectedTicket.replies?.map((reply, i) => (
                                <div key={i} className={`msg-entry ${reply.sender === 'Admin' ? 'admin-msg' : 'user-msg'}`}>
                                    <div className="msg-meta">
                                        <strong>{reply.sender === 'Admin' ? 'Support Agent' : 'You'}</strong>
                                        <span>{new Date(reply.createdAt).toLocaleString()}</span>
                                    </div>
                                    <p>{reply.message}</p>
                                </div>
                            ))}
                            
                            {(!selectedTicket.replies || selectedTicket.replies.length === 0) && (
                                <div className="no-replies-yet">
                                    <Clock size={24} />
                                    <p>Our team is reviewing your request. We'll update you soon.</p>
                                </div>
                            )}
                        </div>

                        <div className="hub-modal-footer">
                             <button className="hub-action-btn-primary" onClick={() => window.location.href = '/support'}>
                                <Send size={16} /> Reply via Full Help Center
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SupportHub;
