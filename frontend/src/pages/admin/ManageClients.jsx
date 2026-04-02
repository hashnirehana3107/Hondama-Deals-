import React, { useState } from 'react';
import {
    Store,
    UserCheck,
    Clock,
    AlertCircle,
    Search,
    Filter,
    Eye,
    CheckCircle,
    XCircle,
    Ban,
    ChevronLeft,
    ChevronRight,
    Star,
    Package,
    ShoppingBag,
    TrendingUp,
    Phone,
    Mail,
    Calendar,
    ArrowLeft,
    Plus,
    X,
    MapPin,
    Briefcase
} from 'lucide-react';
import './ManageClients.css';

const ManageClients = () => {
    const [selectedClient, setSelectedClient] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    // Add Client Modal State
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [editingClient, setEditingClient] = useState(null);
    const [formData, setFormData] = useState({
        clientName: '', // Owner Name
        storeName: '',
        email: '',
        phone: '',
        status: 'Pending',
        address: '',
        businessCategory: 'Electronics',
        website: ''
    });

    // Mock Data for Clients
    const [clients, setClients] = useState([
        { id: 'S101', name: 'Amal Perera', store: 'Amal Electronics', email: 'amal@e-store.com', date: '10 May 2026', status: 'Pending', logo: 'AE', phone: '077 123 4567', rating: 0, sales: 0, orders: 0, address: '123 Main St, Colombo', website: 'www.amalelectronics.lk', category: 'Electronics' },
        { id: 'S102', name: 'Bimal Silva', store: 'Bimal Gadgets', email: 'bimal@gadgets.lk', date: '12 May 2026', status: 'Approved', logo: 'BG', phone: '071 987 6543', rating: 4.8, sales: 120, orders: 45, address: '45 Tech Ave, Kandy', website: 'www.bimalgadgets.com', category: 'Electronics' },
        { id: 'S103', name: 'Nuwan Perera', store: 'Nuwan Salon', email: 'nuwan@salon.com', date: '15 May 2026', status: 'Pending', logo: 'NS', phone: '075 444 3333', rating: 0, sales: 0, orders: 0, address: '88 Cyber Park, Galle', website: '', category: 'Salon' },
        { id: 'S104', name: 'Kasun Priyantha', store: 'Kasun Fashion', email: 'kasun@style.lk', date: '01 May 2026', status: 'Approved', logo: 'KF', phone: '070 111 2222', rating: 4.5, sales: 340, orders: 110, address: '12 Fashion St, Colombo', website: 'www.kasunstyle.lk', category: 'Fashion' },
        { id: 'S105', name: 'Sunil Rathnayaka', store: 'Grand Hotel', email: 'sunil@hotel.com', date: '20 Apr 2026', status: 'Blocked', logo: 'GH', phone: '072 555 6666', rating: 3.2, sales: 50, orders: 15, address: '55 Scholar Rd, Matara', website: 'www.grandhotelmatara.com', category: 'Hotel' },
    ]);

    // Mock Client Products
    const clientProducts = [
        { name: 'Wireless Headphones', category: 'Electronics', price: 'Rs 4,500', stock: 24, status: 'In Stock' },
        { name: 'Smart Watch Z', category: 'Electronics', price: 'Rs 12,000', stock: 10, status: 'Low Stock' },
        { name: 'BT Speaker Mini', category: 'Electronics', price: 'Rs 3,200', stock: 0, status: 'Out of Stock' }
    ];

    // Stats Calculation
    const stats = {
        total: clients.length,
        pending: clients.filter(s => s.status === 'Pending').length,
        active: clients.filter(s => s.status === 'Approved').length,
        blocked: clients.filter(s => s.status === 'Blocked').length,
    };

    const handleAction = (id, newStatus) => {
        setClients(clients.map(s => s.id === id ? { ...s, status: newStatus } : s));
        if (selectedClient && selectedClient.id === id) {
            setSelectedClient({ ...selectedClient, status: newStatus });
        }
    };

    const openAddModal = () => {
        setEditingClient(null);
        setFormData({
            clientName: '',
            storeName: '',
            email: '',
            phone: '',
            status: 'Pending',
            address: '',
            businessCategory: 'Electronics',
            website: ''
        });
        setIsFormModalOpen(true);
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        const logo = formData.storeName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

        if (editingClient) {
            setClients(clients.map(s => s.id === editingClient.id ? {
                ...s,
                name: formData.clientName,
                store: formData.storeName,
                email: formData.email,
                phone: formData.phone,
                status: formData.status,
                address: formData.address,
                website: formData.website,
                category: formData.businessCategory,
                logo
            } : s));
        } else {
            const newClient = {
                id: `S${Math.floor(100 + Math.random() * 900)}`,
                name: formData.clientName,
                store: formData.storeName,
                email: formData.email,
                phone: formData.phone,
                date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
                status: formData.status,
                address: formData.address,
                website: formData.website,
                category: formData.businessCategory,
                logo,
                rating: 0,
                sales: 0,
                orders: 0
            };
            setClients([newClient, ...clients]);
        }
        setIsFormModalOpen(false);
    };

    return (
        <div className="ams-page-wrapper">
            {/* 1. Page Header */}
            <div className="ams-header">
                <div className="ams-header-left">
                    <h1 className="ams-title">Manage Partners</h1>
                    <p className="ams-subtitle">Monitor and verify business partners and their deal performance</p>
                </div>
                <div className="ams-header-right">
                    <button className="ams-add-btn" onClick={openAddModal}>
                        <Plus size={18} /> Add New Partner
                    </button>
                </div>
            </div>

            {/* 2. Summary Cards */}
            <div className="ams-summary-grid">
                <div className="ams-sum-card adlay-shadow">
                    <div className="ams-sum-icon bg-blue"><Store size={24} /></div>
                    <div className="ams-sum-info">
                        <span className="ams-sum-val">{stats.total}</span>
                        <span className="ams-sum-lbl">Total Clients</span>
                    </div>
                </div>
                <div className="ams-sum-card adlay-shadow">
                    <div className="ams-sum-icon bg-yellow"><Clock size={24} /></div>
                    <div className="ams-sum-info">
                        <span className="ams-sum-val">{stats.pending}</span>
                        <span className="ams-sum-lbl">Pending Approval</span>
                    </div>
                </div>
                <div className="ams-sum-card adlay-shadow">
                    <div className="ams-sum-icon bg-green"><UserCheck size={24} /></div>
                    <div className="ams-sum-info">
                        <span className="ams-sum-val">{stats.active}</span>
                        <span className="ams-sum-lbl">Active Clients</span>
                    </div>
                </div>
                <div className="ams-sum-card adlay-shadow">
                    <div className="ams-sum-icon bg-red"><Ban size={24} /></div>
                    <div className="ams-sum-info">
                        <span className="ams-sum-val">{stats.blocked}</span>
                        <span className="ams-sum-lbl">Blocked Clients</span>
                    </div>
                </div>
            </div>

            {/* 3 & 4. Search & Filters */}
            <div className="ams-controls-card adlay-shadow">
                <div className="ams-search-box">
                    <Search size={20} />
                    <input
                        type="text"
                        placeholder="Search by name, store, email or ID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="ams-filters">
                    <div className="ams-filter-group">
                        <Filter size={18} />
                        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                            <option value="All">All Status</option>
                            <option value="Approved">Approved</option>
                            <option value="Pending">Pending</option>
                            <option value="Blocked">Blocked</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* 5. Clients Table */}
            <div className="ams-table-card adlay-shadow">
                <div className="ams-table-container">
                    <table className="ams-table">
                        <thead>
                            <tr>
                                <th>Partner ID</th>
                                <th>Partner / Store</th>
                                <th>Email Address</th>
                                <th>Join Date</th>
                                <th>Status</th>
                                <th className="text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {clients
                                .filter(s => (statusFilter === 'All' || s.status === statusFilter))
                                .filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.store.toLowerCase().includes(searchQuery.toLowerCase()) || s.id.toLowerCase().includes(searchQuery.toLowerCase()))
                                .map((client) => (
                                    <tr key={client.id}>
                                        <td className="ams-td-id">{client.id}</td>
                                        <td>
                                            <div className="ams-td-client">
                                                <div className="ams-client-logo">{client.logo}</div>
                                                <div className="ams-client-info">
                                                    <span className="ams-client-name">{client.name}</span>
                                                    <span className="ams-store-name">{client.store}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="ams-td-email">{client.email}</td>
                                        <td>{client.date}</td>
                                        <td>
                                            <span className={`ams-status-pill ${client.status.toLowerCase()}`}>
                                                {client.status}
                                            </span>
                                        </td>
                                        <td className="text-right">
                                            <div className="ams-actions">
                                                <button className="ams-btn-icon" onClick={() => setSelectedClient(client)} title="View Store">
                                                    <Eye size={18} />
                                                </button>
                                                {client.status === 'Pending' && (
                                                    <>
                                                        <button className="ams-btn-icon approve" onClick={() => handleAction(client.id, 'Approved')} title="Approve">
                                                            <CheckCircle size={18} />
                                                        </button>
                                                        <button className="ams-btn-icon reject" onClick={() => handleAction(client.id, 'Rejected')} title="Reject">
                                                            <XCircle size={18} />
                                                        </button>
                                                    </>
                                                )}
                                                {client.status === 'Approved' && (
                                                    <button className="ams-btn-icon block" onClick={() => handleAction(client.id, 'Blocked')} title="Block Client">
                                                        <Ban size={18} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>

                {/* 9. Pagination */}
                <div className="ams-pagination">
                    <span className="ams-pager-info">Showing {clients.length} clients</span>
                    <div className="ams-pager-btns">
                        <button className="ams-pager-btn disabled"><ChevronLeft size={18} /></button>
                        <button className="ams-pager-num active">1</button>
                        <button className="ams-pager-btn disabled"><ChevronRight size={18} /></button>
                    </div>
                </div>
            </div>

            {/* Add Client Modal */}
            {isFormModalOpen && (
                <div className="ams-modal-overlay">
                    <div className="ams-form-modal animate-scale-in">
                        <div className="ams-form-header">
                            <h2>{editingClient ? 'Edit Client Details' : 'Register New Client'}</h2>
                            <button className="ams-close-modal" onClick={() => setIsFormModalOpen(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleFormSubmit} className="ams-client-form">
                            <div className="ams-form-row">
                                <div className="ams-form-group" style={{ flex: 2 }}>
                                    <label>Business Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.storeName}
                                        onChange={(e) => setFormData({ ...formData, storeName: e.target.value, clientName: e.target.value })}
                                        placeholder="e.g. Tech Central Store"
                                    />
                                </div>
                                <div className="amu-form-group">
                                    <label>Business Category</label>
                                    <select
                                        value={formData.businessCategory}
                                        onChange={(e) => setFormData({ ...formData, businessCategory: e.target.value })}
                                        required
                                    >
                                        <option value="" disabled>Select category</option>
                                        <option value="Electronics">Electronics</option>
                                        <option value="Fashion">Fashion</option>
                                        <option value="Groceries">Groceries</option>
                                        <option value="Salon">Salon</option>
                                        <option value="Restaurant">Restaurant</option>
                                        <option value="Hotel">Hotel</option>
                                        <option value="Health & Beauty">Health & Beauty</option>
                                        <option value="Spa">Spa</option>
                                        <option value="Other">Other Services</option>
                                    </select>
                                </div>
                            </div>
                            <div className="ams-form-row">
                                <div className="amu-form-group">
                                    <label>Email Address</label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        placeholder="business@gmail.com"
                                    />
                                </div>
                                <div className="amu-form-group">
                                    <label>Phone Number</label>
                                    <input
                                        type="tel"
                                        required
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        placeholder="07XXXXXXXX"
                                    />
                                </div>
                            </div>
                            <div className="ams-form-row">
                                <div className="amu-form-group">
                                    <label>Account Status</label>
                                    <select
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Approved">Approved</option>
                                        <option value="Blocked">Blocked</option>
                                    </select>
                                </div>
                                <div className="amu-form-group" style={{ flex: 1.5 }}>
                                    <label>Store Address (Optional)</label>
                                    <input
                                        type="text"
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        placeholder="Full business address"
                                    />
                                </div>
                            </div>
                            
                            <div className="amu-form-footer">
                                <button type="button" className="amu-btn-cancel" onClick={() => setIsFormModalOpen(false)}>Cancel</button>
                                <button type="submit" className="amu-btn-save">{editingClient ? 'Update Partner' : 'Add Partner'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Client Details Panel */}
            {selectedClient && (
                <div className="ams-modal-overlay">
                    <div className="ams-modal-card animate-slide-in">
                        <div className="ams-modal-header">
                            <button className="ams-modal-back" onClick={() => setSelectedClient(null)}>
                                <ArrowLeft size={20} /> Back to List
                            </button>
                            <div className="ams-modal-header-actions">
                                {selectedClient.status === 'Pending' ? (
                                    <>
                                        <button className="ams-btn-approve-lg" onClick={() => handleAction(selectedClient.id, 'Approved')}>Approve Store</button>
                                        <button className="ams-btn-reject-lg" onClick={() => handleAction(selectedClient.id, 'Rejected')}>Reject Request</button>
                                    </>
                                ) : selectedClient.status === 'Approved' ? (
                                    <button className="ams-btn-block-lg" onClick={() => handleAction(selectedClient.id, 'Blocked')}>Block Client</button>
                                ) : (
                                    <button className="ams-btn-approve-lg" onClick={() => handleAction(selectedClient.id, 'Approved')}>Unblock Client</button>
                                )}
                            </div>
                        </div>

                        <div className="ams-modal-body">
                            <div className="ams-detail-grid">
                                <div className="ams-col-info">
                                    <section className="ams-detail-card">
                                        <h3 className="ams-card-title"><Store size={20} /> Store Information</h3>
                                        <div className="ams-store-profile">
                                            <div className="ams-profile-logo">{selectedClient.logo}</div>
                                            <div className="ams-profile-text">
                                                <h2>{selectedClient.store}</h2>
                                                <span className={`ams-status-pill ${selectedClient.status.toLowerCase()}`}>{selectedClient.status}</span>
                                            </div>
                                        </div>
                                        <div className="ams-info-list">
                                            <div className="ams-info-item">
                                                <UserCheck size={18} />
                                                <div className="ams-ii-text"><span>Client Name</span><strong>{selectedClient.name}</strong></div>
                                            </div>
                                            <div className="ams-info-item">
                                                <Mail size={18} />
                                                <div className="ams-ii-text"><span>Email Address</span><strong>{selectedClient.email}</strong></div>
                                            </div>
                                            <div className="ams-info-item">
                                                <Phone size={18} />
                                                <div className="ams-ii-text"><span>Phone Number</span><strong>{selectedClient.phone}</strong></div>
                                            </div>
                                            <div className="ams-info-item">
                                                <MapPin size={18} />
                                                <div className="ams-ii-text"><span>Address</span><strong>{selectedClient.address || 'N/A'}</strong></div>
                                            </div>
                                        </div>
                                    </section>

                                    <section className="ams-detail-card mt-4">
                                        <h3 className="ams-card-title"><TrendingUp size={20} /> Performance</h3>
                                        <div className="ams-perf-grid">
                                            <div className="ams-perf-item">
                                                <ShoppingBag size={24} className="text-blue" />
                                                <div className="ams-pi-text"><strong>{selectedClient.orders}</strong><span>Total Inquiries</span></div>
                                            </div>
                                            <div className="ams-perf-item">
                                                <Star size={24} className="text-yellow" />
                                                <div className="ams-pi-text"><strong>{selectedClient.rating || 'N/A'}</strong><span>Rating</span></div>
                                            </div>
                                            <div className="ams-perf-item">
                                                <Package size={24} className="text-green" />
                                                <div className="ams-pi-text"><strong>{selectedClient.sales}</strong><span>Deal Views</span></div>
                                            </div>
                                        </div>
                                    </section>
                                </div>

                                <div className="ams-col-data">
                                    <section className="ams-detail-card">
                                        <h3 className="ams-card-title"><Package size={20} /> Top Products</h3>
                                        {clientProducts.length > 0 ? (
                                            <table className="ams-mini-table">
                                                <thead>
                                                    <tr>
                                                        <th>Product</th>
                                                        <th>Price</th>
                                                        <th>Stock</th>
                                                        <th>Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {clientProducts.map((p, i) => (
                                                        <tr key={i}>
                                                            <td>{p.name}</td>
                                                            <td>{p.price}</td>
                                                            <td>{p.stock} Clicks</td>
                                                            <td><span className={`status-text ${p.status.toLowerCase().replace(' ', '-')}`}>Active</span></td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        ) : (
                                            <p className="no-data">No products found for this client.</p>
                                        )}
                                    </section>

                                    <section className="ams-detail-card mt-4">
                                        <h3 className="ams-card-title"><Briefcase size={20} /> Documents</h3>
                                        <div className="ams-empty-state">
                                            <AlertCircle size={32} />
                                            <p>Verification documents pending review</p>
                                        </div>
                                    </section>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageClients;
