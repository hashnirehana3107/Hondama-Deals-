import React, { useState, useEffect } from 'react';
import {
    LayoutGrid,
    Plus,
    Search,
    Edit3,
    Trash2,
    X,
    Upload,
    Palette,
    Image as ImageIcon,
    CheckCircle,
    XCircle,
    ChevronLeft,
    ChevronRight,
    ArrowLeft,
    UploadCloud
} from 'lucide-react';
import api from '../../utils/api';
import ConfirmModal from '../../components/common/ConfirmModal';
import './ManageCategories.css';

const ManageCategories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState({ isOpen: false, id: null });
    const [isSaving, setIsSaving] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        color: '#1B3BFF',
        image: '',
        icon: '',
        badge: '',
        subtitle: '',
        isActive: true,
        enablePriceFilter: true,
        enableRatingFilter: true,
        enableLocationFilter: true,
        customFilters: [] // { title: '', options: '' }
    });

    const API_URL = '/categories';

    useEffect(() => {
        fetchCategories();
    }, []);

    const compressImage = (file) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let { width, height } = img;
                    const maxDim = 800; // Limit size for base64 storage
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
                    // Use PNG to preserve transparency for icons
                    resolve(canvas.toDataURL('image/png'));
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
        });
    };

    const handleFileChange = async (e, field) => {
        const file = e.target.files[0];
        if (file) {
            try {
                const base64 = await compressImage(file);
                setFormData(prev => ({ ...prev, [field]: base64 }));
            } catch (err) {
                console.error("Image compression failed", err);
            }
        }
    };

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const res = await api.get(API_URL);
            if (res.data.success) {
                setCategories(res.data.categories);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (cat = null) => {
        if (cat) {
            setEditingCategory(cat);
            setFormData({
                name: cat.name,
                color: cat.color || '#1B3BFF',
                image: cat.image || '',
                icon: cat.icon || '',
                badge: cat.badge || '',
                subtitle: cat.subtitle || '',
                isActive: cat.isActive !== undefined ? cat.isActive : true,
                enablePriceFilter: cat.enablePriceFilter !== false,
                enableRatingFilter: cat.enableRatingFilter !== false,
                enableLocationFilter: cat.enableLocationFilter !== false,
                customFilters: cat.customFilters ? cat.customFilters.map(cf => ({ 
                    title: cf.title, 
                    options: Array.isArray(cf.options) ? cf.options.join(', ') : (cf.options || '') 
                })) : []
            });
        } else {
            setEditingCategory(null);
            setFormData({
                name: '',
                color: '#1B3BFF',
                image: '',
                icon: '',
                badge: '',
                subtitle: '',
                isActive: true,
                enablePriceFilter: true,
                enableRatingFilter: true,
                enableLocationFilter: true,
                customFilters: []
            });
        }
        setIsModalOpen(true);
    };

    const handleAddCustomFilter = () => {
        setFormData(prev => ({ ...prev, customFilters: [...prev.customFilters, { title: '', options: '' }] }));
    };

    const handleRemoveCustomFilter = (index) => {
        setFormData(prev => ({ ...prev, customFilters: prev.customFilters.filter((_, i) => i !== index) }));
    };

    const handleCustomFilterChange = (index, field, value) => {
        const updated = [...formData.customFilters];
        updated[index][field] = value;
        setFormData(prev => ({ ...prev, customFilters: updated }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Convert comma-separated string to array for each custom filter
        const payload = {
            ...formData,
            customFilters: formData.customFilters.map(cf => ({
                title: cf.title,
                options: typeof cf.options === 'string' 
                    ? cf.options.split(',').map(o => o.trim()).filter(o => o !== '')
                    : cf.options
            }))
        };

        console.log('=== SUBMITTING CATEGORY ===');
        console.log('Custom Filters being sent:', JSON.stringify(payload.customFilters, null, 2));
        console.log('Full payload keys:', Object.keys(payload));

        try {
            setIsSaving(true);
            let response;
            if (editingCategory) {
                response = await api.put(`${API_URL}/${editingCategory._id}`, payload);
            } else {
                response = await api.post(API_URL, payload);
            }
            console.log('=== SERVER RESPONSE ===', response.data);
            setIsModalOpen(false);
            fetchCategories();
        } catch (error) {
            console.error('Error saving category:', error);
            const msg = error.response?.data?.message || error.message || 'Failed to save category.';
            alert(msg);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!confirmDelete.id) return;
        try {
            await api.delete(`${API_URL}/${confirmDelete.id}`);
            setConfirmDelete({ isOpen: false, id: null });
            fetchCategories();
        } catch (error) {
            console.error('Error deleting category:', error);
        }
    };

    const [viewingCategory, setViewingCategory] = useState(null);
    const handleViewCategory = (cat) => {
        setViewingCategory(cat);
    };

    const filteredCategories = categories.filter(cat => 
        cat.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="mcat-page-wrapper">
            {/* 1. Page Header */}
            <div className="mcat-header">
                <div className="mcat-header-left">
                    <h1 className="mcat-title">Manage Categories</h1>
                    <p className="mcat-subtitle">Create and organize business categories for the marketplace</p>
                </div>
                <button className="mcat-add-btn" onClick={() => handleOpenModal()}>
                    <Plus size={20} /> Add New Category
                </button>
            </div>

            {/* 2. Stats Bar */}
            <div className="mcat-stats-row">
                <div className="mcat-stat-card">
                    <div className="mcat-stat-icon blue"><LayoutGrid size={22} /></div>
                    <div className="mcat-stat-info">
                        <strong>{categories.length}</strong>
                        <span>Total Categories</span>
                    </div>
                </div>
                {/* Search Bar */}
                <div className="mcat-search-area adlay-shadow">
                    <Search size={20} />
                    <input 
                        type="text" 
                        placeholder="Search category by name..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* 3. Table */}
            <div className="mcat-table-card adlay-shadow">
                <div className="mcat-table-wrap">
                    <table className="mcat-table">
                        <thead>
                            <tr>
                                <th>Category Structure</th>
                                <th>Visual Theme</th>
                                <th>Status</th>
                                <th className="text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="4" className="text-center py-10">Loading categories...</td></tr>
                            ) : filteredCategories.length === 0 ? (
                                <tr><td colSpan="4" className="text-center py-10">No categories found.</td></tr>
                            ) : (
                                filteredCategories.map(cat => (
                                    <tr key={cat._id}>
                                        <td>
                                            <div className="mcat-info-cell">
                                                <div className="mcat-img-box">
                                                    {cat.image ? <img src={cat.image} alt={cat.name} /> : < ImageIcon size={24} color="#94a3b8" />}
                                                </div>
                                                <div className="mcat-name-box">
                                                    <span className="mcat-name">{cat.name}</span>
                                                    <span className="mcat-slug">URL: /{cat.slug}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="mcat-theme-cell">
                                                <div className="mcat-color-dot" style={{ backgroundColor: cat.color }}></div>
                                                <div className="mcat-icon-preview">
                                                    {cat.icon ? <img src={cat.icon} alt="icon" /> : <LayoutGrid size={16} />}
                                                </div>
                                                <span className="mcat-color-code">{cat.color || '#1B3BFF'}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`mcat-status-pill ${cat.isActive ? 'active' : 'inactive'}`}>
                                                {cat.isActive ? <CheckCircle size={14} /> : <XCircle size={14} />}
                                                {cat.isActive ? 'Live' : 'Hidden'}
                                            </span>
                                        </td>
                                        <td className="text-right">
                                            <div className="mcat-actions">
                                                <button className="mcat-icon-btn view" title="View Details" onClick={() => handleViewCategory(cat)}>
                                                    <Search size={18} />
                                                </button>
                                                <button className="mcat-icon-btn edit" title="Edit" onClick={() => handleOpenModal(cat)}>
                                                    <Edit3 size={18} />
                                                </button>
                                                <button className="mcat-icon-btn delete" title="Delete" onClick={() => setConfirmDelete({ isOpen: true, id: cat._id })}>
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* 4. Add/Edit Modal */}
            {isModalOpen && (
                <div className="mcat-modal-overlay">
                    <div className="mcat-modal-container animate-slide-up">
                        <header className="mcat-modal-header">
                            <div className="mcat-mh-left">
                                <div className="mcat-icon-circle">
                                    <LayoutGrid size={22} color="#1B3BFF" />
                                </div>
                                <div>
                                    <h3>{editingCategory ? 'Edit Category' : 'Create New Category'}</h3>
                                    <p>Configure the look and feel of the marketplace category</p>
                                </div>
                            </div>
                            <button className="mcat-close-btn" onClick={() => setIsModalOpen(false)}>
                                <X size={24} />
                            </button>
                        </header>

                        <form className="mcat-form" onSubmit={handleSubmit}>
                            <div className="mcat-modal-body-flex">
                                {/* Left Side: Form Fields */}
                                <div className="mcat-form-main-fields">
                                    <div className="mcat-form-grid">
                                        <div className="mcat-form-group span-2">
                                            <label>Category Name</label>
                                            <div className="mcat-input-wrap">
                                                <LayoutGrid size={18} />
                                                <input 
                                                    type="text" 
                                                    placeholder="e.g. Salon, Restaurant, Electronics" 
                                                    required
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                                />
                                            </div>
                                        </div>

                                        <div className="mcat-form-group span-2">
                                            <label>Dynamic Header Page Badge (e.g. DINE & TASTE)</label>
                                            <div className="mcat-input-wrap">
                                                <LayoutGrid size={18} />
                                                <input 
                                                    type="text" 
                                                    placeholder="Enter badge text..." 
                                                    value={formData.badge}
                                                    onChange={(e) => setFormData({...formData, badge: e.target.value})}
                                                    className="mcat-input"
                                                />
                                            </div>
                                        </div>

                                        <div className="mcat-form-group span-2">
                                            <label>Dynamic Header Page Subtitle (e.g. Discover the best cuisines...)</label>
                                            <div className="mcat-input-wrap">
                                                <Edit3 size={18} />
                                                <input 
                                                    type="text" 
                                                    placeholder="Enter subtitle text..." 
                                                    value={formData.subtitle}
                                                    onChange={(e) => setFormData({...formData, subtitle: e.target.value})}
                                                    className="mcat-input"
                                                />
                                            </div>
                                        </div>

                                        <div className="mcat-form-group">
                                            <label>Theme Color</label>
                                            <div className="mcat-color-input-wrap">
                                                <Palette size={18} />
                                                <input 
                                                    type="color" 
                                                    value={formData.color}
                                                    onChange={(e) => setFormData({...formData, color: e.target.value})}
                                                />
                                                <span className="mcat-color-label">{formData.color}</span>
                                            </div>
                                        </div>

                                        <div className="mcat-form-group">
                                            <label>Status</label>
                                            <div className="mcat-toggle-wrap">
                                                <button 
                                                    type="button"
                                                    className={`mcat-toggle-btn ${formData.isActive ? 'active' : ''}`}
                                                    onClick={() => setFormData({...formData, isActive: !formData.isActive})}
                                                >
                                                    <div className="mcat-toggle-thumb"></div>
                                                </button>
                                                <span>{formData.isActive ? 'Active' : 'Hidden'}</span>
                                            </div>
                                        </div>

                                        <div className="mcat-form-group span-2">
                                            <label>Thumbnail Image</label>
                                            <div 
                                                className="mcat-file-upload-box" 
                                                onClick={() => document.getElementById('thumb-upload').click()}
                                                style={{ 
                                                    border: '2px dashed #e2e8f0', 
                                                    borderRadius: '16px', 
                                                    height: '180px', /* Increased height for better view */
                                                    width: '100%',
                                                    display: 'flex', 
                                                    flexDirection: 'column', 
                                                    alignItems: 'center', 
                                                    justifyContent: 'center', 
                                                    cursor: 'pointer',
                                                    position: 'relative',
                                                    overflow: 'hidden',
                                                    background: formData.image ? '#f1f5f9' : '#f8fafc',
                                                    transition: '0.3s'
                                                }}
                                            >
                                                {formData.image ? (
                                                    <>
                                                        <img src={formData.image} alt="thumb" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                                        <button 
                                                            type="button" 
                                                            onClick={(e) => { e.stopPropagation(); setFormData({...formData, image: ''}); }}
                                                            style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%', padding: '5px', display: 'flex', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                                                        >
                                                            <X size={16} color="#ef4444" />
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <UploadCloud size={32} color="#94a3b8" />
                                                        <span style={{ fontSize: '13px', color: '#64748b', marginTop: '8px', fontWeight: '500' }}>Click to upload thumbnail</span>
                                                    </>
                                                )}
                                                <input id="thumb-upload" type="file" hidden accept="image/*" onChange={(e) => handleFileChange(e, 'image')} />
                                            </div>
                                        </div>

                                        <div className="mcat-form-group span-2">
                                            <label>Category Icon</label>
                                            <div 
                                                className="mcat-file-upload-box" 
                                                onClick={() => document.getElementById('icon-upload').click()}
                                                style={{ 
                                                    border: '2px dashed #e2e8f0', 
                                                    borderRadius: '16px', 
                                                    height: '120px', 
                                                    display: 'flex', 
                                                    flexDirection: 'column', 
                                                    alignItems: 'center', 
                                                    justifyContent: 'center', 
                                                    cursor: 'pointer',
                                                    position: 'relative',
                                                    overflow: 'hidden',
                                                    background: formData.icon ? '#f1f5f9' : '#f8fafc',
                                                    transition: '0.3s'
                                                }}
                                            >
                                                {formData.icon ? (
                                                    <>
                                                        <img src={formData.icon} alt="icon" style={{ height: '80%', width: '80%', objectFit: 'contain' }} />
                                                        <button 
                                                            type="button" 
                                                            onClick={(e) => { e.stopPropagation(); setFormData({...formData, icon: ''}); }}
                                                            style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%', padding: '5px', display: 'flex', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                                                        >
                                                            <X size={16} color="#ef4444" />
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <ImageIcon size={28} color="#94a3b8" />
                                                        <span style={{ fontSize: '13px', color: '#64748b', marginTop: '6px', fontWeight: '500' }}>Click to upload icon</span>
                                                    </>
                                                )}
                                                <input id="icon-upload" type="file" hidden accept="image/*" onChange={(e) => handleFileChange(e, 'icon')} />
                                            </div>
                                        </div>

                                        <div className="mcat-form-group span-2" style={{ borderTop: '1px solid #e2e8f0', paddingTop: '15px' }}>
                                            <label style={{ fontSize: '15px', color: '#1B3BFF' }}>Frontend Filters Configuration</label>
                                            <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '10px' }}>Select standard filters and add custom ones.</p>
                                        </div>

                                        <div className="mcat-form-group span-2" style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', color: '#334155' }}>
                                                <input type="checkbox" checked={formData.enablePriceFilter} onChange={e => setFormData({...formData, enablePriceFilter: e.target.checked})} style={{ width: '16px', height: '16px', accentColor: '#1B3BFF' }} />
                                                Price Filter
                                            </label>
                                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', color: '#334155' }}>
                                                <input type="checkbox" checked={formData.enableRatingFilter} onChange={e => setFormData({...formData, enableRatingFilter: e.target.checked})} style={{ width: '16px', height: '16px', accentColor: '#1B3BFF' }} />
                                                Rating Filter
                                            </label>
                                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', color: '#334155' }}>
                                                <input type="checkbox" checked={formData.enableLocationFilter} onChange={e => setFormData({...formData, enableLocationFilter: e.target.checked})} style={{ width: '16px', height: '16px', accentColor: '#1B3BFF' }} />
                                                Location Filter
                                            </label>
                                        </div>

                                        <div className="mcat-form-group span-2" style={{ marginTop: '10px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                                <label style={{ margin: 0 }}>Custom Filters</label>
                                                <button type="button" onClick={handleAddCustomFilter} style={{ background: '#eff6ff', color: '#1B3BFF', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                                                    <Plus size={14} /> Add Filter
                                                </button>
                                            </div>

                                            {formData.customFilters.map((filter, index) => (
                                                <div key={index} style={{ background: '#f8fafc', padding: '15px', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '10px', position: 'relative' }}>
                                                    <button type="button" onClick={() => handleRemoveCustomFilter(index)} style={{ position: 'absolute', top: '10px', right: '10px', background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                                                        <Trash2 size={16} />
                                                    </button>
                                                    <div className="mcat-form-group" style={{ marginBottom: '10px' }}>
                                                        <label style={{ fontSize: '13px' }}>Filter Title (e.g. Beauty & Grooming)</label>
                                                        <input 
                                                            type="text" 
                                                            placeholder="Filter Title" 
                                                            value={filter.title}
                                                            onChange={(e) => handleCustomFilterChange(index, 'title', e.target.value)}
                                                            className="mcat-input"
                                                            style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '8px' }}
                                                        />
                                                    </div>
                                                    <div className="mcat-form-group" style={{ marginBottom: 0 }}>
                                                        <label style={{ fontSize: '13px' }}>Filter Options (Comma Separated)</label>
                                                        <textarea 
                                                            placeholder="e.g. Salon Liyo, Chandani Bandara, Crown Salon" 
                                                            value={filter.options}
                                                            onChange={(e) => handleCustomFilterChange(index, 'options', e.target.value)}
                                                            className="mcat-textarea"
                                                            style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '8px', minHeight: '60px', resize: 'vertical' }}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                            {formData.customFilters.length === 0 && (
                                                <div style={{ textAlign: 'center', padding: '20px', background: '#f8fafc', borderRadius: '10px', border: '1px dashed #cbd5e1', color: '#94a3b8', fontSize: '13px' }}>
                                                    No custom filters added. Click "Add Filter" to create options like Brands or Deal Types.
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Right Side: Preview Panel */}
                                <div className="mcat-modal-preview-panel">
                                    <div className="mcat-preview-sticky-wrap">
                                        <div className="mcat-preview-section">
                                            <h4>Live Preview</h4>
                                            <div className="mcat-preview-box">
                                                <div className="cat-premium-card" style={{ maxWidth: '180px', margin: '0' }}>
                                                    <div className="cat-circle-frame">
                                                        <div className="cat-img-inner-circle">
                                                            {formData.image ? <img src={formData.image} alt="preview" /> : <div className="img-placeholder"></div>}
                                                        </div>
                                                    </div>
                                                    <div className="cat-label-box" style={{ 
                                                        backgroundColor: formData.color + '15',
                                                        borderColor: formData.color + '40'
                                                    }}>
                                                        <div className="cat-card-icon-wrap">
                                                            {formData.icon ? <img src={formData.icon} alt="icon" style={{width:'18px', height: '18px'}}/> : <LayoutGrid size={16} color={formData.color}/>}
                                                        </div>
                                                        <span className="cat-label-text">{formData.name || 'Category'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <p className="mcat-preview-hint">Real-time storefront appearance</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <footer className="mcat-modal-footer">
                                <button type="submit" className="mcat-btn-save" disabled={isSaving}>
                                    {isSaving ? 'Saving...' : (editingCategory ? 'Update Category' : 'Create Category')}
                                </button>
                                <button type="button" className="mcat-btn-cancel" onClick={() => setIsModalOpen(false)}>Cancel</button>
                            </footer>
                        </form>
                    </div>
                </div>
            )}

            {/* View Details Modal */}
            {viewingCategory && (
                <div className="mcat-modal-overlay">
                    <div className="mcat-modal-container" style={{ maxWidth: '600px' }}>
                        <header className="mcat-modal-header">
                            <div className="mcat-mh-left">
                                <div className="mcat-icon-circle" style={{ backgroundColor: viewingCategory.color + '20' }}>
                                    {viewingCategory.icon ? <img src={viewingCategory.icon} alt="icon" style={{width: '24px'}} /> : <LayoutGrid size={22} color={viewingCategory.color} />}
                                </div>
                                <h3 style={{ margin: 0 }}>Category Details</h3>
                            </div>
                            <button className="mcat-close-btn" onClick={() => setViewingCategory(null)}>
                                <X size={24} />
                            </button>
                        </header>
                        <div style={{ padding: '30px', overflowY: 'auto', maxHeight: '70vh' }}>
                            <div style={{ textAlign: 'center', marginBottom: '30px', background: '#f8fafc', padding: '20px', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
                                <div style={{ width: '100px', height: '100px', borderRadius: '20px', overflow: 'hidden', margin: '0 auto 15px', background: '#fff', border: '3px solid white', boxShadow: '0 10px 20px rgba(0,0,0,0.05)' }}>
                                    {viewingCategory.image ? <img src={viewingCategory.image} alt="cat" style={{width:'100%', height:'100%', objectFit:'cover'}} /> : <div style={{width:'100%', height:'100%', background: '#f1f5f9'}} />}
                                </div>
                                <h2 style={{ margin: 0, color: '#323c82', fontSize: '24px', fontWeight: '800' }}>{viewingCategory.name}</h2>
                                <span style={{ color: '#64748b', fontSize: '14px' }}>Slug: /{viewingCategory.slug}</span>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
                                <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '15px', border: '1px solid #e2e8f0' }}>
                                    <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px' }}>Theme Color</label>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <div style={{ width: '24px', height: '24px', borderRadius: '6px', background: viewingCategory.color }}></div>
                                        <span style={{ fontWeight: '700', color: '#323c82' }}>{viewingCategory.color}</span>
                                    </div>
                                </div>
                                <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '15px', border: '1px solid #e2e8f0' }}>
                                    <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px' }}>Status</label>
                                    <span style={{ 
                                        padding: '4px 12px', 
                                        borderRadius: '20px', 
                                        fontSize: '12px', 
                                        fontWeight: '800', 
                                        background: viewingCategory.isActive ? '#f0fdf4' : '#fef2f2',
                                        color: viewingCategory.isActive ? '#16a34a' : '#ef4444' 
                                    }}>
                                        {viewingCategory.isActive ? 'Active' : 'Hidden'}
                                    </span>
                                </div>
                            </div>

                            <div style={{ background: '#f1f5f9', padding: '20px', borderRadius: '15px', marginBottom: '30px' }}>
                                <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', marginBottom: '12px' }}>Front-end Display Meta</label>
                                <div style={{ marginBottom: '15px' }}>
                                    <p style={{ margin: 0, fontSize: '11px', color: '#94a3b8', fontWeight: '800' }}>HEADER BADGE</p>
                                    <p style={{ margin: 0, fontSize: '15px', color: '#323c82', fontWeight: '800' }}>{viewingCategory.badge || 'Not Set'}</p>
                                </div>
                                <div>
                                    <p style={{ margin: 0, fontSize: '11px', color: '#94a3b8', fontWeight: '800' }}>PAGE SUBTITLE</p>
                                    <p style={{ margin: 0, fontSize: '14px', color: '#475569', fontWeight: '600' }}>{viewingCategory.subtitle || 'Not Set'}</p>
                                </div>
                            </div>

                            <div style={{ marginBottom: '25px' }}>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: '800', color: '#323c82', marginBottom: '12px', borderBottom: '1.5px solid #f1f5f9', paddingBottom: '8px' }}>Standard Filters Enabled</label>
                                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                    {['Price', 'Rating', 'Location'].map(f => {
                                        const field = `enable${f}Filter`;
                                        const isEnabled = viewingCategory[field] !== false; // Active by default
                                        return (
                                            <span key={f} style={{ 
                                                padding: '6px 14px', 
                                                borderRadius: '8px', 
                                                fontSize: '13px', 
                                                fontWeight: '600',
                                                background: isEnabled ? '#eff6ff' : '#fef2f2',
                                                color: isEnabled ? '#1B3BFF' : '#ef4444',
                                                border: isEnabled ? '1px solid #bfdbfe' : '1px solid #fee2e2'
                                            }}>
                                                {f} Filter: {isEnabled ? 'ENABLED' : 'DISABLED'}
                                            </span>
                                        );
                                    })}
                                </div>
                            </div>

                             <div>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: '800', color: '#323c82', marginBottom: '12px', borderBottom: '1.5px solid #f1f5f9', paddingBottom: '8px' }}>Custom Filters</label>
                                {viewingCategory.customFilters && viewingCategory.customFilters.length > 0 ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                        {viewingCategory.customFilters.map((cf, i) => {
                                            const displayOptions = Array.isArray(cf.options) 
                                                ? cf.options.join(', ') 
                                                : (typeof cf.options === 'string' ? cf.options : 'None');
                                            
                                            return (
                                                <div key={i} style={{ background: '#f8fafc', padding: '12px 15px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                                    <strong style={{ display: 'block', fontSize: '14px', color: '#1B3BFF', marginBottom: '5px' }}>{cf.title || 'Untitled Filter'}</strong>
                                                    <span style={{ fontSize: '13px', color: '#64748b' }}>Options: {displayOptions}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <p style={{ color: '#94a3b8', fontSize: '13px', fontStyle: 'italic' }}>No custom filters configured.</p>
                                )}
                            </div>
                        </div>
                        <footer className="mcat-modal-footer">
                            <button className="mcat-btn-save" onClick={() => setViewingCategory(null)}>Close</button>
                            <button className="mcat-btn-cancel" onClick={() => { setViewingCategory(null); handleOpenModal(viewingCategory); }}>Edit Category</button>
                        </footer>
                    </div>
                </div>
            )}

            {/* Delete Confirmation */}
            <ConfirmModal 
                isOpen={confirmDelete.isOpen}
                onClose={() => setConfirmDelete({ isOpen: false, id: null })}
                onConfirm={handleDelete}
                title="Delete Category?"
                message="Are you sure you want to permanently delete this category? This will also affect deals assigned to it."
                confirmText="Delete Permanently"
                type="danger"
            />
        </div>
    );
};

export default ManageCategories;
