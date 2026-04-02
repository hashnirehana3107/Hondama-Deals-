import React, { useState, useMemo, useEffect } from 'react';
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
    Store,
    Link,
    Phone
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import ClientSidebar from '../../components/layout/ClientSidebar';
import ClientTopbar from '../../components/layout/ClientTopbar';
import { getStoredCategories } from '../../utils/categoryUtils';
import AlertModal from '../../components/common/AlertModal';
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
            
            // Map the storage format to the UI format
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

            setProducts([...mappedDeals]);
        };

        fetchDeals();
        window.addEventListener('storage', fetchDeals);
        return () => window.removeEventListener('storage', fetchDeals);
    }, []);

    // Sync state to localStorage whenever products change locally
    const updateStorage = (updatedProducts) => {
        const storedDeals = JSON.parse(localStorage.getItem('hodama_all_deals_v1') || '[]');
        
        const finalDeals = updatedProducts.map(p => {
            const original = storedDeals.find(d => d.id.toString() === p.id.toString()) || {};
            return {
                ...original,
                ...p, // preserve exact keys
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
                storeImg: p.storeImg,
                images: p.images || [p.image]
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

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    // Derived State
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
            triggerAlert(
                'confirm',
                'Delete Items?',
                `Are you sure you want to delete ${selectedProducts.length} selected items? This action cannot be undone.`,
                () => {
                    const updated = products.filter(p => !selectedProducts.includes(p.id));
                    updateStorage(updated);
                    setSelectedProducts([]);
                },
                'Yes, Delete All'
            );
        } else if (action === 'Disable') {
            const updated = products.map(p => selectedProducts.includes(p.id) ? { ...p, status: 'Disabled' } : p);
            updateStorage(updated);
            setSelectedProducts([]);
            triggerAlert('success', 'Deals Disabled', 'Selected deals have been disabled successfully.');
        }
    };

    const handleDelete = (id) => {
        triggerAlert(
            'confirm',
            'Delete Deal?',
            'Are you sure you want to delete this deal? This action cannot be undone and it will be removed from all sections.',
            () => {
                const updated = products.filter(p => p.id !== id);
                updateStorage(updated);
                triggerAlert('success', 'Deleted!', 'The deal has been removed successfully.');
            },
            'Delete'
        );
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
        setCurrentProduct({ ...product });
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
        triggerAlert('success', 'Update Successful', 'Your changes have been saved and synced to the marketplace.');
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

    const handleGalleryImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            const currentImages = currentProduct.images || [currentProduct.image];
            const maxAllowed = 5 - currentImages.length;
            const filesToProcess = files.slice(0, maxAllowed);
            
            if (filesToProcess.length === 0) {
                triggerAlert('error', 'Limit Reached', 'Only a maximum of 5 images are allowed per deal.');
                return;
            }

            Promise.all(filesToProcess.map(file => {
                return new Promise((resolve) => {
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
                            resolve(canvas.toDataURL('image/jpeg', 0.6));
                        };
                        img.src = event.target.result;
                    };
                    reader.readAsDataURL(file);
                });
            })).then(results => {
                setCurrentProduct({
                    ...currentProduct,
                    images: [...currentImages, ...results]
                });
            });
        }
    };

    const removeGalleryImage = (index) => {
        const newImages = [...(currentProduct.images || [currentProduct.image])];
        if (newImages.length > 1) { 
            newImages.splice(index, 1);
            setCurrentProduct({...currentProduct, images: newImages});
            // if they remove the first image, make the new first image the primary cover
            if (index === 0 && newImages.length > 0) {
                 setCurrentProduct(prev => ({...prev, images: newImages, image: newImages[0]}));
            }
        } else {
            triggerAlert('error', 'Deletion Prevented', 'A deal must have at least one primary image to be visible.');
        }
    };

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
                            <span className="current">Manage Deals</span>
                        </div>

                        <div className="mp-page-header">
                            <div>
                                <h1><Archive size={28} /> Manage Deals</h1>
                                <p>View, edit, and manage all your active and upcoming offers.</p>
                            </div>
                            <button className="mp-btn-add" onClick={() => navigate('/client/add-deal')}>
                                <Plus size={20} /> Add New Deal
                            </button>
                        </div>

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

                        <div className="mp-table-container">
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
                                                            <span className="mp-prod-cat">{product.category} • ID: {product.id}</span>
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
                                                    <span className={`mp-badge ${product.status?.toLowerCase() || 'pending'}`}>
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

            {/* Premium Preview Modal (Conditional Rendering of Fields) */}
            {isViewModalOpen && currentProduct && (
                <div className="mp-modal-overlay fade-in">
                    <div className="mp-modal-content" style={{maxWidth: '650px', borderRadius: '24px', overflow: 'hidden'}}>
                        <div className="mp-modal-header" style={{borderBottom: 'none', background: '#f8fafc', paddingBottom: '16px'}}>
                            <h3 style={{display: 'flex', alignItems: 'center', gap: '8px', color: '#0f172a'}}>
                                <Eye size={20} color="#3b82f6" /> Deal Preview Layout
                            </h3>
                            <button className="mp-modal-close" onClick={closeModals}><X size={20} /></button>
                        </div>
                        <div className="mp-modal-body" style={{padding: '0 30px 30px 30px', background: '#f8fafc', overflowY: 'auto'}}>
                            <div style={{
                                position: 'relative', 
                                width: '100%', 
                                height: '260px', 
                                borderRadius: '16px', 
                                overflow: 'hidden',
                                boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                            }}>
                                <img src={currentProduct.image} alt={currentProduct.name} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                                {currentProduct.badge && (
                                    <div style={{position: 'absolute', top: '16px', left: '16px', background: '#ef4444', color: 'white', padding: '6px 16px', borderRadius: '50px', fontWeight: '900', fontSize: '0.85rem'}}>
                                        {currentProduct.badge}
                                    </div>
                                )}
                            </div>
                            
                            <div style={{marginTop: '24px'}}>
                                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '20px'}}>
                                    <div style={{flex: 1}}>
                                        <h2 style={{fontSize: '1.6rem', fontWeight: '900', color: '#0f172a', marginBottom: '8px', lineHeight: '1.2'}}>{currentProduct.name}</h2>
                                        {currentProduct.subtitle && <p style={{color: '#64748b', fontSize: '1rem', marginBottom: '12px'}}>{currentProduct.subtitle}</p>}
                                        <div style={{display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px', fontSize: '0.85rem', color: '#94a3b8', fontWeight: '600', marginBottom: '16px'}}>
                                            {currentProduct.storeName && (
                                                <span style={{display: 'flex', alignItems: 'center', gap: '6px', background: '#e2e8f0', padding: '4px 10px', borderRadius: '8px', color: '#334155'}}>
                                                    {currentProduct.storeImg ? <img src={currentProduct.storeImg} alt="store" style={{width: 14, height: 14, objectFit: 'contain'}} /> : <Store size={14} />} 
                                                    {currentProduct.storeName}
                                                </span>
                                            )}
                                            {currentProduct.location && <span style={{display: 'flex', alignItems: 'center', gap: '4px', background: '#e2e8f0', padding: '4px 10px', borderRadius: '8px', color: '#334155'}}><MapPin size={14} /> {currentProduct.location}</span>}
                                            {currentProduct.rating && currentProduct.rating !== '0' && (
                                                <span style={{display: 'flex', alignItems: 'center', gap: '4px', background: '#fef9c3', padding: '4px 10px', borderRadius: '8px', color: '#854d0e', fontWeight: '800'}}>
                                                    ⭐ {currentProduct.rating} ({currentProduct.ratingCount})
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div style={{textAlign: 'right', minWidth: '120px'}}>
                                        <div style={{fontSize: '1.6rem', fontWeight: '900', color: '#10b981'}}>Rs. {currentProduct.price.toLocaleString()}</div>
                                        {currentProduct.originalPrice > currentProduct.price && (
                                            <div style={{fontSize: '1rem', color: '#94a3b8', textDecoration: 'line-through', fontWeight: '600'}}>Rs. {currentProduct.originalPrice.toLocaleString()}</div>
                                        )}
                                    </div>
                                </div>

                                {currentProduct.description && (
                                    <div style={{marginTop: '8px', fontSize: '0.95rem', color: '#334155', lineHeight: '1.6'}}>
                                        {currentProduct.description}
                                    </div>
                                )}
                            </div>
                            
                            <div style={{
                                marginTop: '24px', 
                                background: 'white', 
                                padding: '24px', 
                                borderRadius: '16px', 
                                border: '1px solid #e2e8f0',
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: '20px'
                            }}>
                                <div><strong style={{color: '#64748b', fontWeight: '600', display: 'block', marginBottom: '4px', fontSize: '0.8rem'}}>CATEGORY</strong> <span style={{color: '#1e293b', fontWeight: '800'}}>{currentProduct.category}</span></div>
                                
                                {currentProduct.dealType && (
                                    <div><strong style={{color: '#64748b', fontWeight: '600', display: 'block', marginBottom: '4px', fontSize: '0.8rem'}}>DEAL TYPE</strong> <span style={{color: '#1e293b', fontWeight: '800'}}>{currentProduct.dealType}</span></div>
                                )}
                                
                                <div><strong style={{color: '#64748b', fontWeight: '600', display: 'block', marginBottom: '4px', fontSize: '0.8rem'}}>STATUS</strong> 
                                    <span style={{color: '#1e293b', fontWeight: '800', display: 'inline-block', padding: '4px 10px', borderRadius: '6px', background: currentProduct.status === 'Active' || currentProduct.status === 'In Stock' ? '#dcfce7' : '#fee2e2', color: currentProduct.status === 'Active' || currentProduct.status === 'In Stock' ? '#16a34a' : '#ef4444', fontSize: '0.85rem'}}>{currentProduct.status}</span>
                                </div>

                                <div><strong style={{color: '#64748b', fontWeight: '600', display: 'block', marginBottom: '4px', fontSize: '0.8rem'}}>STOCK LEFT</strong> <span style={{color: '#1e293b', fontWeight: '800'}}>{currentProduct.stock || 0} Units</span></div>
                                
                                {currentProduct.totalStock && (
                                    <div><strong style={{color: '#64748b', fontWeight: '600', display: 'block', marginBottom: '4px', fontSize: '0.8rem'}}>TOTAL STOCK</strong> <span style={{color: '#1e293b', fontWeight: '800'}}>{currentProduct.totalStock} Units</span></div>
                                )}

                                {currentProduct.availability2 && (
                                    <div style={{gridColumn: '1 / -1'}}><strong style={{color: '#64748b', fontWeight: '600', display: 'block', marginBottom: '4px', fontSize: '0.8rem'}}>TIMING/VALIDITY</strong> <span style={{color: '#1e293b', fontWeight: '800'}}>{currentProduct.availability2}</span></div>
                                )}

                                {currentProduct.expiryDate && (
                                    <div><strong style={{color: '#64748b', fontWeight: '600', display: 'block', marginBottom: '4px', fontSize: '0.8rem'}}>EXPIRY DATE</strong> <span style={{color: '#eab308', fontWeight: '800'}}>{currentProduct.expiryDate}</span></div>
                                )}

                                {currentProduct.couponCode && (
                                    <div><strong style={{color: '#64748b', fontWeight: '600', display: 'block', marginBottom: '4px', fontSize: '0.8rem'}}>COUPON CODE</strong> <span style={{color: '#10b981', fontWeight: '900', border: '1px dashed #10b981', padding: '2px 8px', borderRadius: '4px'}}>{currentProduct.couponCode}</span></div>
                                )}

                                {currentProduct.websiteUrl && (
                                    <div style={{gridColumn: '1 / -1'}}><strong style={{color: '#64748b', fontWeight: '600', display: 'block', marginBottom: '4px', fontSize: '0.8rem'}}>WEBSITE URL</strong> 
                                        <a href={currentProduct.websiteUrl} target="_blank" rel="noreferrer" style={{color: '#3b82f6', fontWeight: '700', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px'}}><Link size={14} /> {currentProduct.websiteUrl}</a>
                                    </div>
                                )}
                                
                                {currentProduct.businessPhone && (
                                    <div><strong style={{color: '#64748b', fontWeight: '600', display: 'block', marginBottom: '4px', fontSize: '0.8rem'}}>BUSINESS PHONE</strong> 
                                        <div style={{color: '#1e293b', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '6px'}}><Phone size={14} color="#64748b" /> {currentProduct.businessPhone}</div>
                                    </div>
                                )}
                            </div>

                            {/* Optional Long texts */}
                            {(currentProduct.highlights || currentProduct.terms) && (
                                <div style={{marginTop: '24px'}}>
                                    {currentProduct.highlights && (
                                        <div style={{marginBottom: '20px', background: '#fef3c7', padding: '20px', borderRadius: '12px', border: '1px solid #fde68a'}}>
                                            <h4 style={{fontSize: '0.95rem', fontWeight: '800', color: '#b45309', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px'}}><AlertCircle size={16} /> Deal Highlights</h4>
                                            <p style={{whiteSpace: 'pre-wrap', fontSize: '0.9rem', color: '#92400e'}}>{currentProduct.highlights}</p>
                                        </div>
                                    )}
                                    {currentProduct.terms && (
                                        <div style={{background: '#f1f5f9', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0'}}>
                                            <h4 style={{fontSize: '0.95rem', fontWeight: '800', color: '#475569', marginBottom: '10px'}}>Terms & Conditions</h4>
                                            <p style={{whiteSpace: 'pre-wrap', fontSize: '0.85rem', color: '#64748b'}}>{currentProduct.terms}</p>
                                        </div>
                                    )}
                                </div>
                            )}

                        </div>
                        <div className="mp-modal-footer" style={{padding: '20px 30px', justifyContent: 'flex-end', gap: '12px'}}>
                            <button type="button" className="mp-btn-outline" onClick={closeModals} style={{padding: '12px 24px', borderRadius: '12px', fontWeight: '800'}}>Close</button>
                            <button type="button" className="mp-btn-primary" onClick={() => navigate(`/deal/${currentProduct.id}?from=manage`)} style={{padding: '12px 24px', borderRadius: '12px', fontWeight: '800', background: '#3b82f6', color: 'white', border: 'none', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'}}>View Live Page</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Smart Conditional Edit Modal */}
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
                                        {/* Conditionally Render Optional: Subtitle */}
                                        {currentProduct.subtitle !== undefined && currentProduct.subtitle !== null && currentProduct.subtitle !== "" && (
                                            <div className="mp-form-group">
                                                <label>Subtitle / Short Desc</label>
                                                <input type="text" className="mp-form-input" value={currentProduct.subtitle || ''} onChange={(e) => setCurrentProduct({ ...currentProduct, subtitle: e.target.value })} />
                                            </div>
                                        )}
                                    </div>
                                    <div className="mp-field-row">
                                        <div className="mp-form-group">
                                            <label>Category <span className="mp-req">*</span></label>
                                            <select className="mp-form-select" value={currentProduct.category || ''} onChange={(e) => setCurrentProduct({ ...currentProduct, category: e.target.value })}>
                                                {globalCategories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
                                                <option value="other">Other</option>
                                            </select>
                                        </div>
                                        {/* Deal Type mostly always there, but check if filled or we just handle required */}
                                        {currentProduct.dealType && (
                                            <div className="mp-form-group">
                                                <label>Deal Type</label>
                                                <select className="mp-form-select" value={currentProduct.dealType || 'OFFER'} onChange={(e) => setCurrentProduct({ ...currentProduct, dealType: e.target.value })}>
                                                    <option value="SALE">SALE</option>
                                                    <option value="OFFER">OFFER</option>
                                                    <option value="LIMITED OFFER">LIMITED OFFER</option>
                                                    <option value="DISCOUNT">DISCOUNT</option>
                                                </select>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* 2. Pricing & Status */}
                                <div className="mp-edit-section">
                                    <div className="mp-section-title">
                                        <Tag size={20} />
                                        <h4>Pricing &amp; Status</h4>
                                    </div>
                                    <div className="mp-field-row">
                                        {/* Original Price conditional if it exist and greater than price, but usually it exists. */}
                                        <div className="mp-form-group">
                                            <label>Selling Price (Rs.) <span className="mp-req">*</span></label>
                                            <input type="number" required className="mp-form-input" value={currentProduct.price || 0} onChange={(e) => setCurrentProduct({ ...currentProduct, price: Number(e.target.value) })} />
                                        </div>
                                        {currentProduct.originalPrice > 0 && currentProduct.originalPrice !== null && (
                                            <div className="mp-form-group">
                                                <label>Original Price (Rs.)</label>
                                                <input type="number" className="mp-form-input" value={currentProduct.originalPrice || currentProduct.price} onChange={(e) => setCurrentProduct({ ...currentProduct, originalPrice: Number(e.target.value) })} />
                                            </div>
                                        )}
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
                                    
                                    {(currentProduct.badge || currentProduct.expiryDate || currentProduct.availability2) && (
                                        <div className="mp-field-row">
                                            {currentProduct.badge && (
                                                <div className="mp-form-group">
                                                    <label>Custom Badge</label>
                                                    <input type="text" className="mp-form-input" value={currentProduct.badge || ''} onChange={(e) => setCurrentProduct({ ...currentProduct, badge: e.target.value })} />
                                                </div>
                                            )}
                                            {currentProduct.availability2 && (
                                                <div className="mp-form-group">
                                                    <label>Available Time / Validity</label>
                                                    <input type="text" className="mp-form-input" value={currentProduct.availability2 || ''} onChange={(e) => setCurrentProduct({ ...currentProduct, availability2: e.target.value })} />
                                                </div>
                                            )}
                                            {currentProduct.expiryDate && (
                                                <div className="mp-form-group">
                                                    <label>Expiry Date</label>
                                                    <input type="date" className="mp-form-input" value={currentProduct.expiryDate || ''} onChange={(e) => setCurrentProduct({ ...currentProduct, expiryDate: e.target.value })} />
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* 3. Business & Affiliate */}
                                <div className="mp-edit-section">
                                    <div className="mp-section-title">
                                        <Store size={20} />
                                        <h4>Business &amp; Affiliate Details</h4>
                                    </div>
                                    <div className="mp-field-row">
                                        {currentProduct.storeName && (
                                            <div className="mp-form-group">
                                                <label>Business Name (Brand)</label>
                                                <input type="text" className="mp-form-input" value={currentProduct.storeName || ''} onChange={(e) => setCurrentProduct({ ...currentProduct, storeName: e.target.value, brand: e.target.value })} />
                                            </div>
                                        )}
                                        {currentProduct.location && (
                                            <div className="mp-form-group">
                                                <label>Location / City</label>
                                                <input type="text" className="mp-form-input" value={currentProduct.location || ''} onChange={(e) => setCurrentProduct({ ...currentProduct, location: e.target.value })} />
                                            </div>
                                        )}
                                    </div>
                                    {(currentProduct.websiteUrl || currentProduct.businessPhone) && (
                                        <div className="mp-field-row">
                                            {currentProduct.websiteUrl && (
                                                <div className="mp-form-group">
                                                    <label>Website URL</label>
                                                    <input type="url" className="mp-form-input" value={currentProduct.websiteUrl || ''} onChange={(e) => setCurrentProduct({ ...currentProduct, websiteUrl: e.target.value })} />
                                                </div>
                                            )}
                                            {currentProduct.businessPhone && (
                                                <div className="mp-form-group">
                                                    <label>Business Phone</label>
                                                    <input type="tel" className="mp-form-input" value={currentProduct.businessPhone || ''} onChange={(e) => setCurrentProduct({ ...currentProduct, businessPhone: e.target.value })} />
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* 4. Detailed Description */}
                                <div className="mp-edit-section">
                                    <div className="mp-section-title">
                                        <AlertCircle size={20} />
                                        <h4>Description &amp; Terms</h4>
                                    </div>
                                    {currentProduct.description && (
                                        <div className="mp-form-group">
                                            <label>Deal Description <span className="mp-req">*</span></label>
                                            <textarea className="mp-form-textarea" required rows="4" value={currentProduct.description || ''} onChange={(e) => setCurrentProduct({ ...currentProduct, description: e.target.value })}></textarea>
                                        </div>
                                    )}
                                    
                                    {(currentProduct.highlights || currentProduct.terms) && (
                                        <div className="mp-field-row">
                                            {currentProduct.highlights && (
                                                <div className="mp-form-group">
                                                    <label>Highlights (One per line)</label>
                                                    <textarea className="mp-form-textarea" rows="3" value={currentProduct.highlights || ''} onChange={(e) => setCurrentProduct({ ...currentProduct, highlights: e.target.value })}></textarea>
                                                </div>
                                            )}
                                            {currentProduct.terms && (
                                                <div className="mp-form-group">
                                                    <label>Terms & Conditions</label>
                                                    <textarea className="mp-form-textarea" rows="3" value={currentProduct.terms || ''} onChange={(e) => setCurrentProduct({ ...currentProduct, terms: e.target.value })}></textarea>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                
                                {/* 5. Media */}
                                <div className="mp-edit-section">
                                    <div className="mp-section-title">
                                        <ImageIcon size={20} />
                                        <h4>Deal Banner/Images</h4>
                                    </div>
                                    <p style={{fontSize: '0.85rem', color: '#64748b', marginBottom: '16px'}}>First image acts as the cover thumbnail. Max 5 images allowed.</p>
                                    
                                    <div style={{display: 'flex', flexWrap: 'wrap', gap: '16px'}}>
                                        {/* Display Existing Images */}
                                        {(currentProduct.images || [currentProduct.image]).map((imgSrc, idx) => (
                                            <div key={idx} style={{position: 'relative', width: '120px', height: '120px', borderRadius: '12px', overflow: 'hidden', border: '2px dashed #cbd5e1'}}>
                                                <img src={imgSrc} alt="deal" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                                                <button type="button" onClick={() => removeGalleryImage(idx)} style={{position: 'absolute', top: '8px', right: '8px', background: 'rgba(239, 68, 68, 0.9)', color: 'white', border: 'none', borderRadius: '50%', padding: '6px', cursor: 'pointer', display: 'flex'}}>
                                                    <X size={14} />
                                                </button>
                                                {idx === 0 && <span style={{position: 'absolute', bottom: '0', left: '0', right: '0', background: 'rgba(0,0,0,0.6)', color: 'white', fontSize: '0.7rem', padding: '4px', textAlign: 'center', fontWeight: 'bold'}}>COVER</span>}
                                            </div>
                                        ))}

                                        {/* Add New Image Button */}
                                        {(currentProduct.images || [currentProduct.image]).length < 5 && (
                                            <label style={{width: '120px', height: '120px', borderRadius: '12px', border: '2px dashed #94a3b8', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: '#f8fafc', gap: '8px', color: '#64748b'}}>
                                                <UploadCloud size={24} />
                                                <span style={{fontSize: '0.8rem', fontWeight: 'bold'}}>Add Image</span>
                                                <input type="file" multiple accept="image/*" style={{display: 'none'}} onChange={handleGalleryImageChange} />
                                            </label>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="mp-modal-footer">
                                <button type="button" className="mp-btn-outline" onClick={closeModals} style={{padding: '12px 24px', borderRadius: '12px', fontWeight: '800', border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer'}}>Cancel</button>
                                <button type="submit" className="mp-btn-primary" style={{padding: '12px 24px', borderRadius: '12px', background: '#10b981', color: 'white', border: 'none', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer'}}><Save size={18} /> Save Changes</button>
                            </div>
                        </form>
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

export default ManageDeals;
