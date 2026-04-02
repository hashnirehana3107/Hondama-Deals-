import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    ChevronRight,
    Zap,
    ShieldCheck,
    Star,
    ArrowRight,
    ArrowLeft,
    Heart,
    Tag,
    Clock,
    Smartphone,
    Laptop,
    Camera,
    Headphones,
    MapPin,
    Sparkles,
    Star as LucideStar,
    BadgePercent
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useWishlist } from '../../contexts/WishlistContext';
import DesignCard from '../../components/common/DesignCard';
import StoreCard from '../../components/common/StoreCard';
import CategoryCard from '../../components/common/CategoryCard';
import { isDealExpired } from '../../utils/dealUtils';

import './Home.css';



const Home = () => {
    const { t } = useLanguage();
    const { toggleWishlist, isInWishlist } = useWishlist();
    const navigate = useNavigate();

    // ── HERO CAROUSEL LOGIC ──
    const [heroIndex, setHeroIndex] = useState(0);
    const [heroImages, setHeroImages] = useState([
        { image: "/assets/images/home_hero_nolimit.png", link: "/category/fashion" },
        { image: "/assets/images/home_dsi1.png", link: "/category/fashion" },
        { image: "/assets/images/home_skin1.png", link: "/category/health-beauty" },
        { image: "/assets/images/electronic_banner.png", link: "/category/electronics" },
        { image: "/assets/images/home_restaurant1.png", link: "/category/restaurant" },
        { image: "/assets/images/home_foodcity1.png", link: "/category/groceries" },
        { image: "/assets/images/home_hotel1.png", link: "/category/hotel" },
        { image: "/assets/images/home_salon1.png", link: "/category/salon" },
        { image: "/assets/images/electronic_banner.png", link: "/category/electronics" },
    ]);

    useEffect(() => {
        const storedRequests = JSON.parse(localStorage.getItem('hodama_banner_requests_v1') || '[]');
        const now = new Date();
        now.setHours(0, 0, 0, 0);

        const approvedBanners = storedRequests
            .filter(req => {
                if (req.status !== 'Published' || !req.image) return false;

                // EXCLUDE THE TEST BANNER WITH LINK 'aaaaaaaaaaaaaaaaa' specifically
                if (req.redirectUrl && req.redirectUrl.includes('aaaaaaaaaaaaaaaaa')) return false;

                if (req.startDate && req.endDate) {
                    const start = new Date(req.startDate);
                    const end = new Date(req.endDate);
                    start.setHours(0, 0, 0, 0);
                    end.setHours(23, 59, 59, 999);
                    if (now < start || now > end) return false;
                }
                return true;
            })
            .map(req => ({ image: req.image, link: req.redirectUrl || '#' }));

        if (approvedBanners.length > 0) {
            setHeroImages(prev => {
                // Ensure the 'aaaaaaaaaaaaaaaaa' link is not in the hardcoded list either (just in case)
                const filteredPrev = prev.filter(item => {
                    const link = typeof item === 'string' ? '#' : item.link;
                    return !link.includes('aaaaaaaaaaaaaaaaa');
                });
                return [...filteredPrev, ...approvedBanners];
            });
        } else {
            setHeroImages(prev => prev.filter(item => {
                const link = typeof item === 'string' ? '#' : item.link;
                return !link.includes('aaaaaaaaaaaaaaaaa');
            }));
        }
    }, []);

    useEffect(() => {
        const heroInterval = setInterval(() => {
            setHeroIndex(prev => (prev + 1) % heroImages.length);
        }, 5000); // Change every 5 seconds
        return () => clearInterval(heroInterval);
    }, [heroImages.length]);

    const nextHero = () => setHeroIndex((heroIndex + 1) % heroImages.length);
    const prevHero = () => setHeroIndex((heroIndex - 1 + heroImages.length) % heroImages.length);

    // ── COUNTDOWN TIMER (Deals of the Day) ──
    const [dealsTime, setDealsTime] = useState({ h: 0, m: 22, s: 19 });

    useEffect(() => {
        const timer = setInterval(() => {
            setDealsTime(prev => {
                let { h, m, s } = prev;
                if (s > 0) s--;
                else if (m > 0) { m--; s = 59; }
                else if (h > 0) { h--; m = 59; s = 59; }
                return { h, m, s };
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // ── COUNTDOWN TIMER (Spring Sale Abans) ──
    const [springTime, setSpringTime] = useState({ d: 25, h: 3, m: 40, s: 12 });

    useEffect(() => {
        const timer = setInterval(() => {
            setSpringTime(prev => {
                let { d, h, m, s } = prev;
                if (s > 0) s--;
                else if (m > 0) { m--; s = 59; }
                else if (h > 0) { h--; m = 59; s = 59; }
                else if (d > 0) { d--; h = 23; m = 59; s = 59; }
                return { d, h, m, s };
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // ── DEALS SLIDER SCROLL LOGIC ──
    const dealsScrollRef = React.useRef(null);
    const scrollDeals = (dir) => {
        if (dealsScrollRef.current) {
            const scrollAmount = 354; // 330px card width + 24px gap
            dealsScrollRef.current.scrollBy({ left: dir === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
        }
    };

    const bestDealsScrollRef = React.useRef(null);
    const scrollBestDeals = (dir) => {
        if (bestDealsScrollRef.current) {
            const scrollAmount = 354;
            bestDealsScrollRef.current.scrollBy({ left: dir === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
        }
    };

    const trendingDealsScrollRef = React.useRef(null);
    const scrollTrendingDeals = (dir) => {
        if (trendingDealsScrollRef.current) {
            const scrollAmount = 354;
            trendingDealsScrollRef.current.scrollBy({ left: dir === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
        }
    };

    const abansDealsScrollRef = React.useRef(null);
    const scrollAbansDeals = (dir) => {
        if (abansDealsScrollRef.current) {
            const scrollAmount = 324; // Width of 1 card + gap
            abansDealsScrollRef.current.scrollBy({ left: dir === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
        }
    };

    const categoryScrollRef = React.useRef(null);
    const scrollCategory = (dir) => {
        if (categoryScrollRef.current) {
            const scrollAmount = 250;
            categoryScrollRef.current.scrollBy({ left: dir === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
        }
    };

    const storesScrollRef = React.useRef(null);
    const scrollStores = (dir) => {
        if (storesScrollRef.current) {
            const scrollAmount = 200; // width of one store card + gap
            storesScrollRef.current.scrollBy({ left: dir === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
        }
    };

    // ── DATA FOR RENDERING ──

    const dealsProducts = [
        { id: 101, name: "LUV Perfume Duo", price: "6,000", oldPrice: "7,000", img: "/assets/images/luv_perfume_duo.png", badge: "10% OFF", storeName: "Luv Esence", storeImg: "/assets/images/luvLogo.png", rating: "4.6", ratingCount: "15", location: "Luv Esence, Sri Lanka", dealType: "SALE", category: "Health & Beauty" },
        { id: 102, name: "Fruit Paradise Wellness & Beauty Collection", price: "15,900", oldPrice: "27,000", img: "/assets/images/spaceylonOffer.png", badge: "50% Off", storeName: "Spa Ceylon", storeImg: "/assets/images/spaceylonLogo.png", rating: "5.0", ratingCount: "18", location: "Spa Ceylon, Sri Lanka", dealType: "SALE", category: "Health & Beauty" },
        { id: 103, name: "HAIR REALAXING|REBONDING|STRAIGHT", price: "9,500", oldPrice: "12,500", img: "/assets/images/salon2.png", badge: "40% OFF", storeName: "The Station Hair & Beauty", storeImg: "/assets/images/stationHairBeauty.png", rating: "4.5", ratingCount: "220", location: "Battaramulla", dealType: "OFFER", category: "Salon" },
        { id: 104, name: "10 pc Hot & Crispy Chicken", price: "3,900", oldPrice: "4,950", img: "/assets/images/KFC1.png", badge: "20% Off", storeName: "KFC", storeImg: "/assets/images/KFCLogo.png", rating: "4.8", ratingCount: "100", location: "KFC, Sri Lanka", dealType: "LIMITED OFFER", category: "Restaurant" },
        { id: 105, name: "Buy 1 Burger & Get 1 Burger Free", price: "950", oldPrice: "1,500", img: "/assets/images/BurgerKing1.png", badge: "25% OFF", storeName: "BURGER KING", storeImg: "/assets/images/BurgerKingLogo.png", rating: "5.0", ratingCount: "18", location: "BURGER KING, Sri Lanka", dealType: "LIMITED OFFER", category: "Restaurant" },
    ];

    const [dbCategories, setDbCategories] = useState([]);
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/categories');
                if (res.data.success) {
                    setDbCategories(res.data.categories);
                }
            } catch (err) {
                console.error("Home: DB Categories fetch failed", err);
            }
        };
        fetchCategories();
    }, []);

    const mergedCategories = React.useMemo(() => {
        return dbCategories.map(cat => ({
            ...cat,
            icon: cat.icon || '/assets/images/placeholder_icon.png',
            color: cat.color || '#323c82',
            image: cat.image || '/assets/images/placeholder_cat.png'
        }));
    }, [dbCategories]);

    const bestDeals = [
        { id: 201, name: "POP On Nails Offer", description: "Easy Nails at your fingertips !", price: "4,000", img: "/assets/images/Natulals1.png", storeName: "Naturals Unisex Salon ", storeImg: "/assets/images/naturalsLogo.png", rating: "4.7", ratingCount: "20", location: "Colombo", dealType: "LIMITED OFFER", category: "Salon" },
        { id: 202, name: "Enjoy 25% OFF on 2L tubs at Baskin Robbins", price: "6,900", oldPrice: "9,200", img: "/assets/images/BR1.png", badge: "12% Off", storeName: "Baskin Robbins", storeImg: "/assets/images/BaskinRobbinsLogo.png", rating: "4.9", ratingCount: "67", location: "Baskin Robbins, Sri Lanka", dealType: "OFFER", category: "Restaurant" },
        { id: 203, name: "Dark Circle Remover Duo Offer", price: "1,400", oldPrice: "1,590", img: "/assets/images/janet1.png", badge: "5% Off", storeName: "Janet", storeImg: "/assets/images/JanetLogo.png", rating: "4.6", ratingCount: "23", location: "Janet, Sri Lanka", dealType: "SALE", category: "Health & Beauty" },
        { id: 204, name: "Honors Discount Advance Purchase Pack", price: "30,000", img: "/assets/images/honersPack.png", badge: "17% OFF", storeName: "Hilton", storeImg: "/assets/images/HiltonLogo.png", rating: "4.4", ratingCount: "35", location: "Colombo", dealType: "DISCOUNT", category: "Hotel" },
        { id: 205, name: "Gathered Long Sleeve Top - 280325", price: "2,940", oldPrice: "5,000", img: "/assets/images/gflock1.png", badge: "50% OFF", storeName: "GFlock", storeImg: "/assets/images/GFLOCKLogo.png", rating: "4.6", ratingCount: "23", location: "GFLOCK, Sri Lanka", dealType: "SALE", category: "Fashion" },
        { id: 206, name: "FLASH SALE ALERT !", price: "Total Bill: 50% OFF", description: "Get 50% OFF on Any Item from 3pm to 6pm TODAY!", img: "/assets/images/pizzahut1.png", badge: "50% OFF", storeName: "Pizza Hut", storeImg: "/assets/images/PizzahutLogo.png", rating: "4.9", ratingCount: "45", location: "Pizza Hut, Sri Lanka", dealType: "OFFER", category: "Restaurant" },
    ];

    const stores = [
        { name: "SPA CEYLON", img: "/assets/images/spaceylonLogo.png", url: "https://lk.spaceylon.com/", deals: "9 Deals", rating: "5.0", category: "Health & Beauty", catColor: "#d63384", icon: <Sparkles size={10} color="#fff" /> },
        { name: "ARPICO SUPERCENTRE", img: "/assets/images/ARPICOSUPERCENTRELOGO.png", url: "https://arpicosupercentre.com/", deals: "10 Deals", rating: "4.8", category: "Grocery", catColor: "#d97706", icon: <Tag size={10} color="#fff" /> },
        { name: "Salon LIYO", img: "/assets/images/liyoLogo.png", url: "https://www.facebook.com/SalonLiyo/", deals: "4 Deals", rating: "4.9", category: "Salon", catColor: "#dc2626", icon: <Tag size={10} color="#fff" /> },
        { name: "KFC", img: "/assets/images/KFCLogo.png", url: "https://www.kfc.lk/", deals: "3 Deals", rating: "4.8", category: "Restaurant", catColor: "#d97706", icon: <Tag size={10} color="#fff" /> },
        { name: "Hilton", img: "/assets/images/HiltonLogo.png", url: "https://www.hilton.com/en/locations/sri-lanka/", deals: "2 Deals", rating: "4.6", category: "Hotel", catColor: "#8b5cf6", icon: <Tag size={10} color="#fff" /> },
        { name: "COOL PLANET", img: "/assets/images/coolPlanetLogo.png", url: "https://coolplanet.lk/", deals: "5 Deals", rating: "4.7", category: "Fashion", catColor: "#0891b2", icon: <Tag size={10} color="#fff" /> },
        { name: "Keells", img: "/assets/images/KEELLSLogo.png", url: "https://keellssuper.com/", deals: "5 Deals", rating: "4.8", category: "Grocery", catColor: "#d97706", icon: <Tag size={10} color="#fff" /> },
    ];

    const trendingDeals = [
        { id: 301, name: "NEW YEAR CHICKEN COMBO", description: "Hot & Crispy chicken 06 PC Hot Drumlets 06 PC Kochchi Bites 08 PC Pepsi 1.5L", price: "3,990", img: "/assets/images/KFC2.png", badge: "Trending", storeName: "KFC", storeImg: "/assets/images/KFCLogo.png", rating: "4.1", ratingCount: "6", location: "KFC, Sri Lanka", dealType: "OFFER", category: "Restaurant" },
        { id: 302, name: "Enjoy 10% off on Jagro fresh & frozen strawberries", price: "Total Bill: 10% OFF", img: "/assets/images/cargills1.png", badge: "10% OFF", storeName: "Cargills Food City", storeImg: "/assets/images/cargillsLogo.png", rating: "4.0", ratingCount: "10", location: "Cargills Food City, Sri Lanka", dealType: "OFFER", category: "Grocery" },
        { id: 304, name: "Barista COFFEE RUSH is back!", description: "Enjoy 50% OFF on  favorite Lavazza coffee beverages", price: "Total Bill: 50% OFF", img: "/assets/images/barista1.png", badge: "50% OFF", storeName: "Barista", storeImg: "/assets/images/BaristaLogo.png", rating: "4.6", ratingCount: "43", location: "Barista, Sri Lanka", dealType: "OFFER", category: "Restaurant" },
        { id: 305, name: "Our 4 Pizzas just for Rs.999 Pizza Mania offer", price: "999", img: "/assets/images/dominosPizza1.png", badge: "OFFER", storeName: "Domino's Pizza", storeImg: "/assets/images/DominosLogo.png", rating: "4.4", ratingCount: "20", location: "Domino's Pizza, Sri Lanka", dealType: "OFFER", category: "Restaurant" },
        { id: 306, name: "TCL 55'4K UHD Google TV - TCL55P6K", price: "Rs.179,999", oldPrice: "Rs.199,999", img: "/assets/images/tv1.png", badge: "SALE", storeName: "SINGER", storeImg: "/assets/images/SingerLogo.png", rating: "4.5", ratingCount: "15", location: "SINGER, Sri Lanka", dealType: "SALE", category: "Electronics" },
    ];

    const abansDeals = [
        { id: 401, name: "Abans Steam Iron Ceramic Coated - 2200W", price: "7,990", oldPrice: "10,990", img: "/assets/images/abans1.png", badge: "27% OFF", storeName: "Abans", storeImg: "/assets/images/abansLogo2.png", rating: "4.0", ratingCount: "1", location: "Abans, Sri Lanka", dealType: "SALE", category: "Electronics" },
        { id: 402, name: "Abans High Pressure Washer - Maximum up to 130A", price: "24,990", oldPrice: "30,990", img: "/assets/images/abans2.png", badge: "19% OFF", storeName: "Abans", storeImg: "/assets/images/abansLogo2.png", rating: "4.3", ratingCount: "4", location: "Abans, Sri Lanka", dealType: "SALE", category: "Electronics" },
        { id: 403, name: "Abans 12000BTU Air Conditioner R32 Fixed Speed Anti-Corrosion", price: "169,990", oldPrice: "209,990", img: "/assets/images/abans3.png", badge: "19% OFF", storeName: "Abans", storeImg: "/assets/images/abansLogo2.png", rating: "4.1", ratingCount: "12", location: "Abans, Sri Lanka", dealType: "SALE", category: "Electronics" },
        { id: 404, name: "Haier 598L Side By Side Triple Door Inverter Refrigerator", price: "399,990", oldPrice: "599,990", img: "/assets/images/abans4.png", badge: "33% OFF", storeName: "Abans", storeImg: "/assets/images/abansLogo2.png", rating: "4.3", ratingCount: "5", location: "Abans, Sri Lanka", dealType: "SALE", category: "Electronics" },
        { id: 405, name: "Abans Blender with Grinder 1.5L - Black", price: "9,990", oldPrice: "15,990", img: "/assets/images/abans5.png", badge: "37% OFF", storeName: "Abans", storeImg: "/assets/images/abansLogo2.png", rating: "4.6", ratingCount: "11", location: "Abans, Sri Lanka", dealType: "SALE", category: "Electronics" },
        { id: 406, name: "Mibro C4 Square HD Screen Smart Watch (Gray)", price: "15,999", oldPrice: "17,999", img: "/assets/images/abans6.png", badge: "11% OFF", storeName: "Abans", storeImg: "/assets/images/abansLogo2.png", rating: "4.6", ratingCount: "41", location: "Abans, Sri Lanka", dealType: "SALE", category: "Electronics" }
    ];

    // ── DYNAMIC DEAL FILTERING LOGIC ──
    const [localDeals, setLocalDeals] = useState([]);
    const [localStores, setLocalStores] = useState([]);

    useEffect(() => {
        const syncData = () => {
            try {
                const storedDeals = JSON.parse(localStorage.getItem('hodama_all_deals_v1') || '[]');
                setLocalDeals(Array.isArray(storedDeals) ? storedDeals : []);

                const storedStores = JSON.parse(localStorage.getItem('hodama_all_stores_v1') || '[]');
                setLocalStores(Array.isArray(storedStores) ? storedStores : []);
            } catch (e) {
                console.error("Error syncing home data:", e);
            }
        };

        syncData();
        window.addEventListener('storage', syncData);
        return () => window.removeEventListener('storage', syncData);
    }, []);

    const allDealsPool = React.useMemo(() => {
        const pool = [...dealsProducts, ...bestDeals, ...trendingDeals, ...abansDeals, ...localDeals];
        // Ensure we filter out expired deals and ONLY show approved/active deals
        return pool.filter(d => {
            const isApproved = !d.status || d.status === 'Approved' || d.status === 'Active';
            return isApproved && !isDealExpired(d.expiryDate);
        });
    }, [localDeals]);

    // 1. Deals Of The Day: Expires today or marked as isDailyDeal
    const todayStr = new Date().toISOString().split('T')[0];
    const filteredDayDeals = React.useMemo(() => {
        const matched = allDealsPool.filter(d => d.isDailyDeal || d.expiryDate === todayStr);
        return matched.length > 0 ? matched : dealsProducts; // Fallback to static if none added for today
    }, [allDealsPool, todayStr]);

    // 2. This Month / Best Deals: Marked as isMonthlyDeal
    const filteredBestDeals = React.useMemo(() => {
        const matched = allDealsPool.filter(d => d.isMonthlyDeal);
        return matched.length > 0 ? matched : bestDeals;
    }, [allDealsPool]);

    // 3. Trending Online: Sort by views descending
    const filteredTrendingDeals = React.useMemo(() => {
        const sorted = [...allDealsPool].sort((a, b) => (b.views || 0) - (a.views || 0));
        return sorted.length > 0 ? sorted.slice(0, 8) : trendingDeals;
    }, [allDealsPool]);
    // ── STORE STATS LOGIC (Dynamic counts & sorting) ──
    const storesWithStats = React.useMemo(() => {
        // Merge hardcoded stores with dynamic ones
        const merged = [...stores, ...localStores];

        // Ensure unique stores by name (case-insensitive)
        const unique = Array.from(new Map(merged.map(s => [s.name.toLowerCase(), s])).values());

        return unique.map(store => {
            const dealCount = allDealsPool.filter(d =>
                d.storeName && d.storeName.toLowerCase() === store.name.toLowerCase()
            ).length;
            return { ...store, dealsCount: dealCount || parseInt(store.deals?.split(' ')[0] || '0') };
        }).filter(s => {
            // Keep hardcoded mock stores (they have no status) or approved dynamic stores
            return !s.status || s.status === 'Approved' || s.status === 'Active';
        }).sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
    }, [localStores, allDealsPool]);

    return (
        <div className="hd-home-wrapper-main">
            <div className="hd-home-container">

                {/* ── 1. HERO CAROUSEL ── */}
                <section className="hd-hero-slider-main">
                    <div className="hd-hero-slider-inner" onClick={() => {
                        const link = heroImages[heroIndex]?.link;
                        if (link && link !== '#') {
                            if (link.startsWith('http')) {
                                window.open(link, '_blank', 'noopener,noreferrer');
                            } else {
                                navigate(link);
                            }
                        }
                    }} style={{ cursor: heroImages[heroIndex]?.link && heroImages[heroIndex]?.link !== '#' ? 'pointer' : 'default' }}>
                        <img src={heroImages[heroIndex]?.image || heroImages[heroIndex]} alt={`Slide ${heroIndex + 1}`} className="hd-hero-slide-img" />

                        {/* Overlay Content */}
                        <div className="hd-hero-overlay">
                            <div className="hd-hero-btns-wrap" onClick={(e) => e.stopPropagation()}>
                                <Link to="/deals-listing" className="hd-hero-action-btn hd-hero-btn-secondary">Explore Deals</Link>
                            </div>
                        </div>

                        {/* Navigation Arrows */}
                        <button className="hd-hero-arrow-nav hd-hero-prev" onClick={(e) => { e.stopPropagation(); prevHero(); }}><ArrowLeft strokeWidth={3} size={24} /></button>
                        <button className="hd-hero-arrow-nav hd-hero-next" onClick={(e) => { e.stopPropagation(); nextHero(); }}><ArrowRight strokeWidth={3} size={24} /></button>

                        {/* Pagination Dots */}
                        <div className="hd-hero-dots" onClick={(e) => e.stopPropagation()}>
                            {heroImages.map((_, i) => (
                                <div key={i} className={`hd-hero-dot ${i === heroIndex ? 'active' : ''}`} onClick={(e) => { e.stopPropagation(); setHeroIndex(i); }}></div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── 2. FEATURES BAR ── */}
                <section className="hd-features-row">
                    {[
                        { title: "EXCLUSIVE OFFERS", sub: "Handpicked deals for our community", icon: "/assets/images/SolidBadgePercent.png" },
                        { title: "INSTANT SAVINGS", sub: "Real-time discounts on top brands", icon: "/assets/images/SolidHandCoin.png" },
                        { title: "VERIFIED CLIENTS", sub: "Shop with confidence from trusted shops", icon: "/assets/images/SolidShieldCheck.png" },
                        { title: "24/7 CUSTOMER SERVICE", sub: "Friendly 24/7 customer support", icon: "/assets/images/SolidHeadset.png" }
                    ].map((f, i) => (
                        <div key={i} className="hd-feature-card">
                            <div className="hd-feature-icon-circle">
                                <img src={f.icon} alt={f.title} className="hd-feature-icon-img" />
                            </div>
                            <h4>{f.title}</h4>
                            <p>{f.sub}</p>
                        </div>
                    ))}
                </section>

                {/* ── 3. DEALS OF THE DAY ── */}
                <div className="hd-section-divider-line"></div>
                <section className="hd-deals-day">
                    <div className="hd-deals-day-header">
                        <div className="hd-deals-title-top">
                            <div className="hd-section-marker"></div>
                            <h2 className="hd-section-title hd-section-title-blue">Deals Of The Day</h2>
                        </div>
                        <div className="hd-deals-timer-row">
                            <div className="hd-timer-left">
                                <span className="hd-ends-in">Ends In</span>
                                <div className="hd-deals-countdown-new">
                                    <div className="hd-deals-col">
                                        <span className="hd-deals-lab">Days</span>
                                        <span className="hd-deals-val">00</span>
                                    </div>
                                    <span className="hd-deals-colon">:</span>
                                    <div className="hd-deals-col">
                                        <span className="hd-deals-lab">Hours</span>
                                        <span className="hd-deals-val">{dealsTime.h.toString().padStart(2, '0')}</span>
                                    </div>
                                    <span className="hd-deals-colon">:</span>
                                    <div className="hd-deals-col">
                                        <span className="hd-deals-lab">Minutes</span>
                                        <span className="hd-deals-val">{dealsTime.m.toString().padStart(2, '0')}</span>
                                    </div>
                                    <span className="hd-deals-colon">:</span>
                                    <div className="hd-deals-col">
                                        <span className="hd-deals-lab">Seconds</span>
                                        <span className="hd-deals-val">{dealsTime.s.toString().padStart(2, '0')}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="hd-deals-nav-btns">
                                <button className="hd-nav-btn-new" onClick={() => scrollDeals('left')}><ArrowLeft strokeWidth={3} size={24} /></button>
                                <button className="hd-nav-btn-new" onClick={() => scrollDeals('right')}><ArrowRight strokeWidth={3} size={24} /></button>
                            </div>
                        </div>
                    </div>
                    <div className="hd-product-slider-row" ref={dealsScrollRef}>
                        {filteredDayDeals.map((p) => <DesignCard key={p.id} deal={p} />)}
                    </div>
                    <div className="hd-view-all-wrapper">
                        <Link to="/deals-listing" className="hd-blue-btn-large">View All Deals</Link>
                    </div>
                </section>

                {/* ── 4. BROWSE BY CATEGORY ── */}
                <div className="hd-section-divider-line"></div>
                <section className="hd-browse-categories" style={{ position: 'relative' }}>
                    <div className="hd-category-header">
                        <div>
                            <div className="hd-category-title-wrap">
                                <div className="hd-section-marker"></div>
                                <h2 className="hd-section-title hd-section-title-blue">Categories</h2>

                            </div>
                            <h2 className="hd-category-main-h2">Browse By Category</h2>
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button className="hd-nav-btn-new" onClick={() => scrollCategory('left')}>
                                <ArrowLeft strokeWidth={3} size={24} />
                            </button>
                            <button className="hd-nav-btn-new" onClick={() => scrollCategory('right')}>
                                <ArrowRight strokeWidth={3} size={24} />
                            </button>
                        </div>
                    </div>

                    <div className="hd-category-slider-row hd-category-slider-container" ref={categoryScrollRef}>
                        {mergedCategories.map((cat, i) => (
                            <CategoryCard
                                key={i}
                                category={cat}
                                onClick={() => navigate(`/category/${cat.name.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`)}
                            />
                        ))}
                    </div>

                    <div className="hd-view-all-wrapper">
                        <Link to="/categories" className="hd-blue-btn-large">View All Categories</Link>
                    </div>
                </section>
                <div className="hd-section-divider-bottom"></div>

                {/* ── 5. BEST DEALS FOR YOU ── */}
                <section className="hd-best-deals">
                    <div className="hd-best-deals-header hd-best-deals-header-wrap">
                        <div className="hd-best-deals-title-area">
                            <div className="hd-best-deals-title-flex">
                                <div className="hd-section-marker"></div>
                                <h2 className="hd-section-title hd-section-title-blue">This Month</h2>
                            </div>
                            <h2 className="hd-section-title hd-best-deals-main-h2">Best Deals For You</h2>
                        </div>
                        <div className="hd-deals-nav-btns">
                            <button className="hd-nav-btn-new" onClick={() => scrollBestDeals('left')}><ArrowLeft strokeWidth={3} size={24} /></button>
                            <button className="hd-nav-btn-new" onClick={() => scrollBestDeals('right')}><ArrowRight strokeWidth={3} size={24} /></button>
                        </div>
                    </div>

                    <div className="hd-product-slider-row" ref={bestDealsScrollRef}>
                        {filteredBestDeals.map((p) => <DesignCard key={p.id} deal={p} />)}
                    </div>

                    <div className="hd-view-all-best">
                        <Link to="/deals-listing" className="hd-blue-btn-large">View All</Link>
                    </div>
                </section>

                {/* ── 6. PROMOTION BANNER ── */}
                <section className="hd-promo-banner-wrapper">
                    <div className="hd-promo-gradient-border">
                        <div className="hd-promo-content-inner">
                            <div className="hd-promo-image-box">
                                <img src="/assets/images/HomeBanner2.png" alt="Special Promotion" className="hd-promo-image-el" />
                            </div>
                            <div className="hd-promo-text-box">
                                <div className="hd-promo-headings">
                                    <h3 className="hd-promo-h3">
                                        Limited Time<br /><span>Exclusive Offer</span>
                                    </h3>
                                    <p className="hd-promo-p">
                                        Don't miss out on this amazing deal.<br />Grab it before it's gone!
                                    </p>
                                </div>
                                <Link to="/deals-listing" className="hd-promo-buy-btn">
                                    Buy Deal
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── 7. TOP STORES ── */}
                <section className="hd-top-stores-section">
                    <div className="hd-top-stores-header">
                        <div>
                            <div className="hd-top-stores-title-box">
                                <div className="hd-section-marker"></div>
                                <h2 className="hd-section-title hd-section-title-blue">Top Stores</h2>
                            </div>
                            <h2 className="hd-top-stores-main-h2">Top Stores For You</h2>
                        </div>
                        <div className="hd-deals-nav-btns">
                            <button className="hd-nav-btn-new" onClick={() => scrollStores('left')}><ArrowLeft strokeWidth={3} size={24} /></button>
                            <button className="hd-nav-btn-new" onClick={() => scrollStores('right')}><ArrowRight strokeWidth={3} size={24} /></button>
                        </div>
                    </div>

                    <div className="hd-stores-slider-container" ref={storesScrollRef}>
                        <div className="hd-stores-row hd-stores-grid">
                            {storesWithStats.map((s, i) => (
                                <StoreCard key={i} store={s} />
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── 8. TRENDING DEALS ── */}
                <div className="hd-section-divider"></div>
                <section className="hd-trending-deals hd-trending-sect">
                    <div className="hd-best-deals-header hd-trending-header">
                        <div className="hd-best-deals-title-area">
                            <div className="hd-festive-title-row">
                                <div className="hd-section-marker"></div>
                                <h2 className="hd-section-title hd-trending-blue-title">Trending Online Deals</h2>
                            </div>
                            <h2 className="hd-section-title hd-trending-main-title">Trending Deals For You</h2>
                        </div>
                        <div className="hd-deals-nav-btns">
                            <button className="hd-nav-btn-new" onClick={() => scrollTrendingDeals('left')}><ArrowLeft strokeWidth={3} size={24} /></button>
                            <button className="hd-nav-btn-new" onClick={() => scrollTrendingDeals('right')}><ArrowRight strokeWidth={3} size={24} /></button>
                        </div>
                    </div>

                    <div className="hd-product-slider-row" ref={trendingDealsScrollRef}>
                        {filteredTrendingDeals.map((p) => <DesignCard key={p.id} deal={p} />)}
                    </div>
                </section>

                {/* ── 9. FESTIVE SEASON BANNER ── */}
                <div className="hd-section-divider hd-section-divider-top"></div>
                <section className="hd-festive-season hd-festive-sect">
                    <div className="hd-festive-header">
                        <div className="hd-festive-title-row">
                            <div className="hd-section-marker"></div>
                            <h2 className="hd-section-title hd-trending-blue-title">Festive Season Sale</h2>
                        </div>
                        <h2 className="hd-trending-main-title">New Year Deals</h2>
                    </div>
                    <div className="hd-festive-banner-wrap">
                        <img src="/assets/images/HomeBanner3.png" alt="Festive Season New Year Deals" className="hd-festive-banner-img" />
                    </div>
                </section>

                {/* ── 10. SPRING SALE ABANS (Matched to User Image) ── */}
                <div className="hd-section-divider"></div>
                <section className="hd-spring-sale">
                    <div className="hd-spring-sale-left">
                        <img src="/assets/images/abansLogo.png" alt="Abans.com" className="hd-spring-sale-logo" />
                        <h2 className="hd-spring-sale-title">අබාන්ස් එක්ක අවුරුදු!</h2>

                        <div className="hd-spring-sale-banner">
                            <img src="/assets/images/abansBanner.png" alt="Spring Sale Banner" className="hd-spring-image" />
                        </div>

                        <div className="hd-spring-sale-action">
                            <a
                                href="https://buyabans.com/abans-ekka-awurudu"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hd-spring-sale-btn">
                                Shop Now
                            </a>
                        </div>
                    </div>

                    <div className="hd-spring-sale-right">
                        <div className="hd-spring-sale-timer-wrap">
                            <div className="hd-spring-sale-timer">
                                <div className="hd-timer-block">
                                    <span className="hd-timer-val">{String(springTime.d).padStart(2, '0')}</span>
                                    <span className="hd-timer-lab">DAYS</span>
                                </div>
                                <span className="hd-timer-sep">:</span>
                                <div className="hd-timer-block">
                                    <span className="hd-timer-val">{String(springTime.h).padStart(2, '0')}</span>
                                    <span className="hd-timer-lab">HOURS</span>
                                </div>
                                <span className="hd-timer-sep">:</span>
                                <div className="hd-timer-block">
                                    <span className="hd-timer-val">{String(springTime.m).padStart(2, '0')}</span>
                                    <span className="hd-timer-lab">MINUTES</span>
                                </div>
                                <span className="hd-timer-sep">:</span>
                                <div className="hd-timer-block">
                                    <span className="hd-timer-val">{String(springTime.s).padStart(2, '0')}</span>
                                    <span className="hd-timer-lab">SECONDS</span>
                                </div>
                            </div>
                        </div>

                        <div className="hd-spring-sale-cards">
                            <button
                                onClick={() => scrollAbansDeals('left')}
                                className="hd-nav-btn-new">
                                <ArrowLeft size={24} strokeWidth={3} />
                            </button>

                            <div className="hd-spring-sale-slider">
                                <div className="hd-product-slider-row hd-spring-sale-slider-inner" ref={abansDealsScrollRef}>
                                    {abansDeals.map(deal => <DesignCard key={deal.id} deal={deal} />)}
                                </div>
                            </div>

                            <button
                                onClick={() => scrollAbansDeals('right')}
                                className="hd-nav-btn-new">
                                <ArrowRight size={24} strokeWidth={3} />
                            </button>
                        </div>
                    </div>
                </section>

            </div>


        </div>
    );
};

export default Home;
