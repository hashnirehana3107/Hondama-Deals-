import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
    LifeBuoy,
    Clock,
    CheckCircle,
    AlertCircle,
    Search,
    Filter,
    Eye,
    MessageSquare,
    XCircle,
    ChevronLeft,
    ChevronRight,
    User,
    Mail,
    Phone,
    FileText,
    Paperclip,
    Send,
    ArrowLeft,
    MoreVertical,
    Activity,
    RefreshCw,
    Trash2
} from 'lucide-react';

import api from '../../utils/api';
import './ManageSupport.css';



const ManageSupport = () => {
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [activeModal, setActiveModal] = useState(null); // 'view', 'message', 'close'
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const location = useLocation();
    const [typeFilter, setTypeFilter] = useState('All Issue Types');
    const [replyText, setReplyText] = useState('');

    const [tickets, setTickets] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchAllTickets = async () => {
        try {
            setIsLoading(true);
            setError(null);
            console.log("Fetching all tickets for admin...");
            const res = await api.get('/support/admin/all');
            console.log("Admin tickets received:", res.data);
            if (res.data.success) {
                setTickets(res.data.data);
            }
        } catch (err) {
            console.error("Fetch All Tickets Error:", err);
            const msg = err.response?.data?.message || "Failed to load support tickets. Do you have admin permissions?";
            setError(msg);
        } finally {
            setIsLoading(false);
        }
    };


    useEffect(() => {
        fetchAllTickets();
    }, []);

    const stats = {
        total: tickets.length,
        open: tickets.filter(t => t.status === 'Open').length,
        inProgress: tickets.filter(t => t.status === 'In Progress').length,
        resolved: tickets.filter(t => t.status === 'Resolved').length
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            const res = await api.put(`/support/${id}/status`, {
                status: newStatus
            });

            if (res.data.success) {
                setTickets(tickets.map(t => (t._id === id || t.id === id) ? { ...t, status: newStatus } : t));
                if (selectedTicket && (selectedTicket.id === id || selectedTicket._id === id)) {
                    setSelectedTicket({ ...selectedTicket, status: newStatus });
                }
            }
        } catch (err) {
            console.error("Status Update Error:", err);
            alert("Failed to update status.");
        }
    };

    const handleSendReply = async () => {
        if (!replyText.trim() || !selectedTicket) return;

        const ticketId = selectedTicket._id || selectedTicket.id;

        try {
            const res = await api.post(`/support/${ticketId}/reply`, {
                message: replyText
            });

            if (res.data.success) {
                const updatedTicket = res.data.data;
                setTickets(tickets.map(t => (t._id === ticketId || t.id === ticketId) ? updatedTicket : t));
                setSelectedTicket(updatedTicket);
                setReplyText('');
            }
        } catch (err) {
            console.error("Reply Error:", err);
            alert("Failed to send reply.");
        }
    };

    const confirmCloseTicket = () => {
        const ticketId = selectedTicket._id || selectedTicket.id;
        handleStatusChange(ticketId, 'Closed');
        setActiveModal(null);
    };

    const handleDeleteTicket = async () => {
        if (!selectedTicket) return;
        const ticketId = selectedTicket._id || selectedTicket.id;

        try {
            const res = await api.delete(`/support/${ticketId}`);
            if (res.data.success) {
                setTickets(tickets.filter(t => (t._id !== ticketId && t.id !== ticketId)));
                setActiveModal(null);
                setSelectedTicket(null);
            }
        } catch (err) {
            console.error("Delete Ticket Error:", err);
            alert("Failed to delete ticket. Please try again.");
        }
    };

    const resetFilters = () => {
        setSearchQuery('');
        setStatusFilter('All');
        setTypeFilter('All Issue Types');
    };

    return (
        <div className="amsup-page-wrapper">
            {/* 1. Page Header */}
            <div className="amsup-header">
                <div className="amsup-header-left">
                    <h1 className="amsup-title">Customer Support</h1>
                    <p className="amsup-subtitle">Manage customer issues, resolve disputes and track support tickets</p>
                </div>
                <div className="amsup-header-right">
                    <button className="amsup-refresh-btn" onClick={fetchAllTickets} disabled={isLoading}>
                        <RefreshCw size={18} className={isLoading ? "animate-spin" : ""} />
                        Refresh List
                    </button>
                    <div className="amsup-mini-counts">
                        <div className="amsup-mc-item"><span>Open Requests</span><strong className="text-yellow">{stats.open}</strong></div>
                        {/* <div className="amsup-mc-item"><span>Resolved Today</span><strong>12</strong></div> */}
                    </div>
                </div>
            </div>

            {error && (
                <div className="amsup-error-banner" style={{ 
                    backgroundColor: '#fee2e2', 
                    color: '#b91c1c', 
                    padding: '15px', 
                    borderRadius: '8px', 
                    marginBottom: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontWeight: 600
                }}>
                    <AlertCircle size={20} />
                    {error}
                </div>
            )}


            {/* 2. Summary Cards */}
            <div className="amsup-summary-grid">
                <div className="amsup-stat-card adlay-shadow">
                    <div className="amsup-stat-icon bg-blue"><LifeBuoy size={24} /></div>
                    <div className="amsup-stat-content">
                        <span className="amsup-stat-value">{stats.total}</span>
                        <span className="amsup-stat-label">Total Tickets</span>
                    </div>
                </div>
                <div className="amsup-stat-card adlay-shadow">
                    <div className="amsup-stat-icon bg-yellow"><AlertCircle size={24} /></div>
                    <div className="amsup-stat-content">
                        <span className="amsup-stat-value">{stats.open}</span>
                        <span className="amsup-stat-label">Open Tickets</span>
                    </div>
                </div>
                <div className="amsup-stat-card adlay-shadow">
                    <div className="amsup-stat-icon bg-cyan"><Activity size={24} /></div>
                    <div className="amsup-stat-content">
                        <span className="amsup-stat-value">{stats.inProgress}</span>
                        <span className="amsup-stat-label">In Progress</span>
                    </div>
                </div>
                <div className="amsup-stat-card adlay-shadow">
                    <div className="amsup-stat-icon bg-green"><CheckCircle size={24} /></div>
                    <div className="amsup-stat-content">
                        <span className="amsup-stat-value">{stats.resolved}</span>
                        <span className="amsup-stat-label">Resolved</span>
                    </div>
                </div>
            </div>

            {/* 3 & 4. Search & Filters */}
            <div className="amsup-controls-card adlay-shadow">
                <div className="amsup-search-box">
                    <Search size={20} />
                    <input
                        type="text"
                        placeholder="Search by Ticket ID, user, email or issue..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="amsup-filters">
                    <div className="amsup-filter-item">
                        <Filter size={18} />
                        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                            <option value="All">All Status</option>
                            <option value="Open">Open</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Resolved">Resolved</option>
                            <option value="Closed">Closed</option>
                        </select>
                    </div>
                    <div className="amsup-filter-item">
                        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
                            <option value="All Issue Types">All Issue Types</option>
                            <option value="Deal Inquiry">Deal Inquiry</option>
                            <option value="Partnership">Partnership</option>
                            <option value="Account Support">Account Support</option>
                            <option value="Report a Problem">Report a Problem</option>
                            <option value="Other">Other</option>

                        </select>
                    </div>
                    {(searchQuery || statusFilter !== 'All' || typeFilter !== 'All Issue Types') && (
                        <button className="amsup-btn-reset" onClick={resetFilters}>
                            <XCircle size={16} /> Reset
                        </button>
                    )}
                </div>
            </div>

            {/* 5. Support Tickets Table */}
            <div className="amsup-table-card adlay-shadow">
                <div className="amsup-table-container">
                    <table className="amsup-table">
                        <thead>
                            <tr>
                                <th>Ticket ID</th>
                                <th>User Info</th>
                                <th>Issue Type</th>
                                <th>Message Snippet</th>
                                <th>Status</th>
                                <th>Date</th>
                                <th className="text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tickets
                                .filter(t => (statusFilter === 'All' || t.status === statusFilter))
                                .filter(t => (typeFilter === 'All Issue Types' || t.category === typeFilter))
                                .filter(t =>
                                    t._id.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
                                    t.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                    t.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                    t.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                    t.description.toLowerCase().includes(searchQuery.toLowerCase())
                                )

                                .map((ticket) => (
                                    <tr key={ticket._id}>
                                        <td className="amsup-td-id">{ticket._id.substring(0, 8).toUpperCase()}</td>
                                        <td>
                                            <div className="amsup-user-cell">
                                                <span className="amsup-u-name">{ticket.fullName}</span>
                                                <span className="amsup-u-email">{ticket.email}</span>
                                            </div>
                                        </td>
                                        <td><span className="amsup-type-tag">{ticket.category}</span></td>
                                        <td><p className="amsup-msg-snippet">{ticket.description.substring(0, 40)}...</p></td>
                                        <td>
                                            <span className={`amsup-status-pill ${ticket.status.toLowerCase().replace(' ', '-')}`}>
                                                {ticket.status}
                                            </span>
                                        </td>
                                        <td>{new Date(ticket.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                                        <td className="text-right">
                                            <div className="amsup-table-actions">
                                                <button className="amsup-btn-icon" onClick={() => { setSelectedTicket(ticket); setActiveModal('view'); }} title="View Details">
                                                    <Eye size={18} />
                                                </button>
                                                <button className="amsup-btn-icon reply" onClick={() => { setSelectedTicket(ticket); setActiveModal('message'); }} title="Send Email Reply">
                                                    <Mail size={18} />
                                                </button>

                                                {ticket.status !== 'Closed' && (
                                                    <button className="amsup-btn-icon close" onClick={() => { setSelectedTicket(ticket); setActiveModal('close'); }} title="Close Ticket">
                                                        <XCircle size={18} />
                                                    </button>
                                                )}

                                                <button className="amsup-btn-icon delete" onClick={() => { setSelectedTicket(ticket); setActiveModal('delete'); }} title="Delete Permanently" style={{ color: '#ef4444' }}>
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                        </tbody>
                    </table>
                </div>

                {/* 9. Pagination */}
                <div className="amsup-pagination">
                    <span className="amsup-pager-info">Showing 1–{tickets.length} of {stats.total} tickets</span>
                    <div className="amsup-pager-controls">
                        <button className="amsup-pager-nav disabled"><ChevronLeft size={18} /></button>
                        <button className="amsup-pager-num active">1</button>
                        <button className="amsup-pager-num">2</button>
                        <button className="amsup-pager-nav"><ChevronRight size={18} /></button>
                    </div>
                </div>
            </div>

            {/* Modals Container */}
            {activeModal === 'view' && selectedTicket && (
                <div className="amsup-modal-overlay" onClick={() => setActiveModal(null)}>
                    <div className="amsup-modal-content view-only" onClick={e => e.stopPropagation()}>
                        <header className="amsup-modal-header">
                            <h3 className="amsup-card-title m-0"><User size={20} /> Ticket Details</h3>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <div className="amsup-status-updater">
                                    <select
                                        value={selectedTicket.status}
                                        onChange={(e) => handleStatusChange(selectedTicket._id || selectedTicket.id, e.target.value)}
                                        className={`amsup-status-select ${selectedTicket.status.toLowerCase().replace(' ', '-')}`}
                                    >
                                        <option value="Open">Open</option>
                                        <option value="In Progress">In Progress</option>
                                        <option value="Resolved">Resolved</option>
                                        <option value="Closed">Closed</option>
                                    </select>

                                </div>
                                <button className="amsup-close-btn" onClick={() => setActiveModal(null)}><XCircle size={20} /></button>
                            </div>
                        </header>
                        <div className="amsup-modal-body">
                            <div className="amsup-profile-info mb-4">
                                <div className="amsup-p-item">
                                    <User size={18} />
                                    <div className="amsup-pi-text"><span>Full Name</span><strong>{selectedTicket.fullName}</strong></div>
                                </div>
                                <div className="amsup-p-item">
                                    <Mail size={18} />
                                    <div className="amsup-pi-text"><span>Email Address</span><strong>{selectedTicket.email}</strong></div>
                                </div>
                                <div className="amsup-p-item">
                                    <Phone size={18} />
                                    <div className="amsup-pi-text"><span>Phone Number</span><strong>{selectedTicket.phone || 'N/A'}</strong></div>
                                </div>
                            </div>
                            <div className="amsup-issue-summary mt-4 pt-4" style={{ borderTop: '1px solid #e2e8f0' }}>
                                <div className="amsup-is-row"><span>Ticket ID:</span><strong>{selectedTicket._id}</strong></div>
                                <div className="amsup-is-row"><span>Category:</span><strong>{selectedTicket.category}</strong></div>
                                <div className="amsup-is-row"><span>Status:</span>
                                    <strong className={`amsup-status-pill ${selectedTicket.status.toLowerCase().replace(' ', '-')}`}>
                                        {selectedTicket.status}
                                    </strong>
                                </div>
                            </div>
                             <div className="amsup-issue-desc mt-4">
                                <strong>Description:</strong>
                                <p>{selectedTicket.description}</p>
                            </div>

                            
                            {selectedTicket.attachment && (
                                <div className="amsup-attachment-box mt-3">
                                    <Paperclip size={18} />
                                    <span>{selectedTicket.attachment}</span>
                                    <button className="amsup-btn-link">Download</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {activeModal === 'message' && selectedTicket && (
                <div className="amsup-modal-overlay" onClick={() => setActiveModal(null)}>
                    <div className="amsup-modal-content message-only" onClick={e => e.stopPropagation()} style={{ borderRadius: '20px', overflow: 'hidden', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
                        <header className="amsup-modal-header" style={{ background: 'linear-gradient(to right, #0056D2, #003e9c)', padding: '20px 25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: '10px', borderRadius: '12px' }}>
                                    <Mail size={22} color="#ffffff" />
                                </div>
                                <h3 className="amsup-card-title m-0" style={{ color: '#ffffff', fontSize: '18px', fontWeight: '700' }}>Compose Email Response</h3>
                            </div>
                            <button className="amsup-close-btn" onClick={() => setActiveModal(null)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', color: 'white', padding: '8px' }}>
                                <XCircle size={24} />
                            </button>
                        </header>
                        <div className="amsup-modal-body" style={{ display: 'flex', flexDirection: 'column', height: '640px', padding: '0', backgroundColor: '#fdfdfd' }}>
                            <div className="amsup-email-meta" style={{ padding: '25px', backgroundColor: '#ffffff', borderBottom: '1px solid #f1f5f9' }}>
                                <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: '12px' }}>
                                    <span style={{ width: '70px', color: '#94a3b8', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase' }}>To:</span>
                                    <div style={{ padding: '6px 12px', backgroundColor: '#eff6ff', borderRadius: '8px', border: '1px solid #dbeafe', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <div style={{ width: '24px', height: '24px', backgroundColor: '#0056D2', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', fontSize: '10px', fontWeight: 'bold' }}>{selectedTicket.fullName.charAt(0)}</div>
                                        <strong style={{ color: '#1e40af', fontSize: '14px' }}>{selectedTicket.fullName} <span style={{ opacity: 0.6, fontWeight: '400' }}>&lt;{selectedTicket.email}&gt;</span></strong>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'baseline' }}>
                                    <span style={{ width: '70px', color: '#94a3b8', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase' }}>Subject:</span>
                                    <strong style={{ color: '#1e293b', fontSize: '15px' }}>Re: Support Request - <span style={{ color: '#0056D2' }}>{selectedTicket.category}</span></strong>
                                </div>
                            </div>
                            
                            <div className="amsup-chat-history" style={{ flex: '1', backgroundColor: '#f8fafc', padding: '25px', overflowY: 'auto' }}>
                                <div style={{ textAlign: 'center', marginBottom: '25px' }}>
                                    <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', backgroundColor: '#ffffff', padding: '4px 12px', borderRadius: '20px', border: '1px solid #e2e8f0' }}>Message History</span>
                                </div>
                                <div className="amsup-msg-bubble user" style={{ backgroundColor: '#ffffff', borderRadius: '15px', padding: '18px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', maxWidth: '90%', marginBottom: '20px' }}>
                                    <div className="amsup-msg-meta" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
                                        <strong style={{ color: '#0f172a' }}>{selectedTicket.fullName}</strong>
                                        <span style={{ color: '#94a3b8', fontSize: '12px' }}>{new Date(selectedTicket.createdAt).toLocaleString()}</span>
                                    </div>
                                    <p style={{ color: '#475569', lineHeight: '1.6', margin: '0' }}>{selectedTicket.description}</p>
                                </div>

                                {selectedTicket.replies && selectedTicket.replies.map((msg, index) => (
                                    <div key={index} className={`amsup-msg-bubble ${msg.sender === 'Admin' ? 'admin' : 'user'}`}>
                                        <div className="amsup-msg-meta">
                                            <strong>{msg.sender === 'Admin' ? 'Support Team' : selectedTicket.fullName}</strong>
                                            <span>{new Date(msg.createdAt).toLocaleString()}</span>
                                        </div>
                                        <p>{msg.message}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="amsup-reply-section mt-auto" style={{ padding: '25px', backgroundColor: '#ffffff', borderTop: '2px solid #0056D2' }}>
                                <textarea
                                    placeholder="Type your professional reply here..."
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    style={{ border: 'none', backgroundColor: 'transparent', width: '100%', minHeight: '120px', padding: '0', fontSize: '15px', color: '#1e293b', resize: 'none' }}
                                ></textarea>
                                <div className="amsup-reply-actions" style={{ marginTop: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', gap: '15px' }}>
                                        <button className="amsup-btn-attach" style={{ background: 'none', border: 'none', color: '#64748b', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '14px', fontWeight: '600' }}>
                                            <Paperclip size={18} /> Attach File
                                        </button>
                                        <select
                                            value={selectedTicket.status}
                                            onChange={(e) => handleStatusChange(selectedTicket._id || selectedTicket.id, e.target.value)}
                                            style={{
                                                padding: '4px 12px',
                                                borderRadius: '8px',
                                                border: '1px solid #e2e8f0',
                                                fontSize: '13px',
                                                fontWeight: '600',
                                                backgroundColor: '#f8fafc',
                                                color: '#475569'
                                            }}
                                        >
                                            <option value="Open">Set Open</option>
                                            <option value="In Progress">Set In Progress</option>
                                            <option value="Resolved">Set Resolved</option>
                                            <option value="Closed">Set Closed</option>
                                        </select>
                                    </div>
                                    <button className="amsup-btn-send" onClick={handleSendReply} style={{ backgroundColor: '#0056D2', color: 'white', padding: '12px 25px', borderRadius: '12px', border: 'none', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: '700', boxShadow: '0 4px 6px -1px rgba(0, 86, 210, 0.2)' }}>
                                        <Send size={18} /> Send Email Response
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}


            {activeModal === 'close' && selectedTicket && (
                <div className="amsup-modal-overlay" onClick={() => setActiveModal(null)}>
                    <div className="amsup-modal-content small-prompt" onClick={e => e.stopPropagation()}>
                        <div className="amsup-prompt-icon">
                            <AlertCircle size={32} />
                        </div>
                        <h3 className="amsup-prompt-title">Close Ticket?</h3>
                        <p className="amsup-prompt-text">
                            Are you sure you want to close ticket <strong>{selectedTicket._id}</strong>?
                            This will mark the issue as permanently resolved.
                        </p>

                        <div className="amsup-prompt-actions">
                            <button className="amsup-btn-cancel" onClick={() => setActiveModal(null)}>Cancel</button>
                            <button className="amsup-btn-confirm" onClick={confirmCloseTicket}>Close Ticket</button>
                        </div>
                    </div>
                </div>
            )}


            {activeModal === 'delete' && selectedTicket && (
                <div className="amsup-modal-overlay" onClick={() => setActiveModal(null)}>
                    <div className="amsup-modal-content small-prompt" onClick={e => e.stopPropagation()}>
                        <div className="amsup-prompt-icon" style={{ backgroundColor: '#fee2e2', color: '#ef4444' }}>
                            <Trash2 size={32} />
                        </div>
                        <h3 className="amsup-prompt-title">Delete Ticket?</h3>
                        <p className="amsup-prompt-text">
                            Are you sure you want to permanently delete ticket <strong>{selectedTicket._id.substring(0, 8).toUpperCase()}</strong>?
                            This action cannot be undone.
                        </p>

                        <div className="amsup-prompt-actions">
                            <button className="amsup-btn-cancel" onClick={() => setActiveModal(null)}>Cancel</button>
                            <button className="amsup-btn-confirm" onClick={handleDeleteTicket} style={{ backgroundColor: '#ef4444' }}>Delete Now</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageSupport;
