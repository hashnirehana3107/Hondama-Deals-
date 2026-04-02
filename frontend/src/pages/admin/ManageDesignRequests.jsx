import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Paintbrush,
    Clock,
    CheckCircle,
    AlertCircle,
    Search,
    Filter,
    Eye,
    MessageSquare,
    XCircle,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    User,
    Mail,
    Phone,
    Paperclip,
    Send,
    Layers,
    UploadCloud,
    ExternalLink,
    TrendingUp,
    FileText,
    MoreVertical,
    Download,
    Upload,
    RotateCcw,
    Image as ImageIcon
} from 'lucide-react';
import './ManageDesignRequests.css';

const ManageDesignRequests = () => {
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [activeModal, setActiveModal] = useState(null); // 'view', 'message', 'upload'
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [replyText, setReplyText] = useState('');
    const navigate = useNavigate();

    const [uploadFile, setUploadFile] = useState(null);
    const [isSent, setIsSent] = useState(false);

    // Load data from BOTH support tickets AND banner requests for sync
    const [allRequests, setAllRequests] = useState(() => {
        const savedBanners = localStorage.getItem('hodama_banner_requests_v1');
        return savedBanners ? JSON.parse(savedBanners) : [];
    });

    // Derive only design requests
    const requests = allRequests.filter(b => b?.type?.includes('Design Request'));

    const syncWithTickets = (updatedBanners) => {
        const savedTickets = localStorage.getItem('hodamaAdminSupportTickets_v3');
        let allTickets = savedTickets ? JSON.parse(savedTickets) : [];
        
        // Update corresponding tickets if they exist
        const updatedTickets = allTickets.map(t => {
            const match = updatedBanners.find(b => b.id.includes(t.id.replace('TCK','')) || t.id.includes(b.id.replace('BR-DS-','')));
            if (match) {
                let ticketStatus = t.status;
                if (match.status === 'Resolved') ticketStatus = 'Resolved';
                else if (match.status === 'Designing') ticketStatus = 'In Progress';
                else if (match.status === 'Open') ticketStatus = 'Open';
                
                return { ...t, status: ticketStatus };
            }
            return t;
        });
        localStorage.setItem('hodamaAdminSupportTickets_v3', JSON.stringify(updatedTickets));
    };

    useEffect(() => {
        localStorage.setItem('hodama_banner_requests_v1', JSON.stringify(allRequests));
        syncWithTickets(requests); // Sync only the filtered design ones to tickets
    }, [allRequests]);

    const stats = {
        total: requests.length,
        pending: requests.filter(r => r.status === 'Open' || r.status === 'Pending').length,
        inProgress: requests.filter(r => r.status === 'Designing' || r.status === 'In Review' || r.status === 'Changes Requested').length,
        finished: requests.filter(r => r.status === 'Resolved' || r.status === 'Closed' || r.status === 'Approved' || r.status === 'Published').length
    };

    const handleStatusChange = (id, newStatus) => {
        setAllRequests(allRequests.map(r => r.id === id ? { ...r, status: newStatus } : r));
        if (selectedRequest && selectedRequest.id === id) {
            setSelectedRequest({ ...selectedRequest, status: newStatus });
        }
    };

    const handleSendReply = () => {
        if (!replyText.trim() || !selectedRequest) return;
        const newReply = { sender: 'admin', text: replyText, date: 'Today' };
        const updatedHistory = [...(selectedRequest.history || []), newReply];
        
        setAllRequests(allRequests.map(r => r.id === selectedRequest.id ? { 
            ...r, 
            history: updatedHistory, 
            status: 'Designing',
            isReadClient: false, // New for client
            isReadAdmin: true    // Admin just sent/viewed it
        } : r));
        setSelectedRequest({ ...selectedRequest, status: 'Designing', history: updatedHistory, isReadAdmin: true });
        setReplyText('');
    };

    // Mark as read when admin opens modal
    useEffect(() => {
        if (activeModal && selectedRequest) {
            setAllRequests(prev => prev.map(r => 
                r.id === selectedRequest.id ? { ...r, isReadAdmin: true } : r
            ));
        }
    }, [activeModal, selectedRequest]);


    const handleProceedToDeal = () => {
        if (!selectedRequest) return;
        // Optionally pass state to the next page if needed
        navigate('/admin/manage-deals', { state: { fromDesign: selectedRequest.id, partner: selectedRequest.user } });
    };

    const handleMockDownload = (asset) => {
        if (asset.data) {
            // Actual file download using base64
            const link = document.createElement('a');
            link.href = asset.data;
            link.download = asset.name;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            // Fallback for old requests that just have string filenames
            const filename = typeof asset === 'string' ? asset : asset.name;
            const data = `[System Mock File]\n\nFilename: ${filename}\nRelated ID: ${selectedRequest?.id}\n\n*Note: This is an older request created before actual file data was persisted. Only new requests will download real images.*`;
            const blob = new Blob([data], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename + '.txt';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }
    };

    return (
        <div className="mdsr-page-wrapper">
            {/* 1. Page Header */}
            <div className="mdsr-header">
                <div className="mdsr-header-left">
                    <h1 className="mdsr-title">Design Team Support</h1>
                    <p className="mdsr-subtitle">Manage graphic design requests, banner creation and deal setup tasks</p>
                </div>
                <div className="mdsr-header-right">
                    <div className="mdsr-active-badge">
                        <TrendingUp size={16} /> <span>Active Queue</span>
                    </div>
                </div>
            </div>

            {/* 2. Project Stats */}
            <div className="mdsr-stats-grid">
                <div className="mdsr-stat-card">
                    <div className="mdsr-stat-icon bg-indigo"><Layers size={24} /></div>
                    <div className="mdsr-stat-info">
                        <strong>{stats.total}</strong>
                        <span>Total Requests</span>
                    </div>
                </div>
                <div className="mdsr-stat-card">
                    <div className="mdsr-stat-icon bg-amber"><Clock size={24} /></div>
                    <div className="mdsr-stat-info">
                        <strong>{stats.pending}</strong>
                        <span>New Requests</span>
                    </div>
                </div>
                <div className="mdsr-stat-card">
                    <div className="mdsr-stat-icon bg-blue"><Paintbrush size={24} /></div>
                    <div className="mdsr-stat-info">
                        <strong>{stats.inProgress}</strong>
                        <span>Designing</span>
                    </div>
                </div>
                <div className="mdsr-stat-card">
                    <div className="mdsr-stat-icon bg-emerald"><CheckCircle size={24} /></div>
                    <div className="mdsr-stat-info">
                        <strong>{stats.finished}</strong>
                        <span>Finished</span>
                    </div>
                </div>
            </div>

            {/* 3. Controls */}
            <div className="mdsr-controls">
                <div className="mdsr-search">
                    <Search size={18} />
                    <input 
                        type="text" 
                        placeholder="Search project name or partner..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="mdsr-filters">
                    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                        <option value="All">All Status</option>
                        <option value="Designing">Designing</option>
                        <option value="In Review">In Review</option>
                        <option value="Approved">Approved</option>
                        <option value="Published">Published</option>
                        <option value="Rejected">Rejected</option>
                    </select>
                </div>
            </div>

            {/* 4. Requests List */}
            <div className="mdsr-list-card">
                <div className="mdsr-table-container">
                    <table className="mdsr-table">
                        <thead>
                            <tr>
                                <th>Project ID</th>
                                <th>Partner Name</th>
                                <th>Instructions Highlight</th>
                                <th>Deadline / Date</th>
                                <th>Status</th>
                                <th className="text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {requests.filter(r => (statusFilter === 'All' || r.status === statusFilter))
                                .filter(r => {
                                    const name = r.user || '';
                                    const id = r.id || '';
                                    return name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                           id.toLowerCase().includes(searchQuery.toLowerCase());
                                })
                                .map((req) => (
                                <tr key={req.id}>
                                    <td className="mdsr-td-id">{req.id}</td>
                                    <td>
                                        <div className="mdsr-partner-info">
                                            <span className="p-name">{req.user || 'Client Partner'}</span>
                                            <span className="p-email">{req.email || 'Partner Account'}</span>
                                        </div>
                                    </td>
                                    <td><p className="mdsr-msg-snip">{req.description?.substring(0, 50)}...</p></td>
                                    <td><span className="mdsr-date-tag">{req.date}</span></td>
                                    <td>
                                        <span className={`mdsr-status-pill ${req.status.toLowerCase().replace(' ', '-')}`}>
                                            {req.status}
                                        </span>
                                    </td>
                                    <td className="text-right">
                                        <div className="mdsr-actions">
                                            <button className="mdsr-btn-act" onClick={() => { setSelectedRequest(req); setActiveModal('view'); }}><Eye size={18} /></button>
                                            <button className="mdsr-btn-act chat" onClick={() => { setSelectedRequest(req); setActiveModal('message'); }}><MessageSquare size={18} /></button>
                                            <button className="mdsr-btn-act upload" onClick={() => { setSelectedRequest(req); setActiveModal('upload'); }}><UploadCloud size={18} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modals */}
            {activeModal === 'view' && selectedRequest && (
                <div className="mdsr-modal-ov" onClick={() => setActiveModal(null)}>
                    <div className="mdsr-modal-cn small" onClick={e => e.stopPropagation()}>
                        <header className="mdsr-modal-hr">
                            <h3>Design Project View</h3>
                            <button className="close-x" onClick={() => setActiveModal(null)}><XCircle size={20} /></button>
                        </header>
                        <div className="mdsr-modal-br">
                            <div className="mdsr-project-header">
                                <div className="p-icon"><Paintbrush size={32} /></div>
                                <div className="p-title">
                                    <h4>Request from {selectedRequest.user}</h4>
                                    <span>Added on {selectedRequest.date} • {selectedRequest.id}</span>
                                </div>
                            </div>

                            <div className="mdsr-detail-item mt-4">
                                <label><FileText size={16} /> Partner Instructions</label>
                                <div className="p-bubble">{selectedRequest.description}</div>
                            </div>

                            {selectedRequest.rawAssets && (
                                <div className="mdsr-detail-item mt-3">
                                    <label><Paperclip size={16} /> Raw Materials / Logos</label>
                                    <div className="attach-box" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                        {selectedRequest.rawAssets.map((asset, i) => {
                                            const assetName = typeof asset === 'string' ? asset : asset.name;
                                            return (
                                                <div key={i} onClick={() => handleMockDownload(asset)} className="mock-dl-btn" style={{ padding: '8px 14px', background: '#e0e7ff', borderRadius: '8px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', border: '1px solid #c7d2fe', color: '#3730a3', fontWeight: '500' }}>
                                                    <span>{assetName}</span>
                                                    <Download size={16} />
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {selectedRequest.designFeedback && (
                                <div className="mdsr-detail-item mt-3" style={{ background: '#fffbeb', padding: '15px', borderRadius: '12px', border: '1px solid #fde68a' }}>
                                    <label style={{ color: '#92400e' }}><RotateCcw size={14} /> Client Revision Note</label>
                                    <p style={{ color: '#92400e', fontStyle: 'italic', margin: '5px 0 0 0' }}>"{selectedRequest.designFeedback}"</p>
                                </div>
                            )}

                            <div className="mdsr-workflow-actions mt-5 pt-4">
                                <h4 className="w-title">Production Actions</h4>
                                <div className="w-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                    {selectedRequest.status !== 'Designing' && selectedRequest.status !== 'In Review' && (
                                        <button 
                                            onClick={() => handleStatusChange(selectedRequest.id, 'Designing')}
                                            style={{ padding: '12px', background: '#3b82f6', color: 'white', borderRadius: '10px', border: 'none', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%', boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.2)' }}
                                        >
                                            <Paintbrush size={18} /> Mark as "Designing"
                                        </button>
                                    )}
                                    
                                    {(selectedRequest.status === 'Designing' || selectedRequest.status === 'In Review') && (
                                        <button 
                                            onClick={() => handleStatusChange(selectedRequest.id, 'Open')}
                                            style={{ padding: '12px', background: '#f1f5f9', color: '#475569', borderRadius: '10px', border: 'none', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%' }}
                                        >
                                            <RotateCcw size={18} /> Reset to Pending
                                        </button>
                                    )}

                                    <button 
                                        onClick={() => setActiveModal('upload')}
                                        style={{ padding: '12px', background: '#10b981', color: 'white', borderRadius: '10px', border: 'none', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%', boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.2)' }}
                                    >
                                        <UploadCloud size={18} /> Upload Final Design
                                    </button>
                                    
                                    <button 
                                        onClick={handleProceedToDeal}
                                        disabled={selectedRequest.status !== 'Approved' && selectedRequest.status !== 'Published' && !selectedRequest.finalDesign}
                                        style={{ 
                                            gridColumn: 'span 2', 
                                            padding: '12px', 
                                            background: (selectedRequest.status === 'Approved' || selectedRequest.status === 'Published' || selectedRequest.finalDesign) ? 'white' : '#f1f5f9', 
                                            color: (selectedRequest.status === 'Approved' || selectedRequest.status === 'Published' || selectedRequest.finalDesign) ? '#0f172a' : '#94a3b8', 
                                            borderRadius: '10px', 
                                            border: (selectedRequest.status === 'Approved' || selectedRequest.status === 'Published' || selectedRequest.finalDesign) ? '2px solid #e2e8f0' : '2px solid #f1f5f9', 
                                            fontWeight: '600', 
                                            cursor: (selectedRequest.status === 'Approved' || selectedRequest.status === 'Published' || selectedRequest.finalDesign) ? 'pointer' : 'not-allowed', 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            justifyContent: 'center', 
                                            gap: '8px', 
                                            width: '100%', 
                                            transition: 'all 0.2s' 
                                        }}
                                    >
                                        <ExternalLink size={18} /> Proceed to Create Deal
                                    </button>

                                    {selectedRequest.status === 'Approved' && (
                                        <button 
                                            onClick={() => {
                                                handleStatusChange(selectedRequest.id, 'Published');
                                                alert("Successfully published to Home Page Hero Carousel!");
                                            }}
                                            style={{ 
                                                gridColumn: 'span 2', 
                                                padding: '12px', 
                                                background: '#6366f1', 
                                                color: 'white', 
                                                borderRadius: '10px', 
                                                border: 'none', 
                                                fontWeight: '600', 
                                                cursor: 'pointer', 
                                                display: 'flex', 
                                                alignItems: 'center', 
                                                justifyContent: 'center', 
                                                gap: '8px', 
                                                width: '100%', 
                                                marginTop: '5px',
                                                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)' 
                                            }}
                                        >
                                            <TrendingUp size={18} /> Publish to Home Page
                                        </button>
                                    )}

                                    {selectedRequest.status === 'Published' && (
                                        <div style={{ 
                                            gridColumn: 'span 2', 
                                            padding: '12px', 
                                            background: '#f0f9ff', 
                                            color: '#0369a1', 
                                            borderRadius: '10px', 
                                            border: '1px solid #bae6fd', 
                                            fontWeight: '600', 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            justifyContent: 'center', 
                                            gap: '8px', 
                                            width: '100%', 
                                            marginTop: '5px'
                                        }}>
                                            <CheckCircle2 size={18} /> Currently Live on Home Page
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeModal === 'message' && selectedRequest && (
                <div className="mdsr-modal-ov" onClick={() => setActiveModal(null)}>
                    <div className="mdsr-modal-cn medium" onClick={e => e.stopPropagation()}>
                        <header className="mdsr-modal-hr">
                            <h3>Contact Partner</h3>
                            <button className="close-x" onClick={() => setActiveModal(null)}><XCircle size={20} /></button>
                        </header>
                        <div className="mdsr-chat-view">
                            <div className="mdsr-history">
                                <div className="chat-bubble user">
                                    <div className="meta"><strong>{selectedRequest.user}</strong> <span>{selectedRequest.date}</span></div>
                                    <p>{selectedRequest.message}</p>
                                </div>
                                {selectedRequest.history?.map((msg, i) => (
                                    <div key={i} className={`chat-bubble ${msg.sender === 'admin' ? 'admin' : 'user'}`}>
                                        <div className="meta"><strong>{msg.sender === 'admin' ? 'Design Team' : selectedRequest.user}</strong> <span>{msg.date}</span></div>
                                        <p>{msg.text}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="mdsr-reply">
                                <textarea 
                                    placeholder="Type message to partner..." 
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                ></textarea>
                                <div className="reply-btns">
                                    <button className="btn-attach"><Paperclip size={18} /></button>
                                    <button className="btn-send" onClick={handleSendReply}><Send size={18} /> Send</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
            {activeModal === 'upload' && selectedRequest && (
                <div className="mdsr-modal-ov" onClick={() => { setActiveModal(null); setUploadFile(null); setIsSent(false); }}>
                    <div className="mdsr-modal-cn small" onClick={e => e.stopPropagation()}>
                        <header className="mdsr-modal-hr">
                            <h3>Upload Finished Asset</h3>
                            <button className="close-x" onClick={() => { setActiveModal(null); setUploadFile(null); setIsSent(false); }}><XCircle size={20} /></button>
                        </header>
                        <div className="mdsr-modal-body p-5">
                            {isSent ? (
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px', padding: '40px 0', color: '#16a34a' }}>
                                    <div style={{ background: '#dcfce7', padding: '20px', borderRadius: '50%' }}>
                                        <CheckCircle2 size={64} />
                                    </div>
                                    <h3 style={{ margin: 0, fontSize: '20px' }}>Sent to Client Successfully!</h3>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                    <div className="upload-zone" style={{ border: '2px dashed #cbd5e1', padding: '30px', textAlign: 'center', borderRadius: '12px', background: uploadFile ? '#f1f5f9' : '#f8fafc', transition: 'all 0.2s' }}>
                                        <input 
                                            type="file" 
                                            id="final-design-input" 
                                            hidden 
                                            accept="image/*"
                                            onChange={(e) => {
                                                const file = e.target.files[0];
                                                if (file) setUploadFile(file);
                                            }}
                                        />
                                        <label htmlFor="final-design-input" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
                                            {uploadFile ? (
                                                <>
                                                    <CheckCircle2 size={40} color="#10b981" />
                                                    <span style={{ fontWeight: '600', color: '#0f172a' }}>{uploadFile.name}</span>
                                                    <span style={{ color: '#64748b', fontSize: '13px' }}>Click to change file</span>
                                                </>
                                            ) : (
                                                <>
                                                    <UploadCloud size={48} color="#143ae6" />
                                                    <h5 style={{ margin: 0, fontSize: '16px', color: '#0f172a' }}>Click to select finished banner</h5>
                                                    <span style={{ color: '#64748b' }}>Supported formats: PNG, JPG</span>
                                                </>
                                            )}
                                        </label>
                                    </div>

                                    <button 
                                        disabled={!uploadFile}
                                        onClick={() => {
                                            if (!uploadFile) return;
                                            const reader = new FileReader();
                                            reader.onloadend = () => {
                                                const updated = allRequests.map(r => 
                                                    r.id === selectedRequest.id ? { ...r, finalDesign: reader.result, status: 'In Review', designFeedback: null, isReadClient: false } : r
                                                );
                                                setAllRequests(updated);
                                                setIsSent(true);
                                                setTimeout(() => {
                                                    setActiveModal(null);
                                                    setUploadFile(null);
                                                    setIsSent(false);
                                                }, 1800);

                                            };
                                            reader.readAsDataURL(uploadFile);
                                        }}
                                        style={{ 
                                            padding: '14px', 
                                            background: uploadFile ? '#3b82f6' : '#94a3b8', 
                                            color: 'white', 
                                            borderRadius: '10px', 
                                            border: 'none', 
                                            fontWeight: 'bold', 
                                            fontSize: '16px',
                                            cursor: uploadFile ? 'pointer' : 'not-allowed', 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            justifyContent: 'center', 
                                            gap: '10px',
                                            transition: 'all 0.2s',
                                            boxShadow: uploadFile ? '0 4px 12px rgba(59, 130, 246, 0.3)' : 'none'
                                        }}
                                    >
                                        <Send size={18} /> Send Design to Client
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageDesignRequests;
