import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
    ChevronRight, 
    ArrowLeft, 
    ArrowLeftCircle,
    Star, 
    ChevronDown, 
    X, 
    MapPin,
    LayoutGrid,
    List,
    Heart,
    Sparkles,
    Search,
    Filter,
    Clock,
    Tag,
    Bed,
    ShoppingCart,
    Smartphone,
    Stethoscope,
    Scissors,
    Utensils,
    Building2,
    Shirt,
    Wind,
    ShoppingBasket,
    Monitor
} from 'lucide-react';
import axios from 'axios';
import { useWishlist } from '../../contexts/WishlistContext';
import DesignCard from '../../components/common/DesignCard';
import './CategoryView.css';

const CategoryView = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { toggleWishlist, isInWishlist } = useWishlist();
    const [viewMode, setViewMode] = useState('grid');
    const [sortBy, setSortBy] = useState('Best Match');
    const [isSortOpen, setIsSortOpen] = useState(false);
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

    // Filter States
    const [selectedCustomFilters, setSelectedCustomFilters] = useState({}); // { filterTitle: [selectedOptions...] }
    const [selectedLocations, setSelectedLocations] = useState([]);
    const [selectedRating, setSelectedRating] = useState(null);
    const [priceRange, setPriceRange] = useState({ min: 0, max: 100000 });

    const [openFilters, setOpenFilters] = useState({ locations: true, ratings: true, price: true }); // We'll add custom filter keys dynamically
    
    // Dynamic Filter Data from Admin
    const [dynamicCatData, setDynamicCatData] = useState(null);

    const toggleAccordion = (key) => setOpenFilters(prev => ({ ...prev, [key]: !prev[key] }));

    const toggleCustomFilter = (title, val) => {
        setSelectedCustomFilters(prev => {
            const currentSelected = prev[title] || [];
            return {
                ...prev,
                [title]: currentSelected.includes(val) 
                    ? currentSelected.filter(item => item !== val) 
                    : [...currentSelected, val]
            };
        });
    };

    const [allCategories, setAllCategories] = useState([]);

    useEffect(() => {
        const fetchDynamicCategory = async () => {
            try {
                const res = await axios.get('http://52.66.74.239:5000/api/categories');
                if (res.data.success) {
                    setAllCategories(res.data.categories);
                    const matched = res.data.categories.find(c => 
                        c.slug.toLowerCase() === (slug || "").toLowerCase() || 
                        c.name.toLowerCase() === (slug || "").toLowerCase()
                    );
                    if (matched) {
                        setDynamicCatData(matched);
                    } else {
                        setDynamicCatData(null);
                    }
                }
            } catch (err) {
                console.error("Could not fetch categories", err);
            }
        };
        fetchDynamicCategory();
    }, [slug]);

    useEffect(() => {
        const allOpen = Object.values(openFilters).every(v => v);
        const allClosed = Object.values(openFilters).every(v => !v);
        if (allOpen) setViewMode('grid');
        else if (allClosed) setViewMode('list');
        else setViewMode('custom');
    }, [openFilters]);

    const sortOptions = ['Best Match', 'Price: Low to High', 'Price: High to Low', 'Highest Rated'];

    const toggleFilter = (setter, val) => {
        setter(prev => prev.includes(val) ? prev.filter(item => item !== val) : [...prev, val]);
    };

    const clearAll = () => {
        setSelectedCustomFilters({});
        setSelectedLocations([]);
        setSelectedRating(null);
        setPriceRange({ min: 0, max: 100000 });
        setSortBy('Best Match');
    };

    // DYNAMIC DATA MAPPING BY CATEGORY
    // --- DYNAMIC FILTER DATA DERIVATION ---
    // Extract unique brands and locations from actual deals in this category
    const getDynamicFilters = (deals) => {
        const brands = [...new Set(deals.map(d => d.storeName).filter(Boolean))];
        const locations = [...new Set(deals.map(d => d.location).filter(Boolean))];
        return { brands, locations };
    };

    // Use Tag as default icon for new categories if not specified
    const DefaultIcon = Tag;

    const [allDeals, setAllDeals] = useState([]);
    
    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem('hodama_all_deals_v1') || '[]');
        setAllDeals(stored);
    }, []);

    const currentDeals = allDeals.filter(d => {
        const dCat = (d.category || "").toLowerCase().trim();
        const dynName = (dynamicCatData?.name || "").toLowerCase().trim();
        const urlSlug = (slug || "").toLowerCase().trim();
        const dSlug = dCat.replace(/ & /g, '-').replace(/ /g, '-');
        return dCat === dynName || dSlug === urlSlug || dCat === urlSlug;
    });

    // Derive filters from actual deals
    const { brands: dynamicBrands, locations: dynamicLocations } = getDynamicFilters(currentDeals);

    const currentCat = {
        title: dynamicCatData?.name || slug,
        enablePriceFilter: dynamicCatData?.enablePriceFilter !== false,
        enableRatingFilter: dynamicCatData?.enableRatingFilter !== false,
        enableLocationFilter: dynamicCatData?.enableLocationFilter !== false,
        // Show Brands from deals + any Admin-defined Filters
        customFilters: [
            ...(dynamicBrands.length > 0 ? [{ title: 'Available Brands', options: dynamicBrands }] : []),
            ...(dynamicCatData?.customFilters || [])
        ]
    };

    // Ensure dynamically added filters default to open in accordion
    useEffect(() => {
        if (currentCat.customFilters.length > 0) {
            setOpenFilters(prev => {
                const nextState = { ...prev };
                let modified = false;
                currentCat.customFilters.forEach(cf => {
                    if (nextState[cf.title] === undefined) {
                        nextState[cf.title] = true;
                        modified = true;
                    }
                });
                return modified ? nextState : prev;
            });
        }
    }, [dynamicCatData, dynamicBrands]);

    const finalDeals = currentDeals;
    
    // Icon and Visual Meta
    const CatIcon = dynamicCatData?.icon ? () => (
        <div style={{ 
            marginRight: '18px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            backgroundColor: dynamicCatData.color || '#323c82', 
            width: '45px',
            height: '45px',
            borderRadius: '50%',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
        }}>
            <img 
                src={dynamicCatData.icon} 
                alt="icon" 
                width="22" 
                height="22" 
                style={!dynamicCatData.icon.startsWith('data:') ? { filter: 'brightness(0) invert(1)' } : { filter: 'brightness(0) invert(1)' }}
            />
        </div>
    ) : () => (
        <div style={{ 
            marginRight: '18px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            backgroundColor: dynamicCatData?.color || '#323c82', 
            width: '45px',
            height: '45px',
            borderRadius: '50%'
        }}>
            <DefaultIcon size={20} color="#FFF" />
        </div>
    );

    const filteredDeals = finalDeals.filter(p => {
        // Custom Filters dynamically evaluated
        if (Object.keys(selectedCustomFilters).length > 0) {
            let passesCustom = true;
            for (const [title, selectedOptions] of Object.entries(selectedCustomFilters)) {
                if (selectedOptions.length > 0) {
                    const hasMatch = selectedOptions.some(opt => {
                        const dlLower = (p.dealType || "").toLowerCase();
                        const nmLower = (p.name || "").toLowerCase();
                        const stLower = (p.storeName || "").toLowerCase();
                        const cgLower = (p.category || "").toLowerCase();
                        const objLower = opt.toLowerCase();
                        
                        if (title === "Offers/ Deals") {
                            if (opt === "Combo Meals") return dlLower.includes("combo") || nmLower.includes("combo") || dlLower.includes("pack");
                            if (opt === "Seasonal / Festival Offers") return dlLower.includes("season") || nmLower.includes("season") || dlLower.includes("fest");
                            if (opt === "Buy 1 Get 1 Free") return nmLower.includes("buy 1") || (p.badge && p.badge.toLowerCase().includes("b1g1")) || nmLower.includes("get 1") || nmLower.includes("buy 2");
                            if (opt === "Bank Card Discounts") return dlLower.includes("discount") || nmLower.includes("card") || (p.badge && p.badge.toLowerCase().includes("off"));
                            if (opt === "Loyalty / Rewards Programs") return dlLower.includes("reward") || dlLower.includes("loyalty");
                            if (opt === "Limited-Time Promotions") return dlLower.includes("limited") || dlLower.includes("promo") || dlLower.includes("offer") || dlLower.includes("sale");
                        }
                        
                        return dlLower.includes(objLower) || nmLower.includes(objLower) || stLower.includes(objLower) || cgLower.includes(objLower);
                    });
                    if (!hasMatch) passesCustom = false;
                }
            }
            if (!passesCustom) return false;
        }

        // Locations Filter
        if (selectedLocations.length > 0) {
            const dealLocLower = (p.location || "").toLowerCase();
            const isBroadLocation = dealLocLower.includes("islandwide") || dealLocLower.includes("sri lanka");
            const hasLocMatch = selectedLocations.some(l => dealLocLower.includes(l.toLowerCase()));
            if (!hasLocMatch && !isBroadLocation) return false;
        }

        // Rating Filter
        if (selectedRating !== null) {
            if (parseFloat(p.rating || 0) < selectedRating) return false;
        }

        // Price Filter
        const pPrice = p.price ? p.price.toString() : '';
        if (pPrice && !pPrice.includes('%') && !pPrice.includes('Total') && pPrice !== '') {
            const numPrice = parseFloat(pPrice.replace(/,/g, ''));
            if (!isNaN(numPrice)) {
                if (numPrice < priceRange.min || numPrice > priceRange.max) return false;
            }
        }

        return true;
    }).sort((a, b) => {
        const aPrice = a.price ? a.price.toString().replace(/,/g, '') : '0';
        const bPrice = b.price ? b.price.toString().replace(/,/g, '') : '0';
        if (sortBy === 'Price: Low to High') {
            return (parseFloat(aPrice) || 0) - (parseFloat(bPrice) || 0);
        } else if (sortBy === 'Price: High to Low') {
            return (parseFloat(bPrice) || 0) - (parseFloat(aPrice) || 0);
        } else if (sortBy === 'Highest Rated') {
            return parseFloat(b.rating || 0) - parseFloat(a.rating || 0);
        }
        return 0; // Best Match
    });

    // Deals have already been mapped and given fallback colors/icons inside DesignCard.

    return (
        <div className="cv-page-full">
            <div className="cv-container">
                <button onClick={() => navigate(-1)} className="back-btn-square" style={{ marginBottom: '25px' }}>
                    <div className="back-btn-circle-inner"><ArrowLeft size={16} strokeWidth={3} /></div>
                </button>

                {/* ── PREMIUM WHITE HEADER CONTAINER (Matching Support Page Style) ── */}
                <div className="cv-premium-header-card">
                    <div className="cv-header-main-info">
                        <div className="premium-header-content">
                            <div className="premium-header-title-row">
                                <h1 className="p-header-title" style={{ color: dynamicCatData?.color || '#0D1A5F' }}>
                                    <CatIcon size={28} strokeWidth={2.5} style={{ marginRight: '10px' }} />
                                    {currentCat.title}
                                </h1>
                                <span className="p-header-badge" style={{ backgroundColor: (dynamicCatData?.color || '#0D1A5F') + '15', color: dynamicCatData?.color || '#0D1A5F' }}>
                                    {dynamicCatData?.badge || 'SPECIAL OFFERS'}
                                </span>
                                <span className="p-header-count-indicator">{filteredDeals.length} Deals</span>
                            </div>
                            <p className="p-header-subtitle">{dynamicCatData?.subtitle || 'Amazing deals waiting for you'}</p>
                        </div>
                    </div>

                    <div className="cv-header-controls">
                        {/* Mobile Filter Toggle Button */}
                        <button
                            className="cv-mobile-filter-btn"
                            onClick={() => setIsMobileFilterOpen(true)}
                        >
                            <Filter size={16} strokeWidth={2.5} />
                            <span>Filters</span>
                            {(Object.values(selectedCustomFilters).some(a => a.length > 0) || selectedLocations.length > 0 || selectedRating) && (
                                <span className="cv-filter-dot"></span>
                            )}
                        </button>

                        <div className="cv-mode-switch">
                            <button className={viewMode === 'grid' ? 'active' : ''} onClick={() => setOpenFilters({ brands: true, offers: true, locations: true, ratings: true, price: true })}>
                                <LayoutGrid size={24} strokeWidth={2.5} />
                            </button>
                            <button className={viewMode === 'list' ? 'active' : ''} onClick={() => setOpenFilters({ brands: false, offers: false, locations: false, ratings: false, price: false })}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="5" cy="6" r="1.5" fill="currentColor" />
                                    <circle cx="5" cy="12" r="1.5" fill="currentColor" />
                                    <circle cx="5" cy="18" r="1.5" fill="currentColor" />
                                    <path d="M11 6h9M11 12h9M11 18h9" />
                                </svg>
                            </button>
                        </div>

                        <div className="cv-sort-container">
                            <div className="cv-sort-label">Sort by:</div>
                            <div className="cv-sort-trigger" onClick={() => setIsSortOpen(!isSortOpen)}>
                                {sortBy} <ChevronDown size={14} strokeWidth={3} />
                            </div>
                            {isSortOpen && (
                                <div className="cv-sort-dropdown">
                                    {sortOptions.map(opt => (
                                        <div 
                                            key={opt} 
                                            onClick={() => { setSortBy(opt); setIsSortOpen(false); }}
                                            className={`cv-sort-option ${sortBy === opt ? 'active' : ''}`}
                                        >
                                            {opt}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* ── MOBILE FILTER DRAWER OVERLAY ── */}
                {isMobileFilterOpen && (
                    <div className="cv-mobile-overlay" onClick={() => setIsMobileFilterOpen(false)}>
                        <aside className="cv-mobile-drawer" onClick={e => e.stopPropagation()}>
                            <div className="cv-drawer-header">
                                <div className="cv-drawer-title">
                                    <Filter size={18} strokeWidth={2.5} />
                                    <span>Filters</span>
                                </div>
                                <button className="cv-drawer-close" onClick={() => setIsMobileFilterOpen(false)}>
                                    <X size={20} strokeWidth={2.5} />
                                </button>
                            </div>
                            <div className="cv-drawer-body">
                                {currentCat.customFilters && currentCat.customFilters.map((cf, idx) => (
                                    <div className="cv-filter-group" key={idx}>
                                        <div className="cv-filter-head" onClick={() => toggleAccordion(cf.title)}>
                                            <h3>{cf.title}</h3>
                                            <ChevronDown size={18} strokeWidth={2.5} style={{ transform: openFilters[cf.title] ? 'rotate(180deg)' : 'rotate(0deg)', transition: '0.3s' }} />
                                        </div>
                                        {openFilters[cf.title] && (
                                            <div className="cv-filter-list">
                                                {cf.options.map(itm => {
                                                    const isActive = selectedCustomFilters[cf.title] && selectedCustomFilters[cf.title].includes(itm);
                                                    return (
                                                        <label key={itm} className={`cv-check-item ${isActive ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); toggleCustomFilter(cf.title, itm); }}>
                                                            <div className={`cv-sq-check ${isActive ? 'filled' : ''}`}>
                                                                {isActive && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                                                            </div>
                                                            <span>{itm}</span>
                                                        </label>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                ))}
                                {currentCat.enableLocationFilter && (
                                    <div className="cv-filter-group">
                                        <div className="cv-filter-head" onClick={() => toggleAccordion('locations')}>
                                            <h3>Locations</h3>
                                            <ChevronDown size={18} strokeWidth={2.5} style={{ transform: openFilters.locations ? 'rotate(180deg)' : 'rotate(0deg)', transition: '0.3s' }} />
                                        </div>
                                        {openFilters.locations && (
                                            <div className="cv-filter-list">
                                                <label className={`cv-check-item ${selectedLocations.length === 0 ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setSelectedLocations([]); }}>
                                                    <div className={`cv-sq-check ${selectedLocations.length === 0 ? 'filled' : ''}`}>
                                                        {selectedLocations.length === 0 && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                                                    </div>
                                                    <span>Islandwide / All</span>
                                                </label>
                                                {["Colombo", "Kandy", "Galle", "Matara", "Matale", "Negombo"].map(itm => (
                                                    <label key={itm} className={`cv-check-item ${selectedLocations.includes(itm) ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); toggleFilter(setSelectedLocations, itm); }}>
                                                        <div className={`cv-sq-check ${selectedLocations.includes(itm) ? 'filled' : ''}`}>
                                                            {selectedLocations.includes(itm) && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                                                        </div>
                                                        <span>{itm}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                                {currentCat.enableRatingFilter && (
                                    <div className="cv-filter-group">
                                        <div className="cv-filter-head" onClick={() => toggleAccordion('ratings')}>
                                            <h3>Ratings</h3>
                                            <ChevronDown size={18} strokeWidth={2.5} style={{ transform: openFilters.ratings ? 'rotate(180deg)' : 'rotate(0deg)', transition: '0.3s' }} />
                                        </div>
                                        {openFilters.ratings && (
                                            <div className="cv-filter-list">
                                                {[5, 4, 3, 2, 1].map(r => (
                                                    <label key={r} className={`cv-check-item ${selectedRating === r ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setSelectedRating(selectedRating === r ? null : r); }}>
                                                        <div className={`cv-sq-check ${selectedRating === r ? 'filled' : ''}`}>
                                                            {selectedRating === r && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                                                        </div>
                                                        <div className="cv-stars">
                                                            {Array(5).fill(0).map((_, i) => (
                                                                <Star key={i} size={14} fill={i < r ? "#facc15" : "none"} color={i < r ? "#facc15" : "#cbd5e1"} />
                                                            ))}
                                                            {r < 5 && <span className="cv-up-lab">{r}.0 & Up</span>}
                                                            {r === 5 && <span className="cv-up-lab">5.0</span>}
                                                        </div>
                                                    </label>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                                {currentCat.enablePriceFilter && (
                                    <div className="cv-filter-group no-border">
                                        <div className="cv-filter-head" onClick={() => toggleAccordion('price')}>
                                            <h3>Price</h3>
                                            <ChevronDown size={18} strokeWidth={2.5} style={{ transform: openFilters.price ? 'rotate(180deg)' : 'rotate(0deg)', transition: '0.3s' }} />
                                        </div>
                                        {openFilters.price && (
                                            <div className="cv-price-slider">
                                                <div className="cv-price-inputs">
                                                    <div className="cv-p-box" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                        LKR <input type="number" value={priceRange.min} onChange={(e) => setPriceRange({...priceRange, min: Number(e.target.value)})} style={{ width: '60px', border: 'none', background: 'transparent', outline: 'none', color: '#323c82', fontWeight: 800, fontSize: '14px' }}/>
                                                    </div>
                                                    <div className="cv-p-box" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                        LKR <input type="number" value={priceRange.max} onChange={(e) => setPriceRange({...priceRange, max: Number(e.target.value)})} style={{ width: '60px', border: 'none', background: 'transparent', outline: 'none', color: '#323c82', fontWeight: 800, fontSize: '14px' }}/>
                                                    </div>
                                                </div>
                                                <div className="cv-slider-track">
                                                    <div className="cv-track-fill" style={{ left: `${Math.min(100, Math.max(0, (priceRange.min / 100000) * 100))}%`, right: `${Math.min(100, Math.max(0, 100 - (priceRange.max / 100000) * 100))}%` }}></div>
                                                    <input type="range" className="cv-range-input" min="0" max="100000" step="500" value={priceRange.min} onChange={(e) => setPriceRange({...priceRange, min: Math.min(Number(e.target.value), priceRange.max - 1000)})} />
                                                    <input type="range" className="cv-range-input" min="0" max="100000" step="500" value={priceRange.max} onChange={(e) => setPriceRange({...priceRange, max: Math.max(Number(e.target.value), priceRange.min + 1000)})} />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                            <div className="cv-drawer-footer">
                                <button className="cv-drawer-clear-btn" onClick={() => { clearAll(); }}>
                                    Clear All
                                </button>
                                <button className="cv-drawer-apply-btn" onClick={() => setIsMobileFilterOpen(false)}>
                                    Show {filteredDeals.length} Deals
                                </button>
                            </div>
                        </aside>
                    </div>
                )}

                <div className="cv-layout">
                    {/* ── 2. SIDEBAR ── */}
                    <aside className="cv-sidebar">
                        {/* Render Dynamic Custom Filters (Brands, Offers, etc.) */}
                        {currentCat.customFilters && currentCat.customFilters.map((cf, idx) => (
                            <div className="cv-filter-group" key={idx}>
                                <div className="cv-filter-head" onClick={() => toggleAccordion(cf.title)}>
                                    <h3>{cf.title}</h3>
                                    <ChevronDown size={18} strokeWidth={2.5} style={{ transform: openFilters[cf.title] ? 'rotate(180deg)' : 'rotate(0deg)', transition: '0.3s' }} />
                                </div>
                                {openFilters[cf.title] && (
                                    <div className="cv-filter-list">
                                        {cf.options.map(itm => {
                                            const isActive = selectedCustomFilters[cf.title] && selectedCustomFilters[cf.title].includes(itm);
                                            return (
                                                <label key={itm} className={`cv-check-item ${isActive ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); toggleCustomFilter(cf.title, itm); }}>
                                                    <div className={`cv-sq-check ${isActive ? 'filled' : ''}`}>
                                                        {isActive && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                                                    </div>
                                                    <span>{itm}</span>
                                                </label>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        ))}

                        {currentCat.enableLocationFilter && (
                            <div className="cv-filter-group">
                                <div className="cv-filter-head" onClick={() => toggleAccordion('locations')}>
                                    <h3>Locations</h3>
                                    <ChevronDown size={18} strokeWidth={2.5} style={{ transform: openFilters.locations ? 'rotate(180deg)' : 'rotate(0deg)', transition: '0.3s' }} />
                                </div>
                                {openFilters.locations && (
                                    <div className="cv-filter-list">
                                        <label className={`cv-check-item ${selectedLocations.length === 0 ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setSelectedLocations([]); }}>
                                            <div className={`cv-sq-check ${selectedLocations.length === 0 ? 'filled' : ''}`}>
                                                {selectedLocations.length === 0 && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                                            </div>
                                            <span>Islandwide / All</span>
                                        </label>
                                        {["Colombo", "Kandy", "Galle", "Matara", "Matale", "Negombo"].map(itm => (
                                            <label key={itm} className={`cv-check-item ${selectedLocations.includes(itm) ? 'active' : ''}`} onClick={(e) => { 
                                                    e.preventDefault(); 
                                                    toggleFilter(setSelectedLocations, itm); 
                                                }}>
                                                <div className={`cv-sq-check ${selectedLocations.includes(itm) ? 'filled' : ''}`}>
                                                    {selectedLocations.includes(itm) && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                                                </div>
                                                <span>{itm}</span>
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {currentCat.enableRatingFilter && (
                            <div className="cv-filter-group">
                                <div className="cv-filter-head" onClick={() => toggleAccordion('ratings')}>
                                    <h3>Ratings</h3>
                                    <ChevronDown size={18} strokeWidth={2.5} style={{ transform: openFilters.ratings ? 'rotate(180deg)' : 'rotate(0deg)', transition: '0.3s' }} />
                                </div>
                                {openFilters.ratings && (
                                    <div className="cv-filter-list">
                                        {[5, 4, 3, 2, 1].map(r => (
                                            <label key={r} className={`cv-check-item ${selectedRating === r ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setSelectedRating(selectedRating === r ? null : r); }}>
                                                <div className={`cv-sq-check ${selectedRating === r ? 'filled' : ''}`}>
                                                    {selectedRating === r && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                                                </div>
                                                <div className="cv-stars">
                                                    {Array(5).fill(0).map((_, i) => (
                                                        <Star key={i} size={14} fill={i < r ? "#facc15" : "none"} color={i < r ? "#facc15" : "#cbd5e1"} />
                                                    ))}
                                                    {r < 5 && <span className="cv-up-lab">{r}.0 & Up</span>}
                                                    {r === 5 && <span className="cv-up-lab">5.0</span>}
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {currentCat.enablePriceFilter && (
                            <div className="cv-filter-group no-border">
                                <div className="cv-filter-head" onClick={() => toggleAccordion('price')}>
                                    <h3>Price</h3>
                                    <ChevronDown size={18} strokeWidth={2.5} style={{ transform: openFilters.price ? 'rotate(180deg)' : 'rotate(0deg)', transition: '0.3s' }} />
                                </div>
                                {openFilters.price && (
                                    <div className="cv-price-slider">
                                        <div className="cv-price-inputs">
                                            <div className="cv-p-box" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                LKR <input type="number" value={priceRange.min} onChange={(e) => setPriceRange({...priceRange, min: Number(e.target.value)})} style={{ width: '60px', border: 'none', background: 'transparent', outline: 'none', color: '#323c82', fontWeight: 800, fontSize: '14px' }}/>
                                            </div>
                                            <div className="cv-p-box" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                LKR <input type="number" value={priceRange.max} onChange={(e) => setPriceRange({...priceRange, max: Number(e.target.value)})} style={{ width: '60px', border: 'none', background: 'transparent', outline: 'none', color: '#323c82', fontWeight: 800, fontSize: '14px' }}/>
                                            </div>
                                        </div>
                                        <div className="cv-slider-track">
                                            <div className="cv-track-fill" style={{ left: `${Math.min(100, Math.max(0, (priceRange.min / 100000) * 100))}%`, right: `${Math.min(100, Math.max(0, 100 - (priceRange.max / 100000) * 100))}%` }}></div>
                                            <input type="range" className="cv-range-input" min="0" max="100000" step="500" value={priceRange.min} onChange={(e) => setPriceRange({...priceRange, min: Math.min(Number(e.target.value), priceRange.max - 1000)})} />
                                            <input type="range" className="cv-range-input" min="0" max="100000" step="500" value={priceRange.max} onChange={(e) => setPriceRange({...priceRange, max: Math.max(Number(e.target.value), priceRange.min + 1000)})} />
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </aside>

                    {/* ── 3. MAIN CONTENT ── */}
                    <main className="cv-content">
                        <div className="cv-active-bar" style={{ flexWrap: 'wrap', gap: '15px' }}>
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', flex: 1 }}>
                                {Object.entries(selectedCustomFilters).map(([title, options]) => 
                                    options.map(val => (
                                        <div key={`${title}-${val}`} className="cv-active-tag">
                                            <span>{val}</span>
                                            <X size={14} onClick={() => toggleCustomFilter(title, val)} style={{ cursor: 'pointer' }}/>
                                        </div>
                                    ))
                                )}
                                {selectedRating && (
                                    <div key={`rating-${selectedRating}`} className="cv-active-tag">
                                        <span>{selectedRating}.0 & Up</span>
                                        <X size={14} onClick={() => setSelectedRating(null)} style={{ cursor: 'pointer' }}/>
                                    </div>
                                )}
                                {Object.values(selectedCustomFilters).every(arr => arr.length === 0) && selectedLocations.length === 0 && !selectedRating && (
                                    <span style={{ color: '#94a3b8', fontSize: '14px', fontWeight: '500', alignSelf: 'center' }}>Showing all {filteredDeals.length} deals</span>
                                )}
                            </div>
                            
                            {(Object.values(selectedCustomFilters).some(arr => arr.length > 0) || selectedLocations.length > 0 || selectedRating) && (
                                <button className="cv-clear-btn" onClick={clearAll}>
                                    <span>Clear All</span>
                                    <div className="cv-x-bg"><X size={12} /></div>
                                </button>
                            )}
                        </div>

                        <div className="cv-grid">
                            {filteredDeals.length > 0 ? filteredDeals.map(p => <DesignCard key={p.id} deal={p} />) : (
                                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px 0', color: '#64748b' }}>
                                    <Search size={40} style={{ margin: '0 auto 15px', color: '#cbd5e1' }} />
                                    <h3 style={{ fontSize: '20px', color: '#323c82', marginBottom: '10px' }}>No exact matches found</h3>
                                    <p>Try clearing some filters to expand your search.</p>
                                </div>
                            )}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default CategoryView;
