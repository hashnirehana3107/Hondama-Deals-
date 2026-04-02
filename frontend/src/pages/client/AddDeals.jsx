import React, { useState, useEffect } from 'react';
import {
    LayoutDashboard,
    Package,
    ShoppingBag,
    MessageSquare,
    Store,
    LogOut,
    Bell,
    Search,
    Plus,
    User,
    ChevronRight,
    UploadCloud,
    X,
    Menu,
    Image as ImageIcon,
    Tag,
    MapPin,
    AlertCircle,
    CheckCircle2,
    Home,
    RefreshCw,
    Star
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getStoredCategories } from '../../utils/categoryUtils';
import ClientSidebar from '../../components/layout/ClientSidebar';
import ClientTopbar from '../../components/layout/ClientTopbar';
import AlertModal from '../../components/common/AlertModal';
import './AddDeals.css';

const AddDeals = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // Form States
    const [globalCategories, setGlobalCategories] = useState([]);
    useEffect(() => {
        setGlobalCategories(getStoredCategories());
    }, []);

    const [productName, setProductName] = useState('');
    const [subtitle, setSubtitle] = useState('');
    const [category, setCategory] = useState('');
    const [brand, setBrand] = useState('');
    const [dealType, setDealType] = useState('');

    const [price, setPrice] = useState('');
    const [discountPrice, setDiscountPrice] = useState('');
    const [discountRatio, setDiscountRatio] = useState(0);

    const [stock, setStock] = useState('');
    const [totalStock, setTotalStock] = useState('');
    const [availability, setAvailability] = useState('In Stock');
    const [availability2, setAvailability2] = useState('Valid during store hours');

    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');
    const [highlights, setHighlights] = useState('');
    const [terms, setTerms] = useState('');

    const [images, setImages] = useState([]);
    const [previewImages, setPreviewImages] = useState([]);
    const [cardThumbnail, setCardThumbnail] = useState(null);
    const [cardThumbnailPreview, setCardThumbnailPreview] = useState(null);
    const [customBadge, setCustomBadge] = useState('');

    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [expiryDate, setExpiryDate] = useState('');
    const [websiteUrl, setWebsiteUrl] = useState('');
    const [businessPhone, setBusinessPhone] = useState('');
    const [businessLogo, setBusinessLogo] = useState('');

    const [rating, setRating] = useState('0');
    const [ratingCount, setRatingCount] = useState('0');
    const [isFetchingReviews, setIsFetchingReviews] = useState(false);

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

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const compressImage = (file) => {
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
    };

    const handleUrlBlur = () => {
        if (websiteUrl && websiteUrl.length > 5 && rating === '0') {
            setIsFetchingReviews(true);
            setTimeout(() => {
                const seed = websiteUrl.length + websiteUrl.charCodeAt(0) + (websiteUrl.charCodeAt(websiteUrl.length - 1) || 0);
                const mockRating = (4.0 + (seed % 10) / 10).toFixed(1);
                const mockCount = (15 + (seed * 17) % 900).toString();
                setRating(mockRating);
                setRatingCount(mockCount);
                setIsFetchingReviews(false);
            }, 1200); 
        }
    };

    // Calculate Discount dynamically
    useEffect(() => {
        if (price && discountPrice) {
            const p = parseFloat(price);
            const d = parseFloat(discountPrice);
            if (p > 0 && d < p) {
                const ratio = Math.round(((p - d) / p) * 100);
                setDiscountRatio(ratio);
            } else {
                setDiscountRatio(0);
            }
        } else {
            setDiscountRatio(0);
        }
    }, [price, discountPrice]);

    // Handle Image Upload
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            const newImages = [...images, ...files].slice(0, 5); // Max 5 images
            setImages(newImages);

            const fileReaders = files.map(file => compressImage(file));

            Promise.all(fileReaders).then(results => {
                setPreviewImages(prev => [...prev, ...results].slice(0, 5));
            });
        }
    };

    const removeImage = (index) => {
        const newImages = [...images];
        newImages.splice(index, 1);
        setImages(newImages);

        const newPreviews = [...previewImages];
        newPreviews.splice(index, 1);
        setPreviewImages(newPreviews);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // 1. Validation: Images
        if (!cardThumbnailPreview && previewImages.length === 0) {
            triggerAlert('error', 'Missing Images', 'Please upload at least a Deal Card Thumbnail or a Deal Banner Image.');
            return;
        }

        // 2. Validation: Pricing
        const p = parseFloat(price);
        const d = discountPrice ? parseFloat(discountPrice) : 0;
        if (d > 0 && d >= p) {
            triggerAlert('error', 'Invalid Pricing', 'The Offer/Discount Price must be lower than the Original Price.');
            return;
        }

        // 3. Validation: Dates
        const start = new Date(startDate);
        const expiry = new Date(expiryDate);
        if (expiry <= start) {
            triggerAlert('error', 'Invalid Date', 'The Expiry Date must be after the Start Date.');
            return;
        }
        
        // 4. Validation: Stock
        const stockLeftValue = Number(stock) || 0;
        const totalStockValue = Number(totalStock) || 0;
        if (totalStockValue > 0 && stockLeftValue > totalStockValue) {
            triggerAlert('error', 'Invalid Stock', 'Current Stock Quantity cannot be greater than Total Stock.');
            return;
        }

        // Calculate categorization logic
        const diffDays = Math.ceil((expiry - start) / (1000 * 60 * 60 * 24));

        // Provide fallback totalStockValue if needed
        const finalTotalStock = totalStockValue || stockLeftValue || 0;

        const newDeal = {
            id: Date.now(),
            name: productName,
            subtitle,
            price: discountPrice ? parseFloat(discountPrice).toLocaleString() : parseFloat(price).toLocaleString(),
            oldPrice: discountPrice ? parseFloat(price).toLocaleString() : null,
            img: cardThumbnailPreview || previewImages[0] || "/assets/images/placeholder_deal.png",
            badge: customBadge || (discountRatio > 0 ? `${discountRatio}% OFF` : 'NEW'),
            storeName: brand || user?.name || "Premium Store",
            storeImg: businessLogo || (user?.email?.includes('spaceylon') ? "/assets/images/spaceylonLogo.png" : "/assets/images/luvLogo.png"),
            rating: rating,
            ratingCount: ratingCount,
            location: location || "Nationwide",
            dealType: dealType || "OFFER",
            category: category,
            status: availability === 'Out of Stock' ? 'Expired' : (availability === 'Draft' ? 'Draft' : 'Active'),
            availability: availability,
            availability2: availability2,
            stockLeft: stockLeftValue,
            totalStock: finalTotalStock,
            sellingFast: finalTotalStock > 0 ? stockLeftValue / finalTotalStock <= 0.35 : false,
            views: Math.floor(Math.random() * 50), // Random starting views for mock testing
            isDailyDeal: diffDays <= 1,
            isMonthlyDeal: diffDays >= 28,
            expiryDate: expiryDate,
            websiteUrl: websiteUrl,
            description: description,
            highlights: highlights,
            terms: terms,
            images: previewImages.length > 0 ? previewImages : [cardThumbnailPreview || "/assets/images/placeholder_deal.png"],
            couponCode: "SAVE NOW"
        };

        try {
            const existingDeals = JSON.parse(localStorage.getItem('hodama_all_deals_v1') || '[]');
            localStorage.setItem('hodama_all_deals_v1', JSON.stringify([newDeal, ...existingDeals]));

            triggerAlert(
                'success', 
                'Deal Published!', 
                'Your deal has been successfully added to the marketplace. It will be visible in relevant sections soon.',
                () => navigate('/client/manage-deals')
            );
        } catch (error) {
            console.error(error);
            if (error.name === 'QuotaExceededError' || error.message.includes('quota')) {
                triggerAlert('error', 'Storage Full', 'Image sizes are too large for browser storage. Please upload smaller images as this is a prototype limit.');
            } else {
                triggerAlert('error', 'Publish Failed', 'Failed to publish deal: ' + error.message);
            }
        }
    };

    const handleSaveDraft = () => {
        triggerAlert('success', 'Draft Saved', 'Your deal progress has locally been saved as a draft.');
    };

    return (
        <div className="client-dashboard-wrapper">
            <ClientSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

            {/* Main Content Area */}
            <main className="dashboard-main-content">
                <ClientTopbar toggleSidebar={toggleSidebar} />

                {/* View Container */}
                <div className="dashboard-view-container ap-scroll-container">
                    <div className="ap-wrapper fade-in">

                        {/* 1. Breadcrumb */}
                        <div className="ap-breadcrumb">
                            <span onClick={() => navigate('/client/dashboard')}>Dashboard</span>
                            <ChevronRight size={14} />
                            <span className="current">Add New Deal</span>
                        </div>

                        {/* 2. Page Header */}
                        <div className="ap-page-header">
                            <div className="ap-header-title">
                                <div className="ap-header-icon">
                                    <Plus size={32} />
                                </div>
                                <div className="ap-header-text">
                                    <h1>Add New Deal</h1>
                                    <p>Fill the details below to publish your offer in Hodama Deals marketplace.</p>
                                </div>
                            </div>
                            <div className="ap-header-tip">
                                <AlertCircle size={18} />
                                <span>Add vibrant images to attract more deal clicks.</span>
                            </div>
                        </div>


                        <form className="ap-form-container" onSubmit={handleSubmit}>

                            <div className="ap-grid-layout">
                                {/* Left Column: Main Details */}
                                <div className="ap-main-col">

                                    {/* 3. Deal Information */}
                                    <div className="ap-section-card">
                                        <div className="section-title">
                                            <Package size={20} />
                                            <h3>Deal Information</h3>
                                        </div>
                                        <div className="ap-form-group">
                                            <label>Deal Title <span className="req">*</span></label>
                                            <input
                                                type="text"
                                                placeholder="e.g. Sunday Seafood Buffet – 15% OFF"
                                                value={productName}
                                                onChange={(e) => setProductName(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="ap-form-group">
                                            <label>Short Subtitle (Optional)</label>
                                            <input
                                                type="text"
                                                placeholder="e.g. Grab 8 drumsticks for You"
                                                value={subtitle}
                                                onChange={(e) => setSubtitle(e.target.value)}
                                            />
                                        </div>
                                        <div className="ap-form-group">
                                            <label>Deal Card Thumbnail Image <span className="req">*</span></label>
                                            <div className="ap-thumbnail-upload-box" style={{ 
                                                border: '1px dashed #cbd5e1', 
                                                padding: '16px', 
                                                borderRadius: '8px', 
                                                display: 'flex', 
                                                flexDirection: 'column', 
                                                alignItems: 'center',
                                                gap: '10px',
                                                backgroundColor: '#f8fafc'
                                            }}>
                                                {cardThumbnailPreview ? (
                                                    <div style={{ position: 'relative', width: '120px', height: '120px' }}>
                                                        <img src={cardThumbnailPreview} alt="Thumbnail Preview" style={{ width: '100%', height: '100%', borderRadius: '8px', objectFit: 'cover' }} />
                                                        <button 
                                                            type="button" 
                                                            onClick={() => { setCardThumbnail(null); setCardThumbnailPreview(null); }}
                                                            style={{ position: 'absolute', top: -8, right: -8, backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '50%', padding: '4px', cursor: 'pointer' }}
                                                        >
                                                            <X size={14} />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                                        <div style={{ backgroundColor: 'white', padding: '10px', borderRadius: '50%', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', color: '#3b82f6' }}><UploadCloud size={24} /></div>
                                                        <span style={{ fontSize: '13px', color: '#64748b' }}>Upload Design Card Thumbnail</span>
                                                        <input 
                                                            type="file" 
                                                            accept="image/*" 
                                                            style={{ display: 'none' }}
                                                            onChange={async (e) => {
                                                                const file = e.target.files[0];
                                                                if (file) {
                                                                    setCardThumbnail(file);
                                                                    const compressed = await compressImage(file);
                                                                    setCardThumbnailPreview(compressed);
                                                                }
                                                            }}
                                                        />
                                                    </label>
                                                )}
                                                <p style={{ margin: 0, fontSize: '11px', color: '#94a3b8' }}>This image appears on the homepage sliders.</p>
                                            </div>
                                        </div>
                                        <div className="ap-form-row">
                                            <div className="ap-form-group">
                                                <label>Category <span className="req">*</span></label>
                                                <select
                                                    value={category}
                                                    onChange={(e) => {
                                                        setCategory(e.target.value);
                                                    }}
                                                    required
                                                >
                                                    <option value="">Select Category</option>
                                                    {globalCategories.map(cat => (
                                                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                                                    ))}
                                                    <option value="other">Other</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="ap-form-row">
                                            <div className="ap-form-group">
                                                <label>Business / Brand Name</label>
                                                <input
                                                    type="text"
                                                    placeholder="e.g. Pizza Hut/ Spa Ceylon"
                                                    value={brand}
                                                    onChange={(e) => setBrand(e.target.value)}
                                                />
                                            </div>
                                            <div className="ap-form-group">
                                                <label>Primary Location</label>
                                                <input
                                                    type="text"
                                                    placeholder="e.g. Colombo, Galle, Islandwide"
                                                    value={location}
                                                    onChange={(e) => setLocation(e.target.value)}
                                                />
                                            </div>
                                            <div className="ap-form-group">
                                                <label>Deal Type</label>
                                                <select value={dealType} onChange={(e) => setDealType(e.target.value)}>
                                                    <option value="">Select Deal Type</option>
                                                    <option value="SALE">SALE</option>
                                                    <option value="OFFER">OFFER</option>
                                                    <option value="LIMITED OFFER">LIMITED OFFER</option>
                                                    <option value="DISCOUNT">DISCOUNT</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    {/* 5. Deal Images Upload */}
                                    <div className="ap-section-card">
                                        <div className="section-title">
                                            <ImageIcon size={20} />
                                            <h3>Deal Banner/Images <span className="req">*</span></h3>
                                        </div>
                                        <p className="ap-helper-text">Upload up to 5 images. First image will be the primary offer thumbnail. Use a branded banner for best results.</p>

                                        <div className="ap-upload-zone">
                                            <input
                                                type="file"
                                                id="ap-img-upload"
                                                multiple
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                style={{ display: 'none' }}
                                            />
                                            <label htmlFor="ap-img-upload" className="ap-upload-trigger">
                                                <UploadCloud size={40} className="text-gray-400" />
                                                <span className="upload-link">Click to upload</span>
                                                <span className="upload-hint">or drag and drop</span>
                                                <span className="upload-req">PNG, JPG (max. 5MB per image)</span>
                                            </label>
                                        </div>

                                        {previewImages.length > 0 && (
                                            <div className="ap-image-preview-list">
                                                {previewImages.map((src, index) => (
                                                    <div key={index} className="preview-item">
                                                        <img src={src} alt={`Preview ${index}`} />
                                                        <button type="button" className="remove-img-btn" onClick={() => removeImage(index)}>
                                                            <X size={14} />
                                                        </button>
                                                        {index === 0 && <span className="cover-badge">Cover</span>}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* 8. Deal Description */}
                                    <div className="ap-section-card">
                                        <div className="section-title">
                                            <AlertCircle size={20} />
                                            <h3>Deal Description <span className="req">*</span></h3>
                                        </div>
                                        <div className="ap-form-group">
                                            <textarea
                                                className="ap-desc-area"
                                                placeholder="Describe the deal in detail. Include what's included, terms of use, how to claim it, etc."
                                                rows="6"
                                                value={description}
                                                onChange={(e) => setDescription(e.target.value)}
                                                required
                                            ></textarea>
                                        </div>
                                        <div className="ap-form-group">
                                            <label>Deal Highlights (one per line)</label>
                                            <textarea
                                                className="ap-desc-area"
                                                placeholder={"100% Natural ingredients\nAward-winning brand\n60-day money back guarantee"}
                                                rows="4"
                                                value={highlights}
                                                onChange={(e) => setHighlights(e.target.value)}
                                            ></textarea>
                                        </div>
                                        <div className="ap-form-group">
                                            <label>Terms &amp; Conditions</label>
                                            <textarea
                                                className="ap-desc-area"
                                                placeholder="e.g. Valid for dine-in only. Cannot be combined with other offers. Present digital voucher at checkout."
                                                rows="3"
                                                value={terms}
                                                onChange={(e) => setTerms(e.target.value)}
                                            ></textarea>
                                        </div>
                                    </div>

                                </div>

                                {/* Right Column: Pricing & Meta */}
                                <div className="ap-side-col">

                                    {/* 4. Pricing & Discount */}
                                    <div className="ap-section-card">
                                        <div className="section-title">
                                            <Tag size={20} />
                                            <h3>Pricing &amp; Discount</h3>
                                        </div>
                                        <div className="ap-form-group">
                                            <label>Original Price (LKR) <span className="req">*</span></label>
                                            <input
                                                type="number"
                                                placeholder="0.00"
                                                value={price}
                                                onChange={(e) => setPrice(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="ap-form-group">
                                            <label>Offer / Deal Price (LKR) <span className="req">*</span></label>
                                            <input
                                                type="number"
                                                placeholder="0.00 (Optional)"
                                                value={discountPrice}
                                                onChange={(e) => setDiscountPrice(e.target.value)}
                                            />
                                        </div>
                                        {discountRatio > 0 && (
                                            <div className="ap-discount-calc fade-in">
                                                <span className="calc-label">Auto-Calculated Discount:</span>
                                                <span className="calc-badge">{discountRatio}% OFF</span>
                                            </div>
                                        )}
                                        <div className="ap-form-group">
                                            <label>Custom Badge Text (Optional)</label>
                                            <input
                                                type="text"
                                                placeholder="e.g. 50% OFF or NEW"
                                                value={customBadge}
                                                onChange={(e) => setCustomBadge(e.target.value)}
                                            />
                                            <p className="ap-helper-text mt-2">This will override the auto-calculated discount badge.</p>
                                        </div>
                                        <div className="ap-form-group">
                                            <label>Coupon Code (Optional)</label>
                                            <input
                                                type="text"
                                                placeholder="e.g. HODAMA20"
                                            />
                                            <p className="ap-helper-text mt-2">Leave blank if no coupon code is required.</p>
                                        </div>
                                    </div>

                                    {/* Affiliate / Website Details */}
                                    <div className="ap-section-card">
                                        <div className="section-title">
                                            <Store size={20} />
                                            <h3>Website &amp; Affiliate</h3>
                                        </div>
                                        <div className="ap-form-group">
                                            <label>Business Website URL <span className="req">*</span></label>
                                            <input
                                                type="text"
                                                placeholder="https://pizzahut.com"
                                                value={websiteUrl}
                                                onChange={(e) => setWebsiteUrl(e.target.value)}
                                                onBlur={handleUrlBlur}
                                                required
                                            />
                                            {isFetchingReviews ? (
                                                <p className="ap-helper-text mt-2" style={{ color: '#3b82f6', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                    <RefreshCw size={12} className="spin-anim" /> Auto-fetching site reviews...
                                                </p>
                                            ) : (
                                                <div className="ap-rating-manual-grid mt-3">
                                                    <div className="ap-form-group-sm">
                                                        <label>User Rating (0-5)</label>
                                                        <div className="ap-rating-input-wrap">
                                                            <Star size={14} color="#f59e0b" fill="#f59e0b" />
                                                            <input 
                                                                type="number" 
                                                                min="0" 
                                                                max="5" 
                                                                step="0.1" 
                                                                value={rating} 
                                                                onChange={(e) => setRating(e.target.value)}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="ap-form-group-sm">
                                                        <label>Total Reviews</label>
                                                        <input 
                                                            type="number" 
                                                            min="0" 
                                                            value={ratingCount} 
                                                            onChange={(e) => setRatingCount(e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                            <p className="ap-helper-text mt-2">Users will be redirected to the URL. Ratings are auto fetched but can be edited manually.</p>
                                        </div>
                                        <div className="ap-form-group">
                                            <label>Business Phone (Optional)</label>
                                            <input
                                                type="tel"
                                                placeholder="+94 11 234 5678"
                                                value={businessPhone}
                                                onChange={(e) => setBusinessPhone(e.target.value)}
                                            />
                                        </div>
                                        <div className="ap-form-group">
                                            <label>Business Logo URL (Optional)</label>
                                            <input
                                                type="text"
                                                placeholder="https://example.com/logo.png"
                                                value={businessLogo}
                                                onChange={(e) => setBusinessLogo(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    {/* Availability Details */}
                                    <div className="ap-section-card">
                                        <div className="section-title">
                                            <CheckCircle2 size={20} />
                                            <h3>Availability</h3>
                                        </div>
                                        <div className="ap-form-group">
                                            <label>Current Stock Quantity</label>
                                            <input
                                                type="number"
                                                min="0"
                                                placeholder="e.g. 100"
                                                value={stock}
                                                onChange={(e) => setStock(e.target.value)}
                                            />
                                        </div>

                                        <div className="ap-form-group">
                                            <label>Total Stock</label>
                                            <input
                                                type="number"
                                                min="0"
                                                placeholder="e.g. 150"
                                                value={totalStock}
                                                onChange={(e) => setTotalStock(e.target.value)}
                                            />
                                        </div>

                                        <div className="ap-form-group">
                                            <label>Deal Status</label>
                                            <select
                                                value={availability}
                                                onChange={(e) => setAvailability(e.target.value)}
                                            >
                                                <option value="In Stock">Active</option>
                                                <option value="Out of Stock">Expired</option>
                                                <option value="Draft">Draft / Scheduled</option>
                                            </select>
                                        </div>
                                        <div className="ap-form-group">
                                            <label>Available Time / Validity <span className="req">*</span></label>
                                            <input
                                                type="text"
                                                placeholder="e.g. Valid during store hours / Weekdays Only"
                                                value={availability2}
                                                onChange={(e) => setAvailability2(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="ap-form-row">
                                            <div className="ap-form-group">
                                                <label>Start Date</label>
                                                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                                            </div>
                                            <div className="ap-form-group">
                                                <label>Expiry Date</label>
                                                <input type="date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} required />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Location */}
                                    <div className="ap-section-card">
                                        <div className="section-title">
                                            <MapPin size={20} />
                                            <h3>Location</h3>
                                        </div>
                                        <div className="ap-form-group">
                                            <label>City / Outlet / Delivery Area <span className="req">*</span></label>
                                            <input
                                                type="text"
                                                placeholder="e.g. Colombo 03, Online Store, Island-wide"
                                                value={location}
                                                onChange={(e) => setLocation(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>

                                </div>

                            </div>

                            {/* 9. Submit Buttons */}
                            <div className="ap-action-bar">
                                <button type="button" className="ap-btn-cancel" onClick={() => navigate('/client/dashboard')}>Cancel</button>
                                <div className="ap-action-right">
                                    <button type="button" className="ap-btn-draft" onClick={handleSaveDraft}>Save Draft</button>
                                    <button type="submit" className="ap-btn-publish">
                                        <CheckCircle2 size={18} /> Publish Deal
                                    </button>
                                </div>
                            </div>

                        </form>

                    </div>
                </div>
            </main>


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

export default AddDeals;

