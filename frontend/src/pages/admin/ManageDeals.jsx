import React, { useState, useEffect } from 'react';
import {
    Package,
    Clock,
    CheckCircle,
    XCircle,
    X,
    AlertTriangle,
    Search,
    Filter,
    Eye,
    Trash2,
    ChevronLeft,
    ChevronRight,
    Tag,
    Store,
    DollarSign,
    Layers,
    ArrowLeft,
    Star,
    MessageSquare,
    Info,
    MoreVertical,
    Check,
    MapPin,
    TrendingUp,
    ExternalLink,
    User,
    Plus,
    UploadCloud,
    CheckCircle2,
    Calendar,
    ArrowUp,
    Image as ImageIcon
} from 'lucide-react';
import axios from 'axios';
import { getStoredCategories } from '../../utils/categoryUtils';
import ConfirmModal from '../../components/common/ConfirmModal';
import AlertModal from '../../components/common/AlertModal';
import './ManageDeals.css';
import '../client/AddDeals.css'; // Reusing client styles for the form

const AdminManageDeals = () => {
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [confirmDelete, setConfirmDelete] = useState({ isOpen: false, productId: null });
    
    // Add Deal Modal States
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [globalCategories, setGlobalCategories] = useState([]);
    const [allPartners, setAllPartners] = useState([]);

    useEffect(() => { 
        const fetchCategories = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/categories');
                if (res.data.success) {
                    setGlobalCategories(res.data.categories);
                } else {
                    // Fallback to local if API fails
                    setGlobalCategories(getStoredCategories());
                }
            } catch (err) {
                console.error("Admin: Categories fetch failed", err);
                setGlobalCategories(getStoredCategories());
            }
        };
        fetchCategories();
        
        // Fetch stores/partners that are already registered
        const storedStores = JSON.parse(localStorage.getItem('hodama_all_stores_v1') || '[]');
        setAllPartners(storedStores);
    }, []);

    // Form Fields (Cloned from AddDeals.jsx)
    const [selectedPartner, setSelectedPartner] = useState(null); // The store object chosen by admin
    const [productName, setProductName] = useState('');
    const [subtitle, setSubtitle] = useState('');
    const [category, setCategory] = useState('');
    const [brand, setBrand] = useState('');
    const [dealType, setDealType] = useState('OFFER');
    const [price, setPrice] = useState('');
    const [discountPrice, setDiscountPrice] = useState('');
    const [discountRatio, setDiscountRatio] = useState(0);
    const [stock, setStock] = useState('');
    const [totalStock, setTotalStock] = useState('');
    const [availability, setAvailability] = useState('Active');
    const [availability2, setAvailability2] = useState('Valid during store hours');
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');
    const [highlights, setHighlights] = useState('');
    const [terms, setTerms] = useState('');
    const [cardThumbnailPreview, setCardThumbnailPreview] = useState(null);
    const [previewImages, setPreviewImages] = useState([]);
    const [customBadge, setCustomBadge] = useState('');
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [expiryDate, setExpiryDate] = useState('');
    const [websiteUrl, setWebsiteUrl] = useState('');
    const [businessPhone, setBusinessPhone] = useState('');
    const [businessLogo, setBusinessLogo] = useState('');
    const [rating, setRating] = useState('4.8');
    const [ratingCount, setRatingCount] = useState('25');
    const [alertConfig, setAlertConfig] = useState({ isOpen: false, type: 'success', title: '', message: '' });

    useEffect(() => {
        if (price && discountPrice) {
            const p = parseFloat(price);
            const d = parseFloat(discountPrice);
            if (p > 0 && d < p) { setDiscountRatio(Math.round(((p - d) / p) * 100)); }
            else { setDiscountRatio(0); }
        } else { setDiscountRatio(0); }
    }, [price, discountPrice]);

    const resetForm = () => {
        setProductName(''); setSubtitle(''); setCategory(''); setBrand(''); setDealType('OFFER');
        setPrice(''); setDiscountPrice(''); setLocation(''); setDescription(''); setHighlights('');
        setTerms(''); setCardThumbnailPreview(null); setPreviewImages([]); setExpiryDate(''); 
        setWebsiteUrl(''); setCustomBadge(''); setStock(''); setTotalStock('');
        setBusinessPhone(''); setBusinessLogo(''); setSelectedPartner(null);
    };

    // Helper to get category specific styles and icons — matches Home page CATEGORY_DEFAULTS
    const getCategoryDetails = (cat) => {
        const c = (cat || '').toLowerCase();
        if (c.includes('salon'))
            return { color: '#be123c', bg: '#fdf2f4', icon: <img src="/assets/images/Salon.png" alt="Salon" style={{ width: 16, height: 16, filter: 'brightness(0) saturate(100%) invert(13%) sepia(87%) saturate(3000%) hue-rotate(330deg)' }} /> };
        if (c.includes('restaurant') || c.includes('food'))
            return { color: '#c2410c', bg: '#fff7ed', icon: <img src="/assets/images/Restaurant.png" alt="Restaurant" style={{ width: 16, height: 16, filter: 'brightness(0) saturate(100%) invert(27%) sepia(80%) saturate(1200%) hue-rotate(15deg)' }} /> };
        if (c.includes('hotel'))
            return { color: '#6d28d9', bg: '#f5f3ff', icon: <img src="/assets/images/Hotel.png" alt="Hotel" style={{ width: 16, height: 16, filter: 'brightness(0) saturate(100%) invert(18%) sepia(70%) saturate(2000%) hue-rotate(255deg)' }} /> };
        if (c.includes('fashion') || c.includes('clothing'))
            return { color: '#047857', bg: '#ecfdf5', icon: <img src="/assets/images/Fashion.png" alt="Fashion" style={{ width: 16, height: 16, filter: 'brightness(0) saturate(100%) invert(29%) sepia(80%) saturate(700%) hue-rotate(130deg)' }} /> };
        if (c.includes('electronics') || c.includes('gadget'))
            return { color: '#76a81e', bg: '#f7fee7', icon: <img src="/assets/images/electronics.png" alt="Electronics" style={{ width: 16, height: 16, filter: 'brightness(0) saturate(100%) invert(55%) sepia(70%) saturate(500%) hue-rotate(60deg)' }} /> };
        if (c.includes('grocer'))
            return { color: '#b45309', bg: '#fffbeb', icon: <img src="/assets/images/Groceries.png" alt="Groceries" style={{ width: 16, height: 16, filter: 'brightness(0) saturate(100%) invert(34%) sepia(70%) saturate(800%) hue-rotate(20deg)' }} /> };
        if (c.includes('spa'))
            return { color: '#1d4ed8', bg: '#eff6ff', icon: <img src="/assets/images/Spa.png" alt="Spa" style={{ width: 16, height: 16, filter: 'brightness(0) saturate(100%) invert(23%) sepia(80%) saturate(1500%) hue-rotate(210deg)' }} /> };
        if (c.includes('beauty') || c.includes('health'))
            return { color: '#be185d', bg: '#fdf2f8', icon: <img src="/assets/images/Health&Beauty.png" alt="Health & Beauty" style={{ width: 16, height: 16, filter: 'brightness(0) saturate(100%) invert(16%) sepia(90%) saturate(2000%) hue-rotate(305deg)' }} /> };
        return { color: '#64748b', bg: '#f8fafc', icon: <Tag size={16} /> };
    };

    // Mock Data for Deals
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchAllDeals = () => {
            const storedDeals = JSON.parse(localStorage.getItem('hodama_all_deals_v1') || '[]');
            setProducts(storedDeals);
        };
        fetchAllDeals();
        window.addEventListener('storage', fetchAllDeals);
        return () => window.removeEventListener('storage', fetchAllDeals);
    }, []);

    const updateGlobalStorage = (updated) => {
        localStorage.setItem('hodama_all_deals_v1', JSON.stringify(updated));
        setProducts(updated);
    };

    const handleAction = (id, newStatus) => {
        try {
            const updated = products.map(p => p.id === id ? { ...p, status: newStatus } : p);
            updateGlobalStorage(updated);
            
            if (selectedProduct && selectedProduct.id === id) {
                setSelectedProduct({ ...selectedProduct, status: newStatus });
            }
            alert(`Deal ${newStatus} successfully!`);
        } catch (err) {
            console.error("Action error:", err);
            alert("Failed to update status. Storage might be full.");
        }
    };

    const handleDelete = (id) => {
        setConfirmDelete({ isOpen: true, productId: id });
    };

    const confirmDeleteAction = () => {
        if (confirmDelete.productId) {
            const updated = products.filter(p => p.id !== confirmDelete.productId);
            updateGlobalStorage(updated);
            setConfirmDelete({ isOpen: false, productId: null });
            setSelectedProduct(null);
            alert('Deal removed permanently.');
        }
    };

    const handleAddDealSubmit = (e) => {
        e.preventDefault();
        console.log("Submitting Admin Deal...", { productName, category, price, expiryDate });

        if (!productName || !category || !price || !expiryDate) {
            alert('Please fill in all required fields (Name, Category, Price, Expiry Date)');
            return;
        }
        
        const start = new Date(startDate);
        const expiry = new Date(expiryDate);
        if (expiry <= start) { alert('Expiry must be after Start Date'); return; }

        try {
            const stockLeftValue = Number(stock) || 0;
            const totalStockValue = Number(totalStock) || 0;
            
            // Calculate categorization logic like Client side
            const diffDays = Math.ceil((expiry - start) / (1000 * 60 * 60 * 24));

            const newDeal = {
                id: Date.now().toString(),
                name: productName,
                subtitle: subtitle || "",
                price: discountPrice ? parseFloat(discountPrice).toLocaleString() : parseFloat(price).toLocaleString(),
                oldPrice: discountPrice ? parseFloat(price).toLocaleString() : null,
                img: cardThumbnailPreview || previewImages[0] || "/assets/images/placeholder_deal.png",
                badge: customBadge || (discountRatio > 0 ? `${discountRatio}% OFF` : 'NEW'),
                storeName: selectedPartner?.name || brand || "Hodama Deals Exclusive",
                storeImg: selectedPartner?.img || businessLogo || "/assets/images/luvLogo.png",
                ownerEmail: selectedPartner?.email || "admin@hodamadeals.lk",
                rating: rating || "4.8",
                ratingCount: ratingCount || "25",
                location: location || "Nationwide",
                dealType: dealType || "OFFER",
                category: category,
                status: (availability === 'Out of Stock') ? 'Expired' : 'Active',
                availability: availability || 'Active',
                availability2: availability2 || '',
                stockLeft: stockLeftValue,
                totalStock: totalStockValue || stockLeftValue,
                isDailyDeal: diffDays <= 1,
                isMonthlyDeal: diffDays >= 28,
                expiryDate: expiryDate,
                websiteUrl: websiteUrl || "",
                businessPhone: businessPhone || "",
                description: description || "",
                highlights: highlights || "",
                terms: terms || "",
                images: previewImages.length > 0 ? previewImages : [cardThumbnailPreview || "/assets/images/placeholder_deal.png"],
                couponCode: "ADMIN SAVE",
                client: selectedPartner?.name || "Admin",
                createdAt: new Date().toISOString(),
                views: Math.floor(Math.random() * 20)
            };

            const updated = [newDeal, ...products];
            updateGlobalStorage(updated);
            setIsAddModalOpen(false);
            resetForm();
            alert('Deal Published Successfully!');
        } catch (err) {
            console.error("Submit error:", err);
            alert("Error publishing deal. Local storage might be full (5MB limit reached). Please try using a smaller thumbnail image.");
        }
    };

    const handleFileChange = (e, type) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            if (type === 'thumb') setCardThumbnailPreview(reader.result);
            else setPreviewImages([reader.result, ...previewImages]);
        };
        reader.readAsDataURL(file);
    };

    const stats = {
        total: products.length,
        pending: products.filter(p => p && p.status === 'Pending').length,
        approved: products.filter(p => p && (p.status === 'Approved' || p.status === 'Active')).length,
        disabled: products.filter(p => p && p.status === 'Disabled').length
    };

    return (
        <div className="amp-page-wrapper">
            {/* 1. Page Header */}
            <div className="amp-header">
                <div className="amp-header-left">
                    <h1 className="amp-title">Manage Deals</h1>
                    <p className="amp-subtitle">Monitor and review all active offers and seasonal deals</p>
                </div>
                <div className="amp-header-right" style={{ display: 'flex', gap: '15px' }}>
                    <button className="amp-add-btn" onClick={() => setIsAddModalOpen(true)}>
                        <Plus size={18} /> Add New Deal
                    </button>
                    <div className="amp-mini-stats">
                        <div className="amp-ms-item"><span>Total</span><strong>{stats.total}</strong></div>
                        <div className="amp-ms-item"><span>Pending</span><strong className="text-yellow">{stats.pending}</strong></div>
                    </div>
                </div>
            </div>

            {/* 2. Summary Cards */}
            <div className="amp-summary-grid">
                <div className="amp-stat-card adlay-shadow">
                    <div className="amp-stat-icon bg-blue"><Package size={24} /></div>
                    <div className="amp-stat-content">
                        <span className="amp-stat-value">{stats.total}</span>
                        <span className="amp-stat-label">Total Listings</span>
                    </div>
                </div>
                <div className="amp-stat-card adlay-shadow">
                    <div className="amp-stat-icon bg-yellow"><Clock size={24} /></div>
                    <div className="amp-stat-content">
                        <span className="amp-stat-value">{stats.pending}</span>
                        <span className="amp-stat-label">Pending Approval</span>
                    </div>
                </div>
                <div className="amp-stat-card adlay-shadow">
                    <div className="amp-stat-icon bg-green"><CheckCircle size={24} /></div>
                    <div className="amp-stat-content">
                        <span className="amp-stat-value">{stats.approved}</span>
                        <span className="amp-stat-label">Active Deals</span>
                    </div>
                </div>
                <div className="amp-stat-card adlay-shadow">
                    <div className="amp-stat-icon bg-red"><XCircle size={24} /></div>
                    <div className="amp-stat-content">
                        <span className="amp-stat-value">{stats.disabled}</span>
                        <span className="amp-stat-label">Disabled Deals</span>
                    </div>
                </div>
            </div>

            {/* 3 & 4. Search & Filters */}
            <div className="amp-controls-card adlay-shadow">
                <div className="amp-search-box">
                    <Search size={20} />
                    <input
                        type="text"
                        placeholder="Search by product name, client or ID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="amp-filters">
                    <div className="amp-filter-item">
                        <Filter size={18} />
                        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                            <option value="All">All Status</option>
                            <option value="Approved">Approved</option>
                            <option value="Pending">Pending</option>
                            <option value="Disabled">Disabled</option>
                        </select>
                    </div>
                    <div className="amp-filter-item">
                        <select>
                            <option>All Categories</option>
                            <option>Electronics</option>
                            <option>Fashion</option>
                            <option>Gadgets</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* 5. Products Table */}
            <div className="amp-table-card adlay-shadow">
                <div className="amp-table-container">
                    <table className="amp-table">
                        <thead>
                            <tr>
                                <th>Deal Info</th>
                                <th>Partner</th>
                                <th>Category</th>
                                <th>Deal Price</th>
                                <th>Views</th>
                                <th>Status</th>
                                <th className="text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products
                                .filter(p => (statusFilter === 'All' || p.status === statusFilter))
                                .filter(p => 
                                    (p.name || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
                                    (p.storeName || p.brand || p.client || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
                                    (p.id ? p.id.toString() : '').includes(searchQuery)
                                )
                                .map((product) => (
                                    <tr key={product.id}>
                                        <td>
                                            <div className="amp-product-cell">
                                                <div className="amp-product-img">
                                                    <img src={product.img || product.image || "/assets/images/placeholder_deal.png"} alt={product.name} />
                                                </div>
                                                <div className="amp-product-info">
                                                    <span className="amp-product-name">{product.name}</span>
                                                    <span className="amp-product-id">ID: {product.id}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="amp-val-bold">{product.storeName || product.client || 'General Vendor'}</td>
                                        <td><span className="amp-cat-tag">{product.category}</span></td>
                                        <td className="amp-price">LKR {product.price}</td>
                                        <td>
                                            <span className="amp-stock-tag">
                                                {product.views || 0} Clicks
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`amp-status-pill ${product.status.toLowerCase()}`}>
                                                {product.status}
                                            </span>
                                        </td>
                                        <td className="text-right">
                                            <div className="amp-table-actions">
                                                <button className="amp-btn-icon" onClick={() => setSelectedProduct(product)} title="View Details">
                                                    <Eye size={18} />
                                                </button>
                                                {product.status === 'Pending' && (
                                                    <button className="amp-btn-icon success" onClick={() => handleAction(product.id, 'Approved')} title="Approve">
                                                        <Check size={18} />
                                                    </button>
                                                )}
                                                {product.status === 'Disabled' && (
                                                    <button className="amp-btn-icon success" onClick={() => handleAction(product.id, 'Active')} title="Activate Deal">
                                                        <CheckCircle size={18} />
                                                    </button>
                                                )}
                                                {product.status !== 'Disabled' && product.status !== 'Pending' && (
                                                    <button className="amp-btn-icon warn" onClick={() => handleAction(product.id, 'Disabled')} title="Disable">
                                                        <XCircle size={18} />
                                                    </button>
                                                )}
                                                <button className="amp-btn-icon danger" onClick={() => handleDelete(product.id)} title="Remove Product">
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
                <div className="amp-pagination">
                    <span className="amp-pager-info">Showing 1–{products.length} of {stats.total} products</span>
                    <div className="amp-pager-controls">
                        <button className="amp-pager-nav disabled"><ChevronLeft size={18} /></button>
                        <button className="amp-pager-num active">1</button>
                        <button className="amp-pager-num">2</button>
                        <button className="amp-pager-nav"><ChevronRight size={18} /></button>
                    </div>
                </div>
            </div>

            {/* 8. Product Details Modal */}
            {selectedProduct && (
                <div className="amp-modal-overlay" onClick={() => setSelectedProduct(null)}>
                    <div className="amp-modal-content animate-slide-in" onClick={(e) => e.stopPropagation()}>
                        <header className="amp-modal-header">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <button className="amp-btn-back" onClick={() => setSelectedProduct(null)}>
                                    <ArrowLeft size={18} /> Back
                                </button>
                                <div>
                                    <h3 className="amp-modal-title">{selectedProduct.name}</h3>
                                    <span className="amp-modal-id">Listing ID: {selectedProduct.id}</span>
                                </div>
                            </div>
                            <div className="amp-header-actions">
                                <span className={`amp-status-pill ${(selectedProduct.status || 'pending').toLowerCase()}`}>
                                    {selectedProduct.status || 'Pending'}
                                </span>
                                {selectedProduct.status === 'Pending' && (
                                    <button className="amp-btn-main bg-green" onClick={() => handleAction(selectedProduct.id, 'Approved')}>Approve Deal</button>
                                )}
                                {selectedProduct.status === 'Disabled' && (
                                    <button className="amp-btn-main bg-green" onClick={() => handleAction(selectedProduct.id, 'Active')}>Enable Deal</button>
                                )}
                                {selectedProduct.status !== 'Disabled' && selectedProduct.status !== 'Pending' && (
                                    <button className="amp-btn-main" style={{ background: '#f59e0b' }} onClick={() => handleAction(selectedProduct.id, 'Disabled')}>Disable</button>
                                )}
                                <button className="amp-btn-close-circle" onClick={() => setSelectedProduct(null)}>
                                    <X size={20} />
                                </button>
                            </div>
                        </header>

                        <div className="amp-modal-body">
                            <div className="amp-details-grid">
                                {/* Left: Visuals & Core Pricing */}
                                <div className="amp-col-left">
                                    <section className="amp-details-card">
                                        <div className="amp-main-img-view">
                                            <img src={selectedProduct.img || selectedProduct.image || "/assets/images/placeholder_deal.png"} alt={selectedProduct.name} />
                                        </div>
                                                                                {/* Multiple Images Gallery */}
                                        {Array.isArray(selectedProduct.images) && selectedProduct.images.length > 1 && (
                                            <div className="amp-image-gallery-mini">
                                                {selectedProduct.images.map((img, idx) => (
                                                    <div key={idx} className="amp-gallery-thumb">
                                                        <img src={img} alt={`Slide ${idx}`} />
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        
                                        <div className="amp-pricing-highlight">
                                            <div className="amp-price-tag">
                                                <span>Deal Price</span>
                                                <strong>LKR {selectedProduct.price}</strong>
                                            </div>
                                            {selectedProduct.oldPrice && (
                                                <div className="amp-old-price-tag">
                                                    <span>Regular Price</span>
                                                    <strong className="text-line-through">LKR {selectedProduct.oldPrice}</strong>
                                                </div>
                                            )}
                                        </div>

                                        <div className="amp-cat-badge-custom" style={{ 
                                            background: getCategoryDetails(selectedProduct.category).bg,
                                            color: getCategoryDetails(selectedProduct.category).color,
                                            border: `1px solid ${getCategoryDetails(selectedProduct.category).color}20`
                                        }}>
                                            {getCategoryDetails(selectedProduct.category).icon}
                                            <span>{selectedProduct.category}</span>
                                        </div>
                                    </section>

                                    <section className="amp-details-card mt-4">
                                        <h3 className="amp-card-title"><Store size={18} /> Partner Information</h3>
                                        <div className="amp-store-header-mini">
                                            <div className="amp-store-logo-view">
                                                {selectedProduct.storeImg ? (
                                                    <img src={selectedProduct.storeImg} alt="Store" />
                                                ) : (
                                                    <div className="amp-store-initials">{(selectedProduct.storeName || selectedProduct.brand || 'S')[0]}</div>
                                                )}
                                            </div>
                                            <div className="amp-store-main-info">
                                                <strong>{selectedProduct.storeName || selectedProduct.brand}</strong>
                                                <span>Business Partner</span>
                                            </div>
                                        </div>
                                        <div className="amp-info-list-mod">
                                            {selectedProduct.rating && selectedProduct.rating !== '0' && (
                                                <div className="amp-info-row">
                                                    <Star size={16} color="#f59e0b" />
                                                    <div className="amp-ir-content"><span>Store Rating</span><strong>{selectedProduct.rating} ({selectedProduct.ratingCount} Reviews)</strong></div>
                                                </div>
                                            )}
                                            <div className="amp-info-row">
                                                <Tag size={16} />
                                                <div className="amp-ir-content"><span>Business Email</span><strong>{selectedProduct.ownerEmail || 'contact@store.lk'}</strong></div>
                                            </div>
                                            <div className="amp-info-row">
                                                <User size={16} />
                                                <div className="amp-ir-content"><span>Business Phone</span><strong>{selectedProduct.businessPhone || 'N/A'}</strong></div>
                                            </div>
                                            <div className="amp-info-row">
                                                <MapPin size={16} />
                                                <div className="amp-ir-content"><span>Location</span><strong>{selectedProduct.location || 'Colombo, Sri Lanka'}</strong></div>
                                            </div>
                                        </div>
                                    </section>
                                </div>

                                {/* Right: Detailed Info & Description */}
                                <div className="amp-col-right">
                                    <section className="amp-details-card h-full">
                                        <div className="amp-card-header-main">
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                <div>
                                                    <h3 className="amp-card-title">Deal Description & Validity</h3>
                                                    {selectedProduct.subtitle && <p className="amp-modal-subtitle-text">{selectedProduct.subtitle}</p>}
                                                </div>
                                                {selectedProduct.badge && (
                                                    <span className="amp-badge-display">{selectedProduct.badge}</span>
                                                )}
                                            </div>
                                        </div>
                                        
                                        <div className="amp-description-box">
                                            <p>{selectedProduct.description || 'No detailed description provided by the client.'}</p>
                                        </div>

                                        {/* Promotional Meta */}
                                        <div className="amp-promo-strip">
                                            <div className="amp-promo-item">
                                                <span>Type</span>
                                                <strong>{selectedProduct.dealType || 'OFFER'}</strong>
                                            </div>
                                            <div className="amp-promo-item">
                                                <span>Stock Left</span>
                                                <strong>{selectedProduct.stockLeft || selectedProduct.stock || 'N/A'} / {selectedProduct.totalStock || 'N/A'}</strong>
                                            </div>
                                            <div className="amp-promo-item">
                                                <span>Status</span>
                                                <strong>{selectedProduct.status || 'Active'}</strong>
                                            </div>
                                        </div>

                                        {/* Highlights Section */}
                                        {((Array.isArray(selectedProduct.highlights) && selectedProduct.highlights.length > 0) || (typeof selectedProduct.highlights === 'string' && selectedProduct.highlights.trim() !== '')) && (
                                            <div className="amp-detail-section">
                                                <h4 className="amp-section-label">Deal Highlights</h4>
                                                <ul className="amp-points-list">
                                                    {(Array.isArray(selectedProduct.highlights) ? selectedProduct.highlights : selectedProduct.highlights.split('\n').filter(h => h.trim() !== '')).map((h, i) => (
                                                        <li key={i}><Check size={14} /> {h}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {/* Terms Section */}
                                        {((Array.isArray(selectedProduct.terms) && selectedProduct.terms.length > 0) || (typeof selectedProduct.terms === 'string' && selectedProduct.terms.trim() !== '')) && (
                                            <div className="amp-detail-section">
                                                <h4 className="amp-section-label">Terms & Conditions</h4>
                                                <ul className="amp-points-list terms">
                                                    {(Array.isArray(selectedProduct.terms) ? selectedProduct.terms : selectedProduct.terms.split('\n').filter(t => t.trim() !== '')).map((t, i) => (
                                                        <li key={i}><Info size={14} /> {t}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}


                                        <div className="amp-metadata-grid">
                                            <div className="amp-meta-item">
                                                <Clock size={18} />
                                                <div className="amp-mi-text">
                                                    <span>Expiry Date</span>
                                                    <strong className={selectedProduct.expiryDate ? 'text-red' : ''}>
                                                        {selectedProduct.expiryDate || 'Unlimited'}
                                                    </strong>
                                                </div>
                                            </div>
                                            <div className="amp-meta-item">
                                                <CheckCircle size={18} />
                                                <div className="amp-mi-text">
                                                    <span>Availability</span>
                                                    <strong>{selectedProduct.availability2 ? `${selectedProduct.availability} (${selectedProduct.availability2})` : selectedProduct.availability || 'In Stock'}</strong>
                                                </div>
                                            </div>
                                            <div className="amp-meta-item">
                                                <TrendingUp size={18} />
                                                <div className="amp-mi-text">
                                                    <span>Total Engagement</span>
                                                    <strong>{selectedProduct.views || 0} Redirects</strong>
                                                </div>
                                            </div>
                                            {selectedProduct.couponCode && (
                                                <div className="amp-meta-item">
                                                    <Tag size={18} />
                                                    <div className="amp-mi-text">
                                                        <span>Coupon Code</span>
                                                        <strong style={{color: '#10b981'}}>{selectedProduct.couponCode}</strong>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="amp-deal-actions-bottom">
                                            <a href={selectedProduct.url || selectedProduct.websiteUrl || '#'} target="_blank" rel="noreferrer" className="amp-btn-preview-link">
                                                <ExternalLink size={18} /> Preview Deal Page
                                            </a>
                                            <p className="amp-disclaimer-text">
                                                Note: Approving this deal will make it visible to all users on the home page and category pages. Ensure all fields above meet store requirements.
                                            </p>
                                        </div>
                                    </section>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* Premium Confirmation Modal */}
            <ConfirmModal
                isOpen={confirmDelete.isOpen}
                onClose={() => setConfirmDelete({ isOpen: false, productId: null })}
                onConfirm={confirmDeleteAction}
                title="Remove Deal?"
                message="Are you sure you want to permanently remove this deal? This will delete the offer from the marketplace."
                confirmText="Remove Deal"
                type="danger"
            />
            {/* Add New Deal Modal (Cloned UI from Client AddDeals) */}
            {isAddModalOpen && (
                <div className="amp-modal-overlay" style={{ zIndex: 2000 }}>
                    <div className="amp-modal-container large ap-modal-fix" style={{ maxWidth: '1000px', width: '95%', height: '90vh', overflowY: 'auto', background: 'white', borderRadius: '20px', padding: 0 }}>
                        <div className="ap-modal-header" style={{ padding: '20px 30px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, background: 'white', zIndex: 10 }}>
                            <div>
                                <h2 style={{ margin: 0, fontSize: '24px', color: '#0f172a' }}>Add New Marketplace Deal</h2>
                                <p style={{ margin: '5px 0 0 0', color: '#64748b', fontSize: '14px' }}>Administrative access to create deals for partners.</p>
                            </div>
                            <button onClick={() => setIsAddModalOpen(false)} style={{ background: '#f1f5f9', border: 'none', padding: '10px', borderRadius: '50%', cursor: 'pointer' }}><X size={24} /></button>
                        </div>
                        
                        <div className="ap-modal-body" style={{ padding: '30px' }}>
                            <form className="ap-form-container p-0" onSubmit={handleAddDealSubmit}>
                                <div className="ap-grid-layout" style={{ gridTemplateColumns: '1.5fr 1fr' }}>
                                    <div className="ap-main-col">
                                        <div className="ap-section-card adlay-shadow" style={{ border: 'none', background: '#f8fafc' }}>
                                            <div className="section-title"><User size={20} /> <h3>Business Partner / Client</h3></div>
                                            <div className="ap-form-group">
                                                <label>Select Associated Store <span className="req">*</span></label>
                                                <select 
                                                    value={selectedPartner ? JSON.stringify(selectedPartner) : ''} 
                                                    onChange={e => setSelectedPartner(e.target.value ? JSON.parse(e.target.value) : null)}
                                                    required
                                                >
                                                    <option value="">-- Choose a Store --</option>
                                                    <optgroup label="Registered Business Partners">
                                                        {allPartners.map((p, idx) => (
                                                            <option key={idx} value={JSON.stringify(p)}>{p.name} ({p.email || 'No Email'})</option>
                                                        ))}
                                                    </optgroup>
                                                </select>
                                                <p className="ap-hint" style={{ fontSize: '11px', marginTop: '5px' }}>Deals will only appear in this partner's dashboard.</p>
                                            </div>
                                        </div>

                                        <div className="ap-section-card adlay-shadow" style={{ marginTop: '20px', border: 'none', background: '#f8fafc' }}>
                                            <div className="section-title"><Package size={20} /> <h3>Basic Info</h3></div>
                                            <div className="ap-form-group">
                                                <label>Product/Deal Name <span className="req">*</span></label>
                                                <input type="text" value={productName} onChange={e => setProductName(e.target.value)} required placeholder="Enter deal title..." />
                                            </div>
                                            <div className="ap-form-group">
                                                <label>Subtitle / Short Description</label>
                                                <input type="text" value={subtitle} onChange={e => setSubtitle(e.target.value)} placeholder="Short catchy phrase..." />
                                            </div>
                                            <div className="ap-form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                                <div className="ap-form-group">
                                                    <label>Category <span className="req">*</span></label>
                                                    <select value={category} onChange={e => setCategory(e.target.value)} required>
                                                        <option value="">Select Category</option>
                                                        {globalCategories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                                                    </select>
                                                </div>
                                                <div className="ap-form-group">
                                                    <label>Brand/Store Name</label>
                                                    <input type="text" value={brand} onChange={e => setBrand(e.target.value)} placeholder="e.g. Abans" />
                                                </div>
                                            </div>
                                            <div className="ap-form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                                <div className="ap-form-group">
                                                    <label>Deal Type</label>
                                                    <select value={dealType} onChange={e => setDealType(e.target.value)}>
                                                        <option value="OFFER">OFFER</option>
                                                        <option value="FLASH DEAL">FLASH DEAL</option>
                                                        <option value="BUNDLE">BUNDLE</option>
                                                        <option value="COUPON">COUPON</option>
                                                    </select>
                                                </div>
                                                <div className="ap-form-group">
                                                    <label>Custom Badge (Optional)</label>
                                                    <input type="text" value={customBadge} onChange={e => setCustomBadge(e.target.value)} placeholder="e.g. Bestseller" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="ap-section-card adlay-shadow" style={{ marginTop: '20px', border: 'none', background: '#f8fafc' }}>
                                            <div className="section-title"><DollarSign size={20} /> <h3>Pricing & Stock</h3></div>
                                            <div className="ap-form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.5fr', gap: '15px' }}>
                                                <div className="ap-form-group"><label>Reg. Price (LKR)</label><input type="number" value={price} onChange={e => setPrice(e.target.value)} required /></div>
                                                <div className="ap-form-group"><label>Offer Price (LKR)</label><input type="number" value={discountPrice} onChange={e => setDiscountPrice(e.target.value)} /></div>
                                                <div className="ap-form-group">
                                                    <label>Discount</label>
                                                    <div style={{ padding: '12px', background: '#e2e8f0', borderRadius: '10px', textAlign: 'center', fontWeight: 'bold', color: '#1e293b' }}>{discountRatio}% OFF</div>
                                                </div>
                                            </div>
                                            <div className="ap-form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                                <div className="ap-form-group"><label>Stock Left</label><input type="number" value={stock} onChange={e => setStock(e.target.value)} /></div>
                                                <div className="ap-form-group"><label>Total Stock</label><input type="number" value={totalStock} onChange={e => setTotalStock(e.target.value)} /></div>
                                            </div>
                                            <div className="ap-form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                                <div className="ap-form-group">
                                                    <label>Availability</label>
                                                    <select value={availability} onChange={e => setAvailability(e.target.value)}>
                                                        <option value="Active">Active</option>
                                                        <option value="Out of Stock">Out of Stock</option>
                                                        <option value="Draft">Draft</option>
                                                    </select>
                                                </div>
                                                <div className="ap-form-group">
                                                    <label>Availability Note</label>
                                                    <input type="text" value={availability2} onChange={e => setAvailability2(e.target.value)} placeholder="e.g. Valid until stocks last" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="ap-section-card adlay-shadow" style={{ marginTop: '20px', border: 'none', background: '#f8fafc' }}>
                                            <div className="section-title"><Layers size={20} /> <h3>Content Details</h3></div>
                                            <div className="ap-form-group">
                                                <label>Main Description</label>
                                                <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Full details..." style={{ height: '120px' }}></textarea>
                                            </div>
                                            <div className="ap-form-group">
                                                <label>Highlights (One per line)</label>
                                                <textarea value={highlights} onChange={e => setHighlights(e.target.value)} placeholder="Enter key features..." style={{ height: '100px' }}></textarea>
                                            </div>
                                            <div className="ap-form-group">
                                                <label>Terms & Conditions (One per line)</label>
                                                <textarea value={terms} onChange={e => setTerms(e.target.value)} placeholder="Enter terms..." style={{ height: '100px' }}></textarea>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="ap-side-col">
                                        <div className="ap-section-card adlay-shadow" style={{ border: 'none', background: '#f8fafc' }}>
                                            <div className="section-title"><UploadCloud size={20} /> <h3>Images</h3></div>
                                            <p className="ap-hint" style={{ fontSize: '12px', color: '#64748b', marginBottom: '10px' }}>Thumbnail is required for Deal Cards.</p>
                                            <div className="ap-upload-wrapper">
                                                <input type="file" id="adm-thumb" hidden onChange={e => handleFileChange(e, 'thumb')} />
                                                <label htmlFor="adm-thumb" style={{ cursor: 'pointer', border: '2px dashed #cbd5e1', padding: '20px', borderRadius: '12px', display: 'flex', flexDirection:'column', alignItems: 'center', gap:'10px' }}>
                                                    {cardThumbnailPreview ? <img src={cardThumbnailPreview} style={{ width: '100%', borderRadius: '10px' }} /> : <><ImageIcon size={32} color="#94a3b8" /> <span>Card Thumbnail</span></>}
                                                </label>
                                            </div>

                                            <div className="ap-upload-wrapper" style={{ marginTop: '15px' }}>
                                                <input type="file" id="adm-banner" hidden multiple onChange={e => handleFileChange(e, 'banner')} />
                                                <label htmlFor="adm-banner" style={{ cursor: 'pointer', border: '2px dashed #cbd5e1', padding: '15px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap:'10px', justifyContent:'center' }}>
                                                    <Plus size={20} color="#3b82f6" /> <span>Add Banner Images ({previewImages.length})</span>
                                                </label>
                                            </div>
                                        </div>

                                        <div className="ap-section-card adlay-shadow" style={{ marginTop: '20px', border: 'none', background: '#f8fafc' }}>
                                            <div className="section-title"><Calendar size={20} /> <h3>Metadata</h3></div>
                                            <div className="ap-form-group"><label>Start Date <span className="req">*</span></label><input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required /></div>
                                            <div className="ap-form-group"><label>Expiry Date <span className="req">*</span></label><input type="date" value={expiryDate} onChange={e => setExpiryDate(e.target.value)} required /></div>
                                            <div className="ap-form-group"><label>Store Location(s)</label><input type="text" value={location} onChange={e => setLocation(e.target.value)} placeholder="Colombo, Kandy, Online..." /></div>
                                            <div className="ap-form-group"><label>Website/Link</label><input type="url" value={websiteUrl} onChange={e => setWebsiteUrl(e.target.value)} placeholder="https://..." /></div>
                                            <div className="ap-form-group"><label>Business Phone</label><input type="text" value={businessPhone} onChange={e => setBusinessPhone(e.target.value)} placeholder="+94 77..." /></div>
                                        </div>

                                        <button type="submit" style={{ width: '100%', background: '#143ae6', color: 'white', border: 'none', padding: '16px', borderRadius: '12px', fontSize: '18px', fontWeight: 'bold', marginTop: '20px', cursor: 'pointer', boxShadow: '0 10px 15px -3px rgba(20, 58, 230, 0.3)' }}>Publish Deal Now</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminManageDeals;
