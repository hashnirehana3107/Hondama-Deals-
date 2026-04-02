import React from 'react';
import './CategoryCard.css';

const CategoryCard = ({ category, onClick, isLucide = false }) => {
    // Destructure properties from category object
    // color is used for both background opacity and border
    const { name, icon, image, color } = category;

    // Handle Icon: It could be a Lucide component or an image URL
    const renderIcon = () => {
        if (!icon) return null;
        if (typeof icon === 'function' || React.isValidElement(icon)) {
            const IconComponent = icon;
            return <IconComponent size={14} color="#FFF" fill="rgba(255,255,255,0.2)" />;
        }
        
        // Custom Admin Icon (Base64) - Don't force white filter if it's a custom image, 
        // as it might be a colored icon or a photo.
        const isCustom = icon.startsWith('data:');
        const filterStyle = isCustom ? {} : { filter: 'brightness(0) invert(1)' };
        
        return <img src={icon} alt={name} className="cat-card-icon-img" style={filterStyle} />;
    };

    return (
        <div className="cat-premium-card" onClick={onClick}>
            <div className="cat-circle-frame">
                <div className="cat-img-inner-circle">
                    <img src={image} alt={name} />
                </div>
            </div>
            <div className="cat-label-box" style={{ 
                backgroundColor: (color && color.startsWith('#')) ? (color.trim().slice(0, 7)) + '1A' : 'rgba(13, 26, 95, 0.05)',
                borderColor: (color && color.startsWith('#')) ? (color.trim().slice(0, 7)) + '26' : 'rgba(13, 26, 95, 0.1)'
            }}>
                <div className="cat-card-icon-wrap" style={{ backgroundColor: color || '#64748b' }}>
                    {renderIcon()}
                </div>
                <span className="cat-label-text" style={{ color: color || '#0D1A5F' }}>{name}</span>
            </div>
        </div>
    );
};

export default CategoryCard;
