import React, { useState, useEffect } from 'react';
import { 
    Home, 
    Search, 
    Filter, 
    CheckCircle, 
    XCircle, 
    Clock, 
    ExternalLink, 
    Calendar, 
    Tag, 
    Mail, 
    Store,
    Eye,
    Trash2,
    X,
    Star,
    Info,
    Globe,
    AlertTriangle,
    RotateCcw
} from 'lucide-react';
import './AdminHomeRequests.css';
import AlertModal from '../../components/common/AlertModal';

const AdminHomeRequests = () => {
    const [requests, setRequests] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Alert Modal State
    const [alertConfig, setAlertConfig] = useState({
        isOpen: false,
        type: 'success',
        title: '',
        message: '',
        onConfirm: null,
        buttonText: ''
    });

    const triggerAlert = (type, title, message, onConfirm = null, buttonText = '') => {
        setAlertConfig({
            isOpen: true,
            type,
            title,
            message,
            onConfirm: onConfirm ? () => {
                onConfirm();
                setAlertConfig(prev => ({ ...prev, isOpen: false }));
            } : null,
            buttonText
        });
    };

    const closeAlert = () => setAlertConfig(prev => ({ ...prev, isOpen: false }));

    // Fetch requests from localStorage
    const fetchRequests = () => {
        const stored = JSON.parse(localStorage.getItem('hodama_store_requests_v1') || '[]');
        setRequests(stored);
    };

    useEffect(() => {
        fetchRequests();
        window.addEventListener('storage', fetchRequests);
        return () => window.removeEventListener('storage', fetchRequests);
    }, []);

    const updateStoreStatus = (email, newStatus) => {
        // 1. Update requests status
        const updatedRequests = requests.map(r => r.ownerEmail === email ? { ...r, status: newStatus } : r);
        setRequests(updatedRequests);
        localStorage.setItem('hodama_store_requests_v1', JSON.stringify(updatedRequests));

        // 2. Update global store list (Upsert: Add if missing, Update if exists)
        const storedStores = JSON.parse(localStorage.getItem('hodama_all_stores_v1') || '[]');
        const targetReq = requests.find(r => r.ownerEmail === email);
        
        let updatedStores;
        const exists = storedStores.some(s => s.ownerEmail === email);
        
        if (exists) {
            updatedStores = storedStores.map(s => s.ownerEmail === email ? { ...s, ...targetReq, status: newStatus } : s);
        } else if (targetReq && (newStatus === 'Approved' || newStatus === 'Active')) {
            // Add new store from request data
            const newStore = {
                name: targetReq.name,
                img: targetReq.img,
                url: targetReq.url,
                rating: targetReq.rating || '0.0',
                category: targetReq.category || 'Other',
                ownerEmail: targetReq.ownerEmail,
                description: targetReq.description,
                status: newStatus,
                isClaimed: true
            };
            updatedStores = [...storedStores, newStore];
        } else {
            updatedStores = storedStores;
        }

        localStorage.setItem('hodama_all_stores_v1', JSON.stringify(updatedStores));

        // 3. Update client profile
        const mockClient = JSON.parse(localStorage.getItem('hodama_client_user_v1') || '{}');
        if (mockClient.email === email) {
            mockClient.homeRequestStatus = newStatus;
            localStorage.setItem('hodama_client_user_v1', JSON.stringify(mockClient));
        }

        window.dispatchEvent(new Event('storage'));
        triggerAlert('success', 'Status Updated!', `The store listing request has been set to "${newStatus}" successfully.`);
        if (selectedRequest && selectedRequest.ownerEmail === email) {
            setSelectedRequest({ ...selectedRequest, status: newStatus });
        }
    };

    const handleDelete = (email) => {
        triggerAlert(
            'confirm',
            'Delete Request?',
            'Are you sure you want to delete this requesting store? This will permanently remove the record from the system.',
            () => {
                const updatedRequests = requests.filter(r => r.ownerEmail !== email);
                setRequests(updatedRequests);
                localStorage.setItem('hodama_store_requests_v1', JSON.stringify(updatedRequests));

                const storedStores = JSON.parse(localStorage.getItem('hodama_all_stores_v1') || '[]');
                const updatedStores = storedStores.filter(s => s.ownerEmail !== email);
                localStorage.setItem('hodama_all_stores_v1', JSON.stringify(updatedStores));

                // RESET CLIENT STATE TO ALLOW RE-REQUEST
                const savedUser = JSON.parse(localStorage.getItem('hodama_client_user_v1') || '{}');
                if (savedUser.email === email) {
                    savedUser.isHomeRequested = false;
                    savedUser.homeRequestStatus = 'None';
                    localStorage.setItem('hodama_client_user_v1', JSON.stringify(savedUser));
                }

                window.dispatchEvent(new Event('storage'));
                if (isModalOpen) setIsModalOpen(false);
            },
            'Yes, Delete'
        );
    };

    const handleReject = (email) => {
        triggerAlert(
            'confirm',
            'Are you sure you want to reject this request? The user will be able to request again.',
            'Reject Request?',
            () => {
                const updatedRequests = requests.filter(r => r.ownerEmail !== email);
                setRequests(updatedRequests);
                localStorage.setItem('hodama_store_requests_v1', JSON.stringify(updatedRequests));

                // RESET CLIENT STATE
                const savedUser = JSON.parse(localStorage.getItem('hodama_client_user_v1') || '{}');
                if (savedUser.email === email) {
                    savedUser.isHomeRequested = false;
                    savedUser.homeRequestStatus = 'None';
                    localStorage.setItem('hodama_client_user_v1', JSON.stringify(savedUser));
                }

                window.dispatchEvent(new Event('storage'));
                if (isModalOpen) setIsModalOpen(false);
            },
            'Reject'
        );
    }

    const openViewModal = (req) => {
        setSelectedRequest(req);
        setIsModalOpen(true);
    };

    const filteredRequests = requests.filter(req => {
        const matchesSearch = (req.name || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
                             (req.ownerEmail || '').toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'All' || req.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const stats = {
        total: requests.length,
        pending: requests.filter(r => r.status === 'Pending').length,
        approved: requests.filter(r => r.status === 'Approved').length
    };

    return (
        <div className="ahr-page animate-fade-in">
            {/* Header Area */}
            <div className="ahr-header">
                <div className="ahr-header-left">
                    <h1>Home Page Listing Requests</h1>
                    <p>Review and manage stores that are requesting to be listed on the "Top Stores" section of the Home Page.</p>
                </div>
                <div className="ahr-stats">
                    <div className="ahr-stat-item">
                        <span className="ahr-stat-label">Total</span>
                        <strong className="ahr-stat-val">{stats.total}</strong>
                    </div>
                    <div className="ahr-stat-item">
                        <span className="ahr-stat-label">Pending</span>
                        <strong className="ahr-stat-val text-yellow">{stats.pending}</strong>
                    </div>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="ahr-controls">
                <div className="ahr-search">
                    <Search size={20} />
                    <input 
                        type="text" 
                        placeholder="Search store name or email..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="ahr-filters">
                    <div className="ahr-filter-group">
                        <Filter size={18} />
                        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                            <option value="All">All Status</option>
                            <option value="Pending">Only Pending</option>
                            <option value="Approved">Approved</option>
                            <option value="Rejected">Rejected</option>
                        </select>
                    </div>
                    <button className="ahr-btn-sync" onClick={() => { fetchRequests(); triggerAlert('success', 'Sync Complete!', 'Home listing database re-synchronized with latest submissions.'); }}>
                        <RotateCcw size={18} /> Sync Data
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="ahr-table-card">
                {filteredRequests.length === 0 ? (
                    <div className="ahr-empty">
                        <Home size={64} color="#e2e8f0" />
                        <h3>No Requests Found</h3>
                        <p>Adjust your filters or search terms to find what you are looking for.</p>
                    </div>
                ) : (
                    <div className="ahr-table-container">
                        <table className="ahr-table">
                            <thead>
                                <tr>
                                    <th>Store Details</th>
                                    <th>Link / URL</th>
                                    <th>Category</th>
                                    <th>Date Requested</th>
                                    <th>Status</th>
                                    <th className="text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredRequests.map((req, idx) => (
                                    <tr key={idx || req.ownerEmail}>
                                        <td>
                                            <div className="ahr-store-cell">
                                                <div className="ahr-store-logo">
                                                    <img src={req.img || "/assets/images/placeholder_store.png"} alt="Logo" />
                                                </div>
                                                <div className="ahr-store-info">
                                                    <span className="ahr-sn">{req.name}</span>
                                                    <span className="ahr-se"><Mail size={12}/> {req.ownerEmail}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            {req.url ? (
                                                <a href={req.url} target="_blank" rel="noreferrer" className="ahr-link">
                                                    Visit Website <ExternalLink size={14} />
                                                </a>
                                            ) : (
                                                <span className="ahr-no-link">No Link</span>
                                            )}
                                        </td>
                                        <td><span className="ahr-cat-pill">{req.category}</span></td>
                                        <td>
                                            <div className="ahr-date-cell">
                                                <Calendar size={14} /> {req.requestDate || 'N/A'}
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`ahr-status-chip ${req.status.toLowerCase()}`}>
                                                {req.status === 'Pending' && <Clock size={14} />}
                                                {req.status === 'Approved' && <CheckCircle size={14} />}
                                                {req.status === 'Rejected' && <XCircle size={14} />}
                                                {req.status}
                                            </span>
                                        </td>
                                        <td className="text-right">
                                            <div className="ahr-actions">
                                                <button className="ahr-icon-btn view" onClick={() => openViewModal(req)} title="View Details">
                                                    <Eye size={20} />
                                                </button>
                                                <button className="ahr-icon-btn delete" onClick={() => handleDelete(req.ownerEmail)} title="Delete Request">
                                                    <Trash2 size={20} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* View Details Modal */}
            {isModalOpen && selectedRequest && (
                <div className="ahr-modal-overlay" onClick={() => setIsModalOpen(false)}>
                    <div className="ahr-modal-content" onClick={e => e.stopPropagation()}>
                        <div className="ahr-modal-header">
                            <div className="ahr-modal-title">
                                <Store size={24} />
                                <h2>Store Details</h2>
                            </div>
                            <button className="ahr-modal-close" onClick={() => setIsModalOpen(false)}>
                                <X size={24} />
                            </button>
                        </div>

                        <div className="ahr-modal-body">
                            <div className="ahr-modal-section-hero">
                                <div className="ahr-hero-logo">
                                    <img src={selectedRequest.img || "/assets/images/placeholder_store.png"} alt="Store Logo" />
                                </div>
                                <div className="ahr-hero-text">
                                    <h3>{selectedRequest.name}</h3>
                                    <span className="ahr-hero-cat">{selectedRequest.category}</span>
                                    <div className="ahr-hero-rating">
                                        <Star size={16} fill="#fbbf24" color="#fbbf24" />
                                        <span>{selectedRequest.rating || '0.0'}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="ahr-modal-info-grid">
                                <div className="ahr-info-item full">
                                    <label><Info size={14} /> Description</label>
                                    <p>{selectedRequest.description || 'No description provided by the client.'}</p>
                                </div>
                                <div className="ahr-info-item">
                                    <label><Mail size={14} /> Owner Email</label>
                                    <p>{selectedRequest.ownerEmail}</p>
                                </div>
                                <div className="ahr-info-item">
                                    <label><Globe size={14} /> Website</label>
                                    <p>{selectedRequest.url || 'Not provided'}</p>
                                </div>
                                <div className="ahr-info-item">
                                    <label><Calendar size={14} /> Request Date</label>
                                    <p>{selectedRequest.requestDate}</p>
                                </div>
                                <div className="ahr-info-item">
                                    <label><Clock size={14} /> Current Status</label>
                                    <span className={`ahr-status-chip ${selectedRequest.status.toLowerCase()}`}>
                                        {selectedRequest.status}
                                    </span>
                                </div>
                            </div>

                            <div className="ahr-modal-actions-section">
                                <h4>Change Status</h4>
                                <div className="ahr-status-buttons">
                                    <button 
                                        className={`ahr-status-btn approve ${selectedRequest.status === 'Approved' ? 'active' : ''}`}
                                        onClick={() => updateStoreStatus(selectedRequest.ownerEmail, 'Approved')}
                                    >
                                        <CheckCircle size={18} /> Approve
                                    </button>
                                    <button 
                                        className={`ahr-status-btn reject ${selectedRequest.status === 'Rejected' ? 'active' : ''}`}
                                        onClick={() => updateStoreStatus(selectedRequest.ownerEmail, 'Rejected')}
                                    >
                                        <XCircle size={18} /> Reject
                                    </button>
                                    <button 
                                        className={`ahr-status-btn pending ${selectedRequest.status === 'Pending' ? 'active' : ''}`}
                                        onClick={() => updateStoreStatus(selectedRequest.ownerEmail, 'Pending')}
                                    >
                                        <Clock size={18} /> Revert to Pending
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="ahr-modal-footer">
                            <button className="ahr-footer-btn-del" onClick={() => handleDelete(selectedRequest.ownerEmail)}>
                                <Trash2 size={18} /> Delete Store Record
                            </button>
                            <button className="ahr-footer-btn-close" onClick={() => setIsModalOpen(false)}>Close</button>
                        </div>
                    </div>
                </div>
            )}

            {/* CUSTOM ALERT MODAL */}
            <AlertModal 
                isOpen={alertConfig.isOpen}
                type={alertConfig.type}
                title={alertConfig.title}
                message={alertConfig.message}
                onClose={closeAlert}
                onConfirm={alertConfig.onConfirm}
                buttonText={alertConfig.buttonText}
            />
        </div>
    );
};

export default AdminHomeRequests;
