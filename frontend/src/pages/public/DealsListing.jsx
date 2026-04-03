import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, Filter, ChevronDown, ArrowRight, ArrowLeft, Star, ShoppingBag, Zap, Clock, Sparkles, Heart, BadgePercent, Coins, ChevronsUpDown } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import DesignCard from '../../components/common/DesignCard';
import './DealsListing.css';

const DealsListing = () => {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    // State for filters
    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
    const [selectedDiscount, setSelectedDiscount] = useState(searchParams.get('discount') || '0');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'All');
    const [visibleCount, setVisibleCount] = useState(8);

    // Categories State
    const [categories, setCategories] = useState(['All']);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await axios.get('http://52.66.74.239:5000/api/categories');
                if (res.data.success && res.data.categories.length > 0) {
                    const fetchedCats = res.data.categories.map(cat => cat.name);
                    setCategories(['All', ...fetchedCats]);
                }
            } catch (error) {
                console.error("Error fetching categories:", error);
                // Fallback if backend API is offline
                setCategories(['All', 'Health & Beauty', 'Restaurant', 'Fashion', 'Electronics', 'Hotel', 'Groceries', 'Salon', 'Spa']);
            }
        };
        fetchCategories();
    }, []);

    // Mock Deals Data (Synchronized with Home.jsx)
    const allDeals = [
        // Deals of the Day
        { id: 101, name: "LUV Perfume Duo", price: "6,000", oldPrice: "7,000", img: "/assets/images/luv_perfume_duo.png", badge: "10% OFF", storeName: "Luv Esence", storeImg: "/assets/images/luvLogo.png", rating: "4.6", ratingCount: "15", location: "Luv Esence, Sri Lanka", dealType: "SALE", category: "Health & Beauty", description: "Luv Esence signature perfume duo for a refreshing scent all day." },
        { id: 102, name: "Fruit Paradise Wellness & Beauty Collection", price: "15,900", oldPrice: "27,000", img: "/assets/images/spaceylonOffer.png", badge: "50% Off", storeName: "Spa Ceylon", storeImg: "/assets/images/spaceylonLogo.png", rating: "5.0", ratingCount: "18", location: "Spa Ceylon, Sri Lanka", dealType: "SALE", category: "Health & Beauty", description: "Complete wellness set featuring fruit-infused scents and natural ingredients." },
        { id: 103, name: "HAIR REALAXING|REBONDING|STRAIGHT", price: "9,500", oldPrice: "12,500", img: "/assets/images/salon2.png", badge: "40% OFF", storeName: "The Station Hair & Beauty", storeImg: "/assets/images/stationHairBeauty.png", rating: "4.5", ratingCount: "220", location: "Battaramulla", dealType: "OFFER", category: "Salon", description: "Professional hair straightening and relaxing treatments by experts." },
        { id: 104, name: "10 pc Hot & Crispy Chicken", price: "3,900", oldPrice: "4,950", img: "/assets/images/KFC1.png", badge: "20% Off", storeName: "KFC", storeImg: "/assets/images/KFCLogo.png", rating: "4.8", ratingCount: "100", location: "KFC, Sri Lanka", dealType: "LIMITED OFFER", category: "Restaurant", description: "Share the joy with 10 pieces of our world-famous hot and crispy chicken." },
        { id: 105, name: "Buy 1 Burger & Get 1 Burger Free", price: "950", oldPrice: "1,500", img: "/assets/images/BurgerKing1.png", badge: "25% OFF", storeName: "BURGER KING", storeImg: "/assets/images/BurgerKingLogo.png", rating: "5.0", ratingCount: "18", location: "BURGER KING, Sri Lanka", dealType: "LIMITED OFFER", category: "Restaurant", description: "BOGO deal on selected flame-grilled burgers for a limited time." },

        // Best Deals
        { id: 201, name: "POP On Nails Offer", description: "Easy Nails at your fingertips !", price: "4,000", img: "/assets/images/Natulals1.png", badge: "OFFER", storeName: "Naturals Unisex Salon ", storeImg: "/assets/images/naturalsLogo.png", rating: "4.7", ratingCount: "20", location: "Colombo", dealType: "LIMITED OFFER", category: "Salon" },
        { id: 202, name: "Enjoy 25% OFF on 2L tubs at Baskin Robbins", price: "6,900", oldPrice: "9,200", img: "/assets/images/BR1.png", badge: "12% Off", storeName: "Baskin Robbins", storeImg: "/assets/images/BaskinRobbinsLogo.png", rating: "4.9", ratingCount: "67", location: "Baskin Robbins, Sri Lanka", dealType: "OFFER", category: "Restaurant", description: "Treat yourself to large tubs of your favorite flavors with 25% savings." },
        { id: 203, name: "Dark Circle Remover Duo Offer", price: "1,400", oldPrice: "1,590", img: "/assets/images/janet1.png", badge: "5% Off", storeName: "Janet", storeImg: "/assets/images/JanetLogo.png", rating: "4.6", ratingCount: "23", location: "Janet, Sri Lanka", dealType: "SALE", category: "Health & Beauty", description: "Effective eye care duo to reduce dark circles and puffiness." },
        { id: 204, name: "Honors Discount Advance Purchase Pack", price: "30,000", img: "/assets/images/honersPack.png", badge: "17% OFF", storeName: "Hilton", storeImg: "/assets/images/HiltonLogo.png", rating: "4.4", ratingCount: "35", location: "Colombo", dealType: "DISCOUNT", category: "Hotel", description: "Stay at Hilton with exclusive advance purchase discounts for members." },
        { id: 205, name: "Gathered Long Sleeve Top - 280325", price: "2,940", oldPrice: "5,000", img: "/assets/images/gflock1.png", badge: "50% OFF", storeName: "GFlock", storeImg: "/assets/images/GFLOCKLogo.png", rating: "4.6", ratingCount: "23", location: "GFLOCK, Sri Lanka", dealType: "SALE", category: "Fashion", description: "Trendy long sleeve top perfect for casual and semi-formal wear." },
        { id: 206, name: "FLASH SALE ALERT !", price: "Total Bill: 50% OFF", description: "Get 50% OFF on Any Item from 3pm to 6pm TODAY!", img: "/assets/images/pizzahut1.png", badge: "50% OFF", storeName: "Pizza Hut", storeImg: "/assets/images/PizzahutLogo.png", rating: "4.9", ratingCount: "45", location: "Pizza Hut, Sri Lanka", dealType: "OFFER", category: "Restaurant" },

        // Trending Deals
        { id: 301, name: "NEW YEAR CHICKEN COMBO", description: "Hot & Crispy chicken 06 PC Hot Drumlets 06 PC Kochchi Bites 08 PC Pepsi 1.5L", price: "3,990", img: "/assets/images/KFC2.png", badge: "Trending", storeName: "KFC", storeImg: "/assets/images/KFCLogo.png", rating: "4.1", ratingCount: "6", location: "KFC, Sri Lanka", dealType: "OFFER", category: "Restaurant" },
        { id: 302, name: "Enjoy 10% off on Jagro fresh & frozen strawberries", price: "Total Bill: 10% OFF", img: "/assets/images/cargills1.png", badge: "10% OFF", storeName: "Cargills Food City", storeImg: "/assets/images/cargillsLogo.png", rating: "4.0", ratingCount: "10", location: "Cargills Food City, Sri Lanka", dealType: "OFFER", category: "Groceries", description: "Fresh from the farm strawberries now with a 10% discount." },
        { id: 303, name: "The Best Korean Skin Care Products Offer", price: "Total Bill: 20% OFF", img: "/assets/images/Skin1.png", badge: "20% OFF", storeName: "Cosmetics.lk", storeImg: "/assets/images/Cosmetics.png", rating: "4.5", ratingCount: "12", location: "Cosmetics.lk", dealType: "OFFER", category: "Health & Beauty", description: "Authentic Korean beauty products for a flawless skin routine." },
        { id: 304, name: "Barista COFFEE RUSH is back!", description: "Enjoy 50% OFF on favorite Lavazza coffee beverages", price: "Total Bill: 50% OFF", img: "/assets/images/barista1.png", badge: "50% OFF", storeName: "Barista", storeImg: "/assets/images/BaristaLogo.png", rating: "4.6", ratingCount: "43", location: "Barista, Sri Lanka", dealType: "OFFER", category: "Restaurant" },
        { id: 305, name: "Our 4 Pizzas just for Rs.999 Pizza Mania offer", price: "999", img: "/assets/images/dominosPizza1.png", badge: "OFFER", storeName: "Domino's Pizza", storeImg: "/assets/images/DominosLogo.png", rating: "4.4", ratingCount: "20", location: "Domino's Pizza, Sri Lanka", dealType: "OFFER", category: "Restaurant", description: "Get any 4 personal pizzas for just 999. Best value for pizza lovers!" },
        { id: 306, name: "TCL 55'4K UHD Google TV - TCL55P6K", price: "179,999", oldPrice: "199,999", img: "/assets/images/tv1.png", badge: "SALE", storeName: "SINGER", storeImg: "/assets/images/SingerLogo.png", rating: "4.5", ratingCount: "15", location: "SINGER, Sri Lanka", dealType: "SALE", category: "Electronics", description: "Immersive 4K viewing experience with Google TV built-in." },

        // Abans Deals
        { id: 401, name: "Abans Steam Iron Ceramic Coated - 2200W", price: "7,990", oldPrice: "10,990", img: "/assets/images/abans1.png", badge: "27% OFF", storeName: "Abans", storeImg: "/assets/images/abansLogo2.png", rating: "4.0", ratingCount: "1", location: "Abans, Sri Lanka", dealType: "SALE", category: "Electronics", description: "Powerful steam iron with ceramic coating for smooth ironing." },
        { id: 402, name: "Abans High Pressure Washer - Maximum up to 130A", price: "24,990", oldPrice: "30,990", img: "/assets/images/abans2.png", badge: "19% OFF", storeName: "Abans", storeImg: "/assets/images/abansLogo2.png", rating: "4.3", ratingCount: "4", location: "Abans, Sri Lanka", dealType: "SALE", category: "Electronics", description: "Efficient cleaning for your car and garden with high pressure." },
        { id: 403, name: "Abans 12000BTU Air Conditioner R32 Fixed Speed Anti-Corrosion", price: "169,990", oldPrice: "209,990", img: "/assets/images/abans3.png", badge: "19% OFF", storeName: "Abans", storeImg: "/assets/images/abansLogo2.png", rating: "4.1", ratingCount: "12", location: "Abans, Sri Lanka", dealType: "SALE", category: "Electronics", description: "Keep your home cool with durable and anti-corrosion AC units." },
        { id: 404, name: "Haier 598L Side By Side Triple Door Inverter Refrigerator", price: "399,990", oldPrice: "599,990", img: "/assets/images/abans4.png", badge: "33% OFF", storeName: "Abans", storeImg: "/assets/images/abansLogo2.png", rating: "4.3", ratingCount: "5", location: "Abans, Sri Lanka", dealType: "SALE", category: "Electronics", description: "Large capacity inverter fridge with smart cooling technology." },
        { id: 405, name: "Abans Blender with Grinder 1.5L - Black", price: "9,990", oldPrice: "15,990", img: "/assets/images/abans5.png", badge: "37% OFF", storeName: "Abans", storeImg: "/assets/images/abansLogo2.png", rating: "4.6", ratingCount: "11", location: "Abans, Sri Lanka", dealType: "SALE", category: "Electronics", description: "Durable blender and grinder set for all your kitchen needs." },
        { id: 406, name: "Mibro C4 Square HD Screen Smart Watch (Gray)", price: "15,999", oldPrice: "17,999", img: "/assets/images/abans6.png", badge: "11% OFF", storeName: "Abans", storeImg: "/assets/images/abansLogo2.png", rating: "4.6", ratingCount: "41", location: "Abans, Sri Lanka", dealType: "SALE", category: "Electronics", description: "HD screen smartwatch with multiple fitness tracking modes." }
    ];


    // ── LOCAL STORAGE DEALS ──
    const [localDeals, setLocalDeals] = useState([]);
    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem('hodama_all_deals_v1') || '[]');
        setLocalDeals(stored);
    }, []);

    const combinedAllDeals = React.useMemo(() => {
        const pool = [...allDeals, ...localDeals];
        return pool.filter(d => !d.status || d.status === 'Approved' || d.status === 'Active');
    }, [localDeals]);

    const [filteredDeals, setFilteredDeals] = useState(combinedAllDeals);

    useEffect(() => {
        let result = combinedAllDeals.filter(deal => {
            const matchesSearch = (deal.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                (deal.storeName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                (deal.description?.toLowerCase() || '').includes(searchTerm.toLowerCase());

            const matchesCategory = selectedCategory === 'All' || deal.category === selectedCategory;

            // Discount filtering
            const discountValue = parseInt(deal.badge?.replace(/[^0-9]/g, '') || '0');
            const matchesDiscount = discountValue >= parseInt(selectedDiscount);

            // Price range filtering
            const parsedPrice = parseInt(deal.price?.replace(/[^0-9]/g, '') || '0');
            const matchesPrice = (!minPrice || parsedPrice >= parseInt(minPrice)) &&
                (!maxPrice || parsedPrice <= parseInt(maxPrice));

            // SortBy acting as a Deal Type Filter (OFFER, SALE, LIMITED OFFER, DISCOUNT)
            let matchesSortType = true;
            if (sortBy !== 'All') {
                matchesSortType = (deal.dealType === sortBy);
            }

            return matchesSearch && matchesCategory && matchesDiscount && matchesPrice && matchesSortType;
        });

        // Basic default sorting by Highest Discount for better presentation
        result = [...result].sort((a, b) => {
            const discA = parseInt(a.badge?.replace(/[^0-9]/g, '') || '0');
            const discB = parseInt(b.badge?.replace(/[^0-9]/g, '') || '0');
            return discB - discA;
        });

        setFilteredDeals(result);
    }, [searchTerm, selectedCategory, selectedDiscount, minPrice, maxPrice, sortBy]);

    const handleLoadMore = () => {
        setVisibleCount(prev => prev + 4);
    };

    return (
        <div className="all-deals-wrapper">
            <div className="container">
                {/* 1. Title Section */}
                <div className="dl-top-header">
                    <button onClick={() => navigate(-1)} className="back-btn-square">
                        <div className="back-btn-circle-inner"><ArrowLeft size={16} strokeWidth={3} /></div>
                    </button>
                    <div className="header-text">
                        <h1 className="deals-page-title">All Deals</h1>
                        <p className="deals-page-subtitle">Explore the best deals and exclusive offers available for you</p>
                    </div>
                </div>

                {/* 2. Search & Filter Bar (White Container) */}
                <div className="deals-filter-bar">
                    <div className="filter-left">
                        <div className="search-input-group dl-search-box">
                            <Search size={18} className="search-icon" />
                            <input
                                type="text"
                                placeholder="Search deals..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="dropdown-filter dl-blue-outline">
                            <Filter size={16} className="filter-icon" />
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                            >
                                <option value="All">All Category</option>
                                {categories.map(cat => cat !== 'All' && (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                            <ChevronDown size={16} className="chevron" />
                        </div>

                        <div className="dropdown-filter dl-gray-outline">
                            <BadgePercent size={16} className="filter-icon" />
                            <select
                                value={selectedDiscount}
                                onChange={(e) => setSelectedDiscount(e.target.value)}
                            >
                                <option value="0">Any Discount</option>
                                <option value="10">10% or more</option>
                                <option value="25">25% or more</option>
                                <option value="50">50% or more</option>
                            </select>
                            <ChevronDown size={16} className="chevron" />
                        </div>

                        <div className="price-range-group dl-gray-outline dl-minmax-outline">
                            <Coins size={16} className="filter-icon-static" />
                            <div className="price-inputs">
                                <input
                                    type="number"
                                    placeholder="Min"
                                    className="price-input"
                                    value={minPrice}
                                    onChange={(e) => setMinPrice(e.target.value)}
                                />
                                <span>-</span>
                                <input
                                    type="number"
                                    placeholder="Max"
                                    className="price-input"
                                    value={maxPrice}
                                    onChange={(e) => setMaxPrice(e.target.value)}
                                />
                            </div>
                            <ChevronsUpDown size={14} className="filter-icon-static ml-auto-icon" />
                        </div>
                    </div>

                    <div className="filter-right" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        {(searchTerm || selectedCategory !== 'All' || selectedDiscount !== '0' || minPrice || maxPrice || sortBy !== 'All') && (
                            <button
                                className="dl-clear-filters"
                                onClick={() => {
                                    setSearchTerm('');
                                    setSelectedCategory('All');
                                    setSelectedDiscount('0');
                                    setMinPrice('');
                                    setMaxPrice('');
                                    setSortBy('All');
                                }}
                            >
                                Clear All
                            </button>
                        )}
                        <div className="sort-group dl-sort">
                            <label>Sort By:</label>
                            <div className="dropdown-filter dl-gray-outline">
                                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                                    <option value="All">All Deals</option>
                                    <option value="OFFER">OFFER</option>
                                    <option value="SALE">SALE</option>
                                    <option value="LIMITED OFFER">LIMITED OFFER</option>
                                    <option value="DISCOUNT">DISCOUNT</option>
                                </select>
                                <ChevronDown size={16} className="chevron" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. Deals Grid */}
                {filteredDeals.length > 0 ? (
                    <>
                        <div className="deals-grid">
                            {filteredDeals.slice(0, visibleCount).map(deal => (
                                <DesignCard
                                    key={deal.id}
                                    deal={deal}
                                />
                            ))}
                        </div>


                        {/* 4. Load More */}
                        {visibleCount < filteredDeals.length && (
                            <div className="load-more-section">
                                <button className="load-more-btn" onClick={handleLoadMore}>
                                    Load More Deals
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="empty-deals-state">
                        <div className="empty-icon">📂</div>
                        <h3>No deals found</h3>
                        <p>Try adjusting your search terms or filters to find what you're looking for.</p>
                        <button className="reset-filters-btn" onClick={() => {
                            setSearchTerm('');
                            setSelectedCategory('All');
                            setSelectedDiscount('0');
                            setMinPrice('');
                            setMaxPrice('');
                            setSortBy('All');
                        }}>Clear All Filters</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DealsListing;
