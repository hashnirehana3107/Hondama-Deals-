import React, { useState } from 'react';
import {
    Users,
    UserCheck,
    UserMinus,
    UserPlus,
    Search,
    Filter,
    Eye,
    Ban,
    Trash2,
    ChevronLeft,
    ChevronRight,
    ShoppingBag,
    RefreshCw,
    LifeBuoy,
    Mail,
    Phone,
    Calendar,
    ArrowLeft,
    MoreVertical,
    CheckCircle,
    MapPin,
    Edit3,
    X,
    Shield,
    Briefcase
} from 'lucide-react';
import ConfirmModal from '../../components/common/ConfirmModal';
import './ManageUsers.css';

const ManageUsers = () => {
    const [selectedUser, setSelectedUser] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [roleFilter, setRoleFilter] = useState('All');
    const [confirmDelete, setConfirmDelete] = useState({ isOpen: false, userId: null });

    // User Form Modal State
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        role: 'User',
        status: 'Active',
        location: 'Colombo'
    });

    // Mock Data for Users
    const [users, setUsers] = useState([
        { id: 'U1024', name: 'Nimal Perera', email: 'nimal@example.com', phone: '077 123 4567', date: '10 May 2026', status: 'Active', role: 'User', avatar: 'NP', location: 'Colombo' },
        { id: 'U1025', name: 'Hashni Rehana', email: 'hashni@example.com', phone: '071 987 6543', date: '12 May 2026', status: 'Active', role: 'User', avatar: 'HR', location: 'Kandy' },
        { id: 'U1027', name: 'Sunil Rathnayaka', email: 'sunil@example.com', phone: '070 111 2222', date: '01 Jun 2026', status: 'Active', role: 'User', avatar: 'SR', location: 'Jaffna' },
        { id: 'U1028', name: 'Dinuka Mendis', email: 'dinuka@example.com', phone: '077 555 9900', date: '05 Jun 2026', status: 'Blocked', role: 'User', avatar: 'DM', location: 'Galle' },
        { id: 'U1030', name: 'Admin User', email: 'admin@hodamadeals.lk', phone: '011 222 3333', date: '01 Jan 2026', status: 'Active', role: 'Admin', avatar: 'AU', location: 'Colombo' },
    ]);

    // Stats Calculation
    const stats = {
        total: users.length + 845,
        active: users.filter(u => u.status === 'Active').length + 810,
        blocked: users.filter(u => u.status === 'Blocked').length + 35,
        new: 45
    };

    const handleAction = (id, newStatus) => {
        setUsers(users.map(u => u.id === id ? { ...u, status: newStatus } : u));
        if (selectedUser && selectedUser.id === id) {
            setSelectedUser({ ...selectedUser, status: newStatus });
        }
    };

    const handleDelete = (id) => {
        setConfirmDelete({ isOpen: true, userId: id });
    };

    const confirmDeleteAction = () => {
        if (confirmDelete.userId) {
            setUsers(users.filter(u => u.id !== confirmDelete.userId));
            setConfirmDelete({ isOpen: false, userId: null });
            setSelectedUser(null);
        }
    };

    const openAddModal = () => {
        setEditingUser(null);
        setFormData({
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            role: 'User',
            status: 'Active',
            location: 'Colombo'
        });
        setIsFormModalOpen(true);
    };

    const openEditModal = (user) => {
        const nameParts = user.name.split(' ');
        const fName = nameParts[0];
        const lName = nameParts.slice(1).join(' ');
        setEditingUser(user);
        setFormData({
            firstName: fName,
            lastName: lName,
            email: user.email,
            phone: user.phone,
            role: user.role || 'User',
            status: user.status,
            location: user.location
        });
        setIsFormModalOpen(true);
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        const fullName = `${formData.firstName} ${formData.lastName}`;
        const avatar = formData.firstName.charAt(0) + (formData.lastName ? formData.lastName.charAt(0) : '');

        if (editingUser) {
            setUsers(users.map(u => u.id === editingUser.id ? {
                ...u,
                name: fullName,
                email: formData.email,
                phone: formData.phone,
                role: formData.role,
                status: formData.status,
                location: formData.location,
                avatar
            } : u));
        } else {
            const newUser = {
                id: `U${Math.floor(1000 + Math.random() * 9000)}`,
                name: fullName,
                email: formData.email,
                phone: formData.phone,
                date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
                status: formData.status,
                role: formData.role,
                avatar,
                location: formData.location
            };
            setUsers([newUser, ...users]);
        }
        setIsFormModalOpen(false);
    };

    return (
        <div className="amu-page-wrapper">
            {/* 1. Page Header */}
            <div className="amu-header">
                <div className="amu-header-left">
                    <h1 className="amu-title">Manage Standard Users</h1>
                    <p className="amu-subtitle">Monitor and manage all registered Users</p>
                </div>
                <div className="amu-header-right">
                    <button className="amu-add-btn" onClick={openAddModal}>
                        <UserPlus size={18} /> Add New User
                    </button>
                </div>
            </div>

            {/* 2. Users Summary Cards */}
            <div className="amu-summary-grid">
                <div className="amu-stat-card adlay-shadow">
                    <div className="amu-stat-icon bg-blue"><Users size={24} /></div>
                    <div className="amu-stat-content">
                        <span className="amu-stat-value">{stats.total}</span>
                        <span className="amu-stat-label">Total Shoppers</span>
                    </div>
                </div>
                <div className="amu-stat-card adlay-shadow">
                    <div className="amu-stat-icon bg-green"><UserCheck size={24} /></div>
                    <div className="amu-stat-content">
                        <span className="amu-stat-value">{stats.active}</span>
                        <span className="amu-stat-label">Active Users</span>
                    </div>
                </div>
                <div className="amu-stat-card adlay-shadow">
                    <div className="amu-stat-icon bg-red"><UserMinus size={24} /></div>
                    <div className="amu-stat-content">
                        <span className="amu-stat-value">{stats.blocked}</span>
                        <span className="amu-stat-label">Blocked Accounts</span>
                    </div>
                </div>
                <div className="amu-stat-card adlay-shadow">
                    <div className="amu-stat-icon bg-yellow"><UserPlus size={24} /></div>
                    <div className="amu-stat-content">
                        <span className="amu-stat-value">{stats.new}</span>
                        <span className="amu-stat-label">New This Month</span>
                    </div>
                </div>
            </div>

            {/* 3 & 4. Search & Filters */}
            <div className="amu-controls-card adlay-shadow">
                <div className="amu-search-box">
                    <Search size={20} />
                    <input
                        type="text"
                        placeholder="Search by name, email, phone or user ID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="amu-filters">
                    <div className="amu-filter-item">
                        <Shield size={18} />
                        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
                            <option value="All">All Roles</option>
                            <option value="User">Shoppers</option>
                            <option value="Admin">Administrators</option>
                        </select>
                    </div>
                    <div className="amu-filter-item">
                        <Filter size={18} />
                        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                            <option value="All">All Status</option>
                            <option value="Active">Active</option>
                            <option value="Blocked">Blocked</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* 5. Users Table */}
            <div className="amu-table-card adlay-shadow">
                <div className="amu-table-container">
                    <table className="amu-table">
                        <thead>
                            <tr>
                                <th>User ID</th>
                                <th>Name / Email</th>
                                <th>Role</th>
                                <th>Phone Number</th>
                                <th>Join Date</th>
                                <th>Status</th>
                                <th className="text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users
                                .filter(u => (statusFilter === 'All' || u.status === statusFilter))
                                .filter(u => (roleFilter === 'All' || u.role === roleFilter))
                                .filter(u => u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase()) || u.id.toLowerCase().includes(searchQuery.toLowerCase()))
                                .map((user) => (
                                    <tr key={user.id}>
                                        <td className="amu-td-id">{user.id}</td>
                                        <td>
                                            <div className="amu-user-cell">
                                                <div className="amu-user-avatar">{user.avatar}</div>
                                                <div className="amu-user-info">
                                                    <span className="amu-user-name">{user.name}</span>
                                                    <span className="amu-user-email">{user.email}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`amu-role-tag ${user.role?.toLowerCase() || 'user'}`}>
                                                {user.role || 'User'}
                                            </span>
                                        </td>
                                        <td className="amu-val-bold">{user.phone}</td>
                                        <td>{user.date}</td>
                                        <td>
                                            <span className={`amu-status-pill ${user.status.toLowerCase()}`}>
                                                {user.status}
                                            </span>
                                        </td>
                                        <td className="text-right">
                                            <div className="amu-table-actions">
                                                <button className="amu-btn-icon" onClick={() => setSelectedUser(user)} title="View Profile">
                                                    <Eye size={18} />
                                                </button>
                                                <button className="amu-btn-icon secondary" onClick={() => openEditModal(user)} title="Edit User">
                                                    <Edit3 size={18} />
                                                </button>
                                                <button
                                                    className={`amu-btn-icon ${user.status === 'Active' ? 'warn' : 'success'}`}
                                                    onClick={() => handleAction(user.id, user.status === 'Active' ? 'Blocked' : 'Active')}
                                                    title={user.status === 'Active' ? 'Block User' : 'Unblock User'}
                                                >
                                                    <Ban size={18} />
                                                </button>
                                                <button className="amu-btn-icon danger" onClick={() => handleDelete(user.id)} title="Delete User">
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>

                <div className="amu-pagination">
                    <span className="amu-pager-info">Showing {users.length} users</span>
                    <div className="amu-pager-controls">
                        <button className="amu-pager-nav disabled"><ChevronLeft size={18} /></button>
                        <button className="amu-pager-num active">1</button>
                        <button className="amu-pager-nav disabled"><ChevronRight size={18} /></button>
                    </div>
                </div>
            </div>

            {/* Add / Edit User Modal */}
            {isFormModalOpen && (
                <div className="amu-modal-overlay">
                    <div className="amu-form-modal animate-scale-in">
                        <div className="amu-form-header">
                            <h2>{editingUser ? 'Edit User Profile' : 'Add New User'}</h2>
                            <button className="amu-close-modal" onClick={() => setIsFormModalOpen(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleFormSubmit} className="amu-user-form">
                            <div className="amu-form-row">
                                <div className="amu-form-group">
                                    <label>First Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.firstName}
                                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                        placeholder="Enter first name"
                                    />
                                </div>
                                <div className="amu-form-group">
                                    <label>Last Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.lastName}
                                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                        placeholder="Enter last name"
                                    />
                                </div>
                            </div>
                            <div className="amu-form-row">
                                <div className="amu-form-group">
                                    <label>Email Address</label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        placeholder="example@gmail.com"
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
                            <div className="amu-form-row">
                                <div className="amu-form-group">
                                    <label>Role</label>
                                    <select
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    >
                                        <option value="User">User</option>
                                        <option value="Admin">Admin</option>
                                    </select>
                                </div>
                                <div className="amu-form-group">
                                    <label>Status</label>
                                    <select
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    >
                                        <option value="Active">Active</option>
                                        <option value="Blocked">Blocked</option>
                                    </select>
                                </div>
                            </div>
                            <div className="amu-form-group">
                                <label>Location / Area</label>
                                <input
                                    type="text"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    placeholder="e.g. Colombo, Kandy"
                                />
                            </div>



                            <div className="amu-form-footer">
                                <button type="button" className="amu-btn-cancel" onClick={() => setIsFormModalOpen(false)}>Cancel</button>
                                <button type="submit" className="amu-btn-save">
                                    {editingUser ? 'Update User' : 'Create User'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* 8. User Details Modal (View Only) */}
            {selectedUser && (
                <div className="amu-modal-overlay">
                    <div className="amu-modal-content animate-slide-in">
                        <header className="amu-modal-header">
                            <button className="amu-btn-back" onClick={() => setSelectedUser(null)}>
                                <ArrowLeft size={20} /> Back to User List
                            </button>
                            <div className="amu-header-actions">
                                <button className="amu-btn-action btn-edit" onClick={() => { openEditModal(selectedUser); setSelectedUser(null); }}>Edit Profile</button>
                                <button className="amu-btn-action btn-delete" onClick={() => handleDelete(selectedUser.id)}>Delete User</button>
                            </div>
                        </header>

                        <div className="amu-modal-body">
                            <div className="amu-details-layout">
                                <div className="amu-col-left">
                                    <section className="amu-profile-card">
                                        <div className="amu-profile-top">
                                            <div className="amu-profile-avatar">{selectedUser.avatar}</div>
                                            <div className="amu-profile-main">
                                                <h2>{selectedUser.name}</h2>
                                                <div className="amu-profile-tags">
                                                    <span className={`amu-role-tag ${selectedUser.role?.toLowerCase() || 'user'}`}>{selectedUser.role || 'User'}</span>
                                                    <span className={`amu-status-pill ${selectedUser.status.toLowerCase()}`}>{selectedUser.status}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="amu-profile-items">
                                            <div className="amu-p-item">
                                                <Mail size={18} />
                                                <div className="amu-p-text"><span>Email Address</span><strong>{selectedUser.email}</strong></div>
                                            </div>
                                            <div className="amu-p-item">
                                                <Phone size={18} />
                                                <div className="amu-p-text"><span>Phone Number</span><strong>{selectedUser.phone}</strong></div>
                                            </div>
                                            <div className="amu-p-item">
                                                <MapPin size={18} />
                                                <div className="amu-p-text"><span>Location</span><strong>{selectedUser.location}</strong></div>
                                            </div>
                                            <div className="amu-p-item">
                                                <Calendar size={18} />
                                                <div className="amu-p-text"><span>Member Since</span><strong>{selectedUser.date}</strong></div>
                                            </div>
                                        </div>
                                    </section>
                                </div>

                                <div className="amu-col-right">
                                    <div className="amu-details-grid">
                                        <section className="amu-details-section">
                                            <h3 className="amu-section-title"><ShoppingBag size={20} /> Saved Deals</h3>
                                            <p className="no-data">No saved deals found for this user.</p>
                                        </section>
                                        <section className="amu-details-section">
                                            <h3 className="amu-section-title"><LifeBuoy size={20} /> Support History</h3>
                                            <p className="no-data">No support tickets found.</p>
                                        </section>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <ConfirmModal
                isOpen={confirmDelete.isOpen}
                onClose={() => setConfirmDelete({ isOpen: false, userId: null })}
                onConfirm={confirmDeleteAction}
                title="Delete User Account?"
                message="Are you sure you want to permanently delete this user account? This will remove all their profile data and cannot be undone."
                confirmText="Delete Account"
                type="danger"
            />
        </div>
    );
};

export default ManageUsers;

