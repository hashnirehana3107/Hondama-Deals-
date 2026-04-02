const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'frontend', 'src', 'pages', 'client', 'ManageDeals.jsx');

const content = `import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Package,
    Plus,
    ShoppingBag,
    User,
    LogOut,
    Menu,
    Search,
    Bell,
    MessageSquare,
    X,
    Filter,
    Edit2,
    Trash2,
    Eye,
    ChevronLeft,
    ChevronRight,
    CheckCircle2,
    AlertCircle,
    Archive,
    Save,
    RotateCcw,
    Tag,
    Image as ImageIcon,
    UploadCloud,
    Home,
    RefreshCw,
    Clock,
    AlertTriangle,
    MapPin,
    Store
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import ClientSidebar from '../../components/layout/ClientSidebar';
import ClientTopbar from '../../components/layout/ClientTopbar';
import { getStoredCategories } from '../../utils/categoryUtils';
import './ManageDeals.css';

const ManageDeals = () => {
    const navigate = useNavigate();
    const { logout, user } = useAuth();

    // Layout State
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const [products, setProducts] = useState([]);

    useEffect(() => {
        // Load combined deals from localStorage
        const fetchDeals = () => {
            const storedDeals = JSON.parse(localStorage.getItem('hodama_all_deals_v1') || '[]');
            
            // Map the storage format to the UI format if necessary
            const mappedDeals = storedDeals.map(d => ({
                ...d,
                id: d.id.toString(),
                image: d.img || d.image || "/assets/images/placeholder_deal.png",
                originalPrice: d.oldPrice ? parseInt(d.oldPrice.toString().replace(/[^0-9]/g, '')) : 0,
                price: parseInt((d.price || '0').toString().replace(/[^0-9]/g, '')),
                status: d.status || "Active",
                views: d.views || 0,
                stock: d.stockLeft || 0
            }));

            // Include initial mock products if needed, but for persistence we focus on storage
            setProducts([...mappedDeals]);
        };

        fetchDeals();
        // Listen for storage changes in other tabs
        window.addEventListener('storage', fetchDeals);
        return () => window.removeEventListener('storage', fetchDeals);
    }, []);

    // Sync state to localStorage whenever products change locally
    const updateStorage = (updatedProducts) => {
        const storedDeals = JSON.parse(localStorage.getItem('hodama_all_deals_v1') || '[]');
        
        // Re-map back to the storage format expected by Home/Listing
        const finalDeals = updatedProducts.map(p => {
            const original = storedDeals.find(d => d.id.toString() === p.id.toString()) || {};
            return {
                ...original,
                ...p, // preserve new stuff
                id: p.id,
                name: p.name,
                subtitle: p.subtitle,
                category: p.category,
                price: p.price.toLocaleString(),
                oldPrice: p.originalPrice > 0 ? p.originalPrice.toLocaleString() : null,
                img: p.image,
                status: p.status,
                availability: p.availability || p.status,
                availability2: p.availability2,
                views: p.views,
                stockLeft: p.stock,
                totalStock: p.totalStock || p.stock,
                storeName: p.storeName || p.brand,
                dealType: p.dealType || "OFFER",
                expiryDate: p.expiryDate,
                location: p.location,
                description: p.description,
                highlights: p.highlights,
                terms: p.terms,
                badge: p.badge,
                websiteUrl: p.websiteUrl,
                businessPhone: p.businessPhone,
                storeImg: p.storeImg
            };
        });

        localStorage.setItem('hodama_all_deals_v1', JSON.stringify(finalDeals));
        setProducts(updatedProducts);
    };

    // Filter & Search States
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('All');
    const [sortBy, setSortBy] = useState('Latest');
    const [selectedProducts, setSelectedProducts] = useState([]);

    const [globalCategories, setGlobalCategories] = useState([]);
    useEffect(() => {
        setGlobalCategories(getStoredCategories());
    }, []);

    // Category display helper mapping
    const categoryNames = {
        'electronics': 'Electronics',
        'computers': 'Computers & Accessories',
        'fashion': 'Fashion',
        'homeLifestyle': 'Home & Lifestyle',
        'groceries': 'Groceries',
        'healthBeauty': 'Health & Beauty',
        'sportsFitness': 'Sports & Fitness',
        'babyKids': 'Baby & Kids',
        'automotive': 'Automotive',
        'salon': 'Salon',
        'restaurant': 'Restaurant',
        'hotel': 'Hotel',
        'spa': 'Spa',
        'other': 'Other'
    };

    // Modal States
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    // Derived State: Filtered & Sorted Products
    const filteredProducts = useMemo(() => {
        let result = products.filter(product => {
            const matchesSearch = (product.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                (product.id || '').toString().toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = categoryFilter === 'All' || product.category === categoryFilter;
            const matchesStatus = statusFilter === 'All' || product.status === statusFilter;
            return matchesSearch && matchesCategory && matchesStatus;
        });

        if (sortBy === 'PriceLow') {
            result.sort((a, b) => a.price - b.price);
        } else if (sortBy === 'PriceHigh') {
            result.sort((a, b) => b.price - a.price);
        } else if (sortBy === 'Views') {
            result.sort((a, b) => (b.views || 0) - (a.views || 0));
        } else if (sortBy === 'Latest') {
            result.sort((a, b) => b.id - a.id);
        }
        return result;
    }, [products, searchTerm, categoryFilter, statusFilter, sortBy]);

    // Statistics
    const totalProducts = products.length;
    const activeProducts = products.filter(p => p.status === 'Active' || p.status === 'In Stock').length;
    const totalViews = products.reduce((acc, curr) => acc + (curr.views || 0), 0);

    // Handlers
    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedProducts(filteredProducts.map(p => p.id));
        } else {
            setSelectedProducts([]);
        }
    };

    const handleSelectOne = (id) => {
        if (selectedProducts.includes(id)) {
            setSelectedProducts(selectedProducts.filter(pId => pId !== id));
        } else {
            setSelectedProducts([...selectedProducts, id]);
        }
    };

    const handleBulkAction = (action) => {
        if (selectedProducts.length === 0) return;
        if (action === 'Delete') {
            if (window.confirm(\`Are you sure you want to delete \${selectedProducts.length} items?\`)) {
                const updated = products.filter(p => !selectedProducts.includes(p.id));
                updateStorage(updated);
                setSelectedProducts([]);
            }
        } else if (action === 'Disable') {
            const updated = products.map(p => selectedProducts.includes(p.id) ? { ...p, status: 'Disabled' } : p);
            updateStorage(updated);
            setSelectedProducts([]);
        }
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this deal?')) {
            const updated = products.filter(p => p.id !== id);
            updateStorage(updated);
            alert('Deal deleted successfully!');
        }
    };

    const resetFilters = () => {
        setSearchTerm('');
        setCategoryFilter('All');
        setStatusFilter('All');
        setSortBy('Latest');
    };

    const openViewModal = (product) => {
        setCurrentProduct(product);
        setIsViewModalOpen(true);
    };

    const openEditModal = (product) => {
        setCurrentProduct({ ...product }); // create copy for editing
        setIsEditModalOpen(true);
    };

    const closeModals = () => {
        setIsViewModalOpen(false);
        setIsEditModalOpen(false);
        setCurrentProduct(null);
    };

    const handleEditSave = (e) => {
        e.preventDefault();
        const updated = products.map(p => p.id === currentProduct.id ? currentProduct : p);
        updateStorage(updated);
        closeModals();
        alert('Deal updated successfully!');
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let { width, height } = img;
                    const maxDim = 800;
                    if (width > height && width > maxDim) {
                        height = Math.round((height * maxDim) / width);
                        width = maxDim;
                    } else if (height > maxDim) {
                        width = Math.round((width * maxDim) / height);
                        height = maxDim;
                    }
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);
                    setCurrentProduct({...currentProduct, image: canvas.toDataURL('image/jpeg', 0.6)});
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="client-dashboard-wrapper">
            <ClientSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

            {/* Main Content */}
            <main className="dashboard-main-content">
                <ClientTopbar toggleSidebar={toggleSidebar} />

                {/* View Container */}
                <div className="dashboard-view-container mp-scroll-container">
                    <div className="mp-wrapper fade-in">

                        {/* 0. Breadcrumb */}
                        <div className="mp-breadcrumb">
                            <span onClick={() => navigate('/client/dashboard')}>Dashboard</span>
                            <ChevronRight size={14} />
                            <span className="current">Manage Deals</span>
                        </div>

                        {/* 1. Page Header */}
                        <div className="mp-page-header">
                            <div>
                                <h1><Archive size={28} /> Manage Deals</h1>
                                <p>View, edit, and manage all your active and upcoming offers.</p>
                            </div>
                            <button className="mp-btn-add" onClick={() => navigate('/client/add-deal')}>
                                <Plus size={20} /> Add New Deal
                            </button>
                        </div>

                        {/* 2. Quick Stats */}
                        <div className="mp-quick-stats">
                            <div className="mp-stat-card">
                                <div className="mp-stat-icon mp-stat-total"><Package size={24} /></div>
                                <div className="mp-stat-info">
                                    <span className="mp-stat-val">{totalProducts}</span>
                                    <span className="mp-stat-label">Total Deals</span>
                                </div>
                            </div>
                            <div className="mp-stat-card">
                                <div className="mp-stat-icon mp-stat-active"><CheckCircle2 size={24} /></div>
                                <div className="mp-stat-info">
                                    <span className="mp-stat-val">{activeProducts}</span>
                                    <span className="mp-stat-label">Active Deals</span>
                                </div>
                            </div>
                            <div className="mp-stat-card">
                                <div className="mp-stat-icon mp-stat-oos"><Eye size={24} /></div>
                                <div className="mp-stat-info">
                                    <span className="mp-stat-val">{totalViews > 1000 ? (totalViews/1000).toFixed(1)+'k' : totalViews}</span>
                                    <span className="mp-stat-label">Total Views</span>
                                </div>
                            </div>
                        </div>



                        {/* 3. Search & Filters */}
                        <div className="mp-filters-section">
                            <div className="mp-search-bar">
                                <Search size={20} color="#94a3b8" />
                                <input
                                    type="text"
                                    placeholder="Search products by name or ID..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="mp-filter-grid">
                                <div className="mp-filter-item">
                                    <label><Filter size={14} className="inline mr-1" /> Category</label>
                                    <select
                                        value={categoryFilter}
                                        onChange={(e) => setCategoryFilter(e.target.value)}
                                    >
                                        <option value="All">All Categories</option>
                                        {globalCategories.map(cat => (
                                            <option key={cat.id} value={cat.name}>{cat.name}</option>
                                        ))}
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <div className="mp-filter-item">
                                    <label>Status</label>
                                    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                                        <option value="All">All Status</option>
                                        <option value="Active">Active</option>
                                        <option value="Expired">Expired</option>
                                        <option value="Draft">Draft</option>
                                        <option value="Disabled">Disabled</option>
                                    </select>
                                </div>
                                <div className="mp-filter-item">
                                    <label>Sort By</label>
                                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                                        <option value="Latest">Latest Added</option>
                                        <option value="PriceLow">Price: Low to High</option>
                                        <option value="PriceHigh">Price: High to Low</option>
                                        <option value="Views">Most Viewed</option>
                                    </select>
                                </div>
                                <div className="mp-filter-item mp-filter-reset">
                                    <button className="mp-btn-reset" onClick={resetFilters} title="Reset All Filters" type="button">
                                        <RotateCcw size={16} /> Reset
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* 4. Products Table */}
                        <div className="mp-table-container">
                            {/* Bulk Actions */}
                            {selectedProducts.length > 0 && (
                                <div className="mp-bulk-actions fade-in">
                                    <span className="mp-bulk-label">{selectedProducts.length} Items Selected:</span>
                                    <button className="mp-bulk-btn delete" onClick={() => handleBulkAction('Delete')}>Delete Selected</button>
                                    <button className="mp-bulk-btn" onClick={() => handleBulkAction('Disable')}>Disable Products</button>
                                </div>
                            )}

                            <div className="mp-table-scroll">
                                <table className="mp-table">
                                    <thead>
                                        <tr>
                                            <th style={{ width: '40px' }}>
                                                <input
                                                    type="checkbox"
                                                    className="mp-checkbox"
                                                    onChange={handleSelectAll}
                                                    checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                                                />
                                            </th>
                                            <th>Deal Info</th>
                                            <th>Price</th>
                                            <th>Grab Clicks</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredProducts.length === 0 && (
                                            <tr>
                                                <td colSpan="6" className="text-center py-8 text-gray-500 font-bold">
                                                    No products found matching your search.
                                                </td>
                                            </tr>
                                        )}
                                        {filteredProducts.map((product) => (
                                            <tr key={product.id}>
                                                <td>
                                                    <input
                                                        type="checkbox"
                                                        className="mp-checkbox"
                                                        checked={selectedProducts.includes(product.id)}
                                                        onChange={() => handleSelectOne(product.id)}
                                                    />
                                                </td>
                                                <td>
                                                    <div className="mp-prod-col">
                                                        <img src={product.image} alt={product.name} className="mp-prod-img" />
                                                        <div className="mp-prod-info">
                                                            <span className="mp-prod-name">{product.name}</span>
                                                            <span className="mp-prod-cat">{categoryNames[product.category] || product.category} • ID: {product.id}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="mp-price">LKR {product.price.toLocaleString()}</div>
                                                </td>
                                                <td>
                                                    <div className="mp-stock">
                                                        {product.views || 0} Clicks
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className={\`mp-badge \${product.status?.toLowerCase() || 'pending'}\`}>
                                                        {product.status === 'Approved' || product.status === 'Active' ? <CheckCircle2 size={12} /> : 
                                                         product.status === 'Pending' ? <Clock size={12} /> : 
                                                         <AlertTriangle size={12} />}
                                                        {product.status || 'Pending'}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="mp-actions-cell">
                                                        <button
                                                            className="mp-icon-btn edit"
                                                            title="Edit Product"
                                                            onClick={() => openEditModal(product)}
                                                        >
                                                            <Edit2 size={16} />
                                                        </button>
                                                         <button
                                                            className="mp-icon-btn"
                                                            title="Preview Deal"
                                                            onClick={() => openViewModal(product)}
                                                        >
                                                            <Eye size={16} />
                                                        </button>
                                                        <button
                                                            className="mp-icon-btn delete"
                                                            title="Delete Product"
                                                            onClick={() => handleDelete(product.id)}
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* 5. Pagination */}
                        {filteredProducts.length > 0 && (
                            <div className="mp-pagination">
                                <span className="text-sm font-bold text-gray-500 mr-4">Showing 1-{filteredProducts.length} of {filteredProducts.length}</span>
                                <button className="mp-page-btn" disabled><ChevronLeft size={18} /></button>
                                <button className="mp-page-btn active">1</button>
                                <button className="mp-page-btn" disabled><ChevronRight size={18} /></button>
                            </div>
                        )}

                    </div>
                </div>
            </main>

            {/* View/Preview Modal Premium */}
            {isViewModalOpen && currentProduct && (
                <div className="mp-modal-overlay fade-in">
                    <div className="mp-modal-content" style={{maxWidth: '600px', borderRadius: '24px', overflow: 'hidden'}}>
                        <div className="mp-modal-header" style={{borderBottom: 'none', background: '#f8fafc', paddingBottom: '16px'}}>
                            <h3 style={{display: 'flex', alignItems: 'center', gap: '8px', color: '#0f172a'}}>
                                <Eye size={20} color="#3b82f6" /> Deal Preview
                            </h3>
                            <button className="mp-modal-close" onClick={closeModals}><X size={20} /></button>
                        </div>
                        <div className="mp-modal-body" style={{padding: '0 30px 30px 30px', background: '#f8fafc'}}>
                            <div style={{
                                position: 'relative', 
                                width: '100%', 
                                height: '240px', 
                                borderRadius: '16px', 
                                overflow: 'hidden',
                                boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                            }}>
                                <img src={currentProduct.image} alt={currentProduct.name} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                                {currentProduct.badge && (
                                    <div style={{position: 'absolute', top: '16px', left: '16px', background: '#ef4444', color: 'white', padding: '6px 12px', borderRadius: '50px', fontWeight: '800', fontSize: '0.8rem'}}>
                                        {currentProduct.badge}
                                    </div>
                                )}
                            </div>
                            
                            <div style={{marginTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                                <div>
                                    <h2 style={{fontSize: '1.5rem', fontWeight: '900', color: '#0f172a', marginBottom: '8px', lineHeight: '1.2'}}>{currentProduct.name}</h2>
                                    {currentProduct.subtitle && <p style={{color: '#64748b', fontSize: '0.95rem', marginBottom: '8px'}}>{currentProduct.subtitle}</p>}
                                    <div style={{display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.85rem', color: '#94a3b8', fontWeight: '600'}}>
                                        <span style={{display: 'flex', alignItems: 'center', gap: '4px'}}><Store size={14} /> {currentProduct.storeName || 'Premium Store'}</span>
                                        <span style={{display: 'flex', alignItems: 'center', gap: '4px'}}><MapPin size={14} /> {currentProduct.location || 'Nationwide'}</span>
                                    </div>
                                </div>
                                <div style={{textAlign: 'right'}}>
                                    <div style={{fontSize: '1.5rem', fontWeight: '900', color: '#10b981'}}>Rs. {currentProduct.price.toLocaleString()}</div>
                                    {currentProduct.originalPrice > currentProduct.price && (
                                        <div style={{fontSize: '0.9rem', color: '#94a3b8', textDecoration: 'line-through', fontWeight: '600'}}>Rs. {currentProduct.originalPrice.toLocaleString()}</div>
                                    )}
                                </div>
                            </div>
                            
                            <div style={{marginTop: '24px', background: 'white', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0'}}>
                                <h4 style={{fontSize: '0.95rem', fontWeight: '800', color: '#334155', marginBottom: '12px'}}>Deal Information</h4>
                                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '0.9rem'}}>
                                    <div><strong style={{color: '#64748b', fontWeight: '600'}}>Type:</strong> <span style={{color: '#334155', fontWeight: '700'}}>{currentProduct.dealType || 'Offer'}</span></div>
                                    <div><strong style={{color: '#64748b', fontWeight: '600'}}>Status:</strong> <span style={{color: '#334155', fontWeight: '700', padding: '2px 8px', borderRadius: '4px', background: currentProduct.status === 'Active' ? '#dcfce7' : '#fee2e2', color: currentProduct.status === 'Active' ? '#16a34a' : '#ef4444'}}>{currentProduct.status}</span></div>
                                    <div><strong style={{color: '#64748b', fontWeight: '600'}}>Category:</strong> <span style={{color: '#334155', fontWeight: '700'}}>{currentProduct.category}</span></div>
                                    <div><strong style={{color: '#64748b', fontWeight: '600'}}>Stock:</strong> <span style={{color: '#334155', fontWeight: '700'}}>{currentProduct.stock || 0} left</span></div>
                                    <div style={{gridColumn: '1 / -1'}}><strong style={{color: '#64748b', fontWeight: '600'}}>Expiry:</strong> <span style={{color: '#334155', fontWeight: '700'}}>{currentProduct.expiryDate || 'N/A'}</span></div>
                                </div>
                            </div>
                        </div>
                        <div className="mp-modal-footer" style={{padding: '20px 30px', justifyContent: 'flex-end', gap: '12px'}}>
                            <button type="button" className="mp-btn-outline" onClick={closeModals} style={{padding: '10px 20px', borderRadius: '12px', fontWeight: '700'}}>Close</button>
                            <button type="button" className="mp-btn-primary" onClick={() => window.open(\`/deal/\${currentProduct.id}\`, '_blank')} style={{padding: '10px 20px', borderRadius: '12px', fontWeight: '700', background: '#3b82f6', color: 'white', border: 'none'}}>View Live Page</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {isEditModalOpen && currentProduct && (
                <div className="mp-modal-overlay fade-in">
                    <div className="mp-modal-content mp-modal-wide">
                        <div className="mp-modal-header">
                            <h3><Edit2 size={24} style={{ marginRight: '10px', verticalAlign: 'middle', color: '#10b981' }} /> Edit Deal Details</h3>
                            <button className="mp-modal-close" onClick={closeModals}><X size={20} /></button>
                        </div>
                        <form onSubmit={handleEditSave} style={{overflowY: 'auto'}}>
                            <div className="mp-modal-body" style={{padding: '24px'}}>
                                
                                {/* 1. Deal Information */}
                                <div className="mp-edit-section">
                                    <div className="mp-section-title">
                                        <Package size={20} />
                                        <h4>Deal Information</h4>
                                    </div>
                                    <div className="mp-field-row">
                                        <div className="mp-form-group">
                                            <label>Deal Title <span className="mp-req">*</span></label>
                                            <input type="text" required className="mp-form-input" value={currentProduct.name || ''} onChange={(e) => setCurrentProduct({ ...currentProduct, name: e.target.value })} />
                                        </div>
                                        <div className="mp-form-group">
                                            <label>Subtitle / Short Desc</label>
                                            <input type="text" className="mp-form-input" value={currentProduct.subtitle || ''} onChange={(e) => setCurrentProduct({ ...currentProduct, subtitle: e.target.value })} />
                                        </div>
                                    </div>
                                    <div className="mp-field-row">
                                        <div className="mp-form-group">
                                            <label>Category <span className="mp-req">*</span></label>
                                            <select className="mp-form-select" value={currentProduct.category || ''} onChange={(e) => setCurrentProduct({ ...currentProduct, category: e.target.value })}>
                                                {globalCategories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
                                                <option value="other">Other</option>
                                            </select>
                                        </div>
                                        <div className="mp-form-group">
                                            <label>Deal Type</label>
                                            <select className="mp-form-select" value={currentProduct.dealType || 'OFFER'} onChange={(e) => setCurrentProduct({ ...currentProduct, dealType: e.target.value })}>
                                                <option value="SALE">SALE</option>
                                                <option value="OFFER">OFFER</option>
                                                <option value="LIMITED OFFER">LIMITED OFFER</option>
                                                <option value="DISCOUNT">DISCOUNT</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* 2. Pricing & Status */}
                                <div className="mp-edit-section">
                                    <div className="mp-section-title">
                                        <Tag size={20} />
                                        <h4>Pricing &amp; Status</h4>
                                    </div>
                                    <div className="mp-field-row">
                                        <div className="mp-form-group">
                                            <label>Original Price (Rs.)</label>
                                            <input type="number" className="mp-form-input" value={currentProduct.originalPrice || currentProduct.price} onChange={(e) => setCurrentProduct({ ...currentProduct, originalPrice: Number(e.target.value) })} />
                                        </div>
                                        <div className="mp-form-group">
                                            <label>Selling Price (Rs.) <span className="mp-req">*</span></label>
                                            <input type="number" required className="mp-form-input" value={currentProduct.price || 0} onChange={(e) => setCurrentProduct({ ...currentProduct, price: Number(e.target.value) })} />
                                        </div>
                                    </div>
                                    <div className="mp-field-row">
                                        <div className="mp-form-group">
                                            <label>Status</label>
                                            <select className="mp-form-select" value={currentProduct.status || 'Active'} onChange={(e) => setCurrentProduct({ ...currentProduct, status: e.target.value, availability: e.target.value })}>
                                                <option value="Active">Active / In Stock</option>
                                                <option value="Expired">Expired / Out of Stock</option>
                                                <option value="Draft">Draft</option>
                                            </select>
                                        </div>
                                        <div className="mp-form-group">
                                            <label>Stock Quantity <span className="mp-req">*</span></label>
                                            <input type="number" required className="mp-form-input" value={currentProduct.stock || 0} onChange={(e) => setCurrentProduct({ ...currentProduct, stock: Number(e.target.value), stockLeft: Number(e.target.value) })} />
                                        </div>
                                    </div>
                                    <div className="mp-field-row">
                                        <div className="mp-form-group">
                                            <label>Custom Badge</label>
                                            <input type="text" className="mp-form-input" placeholder="e.g. 50% OFF" value={currentProduct.badge || ''} onChange={(e) => setCurrentProduct({ ...currentProduct, badge: e.target.value })} />
                                        </div>
                                        <div className="mp-form-group">
                                            <label>Expiry Date</label>
                                            <input type="date" className="mp-form-input" value={currentProduct.expiryDate || ''} onChange={(e) => setCurrentProduct({ ...currentProduct, expiryDate: e.target.value })} />
                                        </div>
                                    </div>
                                </div>

                                {/* 3. Business & Affiliate */}
                                <div className="mp-edit-section">
                                    <div className="mp-section-title">
                                        <Store size={20} />
                                        <h4>Business &amp; Affiliate Details</h4>
                                    </div>
                                    <div className="mp-field-row">
                                        <div className="mp-form-group">
                                            <label>Business Name (Brand)</label>
                                            <input type="text" className="mp-form-input" value={currentProduct.storeName || ''} onChange={(e) => setCurrentProduct({ ...currentProduct, storeName: e.target.value, brand: e.target.value })} />
                                        </div>
                                        <div className="mp-form-group">
                                            <label>Location / City <span className="mp-req">*</span></label>
                                            <input type="text" required className="mp-form-input" value={currentProduct.location || ''} onChange={(e) => setCurrentProduct({ ...currentProduct, location: e.target.value })} />
                                        </div>
                                    </div>
                                    <div className="mp-field-row">
                                        <div className="mp-form-group">
                                            <label>Website URL</label>
                                            <input type="url" className="mp-form-input" value={currentProduct.websiteUrl || ''} onChange={(e) => setCurrentProduct({ ...currentProduct, websiteUrl: e.target.value })} />
                                        </div>
                                        <div className="mp-form-group">
                                            <label>Business Phone</label>
                                            <input type="tel" className="mp-form-input" value={currentProduct.businessPhone || ''} onChange={(e) => setCurrentProduct({ ...currentProduct, businessPhone: e.target.value })} />
                                        </div>
                                    </div>
                                </div>

                                {/* 4. Detailed Description */}
                                <div className="mp-edit-section">
                                    <div className="mp-section-title">
                                        <AlertCircle size={20} />
                                        <h4>Description &amp; Terms</h4>
                                    </div>
                                    <div className="mp-form-group">
                                        <label>Deal Description <span className="mp-req">*</span></label>
                                        <textarea className="mp-form-textarea" required rows="4" value={currentProduct.description || ''} onChange={(e) => setCurrentProduct({ ...currentProduct, description: e.target.value })}></textarea>
                                    </div>
                                    <div className="mp-field-row">
                                        <div className="mp-form-group">
                                            <label>Highlights (One per line)</label>
                                            <textarea className="mp-form-textarea" rows="3" value={currentProduct.highlights || ''} onChange={(e) => setCurrentProduct({ ...currentProduct, highlights: e.target.value })}></textarea>
                                        </div>
                                        <div className="mp-form-group">
                                            <label>Terms & Conditions</label>
                                            <textarea className="mp-form-textarea" rows="3" value={currentProduct.terms || ''} onChange={(e) => setCurrentProduct({ ...currentProduct, terms: e.target.value })}></textarea>
                                        </div>
                                    </div>
                                </div>

                                {/* 5. Media */}
                                <div className="mp-edit-section">
                                    <div className="mp-section-title">
                                        <ImageIcon size={20} />
                                        <h4>Deal Card Thumbnail</h4>
                                    </div>
                                    <div className="mp-edit-img-section" style={{ alignItems: 'flex-start', display: 'flex', gap: '20px' }}>
                                        <div className="mp-edit-img-wrapper" style={{position: 'relative', width: '150px', height: '150px', borderRadius: '12px', overflow: 'hidden', border: '2px dashed #cbd5e1'}}>
                                            <img src={currentProduct.image} alt="deal" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                                        </div>
                                        <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '10px'}}>
                                            <label htmlFor="editImgUpload" className="mp-btn-outline" style={{padding: '10px 20px', cursor: 'pointer', borderRadius: '8px', textAlign: 'center', fontWeight: 'bold', border: '1px solid #e2e8f0', background: 'white'}}>
                                                <UploadCloud size={16} className="inline mr-2" /> Change Cover Image
                                            </label>
                                            <input type="file" id="editImgUpload" accept="image/*" style={{display: 'none'}} onChange={handleImageChange} />
                                            <p style={{fontSize: '0.8rem', color: '#64748b'}}>Use landscape or square image.</p>
                                        </div>
                                    </div>
                                </div>

                            </div>
                            <div className="mp-modal-footer">
                                <button type="button" className="mp-btn-outline" onClick={closeModals} style={{padding: '12px 24px', borderRadius: '12px', fontWeight: 'bold', border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer'}}>Cancel</button>
                                <button type="submit" className="mp-btn-primary" style={{padding: '12px 24px', borderRadius: '12px', background: '#10b981', color: 'white', border: 'none', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer'}}><Save size={18} /> Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageDeals;
`;

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully updated ManageDeals.jsx');
