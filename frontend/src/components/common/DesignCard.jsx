import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Heart, Star, MapPin, Sparkles, Utensils, Shirt, Monitor, 
    Scissors, Building2, ShoppingBasket, Wind 
} from 'lucide-react';
import { useWishlist } from '../../contexts/WishlistContext';
import './DesignCard.css';

const DesignCard = ({ deal }) => {
    const navigate = useNavigate();
    const { toggleWishlist, isInWishlist } = useWishlist();



    // Standardized Category Mapping
    const catList = deal.category ? deal.category.toLowerCase() : '';
    let catColor = deal.catColor || '#323c82'; // Default Navy Blue for unknown categories
    let catIcon = deal.catIcon || Sparkles; 

    // OVERRIDE with Brand Defaults if matches
    if (catList.includes('salon')) {
        catColor = '#be123c';
        catIcon = "/assets/images/Salon.png";
    } else if (catList.includes('restaurant') || catList.includes('food')) {
        catColor = '#c2410c';
        catIcon = "/assets/images/Restaurant.png";
    } else if (catList.includes('hotel')) {
        catColor = '#6d28d9';
        catIcon = "/assets/images/Hotel.png";
    } else if (catList.includes('fashion') || catList.includes('clothing')) {
        catColor = '#047857';
        catIcon = "/assets/images/Fashion.png";
    } else if (catList.includes('electronics') || catList.includes('gadget')) {
        catColor = '#76a81eff';
        catIcon = "/assets/images/electronics.png";
    } else if (catList.includes('grocer')) {
        catColor = '#b45309';
        catIcon = "/assets/images/Groceries.png";
    } else if (catList.includes('spa')) {
        catColor = '#1d4ed8';
        catIcon = "/assets/images/Spa.png";
    } else if (catList.includes('beauty')) {
        catColor = '#be185d'; // Health & Beauty Pink
        catIcon = "/assets/images/Health&Beauty.png";
    } else {
        // For truly dynamic categories, use the values passed in the deal object
        if (deal.catColor) catColor = deal.catColor;
        if (deal.catIcon) catIcon = deal.catIcon;
    }

    const handleCardClick = () => {
        const stored = JSON.parse(localStorage.getItem('hodama_all_deals_v1') || '[]');
        
        // 1. Increment individual deal views
        const updated = stored.map(d => {
            if (d.id === deal.id) {
                return { ...d, views: (d.views || 0) + 1 };
            }
            return d;
        });
        localStorage.setItem('hodama_all_deals_v1', JSON.stringify(updated));

        // 2. Track global daily click for dashboard stats
        const today = new Date().toISOString().split('T')[0];
        const stats = JSON.parse(localStorage.getItem('hodama_analytics_v1') || '{}');
        if (!stats[today]) stats[today] = { clicks: 0, views: 0 };
        stats[today].clicks = (stats[today].clicks || 0) + 1;
        localStorage.setItem('hodama_analytics_v1', JSON.stringify(stats));
        
        navigate(`/deal/${deal.id}`);
    };

    return (
        <div key={deal.id} className="hd-prod-card-standard" onClick={handleCardClick}>
            <div className="hd-prod-img-box">
                {deal.badge && (
                    <div className="hd-badge-top-left">
                        <span className="badge-text">{deal.badge.toUpperCase()}</span>
                    </div>
                )}
                <button 
                    className={`hd-wishlist-btn ${isInWishlist(deal.id) ? 'active' : ''}`} 
                    onClick={(e) => { 
                        e.stopPropagation(); 
                        toggleWishlist(deal);
                    }}
                >
                    <Heart size={20} fill={isInWishlist(deal.id) ? "#ffffff" : "none"} color={isInWishlist(deal.id) ? "#ffffff" : "currentColor"} />
                </button>
                <img src={deal.img} alt={deal.name} className="hd-prod-img" />
            </div>

            <div className="hd-prod-content">
                <div className="hd-cat-line" style={{ 
                    backgroundColor: (catColor.slice(0, 7)) + '12',
                    borderColor: (catColor.slice(0, 7)) + '25',
                    border: `1px solid ${(catColor.slice(0, 7))}25`
                }}>
                    <div className="hd-cat-icon" style={{ backgroundColor: catColor }}>
                        {typeof catIcon === 'string' ? (
                            <img 
                                src={catIcon} 
                                alt="icon" 
                                style={{ width: '12px', height: '12px', filter: 'brightness(0) invert(1)' }} 
                            />
                        ) : (
                            <catIcon size={10} color="#fff" />
                        )}
                    </div>
                    <span className="hd-cat-text" style={{ color: catColor }}>{deal.category || "Health & Beauty"}</span>
                </div>

                <h3 className="hd-prod-name">{deal.name}</h3>
                {deal.description && <p className="hd-prod-subtitle">{deal.description}</p>}

                <div className="hd-store-line">
                    <img src={deal.storeImg || "https://uvce.lk/wp-content/uploads/2022/10/Luv-Essence-Logo.png"} alt="Store" />
                    <span className="hd-store-name">{deal.storeName}</span>
                </div>

                <div className="hd-meta-row">
                    <div className="hd-rating-box">
                        <Star size={18} fill={parseFloat(deal.rating) > 0 ? "#facc15" : "none"} color={parseFloat(deal.rating) > 0 ? "#facc15" : "#94a3b8"} />
                        {parseInt(deal.ratingCount) > 0 ? (
                            <>
                                <span className="hd-rating-val">{deal.rating}</span>
                                <span className="hd-rating-count">({deal.ratingCount})</span>
                            </>
                        ) : (
                            <span className="hd-rating-count" style={{ marginLeft: '4px' }}>No reviews yet</span>
                        )}
                    </div>
                    <div className="hd-loc-box">
                        <MapPin size={14} color="#64748b" />
                        <span className="hd-loc-text">{deal.location}</span>
                    </div>
                </div>

                <div className="hd-price-row">
                    <div className="hd-price-left">
                        <span className="hd-price-now">
                            {(() => {
                                const p = deal.price || deal.currentPrice || "N/A";
                                const pStr = p.toString();
                                return (pStr.includes('LKR') || pStr.includes('%') || pStr.includes('Total')) ? pStr : `LKR ${pStr}`;
                            })()}
                        </span>
                        {(deal.oldPrice || deal.originalPrice) && (
                            <span className="hd-price-was">
                                LKR {deal.oldPrice || deal.originalPrice}
                            </span>
                        )}
                    </div>
                    <span className={
                        deal.dealType === 'LIMITED OFFER' ? 'hd-limited-badge' :
                            deal.dealType === 'SALE' ? 'hd-sale-badge' :
                                (deal.dealType === 'DISCOUNT' ? 'hd-discount-badge' : 'hd-offer-badge')
                    }>{deal.dealType || "OFFER"}</span>
                </div>

                <div className="hd-separator-line"></div>

                <div className="hd-cta-row">
                    <button className="hd-yellow-deal-btn">View Deal</button>
                </div>
            </div>
        </div>
    );
};

export default DesignCard;
