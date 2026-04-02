import React, { useState, useEffect } from 'react';
import { 
    ShoppingBag, 
    Clock, 
    CheckCircle2, 
    XCircle, 
    Search, 
    Eye, 
    Check, 
    X,
    Filter,
    Calendar,
    ArrowUpRight,
    Trash2,
    Download,
    Upload,
    CheckCircle,
    RotateCcw,
    Image as ImageIcon
} from 'lucide-react';
import './ManageBannerPromotions.css';

const ManageBannerPromotions = () => {
    const [requests, setRequests] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [selectedBanner, setSelectedBanner] = useState(null);

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem('hodama_banner_requests_v1') || '[]');
        setRequests(stored);
    }, []);

    const updateStatus = (id, newStatus) => {
        const updated = requests.map(req => 
            req.id === id ? { ...req, status: newStatus } : req
        );
        localStorage.setItem('hodama_banner_requests_v1', JSON.stringify(updated));
        setRequests(updated);
        setSelectedBanner(null);
        // alert(`Banner request ${newStatus} successfully!`);
    };

    const handleDownload = (asset) => {
        if (!asset) return;
        
        // If it's the new format with real base64 data
        if (asset.data) {
            const link = document.createElement('a');
            link.href = asset.data;
            link.download = asset.name;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            // Handle old format or string filenames
            const filename = typeof asset === 'string' ? asset : asset.name;
            const data = `[System Mock File]\n\nFilename: ${filename}\nRelated ID: ${selectedBanner?.id}\n\n*Note: This is an older request created before actual file data was persisted. Only new requests will download real images.*`;
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

    const deleteRequest = (id) => {
        if (window.confirm("Are you sure you want to delete this submission?")) {
            const updated = requests.filter(req => req.id !== id);
            localStorage.setItem('hodama_banner_requests_v1', JSON.stringify(updated));
            setRequests(updated);
        }
    };

    const filteredRequests = requests.filter(req => {
        const matchesSearch = req.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            req.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'All' || req.status === statusFilter;
        return matchesSearch && matchesStatus && req.type?.toLowerCase().includes('banner');
    });

    const bannerRequests = requests.filter(r => r.type?.toLowerCase().includes('banner'));

    return (
        <div className="mbp-admin-wrapper">
            <header className="mbp-header">
                <div>
                    <h1><ShoppingBag size={28} /> Banner Promotions</h1>
                    <p>Review and manage partner banner submissions for the homepage.</p>
                </div>
            </header>

            <div className="mbp-stats">
                <div className="mbp-stat-card">
                    <span className="label">Total Submissions</span>
                    <span className="value">{bannerRequests.length}</span>
                </div>
                <div className="mbp-stat-card pending">
                    <span className="label">Pending Review</span>
                    <span className="value">{bannerRequests.filter(r => r.status === 'Pending').length}</span>
                </div>
                <div className="mbp-stat-card approved">
                    <span className="label">Live on Home</span>
                    <span className="value">{bannerRequests.filter(r => r.status === 'Approved').length}</span>
                </div>
            </div>

            <div className="mbp-controls">
                <div className="mbp-search">
                    <Search size={18} />
                    <input 
                        type="text" 
                        placeholder="Search by ID or description..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="mbp-filter">
                    <Filter size={18} />
                    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                        <option value="All">All Status</option>
                        <option value="Pending">Pending</option>
                        <option value="Designing">Designing</option>
                        <option value="In Review">In Review</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                    </select>
                </div>
            </div>

            <div className="mbp-table-card">
                <table className="mbp-table">
                    <thead>
                        <tr>
                            <th>Request ID</th>
                            <th>Type</th>
                            <th>Description</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th className="text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredRequests.map(req => (
                            <tr key={req.id}>
                                <td className="font-bold">{req.id}</td>
                                <td>
                                    <span className="type-tag">{req.type}</span>
                                </td>
                                <td>
                                    <div className="desc-cell">{req.description}</div>
                                </td>
                                <td>{req.date}</td>
                                <td>
                                    <span className={`status-tag ${req.status.toLowerCase()}`}>
                                        {req.status}
                                    </span>
                                </td>
                                <td className="text-right">
                                    <div className="mbp-actions">
                                        {req.status !== 'Approved' && (
                                            <button className="approve-btn icon-only" onClick={() => updateStatus(req.id, 'Approved')} title="Approve Request" style={{ color: '#16a34a', background: '#dcfce7', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer', display: 'flex' }}>
                                                <CheckCircle2 size={18} />
                                            </button>
                                        )}
                                        {req.status !== 'Rejected' && (
                                            <button className="reject-btn icon-only" onClick={() => updateStatus(req.id, 'Rejected')} title="Reject Request" style={{ color: '#dc2626', background: '#fee2e2', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer', display: 'flex' }}>
                                                <XCircle size={18} />
                                            </button>
                                        )}
                                        <button className="view-btn icon-only" onClick={() => setSelectedBanner(req)} title="View Detail" style={{ padding: '8px', borderRadius: '8px', display: 'flex' }}>
                                            <Eye size={18} />
                                        </button>
                                        <button className="delete-btn icon-only" onClick={() => deleteRequest(req.id)} title="Delete Request" style={{ padding: '8px', borderRadius: '8px', display: 'flex' }}>
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {filteredRequests.length === 0 && (
                            <tr>
                                <td colSpan="6" className="text-center py-8 text-gray-400">No banner requests found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* View Modal */}
            {selectedBanner && (
                <div className="mbp-modal-overlay" onClick={() => setSelectedBanner(null)}>
                    <div className="mbp-modal-content" onClick={e => e.stopPropagation()}>
                        <div className="mbp-modal-header">
                            <h3>Review Banner Submission</h3>
                            <button className="close-btn" onClick={() => setSelectedBanner(null)}><X size={20} /></button>
                        </div>
                        <div className="mbp-modal-body">
                            <div className="req-meta">
                                <span><strong>ID:</strong> {selectedBanner.id}</span>
                                <span><strong>Date:</strong> {selectedBanner.date}</span>
                                {selectedBanner.startDate && (
                                    <span><strong>Period:</strong> {selectedBanner.startDate} - {selectedBanner.endDate}</span>
                                )}
                            </div>
                            <div className="banner-preview-box">
                                {selectedBanner.image ? (
                                    <img src={selectedBanner.image} alt="Banner Preview" className="full-preview" />
                                ) : (
                                    <div className="no-image">
                                        <ImageIcon size={48} />
                                        <p>No image attached (Design Request)</p>
                                    </div>
                                )}
                            </div>
                            <div className="info-section">
                                <label>Description / Instruction</label>
                                <p>{selectedBanner.description}</p>
                            </div>

                            {selectedBanner.rawAssets && (
                                <div className="info-section" style={{ marginTop: '20px' }}>
                                    <label>Raw Assets from Client</label>
                                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                        {selectedBanner.rawAssets.map((asset, i) => {
                                            const assetName = typeof asset === 'string' ? asset : asset.name;
                                            return (
                                                <div key={i} onClick={() => handleDownload(asset)} style={{ padding: '8px 14px', background: '#e0e7ff', borderRadius: '8px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', border: '1px solid #c7d2fe', color: '#3730a3', fontWeight: '500' }}>
                                                    <span>{assetName}</span>
                                                    <Download size={16} />
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {selectedBanner.designFeedback && (
                                <div className="info-section" style={{ marginTop: '20px', padding: '15px', background: '#fffbeb', borderRadius: '12px', border: '1px solid #fde68a' }}>
                                    <label style={{ color: '#92400e', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <RotateCcw size={14} /> Client Feedback / Revision Note
                                    </label>
                                    <p style={{ color: '#92400e', fontStyle: 'italic', marginTop: '5px' }}>"{selectedBanner.designFeedback}"</p>
                                </div>
                            )}

                            {selectedBanner.status === 'Designing' && (
                                <div className="info-section" style={{ marginTop: '20px' }}>
                                    <label>Upload Finished Design for Client Review</label>
                                    <div style={{ border: '2px dashed #e2e8f0', padding: '25px', textAlign: 'center', borderRadius: '12px', background: '#f8fafc' }}>
                                        <input 
                                            type="file" 
                                            id="design-upload-file" 
                                            hidden 
                                            onChange={(e) => {
                                                const file = e.target.files[0];
                                                if (file) {
                                                    const reader = new FileReader();
                                                    reader.onloadend = () => {
                                                        const updated = requests.map(r => 
                                                            r.id === selectedBanner.id ? { ...r, finalDesign: reader.result, status: 'In Review', designFeedback: null } : r
                                                        );
                                                        localStorage.setItem('hodama_banner_requests_v1', JSON.stringify(updated));
                                                        setRequests(updated);
                                                        setSelectedBanner(null);
                                                        alert("Design uploaded successfully! Sent to client for review.");
                                                    };
                                                    reader.readAsDataURL(file);
                                                }
                                            }}
                                        />
                                        <label htmlFor="design-upload-file" style={{ cursor: 'pointer', color: '#2563eb', fontWeight: '600', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                                            <Upload size={24} />
                                            <span>Click here to upload the final design (JPG/PNG)</span>
                                        </label>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="mbp-modal-footer">
                            <button className="reset-btn" onClick={() => setSelectedBanner(null)}>Close</button>
                            
                            <div style={{ display: 'flex', gap: '10px' }}>
                                {selectedBanner.status !== 'Approved' && (
                                    <button className="approve-btn" onClick={() => updateStatus(selectedBanner.id, 'Approved')}>
                                        <CheckCircle2 size={18} /> Approve
                                    </button>
                                )}

                                {selectedBanner.status !== 'Rejected' && (
                                    <button className="reject-btn" onClick={() => updateStatus(selectedBanner.id, 'Rejected')}>
                                        <XCircle size={18} /> Reject
                                    </button>
                                )}

                                {selectedBanner.status !== 'Pending' && (
                                    <button className="reset-btn" onClick={() => updateStatus(selectedBanner.id, 'Pending')}>
                                        Reset to Pending
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageBannerPromotions;
