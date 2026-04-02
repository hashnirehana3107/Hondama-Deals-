import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, ArrowRight, LayoutGrid } from 'lucide-react';
import CategoryCard from '../../components/common/CategoryCard';
import './Categories.css';



const Categories = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true);
                const res = await axios.get('http://localhost:5000/api/categories');
                if (res.data.success) {
                    // Map with fallbacks for missing values in DB
                    const mapped = res.data.categories.map(cat => ({
                        ...cat,
                        icon:  cat.icon  || '/assets/images/placeholder_icon.png',
                        color: cat.color || '#0D1A5F',
                        image: cat.image || '/assets/images/placeholder_cat.png',
                    }));
                    setCategories(mapped);
                } else {
                    setError("Failed to load categories.");
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
                setError("Connectivity issue. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    const handleCategoryClick = (cat) => {
        const slug = cat.slug || cat.name.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-');
        navigate(`/category/${slug}`);
    };

    if (error) {
        return (
            <div className="cat-page-full-wrap" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
                <div style={{ textAlign: 'center' }}>
                    <h2 style={{ color: '#0D1A5F' }}>{error}</h2>
                    <button onClick={() => window.location.reload()} className="cat-yellow-final-btn" style={{ marginTop: '20px' }}>Retry</button>
                </div>
            </div>
        );
    }

    return (
        <div className="cat-page-full-wrap">
            <div className="cat-container-max">
                {/* ── STANDARDIZED PREMIUM HEADER ── */}
                <div className="premium-header-container">
                    <button onClick={() => navigate(-1)} className="back-btn-square">
                        <div className="back-btn-circle-inner">
                            <ArrowLeft size={16} strokeWidth={3} />
                        </div>
                    </button>
                    <div className="premium-header-content">
                        <div className="premium-header-title-row">
                            <h1 className="p-header-title">
                                <LayoutGrid size={28} strokeWidth={2.5} style={{ marginRight: '10px' }} />
                                Browse Categories
                            </h1>
                            <span className="p-header-badge">
                                {categories.length} CATEGORIES
                            </span>
                        </div>
                        <p className="p-header-subtitle">Find the best deals by category</p>
                    </div>
                </div>

                {/* Category Grid */}
                <div className="cat-main-grid-layout">
                    {loading ? (
                        <div className="mcat-loading">Organizing categories...</div>
                    ) : (
                        categories.map((cat) => (
                            <CategoryCard
                                key={cat._id || cat.id}
                                category={cat}
                                onClick={() => handleCategoryClick(cat)}
                            />
                        ))
                    )}
                </div>

                {/* Explore Area */}
                {!loading && (
                    <div className="cat-bottom-explore-card">
                        <div className="cat-explore-content">
                            <h2>Explore All Deals</h2>
                            <p>Discover amazing offers across all categories!</p>
                        </div>
                        <button className="cat-yellow-final-btn" onClick={() => navigate('/deals-listing')}>
                            Explore All Deals <ArrowRight size={20} strokeWidth={3} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Categories;
