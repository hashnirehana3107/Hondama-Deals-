import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Heart, 
    ArrowLeft, 
    Clock, 
    Trash2,
    LayoutGrid
} from 'lucide-react';
import { useWishlist } from '../../contexts/WishlistContext';
import DesignCard from '../../components/common/DesignCard';
import StoreCard from '../../components/common/StoreCard';
import { ALL_STORES } from '../../utils/constants';
import './Wishlist.css';

const Wishlist = () => {
    const navigate = useNavigate();
    const { wishlist, setWishlist } = useWishlist();
    const [selectedIds, setSelectedIds] = useState([]);
    const [recentStores, setRecentStores] = useState([]);

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem('hd_recent_stores') || '[]');
        setRecentStores(stored);
    }, []);

    const toggleSelect = (id) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(item => item !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === wishlist.length && wishlist.length > 0) {
            setSelectedIds([]);
        } else {
            setSelectedIds(wishlist.map(item => item.id));
        }
    };

    const deleteSelected = () => {
        if (selectedIds.length === 0) return;
        setWishlist(wishlist.filter(item => !selectedIds.includes(item.id)));
        setSelectedIds([]);
    };

    const renderWishlistCard = (p) => {
        return (
            <div key={p.id} style={{ position: 'relative' }}>
                <DesignCard deal={p} />
                <div 
                    onClick={(e) => { e.stopPropagation(); toggleSelect(p.id); }}
                    className="wl-select-bubble"
                    style={{ 
                        background: selectedIds.includes(p.id) ? '#1B3BFF' : '#fff', 
                        border: selectedIds.includes(p.id) ? '2px solid #1B3BFF' : '2px solid #cbd5e1'
                    }}
                >
                    {selectedIds.includes(p.id) && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                </div>
            </div>
        );
    };

    return (
        <div className="wl-page-full">
            <div className="wl-content-limit">
                {/* ── PREMIUM HEADER ── */}
                <div className="premium-header-container">
                    <button onClick={() => navigate(-1)} className="back-btn-square">
                        <div className="back-btn-circle-inner">
                            <ArrowLeft size={16} strokeWidth={3} />
                        </div>
                    </button>
                    <div className="premium-header-content">
                        <div className="premium-header-title-row">
                            <h1 className="p-header-title">
                                <Heart size={28} /> My Wishlist
                            </h1>
                            <span className="p-header-badge">
                                {wishlist.length} DEALS SAVED
                            </span>
                        </div>
                        <p className="p-header-subtitle">
                            Save your favorite deals and view them later.
                        </p>
                    </div>
                </div>

                {/* ── SELECT ALL BAR ── */}
                <div className="wl-select-bar">
                    <div className="wl-sel-all-left" onClick={toggleSelectAll}>
                        <div className={`wl-checkbox-custom ${selectedIds.length === wishlist.length && wishlist.length > 0 ? 'active' : ''}`}>
                            {selectedIds.length === wishlist.length && wishlist.length > 0 && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                        </div>
                        <span className="wl-sel-text">
                            Select All {selectedIds.length > 0 && <span className="wl-sel-count">({selectedIds.length} selected)</span>}
                        </span>
                    </div>

                    {selectedIds.length > 0 && (
                        <button onClick={deleteSelected} className="wl-delete-btn">
                            <Trash2 size={16} strokeWidth={2.5} />
                            <span className="wl-delete-label">Delete Selected</span>
                        </button>
                    )}
                </div>

                {/* ── WISH LIST GRID ── */}
                {wishlist.length > 0 ? (
                    <div className="wl-items-grid">
                        {wishlist.map(renderWishlistCard)}
                    </div>
                ) : (
                    <div className="wl-empty-state">
                        <div className="wl-empty-ring">
                            <Heart size={64} color="#cbd5e1" />
                        </div>
                        <h2>Your wishlist is empty</h2>
                        <p>Start saving deals by clicking the heart icon on any deal card!</p>
                        <button className="wl-go-home-btn" onClick={() => navigate('/')}>Browse Deals</button>
                    </div>
                )}

                {/* ── RECENTLY VIEWED STORES ── */}
                {recentStores.length > 0 && (
                    <section className="wl-recent-stores">
                        <div className="wl-recent-title-row">
                            <Clock size={28} color="#323c82" strokeWidth={2.5} />
                            <h2>Recently Viewed Stores</h2>
                        </div>
                        <div className="wl-stores-grid">
                            {recentStores.slice(0, 6).map((s, i) => (
                                <StoreCard key={i} store={{...s, dealsCount: (s.dealsCount || 0)}} />
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
};

export default Wishlist;
