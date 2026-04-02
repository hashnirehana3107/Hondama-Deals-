import React from 'react';
import { 
    Star, 
    Sparkles, 
    Tag, 
    Scissors, 
    Utensils, 
    Hotel, 
    Shirt, 
    ShoppingCart,
    CheckCircle2,
    Info
} from 'lucide-react';
import './StoreCard.css';

const StoreCard = ({ store }) => {
    // Standardized Category Mapping for Stores
    const getCatData = (cat) => {
        const c = (cat || "").toLowerCase();
        if (c.includes('salon')) return { color: '#be123c', icon: "/assets/images/Salon.png" };
        if (c.includes('restaurant')) return { color: '#c2410c', icon: "/assets/images/Restaurant.png" };
        if (c.includes('hotel')) return { color: '#6d28d9', icon: "/assets/images/Hotel.png" };
        if (c.includes('fashion')) return { color: '#047857', icon: "/assets/images/Fashion.png" };
        if (c.includes('electronics')) return { color: '#76a81eff', icon: "/assets/images/electronics.png" };
        if (c.includes('grocer')) return { color: '#b45309', icon: "/assets/images/Groceries.png" };
        if (c.includes('spa')) return { color: '#1d4ed8', icon: "/assets/images/Spa.png" };
        if (c.includes('health') || c.includes('beauty')) return { color: '#be185d', icon: "/assets/images/Health&Beauty.png" };
        return { color: '#be185d', icon: null }; // Default
    };

    const catData = getCatData(store.category);
    const handleStoreClick = (e) => {
        const recentStores = JSON.parse(localStorage.getItem('hd_recent_stores') || '[]');
        
        // We only store serializable data to localStorage
        const storeToTrack = {
            name: store.name,
            img: store.img,
            url: store.url,
            rating: store.rating,
            category: store.category,
            catColor: store.catColor,
            dealsCount: store.dealsCount
        };

        const updatedRecent = [
            storeToTrack, 
            ...recentStores.filter(s => s.name !== store.name)
        ].slice(0, 7); 

        localStorage.setItem('hd_recent_stores', JSON.stringify(updatedRecent));
    };

    return (
        <a 
            href={store.url || "#"} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hd-store-card-link"
            onClick={handleStoreClick}
        >
            <div className="hd-store-card-img-wrap">
                <img src={store.img} alt={store.name} className="hd-store-card-img" />
            </div>
            
            <div className="hd-store-card-name">
                {store.name}
            </div>

            <div className="hd-store-card-cat">
                <div className="hd-store-cat-badge" style={{ 
                    backgroundColor: (catData.color.slice(0, 7)) + '12',
                    borderColor: (catData.color.slice(0, 7)) + '25',
                    border: `1px solid ${(catData.color.slice(0, 7))}25`
                }}>
                    <div className="hd-store-cat-icon-circle" style={{ background: catData.color }}>
                        {catData.icon ? (
                            <img 
                                src={catData.icon} 
                                alt="icon" 
                                style={{ width: '10px', height: '10px', filter: 'brightness(0) invert(1)' }} 
                            />
                        ) : (
                            <Tag size={8} color="#fff" />
                        )}
                    </div>
                    <span className="hd-store-card-cat-name" style={{ color: catData.color }}>
                        {store.category}
                    </span>
                </div>
            </div>

            <div className="hd-store-card-footer">
                <div className="hd-store-card-deals">
                    {store.dealsCount} Deals
                </div>
                <div className="hd-store-card-rating">
                    <Star size={12} fill="#facc15" color="#facc15" />
                    <span>{store.rating}</span>
                    {store.status === 'Approved' || store.status === 'Active' ? (
                        <CheckCircle2 size={14} color="#10b981" title="Verified by Hodama Deals" />
                    ) : store.isClaimed ? (
                        <div className="hd-verified-store-check" title="Verified Business">
                            <CheckCircle2 size={15} color="#0066ff" strokeWidth={3} />
                        </div>
                    ) : null}
                </div>
            </div>
        </a>
    );
};

export default StoreCard;
