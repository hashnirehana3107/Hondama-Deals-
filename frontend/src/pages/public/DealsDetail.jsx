import React, { useState, useEffect, useMemo } from 'react';
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import {
    Heart, Share2, CheckCircle,
    Clock, ExternalLink, Tag, Star,
    MapPin, ChevronRight, Calendar,
    AlertCircle, Flame, Copy, Phone,
    Globe, ArrowRight, ArrowLeft, ShoppingBag, Eye
} from 'lucide-react';
import { useWishlist } from '../../contexts/WishlistContext';
import DesignCard from '../../components/common/DesignCard';
import './DealsDetail.css';

const DealsDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const fromManage = queryParams.get('from') === 'manage';

    const handleGrabDeal = (url) => {
        if (!deal) return;
        
        const storedDeals = JSON.parse(localStorage.getItem('hodama_all_deals_v1') || '[]');
        let updated = false;
        const updatedDeals = storedDeals.map(d => {
            if (d.id.toString() === deal.id.toString()) {
                updated = true;
                return { ...d, views: (d.views || 0) + 1 };
            }
            return d;
        });
        
        if (updated) {
            localStorage.setItem('hodama_all_deals_v1', JSON.stringify(updatedDeals));
            window.dispatchEvent(new Event('storage'));
        }
        
        if (url) {
            window.open(url, '_blank');
        }
    };

    const { toggleWishlist, isInWishlist } = useWishlist();
    const [activeImg, setActiveImg] = useState(0);
    const [showStickyBar, setShowStickyBar] = useState(false);
    const [codeCopied, setCodeCopied] = useState(false);
    const [quantity, setQuantity] = useState(1);

    const [deal, setDeal] = useState(null);
    const [loading, setLoading] = useState(true);

    // Initial mock data as fallback if not in localStorage
    const staticDeals = [
        // ── Deals of the Day (101–105) ──
        {
            id: "101",
            badge: "10% OFF",
            name: "LUV Perfume Duo",
            businessName: "Luv Esence",
            businessLogo: "/assets/images/luvLogo.png",
            category: "Health & Beauty",
            dealType: "SALE",
            currentPrice: 6000,
            originalPrice: 7000,
            discount: 10,
            rating: 4.6,
            reviewCount: 15,
            location: "Luv Esence, Sri Lanka",
            availability: "In Stock",
            stockLeft: 8,
            totalStock: 20,
            sellingFast: false,
            websiteUrl: "https://luv-essence.com",
            couponCode: "LUV10",
            expiryDate: "30th April 2026",
            terms: "Offer valid on selected perfume sets only. Not combinable with other promotions. Subject to stock availability.",
            availability2: "Daily 9.00 AM to 9.00 PM",
            description: "Luv Esence's signature perfume duo delivers an elegant, long-lasting fragrance crafted for all-day freshness. This exclusive set pairs two complementary scents — a light floral top note and a warm woody base — for a truly luxurious sensory experience.",
            highlights: [
                "Long-lasting fragrance – up to 12 hours",
                "Alcohol-free & skin-friendly formula",
                "Elegant gift-ready packaging"
            ],
            images: [
                "/assets/images/luv_perfume_duo.png",
                "https://images.unsplash.com/photo-1541643600914-78b084683702?w=800",
                "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800"
            ],
            client: {
                name: "LUV ESENCE",
                logo: "/assets/images/luvLogo.png",
                rating: 4.6,
                totalDeals: 12,
                verified: true,
                websiteUrl: "https://luv-essence.com",
                phone: "+94 77 123 4567"
            }
        },
        {
            id: "102",
            badge: "50% Off",
            name: "Fruit Paradise Wellness & Beauty Collection",
            businessName: "Spa Ceylon",
            businessLogo: "/assets/images/spaceylonLogo.png",
            category: "Health & Beauty",
            dealType: "AURUDU SALE",
            currentPrice: 15900,
            originalPrice: 27000,
            discount: 41,
            rating: 5.0,
            reviewCount: 18,
            location: "Spa Ceylon, Sri Lanka",
            availability: "In Stock",
            stockLeft: 4,
            totalStock: 15,
            sellingFast: true,
            websiteUrl: "https://spaceylon.com",
            couponCode: "HODAMA20",
            expiryDate: "31st April 2026",
            terms: "Made with natural fruit-based ingredients, these products are for external use only. Perform a patch test before use, avoid contact with eyes, and discontinue if irritation occurs. Results may vary depending on skin type.",
            availability2: "Daily, 9.00 AM to 10.00 PM",
            description: "Celebrate the joyful Ceylonese Summer with these 15 wellness & beauty treats designed to pamper you from head to toe. Each carefully crafted formula is infused with powerful Ayurveda WonderHerbs, floral extracts & pure aromatic essential oils to naturally soothe, calm & relax your body, mind & soul.\n\nThis Set Includes:\n\n1. White Rice - Age Control Facial Cleansing Milk - 25g\n2. White Rice - Rejuvenating Facial Exfoliator - 25g\n3. Sandalwood - Uplifting Body Elixir - 50ml\n4. Sandalwood - Uplifting Body Cleanser - 50ml\n5. White Jasmine - Brighten & Treat - Body Scrub - 25g\n6. Virgin Coconut - 20% Rich Body Cream - 25g\n7. Island Rose - WonderOil - 20ml\n8. Sleep - Massage & Bath Oil - 20ml\n9. Weligama - Perfumed Body Spray - 40ml\n10. Orchid Rose - Perfumed Body Spray - 40ml\n11. Sunrise Hope - Eau de Perfume - 10ml\n12. Comforting Glossy Lip Butter - 8g (Assorted)\n13. Comforting Glossy Lip Butter - (Assorted)\n14. Neroli Jasmine - No Age - Serum Enriched Hand Cream - 10g\n15. Comfort - Neck & Shoulder Rub - 10g",
            highlights: [
                "100% Natural ingredients – No harsh chemicals",
                "Made with traditional Ayurvedic recipes",
                "Award-winning Sri Lankan luxury brand"
            ],
            images: [
                "/assets/images/spaceylonOffer.png",
                "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800",
                "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800"
            ],
            client: {
                name: "SPA CEYLON",
                logo: "/assets/images/spaceylonLogo.png",
                rating: 5.0,
                totalDeals: 32,
                verified: true,
                websiteUrl: "https://spaceylon.com",
                phone: "+94 11 234 5678"
            }
        },
        {
            id: "103",
            badge: "40% OFF",
            name: "HAIR RELAXING | REBONDING | STRAIGHT",
            businessName: "The Station Hair & Beauty",
            businessLogo: "/assets/images/stationHairBeauty.png",
            category: "Salon",
            dealType: "OFFER",
            currentPrice: 9500,
            originalPrice: 12500,
            discount: 40,
            rating: 4.5,
            reviewCount: 220,
            location: "Battaramulla",
            availability: "In Stock",
            stockLeft: 10,
            totalStock: 30,
            sellingFast: true,
            websiteUrl: "https://thestationsalon.lk",
            couponCode: "STATION40",
            expiryDate: "15th May 2026",
            terms: "Offer applicable for first-time customers only. Appointment required. Treatment duration approx. 3-4 hours. Not valid on weekends & public holidays.",
            availability2: "Mon–Sat: 9.00 AM to 7.00 PM",
            description: "Transform your hair with our professional straightening, rebonding, and relaxing treatments. Using top-grade keratin and Japanese relaxer formulas, our expert stylists at The Station will give you silky-smooth, frizz-free hair that lasts for months.",
            highlights: [
                "Professional-grade keratin & Japanese relaxer",
                "Lasts 3–6 months with proper care",
                "Experienced & certified hair stylists"
            ],
            images: [
                "/assets/images/salon2.png",
                "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=800",
                "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800"
            ],
            client: {
                name: "THE STATION HAIR & BEAUTY",
                logo: "/assets/images/stationHairBeauty.png",
                rating: 4.5,
                totalDeals: 8,
                verified: true,
                websiteUrl: "https://thestationsalon.lk",
                phone: "+94 11 287 6543"
            }
        },
        {
            id: "104",
            badge: "20% Off",
            name: "10 pc Hot & Crispy Chicken",
            businessName: "KFC",
            businessLogo: "/assets/images/KFCLogo.png",
            category: "Restaurant",
            dealType: "LIMITED OFFER",
            currentPrice: 3900,
            originalPrice: 4950,
            discount: 20,
            rating: 4.8,
            reviewCount: 100,
            location: "KFC, Sri Lanka",
            availability: "In Stock",
            stockLeft: 50,
            totalStock: 200,
            sellingFast: true,
            websiteUrl: "https://kfc.lk",
            couponCode: "KFC20",
            expiryDate: "10th April 2026",
            terms: "Valid at all KFC locations island-wide. Not valid with any other offer. Limited to one redemption per customer per day. Dine-in and takeaway only.",
            availability2: "Daily 10.00 AM to 11.00 PM",
            description: "Share the joy with 10 pieces of the world-famous KFC Hot & Crispy Chicken! Perfectly seasoned with the Colonel's secret blend of 11 herbs and spices, each piece is cooked to golden perfection – crispy on the outside, juicy on the inside. The ultimate crowd-pleaser at an unbeatable price.",
            highlights: [
                "10 pieces of world-famous crispy chicken",
                "Seasoned with 11 secret herbs & spices",
                "Valid island-wide at all KFC branches"
            ],
            images: [
                "/assets/images/KFC1.png",
                "https://images.unsplash.com/photo-1562802378-063ec186a863?w=800",
                "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=800"
            ],
            client: {
                name: "KFC SRI LANKA",
                logo: "/assets/images/KFCLogo.png",
                rating: 4.8,
                totalDeals: 25,
                verified: true,
                websiteUrl: "https://kfc.lk",
                phone: "+94 11 500 0522"
            }
        },
        {
            id: "105",
            badge: "25% OFF",
            name: "Buy 1 Burger & Get 1 Burger Free",
            businessName: "BURGER KING",
            businessLogo: "/assets/images/BurgerKingLogo.png",
            category: "Restaurant",
            dealType: "LIMITED OFFER",
            currentPrice: 950,
            originalPrice: 1500,
            discount: 25,
            rating: 5.0,
            reviewCount: 18,
            location: "BURGER KING, Sri Lanka",
            availability: "In Stock",
            stockLeft: 30,
            totalStock: 100,
            sellingFast: false,
            websiteUrl: "https://burgerking.lk",
            couponCode: "BKBOGO",
            expiryDate: "5th April 2026",
            terms: "BOGO offer valid on selected flame-grilled burgers only. Must purchase one burger of equal or greater value. Valid at participating locations. Not combinable with other offers.",
            availability2: "Daily 10.00 AM to 11.00 PM",
            description: "Burger King's legendary BOGO deal is back! Buy any flame-grilled signature burger and get a second one absolutely FREE. Whether you prefer the iconic Whopper or the crispy Chicken Royal, this is your chance to treat a friend or simply double your own burger bliss at Sri Lanka's most-loved fast food chain.",
            highlights: [
                "BOGO on selected flame-grilled burgers",
                "Includes Whopper & Chicken Royal",
                "Valid island-wide at participating branches"
            ],
            images: [
                "/assets/images/BurgerKing1.png",
                "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800",
                "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=800"
            ],
            client: {
                name: "BURGER KING",
                logo: "/assets/images/BurgerKingLogo.png",
                rating: 5.0,
                totalDeals: 18,
                verified: true,
                websiteUrl: "https://burgerking.lk",
                phone: "+94 11 600 1234"
            }
        },

        // ── Best Deals (201–206) ──
        {
            id: "201",
            badge: "OFFER",
            name: "POP On Nails Offer",
            businessName: "Naturals Unisex Salon",
            businessLogo: "/assets/images/naturalsLogo.png",
            category: "Salon",
            dealType: "LIMITED OFFER",
            currentPrice: 4000,
            originalPrice: 5500,
            discount: 27,
            rating: 4.7,
            reviewCount: 20,
            location: "Colombo",
            availability: "In Stock",
            stockLeft: 15,
            totalStock: 40,
            sellingFast: false,
            websiteUrl: "https://naturalssalon.lk",
            couponCode: "NAILPOP27",
            expiryDate: "20th April 2026",
            terms: "Offer valid at all Naturals Unisex Salon branches. Appointment required 24 hours in advance. Not valid on public holidays.",
            availability2: "Mon–Sat: 8.30 AM to 7.30 PM",
            description: "Easy nails at your fingertips! Naturals Unisex Salon's POP On Nails offer brings you salon-quality press-on nail application done by professionals. Choose from 50+ designs – from minimalist French tips to bold nail art. Perfect for brides, parties, or everyday glam.",
            highlights: [
                "50+ nail design options available",
                "Done by certified nail technicians",
                "Includes base coat & top coat"
            ],
            images: [
                "/assets/images/Natulals1.png",
                "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800",
                "https://images.unsplash.com/photo-1604654894690-ce0adb4a16a5?w=800"
            ],
            client: {
                name: "NATURALS UNISEX SALON",
                logo: "/assets/images/naturalsLogo.png",
                rating: 4.7,
                totalDeals: 14,
                verified: true,
                websiteUrl: "https://naturalssalon.lk",
                phone: "+94 11 456 7890"
            }
        },
        {
            id: "202",
            badge: "12% Off",
            name: "Enjoy 25% OFF on 2L tubs at Baskin Robbins",
            businessName: "Baskin Robbins",
            businessLogo: "/assets/images/BaskinRobbinsLogo.png",
            category: "Restaurant",
            dealType: "OFFER",
            currentPrice: 6900,
            originalPrice: 9200,
            discount: 25,
            rating: 4.9,
            reviewCount: 67,
            location: "Baskin Robbins, Sri Lanka",
            availability: "In Stock",
            stockLeft: 25,
            totalStock: 80,
            sellingFast: false,
            websiteUrl: "https://baskinrobbins.lk",
            couponCode: "BR25TUBS",
            expiryDate: "30th April 2026",
            terms: "Valid on 2L tub purchases only. Not valid on single scoop or cone orders. While stocks last. Available at all Baskin Robbins outlets island-wide.",
            availability2: "Daily 10.00 AM to 10.00 PM",
            description: "Treat yourself and your loved ones to large 2L tubs of your favorite Baskin Robbins flavors, now with a delightful 25% savings! Choose from over 100 flavors including Pralines 'n Cream, Mint Chocolate Chip, Jamoca Almond Fudge, and seasonal specials available only in Sri Lanka.",
            highlights: [
                "25% off on all 2L tub flavors",
                "100+ flavors to choose from",
                "Valid at all Baskin Robbins outlets"
            ],
            images: [
                "/assets/images/BR1.png",
                "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=800",
                "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=800"
            ],
            client: {
                name: "BASKIN ROBBINS",
                logo: "/assets/images/BaskinRobbinsLogo.png",
                rating: 4.9,
                totalDeals: 21,
                verified: true,
                websiteUrl: "https://baskinrobbins.lk",
                phone: "+94 11 234 9876"
            }
        },
        {
            id: "203",
            badge: "5% Off",
            name: "Dark Circle Remover Duo Offer",
            businessName: "Janet",
            businessLogo: "/assets/images/JanetLogo.png",
            category: "Health & Beauty",
            dealType: "SALE",
            currentPrice: 1400,
            originalPrice: 1590,
            discount: 12,
            rating: 4.6,
            reviewCount: 23,
            location: "Janet, Sri Lanka",
            availability: "In Stock",
            stockLeft: 35,
            totalStock: 100,
            sellingFast: false,
            websiteUrl: "https://janet.lk",
            couponCode: "JANEYES12",
            expiryDate: "15th May 2026",
            terms: "For external use only. Avoid direct contact with eyes. Perform a patch test before full application. Not suitable for children under 12.",
            availability2: "Available at all Janet outlets & online",
            description: "Janet's Dark Circle Remover Duo combines two powerful eye care products in one effective routine. The depuffing eye gel targets puffiness and reduces the appearance of bags while the brightening serum lightens dark circles and improves overall under-eye tone for a refreshed, well-rested look.",
            highlights: [
                "Clinically tested under-eye formula",
                "Reduces puffiness & dark circles in 4 weeks",
                "Suitable for all skin types"
            ],
            images: [
                "/assets/images/janet1.png",
                "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800",
                "https://images.unsplash.com/photo-1570194065650-d99fb4abbd90?w=800"
            ],
            client: {
                name: "JANET",
                logo: "/assets/images/JanetLogo.png",
                rating: 4.6,
                totalDeals: 9,
                verified: true,
                websiteUrl: "https://janet.lk",
                phone: "+94 11 222 3344"
            }
        },
        {
            id: "204",
            badge: "17% OFF",
            name: "Honors Discount Advance Purchase Pack",
            businessName: "Hilton",
            businessLogo: "/assets/images/HiltonLogo.png",
            category: "Hotel",
            dealType: "DISCOUNT",
            currentPrice: 30000,
            originalPrice: 36000,
            discount: 17,
            rating: 4.4,
            reviewCount: 35,
            location: "Colombo",
            availability: "Limited Availability",
            stockLeft: 5,
            totalStock: 20,
            sellingFast: true,
            websiteUrl: "https://hilton.com/srilanka",
            couponCode: "HLTNPRE17",
            expiryDate: "31st May 2026",
            terms: "Advance purchase required. Non-refundable booking. Subject to room availability. Valid for stays booked at least 14 days in advance. Hilton Honors membership required.",
            availability2: "Check-in from 3.00 PM, Check-out by 12.00 PM",
            description: "Experience unparalleled luxury at Hilton Colombo with our exclusive Honors Advance Purchase Package. Book your stay at least two weeks ahead and enjoy 17% savings plus complimentary breakfast for two, late check-out, and a welcome amenity prepared by our culinary team. Ideal for business travelers and leisure guests alike.",
            highlights: [
                "17% off standard room rates",
                "Complimentary breakfast for two included",
                "Late check-out until 2.00 PM"
            ],
            images: [
                "/assets/images/honersPack.png",
                "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800",
                "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800"
            ],
            client: {
                name: "HILTON COLOMBO",
                logo: "/assets/images/HiltonLogo.png",
                rating: 4.4,
                totalDeals: 6,
                verified: true,
                websiteUrl: "https://hilton.com/srilanka",
                phone: "+94 11 249 2492"
            }
        },
        {
            id: "205",
            badge: "50% OFF",
            name: "Gathered Long Sleeve Top - 280325",
            businessName: "GFlock",
            businessLogo: "/assets/images/GFLOCKLogo.png",
            category: "Fashion",
            dealType: "SALE",
            currentPrice: 2940,
            originalPrice: 5000,
            discount: 50,
            rating: 4.6,
            reviewCount: 23,
            location: "GFLOCK, Sri Lanka",
            availability: "In Stock",
            stockLeft: 18,
            totalStock: 50,
            sellingFast: true,
            websiteUrl: "https://gflock.com",
            couponCode: "GFLOCK50",
            expiryDate: "25th April 2026",
            terms: "Sale price applies to marked items only. No exchanges or returns on sale items. Available while stocks last. Not valid with any other promotion.",
            availability2: "Online & in-store daily",
            description: "Step up your wardrobe with GFlock's Gathered Long Sleeve Top – a versatile wardrobe staple perfect for both casual outings and semi-formal occasions. Made with premium breathable fabric featuring elegant gather detailing at the sleeves, this piece effortlessly combines comfort with style. Available in multiple colors.",
            highlights: [
                "Premium breathable fabric",
                "Elegant gathered sleeve detailing",
                "Available in 6 color options"
            ],
            images: [
                "/assets/images/gflock1.png",
                "https://images.unsplash.com/photo-1551163943-3f7fb896e0ce?w=800",
                "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=800"
            ],
            client: {
                name: "GFLOCK",
                logo: "/assets/images/GFLOCKLogo.png",
                rating: 4.6,
                totalDeals: 40,
                verified: true,
                websiteUrl: "https://gflock.com",
                phone: "+94 77 900 1234"
            }
        },
        {
            id: "206",
            badge: "50% OFF",
            name: "FLASH SALE ALERT!",
            businessName: "Pizza Hut",
            businessLogo: "/assets/images/PizzahutLogo.png",
            category: "Restaurant",
            dealType: "OFFER",
            currentPrice: 0,
            originalPrice: 0,
            discount: 50,
            rating: 4.9,
            reviewCount: 45,
            location: "Pizza Hut, Sri Lanka",
            availability: "In Stock",
            stockLeft: 100,
            totalStock: 500,
            sellingFast: true,
            websiteUrl: "https://pizzahut.lk",
            couponCode: "PHFLASH50",
            expiryDate: "Today Only",
            terms: "Valid 3PM–6PM only. Applies to regular menu items. Not applicable on already-discounted combos, delivery charges, or beverages. Dine-in and takeaway only.",
            availability2: "Flash Sale: Daily 3.00 PM to 6.00 PM",
            description: "Pizza Hut's legendary Flash Sale is back – and bigger than ever! Get 50% OFF on ANY item from our menu between 3PM and 6PM TODAY only. From our signature Pan Pizzas to cheesy pastas and loaded sides, everything qualifies. Grab your favorites at half the price before the clock runs out!",
            highlights: [
                "50% off ANY menu item – 3PM to 6PM",
                "Applies to dine-in and takeaway orders",
                "Valid island-wide at all Pizza Hut outlets"
            ],
            images: [
                "/assets/images/pizzahut1.png",
                "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800",
                "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800"
            ],
            client: {
                name: "PIZZA HUT",
                logo: "/assets/images/PizzahutLogo.png",
                rating: 4.9,
                totalDeals: 28,
                verified: true,
                websiteUrl: "https://pizzahut.lk",
                phone: "+94 11 777 4444"
            }
        },

        // ── Trending Deals (301–306) ──
        {
            id: "301",
            badge: "Trending",
            name: "NEW YEAR CHICKEN COMBO",
            businessName: "KFC",
            businessLogo: "/assets/images/KFCLogo.png",
            category: "Restaurant",
            dealType: "OFFER",
            currentPrice: 3990,
            originalPrice: 5200,
            discount: 23,
            rating: 4.1,
            reviewCount: 6,
            location: "KFC, Sri Lanka",
            availability: "In Stock",
            stockLeft: 40,
            totalStock: 150,
            sellingFast: false,
            websiteUrl: "https://kfc.lk",
            couponCode: "KFCNY2026",
            expiryDate: "30th April 2026",
            terms: "Combo offer valid at all KFC locations island-wide. Cannot be split. Not valid with other promotions. One redemption per receipt.",
            availability2: "Daily 10.00 AM to 11.00 PM",
            description: "Celebrate in style with KFC's New Year Chicken Combo! This generously packed combo includes 06 pieces of Hot & Crispy Chicken, 06 pieces of Kochchi Bites, 08 pieces of Hot Drumlets, and a refreshing Pepsi 1.5L – everything you need to party with your crew at the most unbeatable price.",
            highlights: [
                "06 pcs Hot & Crispy + 06 Kochchi Bites + 08 Drumlets",
                "Comes with Pepsi 1.5L",
                "Great for sharing with family & friends"
            ],
            images: [
                "/assets/images/KFC2.png",
                "https://images.unsplash.com/photo-1562802378-063ec186a863?w=800",
                "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=800"
            ],
            client: {
                name: "KFC SRI LANKA",
                logo: "/assets/images/KFCLogo.png",
                rating: 4.8,
                totalDeals: 25,
                verified: true,
                websiteUrl: "https://kfc.lk",
                phone: "+94 11 500 0522"
            }
        },
        {
            id: "302",
            badge: "10% OFF",
            name: "Enjoy 10% off on Jagro fresh & frozen strawberries",
            businessName: "Cargills Food City",
            businessLogo: "/assets/images/cargillsLogo.png",
            category: "Groceries",
            dealType: "OFFER",
            currentPrice: 0,
            originalPrice: 0,
            discount: 10,
            rating: 4.0,
            reviewCount: 10,
            location: "Cargills Food City, Sri Lanka",
            availability: "In Stock",
            stockLeft: 200,
            totalStock: 500,
            sellingFast: false,
            websiteUrl: "https://cargillsfoodcity.lk",
            couponCode: "CFCSTRAW10",
            expiryDate: "20th April 2026",
            terms: "Offer applies to Jagro brand fresh and frozen strawberries only. Valid at all Cargills Food City outlets. While stocks last. Cannot be combined with other promotions.",
            availability2: "Daily 8.00 AM to 10.00 PM",
            description: "Fresh from the farm to your table! Enjoy a delicious 10% discount on Jagro's freshly sourced and flash-frozen strawberries at all Cargills Food City outlets. Perfect for smoothies, desserts, jams, and fresh snacking. Jagro strawberries are locally grown in Nuwara Eliya using sustainable farming practices.",
            highlights: [
                "Locally grown in Nuwara Eliya – 100% Sri Lankan",
                "Flash-frozen to lock in maximum freshness",
                "Available in fresh & frozen variants"
            ],
            images: [
                "/assets/images/cargills1.png",
                "https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?w=800",
                "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=800"
            ],
            client: {
                name: "CARGILLS FOOD CITY",
                logo: "/assets/images/cargillsLogo.png",
                rating: 4.0,
                totalDeals: 35,
                verified: true,
                websiteUrl: "https://cargillsfoodcity.lk",
                phone: "+94 11 234 2222"
            }
        },
        {
            id: "303",
            badge: "20% OFF",
            name: "The Best Korean Skin Care Products Offer",
            businessName: "Cosmetics.lk",
            businessLogo: "/assets/images/Cosmetics.png",
            category: "Health & Beauty",
            dealType: "OFFER",
            currentPrice: 0,
            originalPrice: 0,
            discount: 20,
            rating: 4.5,
            reviewCount: 12,
            location: "Cosmetics.lk",
            availability: "In Stock",
            stockLeft: 60,
            totalStock: 200,
            sellingFast: false,
            websiteUrl: "https://cosmetics.lk",
            couponCode: "KBEAUTY20",
            expiryDate: "30th May 2026",
            terms: "Offer valid on selected K-Beauty product range. Applies to total bill. Not valid on already-discounted items or gift sets. Online and in-store.",
            availability2: "Online: 24/7 | Store: Mon–Sat 9AM–8PM",
            description: "Elevate your skincare routine with authentic Korean beauty products exclusively available at Cosmetics.lk! Enjoy 20% off our curated K-Beauty collection featuring top brands like COSRX, Innisfree, Etude House, and more. From glass-skin serums and hydrating toners to SPF moisturizers and sheet masks – build your perfect 10-step K-Beauty routine at unbeatable prices.",
            highlights: [
                "Authentic K-Beauty brands – COSRX, Innisfree & more",
                "Suitable for all skin types including sensitive skin",
                "Dermatologist-tested & cruelty-free formulas"
            ],
            images: [
                "/assets/images/Skin1.png",
                "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800",
                "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800"
            ],
            client: {
                name: "COSMETICS.LK",
                logo: "/assets/images/Cosmetics.png",
                rating: 4.5,
                totalDeals: 19,
                verified: true,
                websiteUrl: "https://cosmetics.lk",
                phone: "+94 77 445 6677"
            }
        },
        {
            id: "304",
            badge: "50% OFF",
            name: "Barista COFFEE RUSH is back!",
            businessName: "Barista",
            businessLogo: "/assets/images/BaristaLogo.png",
            category: "Restaurant",
            dealType: "OFFER",
            currentPrice: 0,
            originalPrice: 0,
            discount: 50,
            rating: 4.6,
            reviewCount: 43,
            location: "Barista, Sri Lanka",
            availability: "In Stock",
            stockLeft: 80,
            totalStock: 300,
            sellingFast: true,
            websiteUrl: "https://barista.lk",
            couponCode: "COFFEERUSH",
            expiryDate: "15th April 2026",
            terms: "Valid on selected Lavazza coffee beverages only. Not valid on food items, pastries, or merchandise. One offer per customer per visit. Valid at all Barista outlets island-wide.",
            availability2: "Daily 7.00 AM to 10.00 PM",
            description: "Fuel your day with Barista's legendary Coffee Rush offer – now giving you 50% OFF on your favorite Lavazza coffee beverages! Whether you're a classic Lungo lover, a creamy Cappuccino fan, or an iced Americano devotee, Barista has the perfect cup for you. Premium Italian Lavazza coffee, expertly brewed, at half the price.",
            highlights: [
                "50% off on selected Lavazza coffee beverages",
                "Artisan brewing by certified baristas",
                "Valid at all Barista outlets island-wide"
            ],
            images: [
                "/assets/images/barista1.png",
                "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800",
                "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800"
            ],
            client: {
                name: "BARISTA",
                logo: "/assets/images/BaristaLogo.png",
                rating: 4.6,
                totalDeals: 17,
                verified: true,
                websiteUrl: "https://barista.lk",
                phone: "+94 11 555 6677"
            }
        },
        {
            id: "305",
            badge: "OFFER",
            name: "Our 4 Pizzas just for Rs.999 Pizza Mania offer",
            businessName: "Domino's Pizza",
            businessLogo: "/assets/images/DominosLogo.png",
            category: "Restaurant",
            dealType: "OFFER",
            currentPrice: 999,
            originalPrice: 2400,
            discount: 58,
            rating: 4.4,
            reviewCount: 20,
            location: "Domino's Pizza, Sri Lanka",
            availability: "In Stock",
            stockLeft: 60,
            totalStock: 200,
            sellingFast: true,
            websiteUrl: "https://dominos.lk",
            couponCode: "PIZZA999",
            expiryDate: "30th April 2026",
            terms: "Valid on Pizza Mania personal-size pizzas only. Available Monday–Thursday. Cannot be combined with other offers or promotions. Dine-in and delivery orders accepted.",
            availability2: "Mon–Thu: 11.00 AM to 11.00 PM",
            description: "Pizza lovers, this is your dream deal! Domino's iconic Pizza Mania offer lets you pick any 4 personal-size pizzas for just Rs.999! Choose your favorites from our classic range – Pepperoni Passion, Veggie Supreme, Chicken Dominator, BBQ Chicken & more. All fresh-baked with our premium hand-tossed dough and premium cheese. Best value in Sri Lanka!",
            highlights: [
                "Any 4 personal pizzas for just Rs.999",
                "Choose from 10+ pizza varieties",
                "Fresh-baked with premium ingredients"
            ],
            images: [
                "/assets/images/dominosPizza1.png",
                "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800",
                "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800"
            ],
            client: {
                name: "DOMINO'S PIZZA",
                logo: "/assets/images/DominosLogo.png",
                rating: 4.4,
                totalDeals: 22,
                verified: true,
                websiteUrl: "https://dominos.lk",
                phone: "+94 11 011 0011"
            }
        },
        {
            id: "306",
            badge: "SALE",
            name: "TCL 55\" 4K UHD Google TV - TCL55P6K",
            businessName: "SINGER",
            businessLogo: "/assets/images/SingerLogo.png",
            category: "Electronics",
            dealType: "SALE",
            currentPrice: 179999,
            originalPrice: 199999,
            discount: 10,
            rating: 4.5,
            reviewCount: 15,
            location: "SINGER, Sri Lanka",
            availability: "In Stock",
            stockLeft: 7,
            totalStock: 20,
            sellingFast: true,
            websiteUrl: "https://singersl.com",
            couponCode: "SINGER4KTV",
            expiryDate: "20th April 2026",
            terms: "Offer valid at all Singer showrooms island-wide and singersl.com. Subject to stock availability. Standard warranty terms apply. Finance options available.",
            availability2: "Mon–Sat: 9.00 AM to 7.00 PM | Sun: 10.00 AM to 5.00 PM",
            description: "Bring the cinema home with the TCL 55\" 4K UHD Google TV (TCL55P6K)! Featuring a stunning 4K Ultra HD VA display, built-in Google TV OS with access to Netflix, YouTube, Prime Video & 700,000+ apps, Dolby Audio, and AiPQ Engine for intelligent picture processing. Control it with your voice via Google Assistant. A complete smart entertainment experience.",
            highlights: [
                "55\" 4K UHD VA Display with Dolby Vision",
                "Built-in Google TV – 700,000+ apps",
                "Voice control with Google Assistant"
            ],
            images: [
                "/assets/images/tv1.png",
                "https://images.unsplash.com/photo-1593359677879-a4bb92f4834?w=800",
                "https://images.unsplash.com/photo-1601944179066-29786cb9d32a?w=800"
            ],
            client: {
                name: "SINGER SRI LANKA",
                logo: "/assets/images/SingerLogo.png",
                rating: 4.5,
                totalDeals: 55,
                verified: true,
                websiteUrl: "https://singersl.com",
                phone: "+94 11 231 7100"
            }
        },

        // ── Abans Deals (401–406) ──
        {
            id: "401",
            badge: "27% OFF",
            name: "Abans Steam Iron Ceramic Coated - 2200W",
            businessName: "Abans",
            businessLogo: "/assets/images/abansLogo2.png",
            category: "Electronics",
            dealType: "SALE",
            currentPrice: 7990,
            originalPrice: 10990,
            discount: 27,
            rating: 4.0,
            reviewCount: 1,
            location: "Abans, Sri Lanka",
            availability: "In Stock",
            stockLeft: 20,
            totalStock: 50,
            sellingFast: false,
            websiteUrl: "https://abans.lk",
            couponCode: "ABSIRN27",
            expiryDate: "15th May 2026",
            terms: "Valid at all Abans showrooms and online. Standard warranty of 1 year applies. No returns once item is opened.",
            availability2: "Mon–Sat: 9.00 AM to 7.00 PM",
            description: "Achieve perfectly crisp clothes with the Abans 2200W Steam Iron featuring a premium ceramic-coated soleplate for smooth gliding over all fabric types. The powerful steam burst function tackles stubborn creases effortlessly while the anti-calc system prevents mineral buildup, ensuring long-lasting performance.",
            highlights: [
                "2200W powerful steam output",
                "Ceramic-coated soleplate for smooth gliding",
                "Anti-calc system for longevity"
            ],
            images: [
                "/assets/images/abans1.png",
                "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
                "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=800"
            ],
            client: {
                name: "ABANS",
                logo: "/assets/images/abansLogo2.png",
                rating: 4.3,
                totalDeals: 48,
                verified: true,
                websiteUrl: "https://abans.lk",
                phone: "+94 11 264 2020"
            }
        },
        {
            id: "402",
            badge: "19% OFF",
            name: "Abans High Pressure Washer - Maximum up to 130A",
            businessName: "Abans",
            businessLogo: "/assets/images/abansLogo2.png",
            category: "Electronics",
            dealType: "SALE",
            currentPrice: 24990,
            originalPrice: 30990,
            discount: 19,
            rating: 4.3,
            reviewCount: 4,
            location: "Abans, Sri Lanka",
            availability: "In Stock",
            stockLeft: 12,
            totalStock: 30,
            sellingFast: false,
            websiteUrl: "https://abans.lk",
            couponCode: "ABSPWASH19",
            expiryDate: "30th April 2026",
            terms: "Valid at all Abans showrooms and online. Includes standard 1-year warranty. Professional installation service available at extra cost.",
            availability2: "Mon–Sat: 9.00 AM to 7.00 PM",
            description: "Keep your vehicle and garden spotless with the Abans High Pressure Washer delivering up to 130 bar pressure! Perfect for washing cars, motorcycles, garden paths, driveways, and outdoor furniture. Features an ergonomic gun design, high-quality hose, and multiple nozzle attachments for versatile cleaning power.",
            highlights: [
                "High pressure up to 130 bar",
                "Multiple nozzle attachments included",
                "Suitable for cars, garden & outdoor use"
            ],
            images: [
                "/assets/images/abans2.png",
                "https://images.unsplash.com/photo-1511193311914-0346f16efe90?w=800",
                "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800"
            ],
            client: {
                name: "ABANS",
                logo: "/assets/images/abansLogo2.png",
                rating: 4.3,
                totalDeals: 48,
                verified: true,
                websiteUrl: "https://abans.lk",
                phone: "+94 11 264 2020"
            }
        },
        {
            id: "403",
            badge: "19% OFF",
            name: "Abans 12000BTU Air Conditioner R32 Fixed Speed Anti-Corrosion",
            businessName: "Abans",
            businessLogo: "/assets/images/abansLogo2.png",
            category: "Electronics",
            dealType: "SALE",
            currentPrice: 169990,
            originalPrice: 209990,
            discount: 19,
            rating: 4.1,
            reviewCount: 12,
            location: "Abans, Sri Lanka",
            availability: "In Stock",
            stockLeft: 6,
            totalStock: 20,
            sellingFast: true,
            websiteUrl: "https://abans.lk",
            couponCode: "ABSAC12K19",
            expiryDate: "31st May 2026",
            terms: "Price includes unit only. Installation charges apply. Valid at all Abans showrooms and online. 2-year factory warranty. R32 refrigerant – environmentally friendly.",
            availability2: "Mon–Sat: 9.00 AM to 7.00 PM",
            description: "Stay cool all year round with the Abans 12000BTU R32 Fixed Speed Air Conditioner featuring advanced anti-corrosion technology for the coastal climate of Sri Lanka. The R32 refrigerant is eco-friendly and energy-efficient, while the anti-corrosion coating ensures superior durability even in high-humidity environments.",
            highlights: [
                "Anti-corrosion coating for coastal climates",
                "Eco-friendly R32 refrigerant",
                "2-year manufacturer warranty"
            ],
            images: [
                "/assets/images/abans3.png",
                "https://images.unsplash.com/photo-1631567091069-bab2d9ec2d55?w=800",
                "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800"
            ],
            client: {
                name: "ABANS",
                logo: "/assets/images/abansLogo2.png",
                rating: 4.3,
                totalDeals: 48,
                verified: true,
                websiteUrl: "https://abans.lk",
                phone: "+94 11 264 2020"
            }
        },
        {
            id: "404",
            badge: "33% OFF",
            name: "Haier 598L Side By Side Triple Door Inverter Refrigerator",
            businessName: "Abans",
            businessLogo: "/assets/images/abansLogo2.png",
            category: "Electronics",
            dealType: "SALE",
            currentPrice: 399990,
            originalPrice: 599990,
            discount: 33,
            rating: 4.3,
            reviewCount: 5,
            location: "Abans, Sri Lanka",
            availability: "In Stock",
            stockLeft: 3,
            totalStock: 10,
            sellingFast: true,
            websiteUrl: "https://abans.lk",
            couponCode: "HAIER33",
            expiryDate: "30th April 2026",
            terms: "Valid at all Abans showrooms. Standard 2-year manufacturer warranty applies. Delivery and installation charges may apply. Subject to stock availability.",
            availability2: "Mon–Sat: 9.00 AM to 7.00 PM",
            description: "Upgrade your kitchen with the Haier 598L Side-by-Side Triple Door Inverter Refrigerator – the ultimate storage solution for large families. Featuring advanced inverter compressor technology for energy savings, a twin-cooling system to maintain optimal humidity, a spacious triple-door design with dedicated zones for fresh food, frozen items, and beverages.",
            highlights: [
                "598L large capacity – perfect for big families",
                "Inverter compressor for energy efficiency",
                "Twin cooling system for optimal freshness"
            ],
            images: [
                "/assets/images/abans4.png",
                "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=800",
                "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=800"
            ],
            client: {
                name: "ABANS",
                logo: "/assets/images/abansLogo2.png",
                rating: 4.3,
                totalDeals: 48,
                verified: true,
                websiteUrl: "https://abans.lk",
                phone: "+94 11 264 2020"
            }
        },
        {
            id: "405",
            badge: "37% OFF",
            name: "Abans Blender with Grinder 1.5L - Black",
            businessName: "Abans",
            businessLogo: "/assets/images/abansLogo2.png",
            category: "Electronics",
            dealType: "SALE",
            currentPrice: 9990,
            originalPrice: 15990,
            discount: 37,
            rating: 4.6,
            reviewCount: 11,
            location: "Abans, Sri Lanka",
            availability: "In Stock",
            stockLeft: 25,
            totalStock: 60,
            sellingFast: false,
            websiteUrl: "https://abans.lk",
            couponCode: "ABSBLEND37",
            expiryDate: "15th May 2026",
            terms: "Valid at all Abans showrooms and online. 1-year warranty on motor. Blade sharpness warranty: 6 months.",
            availability2: "Available in-store & online",
            description: "Make your kitchen smarter with the Abans 1.5L Blender with Grinder! Featuring powerful stainless-steel blades, a high-torque motor, and a durable BPA-free 1.5L jar, this versatile appliance handles smoothies, milkshakes, juices, chutneys, and dry grinding with ease. Compact, quiet, and built to last – the perfect kitchen companion.",
            highlights: [
                "Powerful motor with stainless-steel blades",
                "1.5L BPA-free jar",
                "Dual function – blender & dry grinder"
            ],
            images: [
                "/assets/images/abans5.png",
                "https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=800",
                "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800"
            ],
            client: {
                name: "ABANS",
                logo: "/assets/images/abansLogo2.png",
                rating: 4.3,
                totalDeals: 48,
                verified: true,
                websiteUrl: "https://abans.lk",
                phone: "+94 11 264 2020"
            }
        },
        {
            id: "406",
            badge: "11% OFF",
            name: "Mibro C4 Square HD Screen Smart Watch (Gray)",
            businessName: "Abans",
            businessLogo: "/assets/images/abansLogo2.png",
            category: "Electronics",
            dealType: "SALE",
            currentPrice: 15999,
            originalPrice: 17999,
            discount: 11,
            rating: 4.6,
            reviewCount: 41,
            location: "Abans, Sri Lanka",
            availability: "In Stock",
            stockLeft: 14,
            totalStock: 40,
            sellingFast: false,
            websiteUrl: "https://abans.lk",
            couponCode: "MIBRO11",
            expiryDate: "31st May 2026",
            terms: "Valid at all Abans showrooms and online. 1-year manufacturer warranty. Water-resistant – not waterproof. Compatible with Android 5.0+ and iOS 10+.",
            availability2: "Available in-store & online",
            description: "Track your fitness and stay connected in style with the Mibro C4 Square HD Screen Smartwatch! Featuring a vibrant 1.96\" HD square display, 100+ sports modes, 24-hour heart rate monitoring, SpO2 blood oxygen tracking, sleep analysis, and 10-day battery life. Its sleek aluminum alloy case and interchangeable silicone straps make it perfect for everyday wear.",
            highlights: [
                "1.96\" HD square display with 370 mAh battery",
                "100+ sports modes & health monitoring",
                "Compatible with iOS & Android"
            ],
            images: [
                "/assets/images/abans6.png",
                "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800",
                "https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=800"
            ],
            client: {
                name: "ABANS",
                logo: "/assets/images/abansLogo2.png",
                rating: 4.3,
                totalDeals: 48,
                verified: true,
                websiteUrl: "https://abans.lk",
                phone: "+94 11 264 2020"
            }
        }
    ];

    useEffect(() => {
        const fetchDealData = () => {
            setLoading(true);
            const storedDeals = JSON.parse(localStorage.getItem('hodama_all_deals_v1') || '[]');
            const found = storedDeals.find(d => d.id.toString() === id.toString()) || staticDeals.find(d => d.id.toString() === id.toString());

            if (found) {
                // Map storage format to detail page format
                const mapped = {
                    ...found,
                    businessName: found.storeName || found.businessName,
                    businessLogo: found.storeImg || found.businessLogo,
                    currentPrice: parseFloat(found.price?.toString().replace(/[^0-9.]/g, '') || found.currentPrice || '0'),
                    originalPrice: parseFloat(found.oldPrice?.toString().replace(/[^0-9.]/g, '') || found.originalPrice || found.currentPrice || '0'),
                    images: found.images || [found.img || found.image],
                    discount: found.discount || (found.badge?.includes('%') ? parseInt(found.badge) : 0),
                    availability: found.availability || found.status || 'Active',
                    reviewCount: found.ratingCount || found.reviews || 0,
                    client: found.client || {
                        name: found.storeName || "Premium Partner",
                        logo: found.storeImg || "/assets/images/placeholder_logo.png",
                        rating: 5.0,
                        verified: true,
                        websiteUrl: found.websiteUrl,
                        phone: found.businessPhone || "+94 11 000 0000"
                    }
                };
                setDeal(mapped);
            }
            setLoading(false);
        };
        fetchDealData();
    }, [id]);

    // Other deals from this client (simulated)
    const otherDeals = useMemo(() => {
        if (!deal) return [];
        const storedDeals = JSON.parse(localStorage.getItem('hodama_all_deals_v1') || '[]');
        const allPool = [...storedDeals, ...staticDeals];
        
        return allPool
            .filter(d => {
                const isSameStore = (d.storeName === deal.businessName) || (d.businessName === deal.businessName);
                const isDifferentDeal = d.id.toString() !== deal.id.toString();
                return isSameStore && isDifferentDeal;
            })
            .slice(0, 4);
    }, [deal, staticDeals]);

    useEffect(() => {
        // Track unique deal exploration for Profile Stats
        const trackExploration = () => {
            const viewedDeals = JSON.parse(localStorage.getItem('hd_viewed_deal_ids') || '[]');
            if (!viewedDeals.includes(id)) {
                const newViewed = [...viewedDeals, id];
                localStorage.setItem('hd_viewed_deal_ids', JSON.stringify(newViewed));
                localStorage.setItem('hd_deals_explored_count', newViewed.length.toString());
            }
        };
        if (id) trackExploration();

        const handleScroll = () => setShowStickyBar(window.scrollY > 500);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [id]);

    const handleCopyCoupon = () => {
        if (!deal) return;
        navigator.clipboard.writeText(deal.couponCode);
        setCodeCopied(true);
        setTimeout(() => setCodeCopied(false), 2000);
    };

    const stockPct = deal ? ((deal.stockLeft || 0) / (deal.totalStock || 1)) * 100 : 0;

    let catColor = '#be123c'; 
    let catIcon = Tag; 
    if (deal && deal.category) {
        const catList = deal.category.toLowerCase();
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
            catColor = '#be185d';
            catIcon = "/assets/images/Health&Beauty.png";
        }
    }
    return (
        <div className="dd-page">
            <div className="container">

                {/* ── BACK BUTTON ── */}
                <div style={{ marginBottom: '24px' }}>
                    <button onClick={() => fromManage ? navigate('/client/manage-deals') : navigate(-1)} className="back-btn-square" style={{ backgroundColor: 'transparent' }}>
                        <div className="back-btn-circle-inner">
                            <ArrowLeft size={16} strokeWidth={3} />
                        </div>
                    </button>
                </div>

                {!deal && !loading && (
                    <div className="dd-error-state">
                        <AlertCircle size={48} color="#ef4444" />
                        <h2>Deal Not Found</h2>
                        <p>The deal you're looking for may have expired or been removed.</p>
                        <button className="dd-btn-primary" onClick={() => navigate('/deals')}>Browse All Deals</button>
                    </div>
                )}

                {loading ? (
                    <div className="dd-loading-state">
                        <div className="dd-loader"></div>
                        <p>Loading deal details...</p>
                    </div>
                ) : deal && (
                    <>

                {/* ── MAIN 2-COLUMN LAYOUT ── */}
                <div className="dd-main">

                    {/* LEFT: Image Gallery */}
                    <div className="dd-gallery">
                        <div className="dd-gallery-inner">
                            <div className="dd-main-img-wrap">
                                <img src={deal.images[activeImg]} alt={deal.name} className="dd-main-img" />
                            </div>
                            <div className="dd-thumbs">
                                {deal.images.map((img, i) => (
                                    <div
                                        key={i}
                                        className={`dd-thumb ${activeImg === i ? 'active' : ''}`}
                                        onClick={() => setActiveImg(i)}
                                    >
                                        <img src={img} alt={`Thumb ${i}`} />
                                    </div>
                                ))}
                            </div>
                            
                            <div className="dd-carousel-dots">
                                {deal.images.map((img, i) => (
                                    <span 
                                        key={`dot-${i}`} 
                                        className={`dd-dot ${activeImg === i ? 'active' : ''}`}
                                        onClick={() => setActiveImg(i)}
                                    ></span>
                                ))}
                            </div>

                            <div className="dd-quantity-container">
                                <span className="dd-qty-label">Quantity :</span>
                                <div className="dd-qty-selector">
                                    <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="dd-qty-btn">-</button>
                                    <span className="dd-qty-value">{quantity}</span>
                                    <button onClick={() => setQuantity(q => q + 1)} className="dd-qty-btn">+</button>
                                </div>
                            </div>
                            
                            <div className="dd-ticket-discount">
                                <span>{deal.badge ? deal.badge.toUpperCase() : `${deal.discount} % OFF`}</span>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: Deal Info */}
                    <div className="dd-info-card">
                        {/* Top Badge */}
                        <div className="dd-top-badge-row mb-4">
                            <span className="dd-top-badge">
                                {deal.dealType || 'SALE'}
                            </span>
                        </div>

                        <h1 className="dd-title">
                            {deal.name}
                        </h1>

                        <div className="dd-biz-name-box flex items-center gap-3 mb-6">
                            <img src={deal.client?.logo || deal.businessLogo} alt="Logo" className="dd-biz-small-logo" />
                            <span>{deal.businessName}</span>
                        </div>

                        <div className="dd-meta-row flex justify-between items-center mb-6">
                            <div className="dd-category-pill flex items-center gap-2">
                                <div className="dd-cat-icon-circle flex items-center justify-center rounded-full" style={{ backgroundColor: catColor, width: 28, height: 28 }}>
                                    {typeof catIcon === 'string' ? <img src={catIcon} alt="Cat" style={{ width: 14 }} /> : <Tag size={14} color="#fff" />}
                                </div>
                                <span style={{ color: catColor, fontWeight: 800, fontSize: '15px' }}>{deal.category}</span>
                            </div>
                            <div className="dd-rating-box flex items-center gap-2">
                                <Star size={18} fill="#f8c205" color="#f8c205" />
                                <span className="dd-rating-num">{parseFloat(deal.rating || 5.0).toFixed(1)}</span>
                                <span className="dd-reviews">({deal.reviewCount || 18} Reviews)</span>
                            </div>
                        </div>

                        <div className="dd-price-row flex justify-between items-center mb-6">
                            <div className="dd-price-left flex items-center gap-4">
                                <span className="dd-current-price">LKR {deal.currentPrice.toLocaleString()}</span>
                                {deal.originalPrice > 0 && <span className="dd-old-price">LKR {deal.originalPrice.toLocaleString()}</span>}
                            </div>
                            <div className="dd-location-box flex items-center gap-1">
                                <MapPin size={16} color="#64748b" /> 
                                <span>{deal.location}</span>
                            </div>
                        </div>

                        {/* Stock Progress Box (Optional) */}
                        {deal.totalStock > 0 && deal.stockLeft > 0 && (
                            <div className={`dd-stock-box ${deal.stockLeft < 10 ? 'low-stock-alert' : ''}`} style={deal.stockLeft < 10 ? { borderColor: '#fecaca', backgroundColor: '#fff5f5' } : {}}>
                                <div className="dd-urgency-row flex justify-between items-center mb-3">
                                    <div className="dd-urgency-badge flex items-center gap-2" style={{ color: deal.stockLeft < 10 ? '#dc2626' : '#143ae6' }}>
                                        <Flame size={16} fill={deal.stockLeft < 10 ? '#dc2626' : '#143ae6'} color={deal.stockLeft < 10 ? '#dc2626' : '#143ae6'} /> Selling fast!
                                    </div>
                                    <span className="dd-in-stock-label" style={{ color: deal.stockLeft < 10 ? '#dc2626' : '#143ae6', borderColor: deal.stockLeft < 10 ? '#fca5a5' : '#cce0ff', backgroundColor: deal.stockLeft < 10 ? '#fef2f2' : '#f0f4ff' }}>IN STOCK</span>
                                    <span className="dd-stock-left-label" style={{ color: deal.stockLeft < 10 ? '#dc2626' : '#071356', fontWeight: deal.stockLeft < 10 ? '700' : '600' }}>Only {deal.stockLeft} items left</span>
                                </div>
                                <div className="dd-stock-bar" style={{ backgroundColor: deal.stockLeft < 10 ? '#fee2e2' : '#e2e8f0' }}>
                                    <div className="dd-stock-fill" style={{ width: `${stockPct}%`, backgroundColor: deal.stockLeft < 10 ? '#dc2626' : '#143ae6' }} />
                                </div>
                            </div>
                        )}

                        {/* Deal Details Box */}
                        <div className="dd-details-inner-card">
                            <h4 className="dd-details-title-sm">Deal Details</h4>
                            
                            <div className="dd-detail-grid-row flex items-start gap-4 mb-4 pb-4">
                                <div className="dd-detail-icon-wrap"><img src="/assets/images/expiryOn.png" alt="icon" style={{width: '32px'}}/></div>
                                <div className="dd-detail-text">
                                    <span className="dd-detail-label-inline">Expires On:</span>
                                    <span className="dd-detail-val-inline">{deal.expiryDate}</span>
                                </div>
                            </div>

                            <div className="dd-detail-grid-row flex items-start gap-4 mb-4 pb-4">
                                <div className="dd-detail-icon-wrap"><img src="/assets/images/terms.png" alt="icon" style={{width: '32px'}}/></div>
                                <div className="dd-detail-text">
                                    <span className="dd-detail-label-inline">Terms:</span>
                                    <span className="dd-detail-val-inline">{deal.terms}</span>
                                </div>
                            </div>

                            <div className="dd-detail-grid-row flex items-start gap-4">
                                <div className="dd-detail-icon-wrap"><img src="/assets/images/available.png" alt="icon" style={{width: '32px'}}/></div>
                                <div className="dd-detail-text">
                                    <span className="dd-detail-label-inline">Available:</span>
                                    <span className="dd-detail-val-inline">{deal.availability2}</span>
                                </div>
                            </div>
                        </div>

                        {/* CTA Buttons */}
                        <div className="dd-actions flex gap-4 mt-6">
                            <button
                                className="dd-btn-visit flex-1 flex items-center justify-center"
                                onClick={() => handleGrabDeal(deal.websiteUrl)}
                            >
                                Visit Website
                            </button>
                            <button
                                className={`dd-btn-wishlist-action flex-1 flex items-center justify-center gap-2 ${isInWishlist(deal.id) ? 'active' : ''}`}
                                onClick={() => toggleWishlist(deal)}
                            >
                                <Heart size={24} className="dd-btn-heart" fill={isInWishlist(deal.id) ? "currentColor" : "none"} />
                                {isInWishlist(deal.id) ? 'Saved to Wishlist' : 'Add to Wishlist'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* ── BOTTOM 2-COLUMN ── */}
                <div className="dd-lower">
                    {/* LEFT: Description */}
                    <div className="dd-description-col">
                        <div className="dd-desc-box">
                            <div className="dd-desc-header">
                                <CheckCircle size={22} className="dd-green-icon" />
                                <h3>Deal Description</h3>
                            </div>
                            <div className="dd-desc-text">
                                {(deal.description || "").split('\n').map((line, idx) => (
                                    <React.Fragment key={idx}>
                                        {line}
                                        <br />
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: Client Card */}
                    <div className="dd-client-col">
                        <div className="dd-client-card">
                            <h4 className="dd-client-card-title">About Website</h4>
                            <div className="dd-client-profile-box">
                                <img src={deal.client?.logo || deal.businessLogo} alt={deal.client?.name || deal.businessName} className="dd-client-logo-lg" />
                                <div className="dd-client-title-row">
                                    <h4 className="dd-client-name-lg">{deal.client?.name || deal.businessName}</h4>
                                </div>
                                <div className="dd-client-rating-star">
                                    <Star size={14} fill="#f8c205" color="#f8c205" />
                                    <span>{parseFloat(deal.rating || 5.0).toFixed(1)}</span>
                                </div>
                            </div>
                            <p className="dd-client-desc">
                                <strong>{deal.client?.name || deal.businessName}</strong> is a luxury Ayurvedic wellness brand from Sri Lanka, inspired by the island's rich heritage of natural healing and beauty rituals. The brand combines traditional Ayurvedic practices with modern formulations to create high quality skincare, body care, and wellness products.
                            </p>
                            <button
                                className="dd-btn-visit-client"
                                onClick={() => handleGrabDeal(deal.websiteUrl)}
                            >
                                Visit Website
                            </button>
                        </div>
                    </div>
                </div>

                {/* ── OTHER DEALS FROM THIS CLIENT ── */}
                <div className="dd-other-deals-section">
                    <div className="dd-section-header-row">
                        <h2>Other Deals in {deal.client?.name || deal.businessName}</h2>
                        <button className="dd-btn-view-all" onClick={() => navigate('/deals')}>
                            View All
                        </button>
                    </div>
                    <div className="dd-other-grid">
                        {otherDeals.length > 0 ? (
                            otherDeals.map(item => (
                                <DesignCard key={item.id} deal={item} />
                            ))
                        ) : (
                            <p style={{ color: '#64748b', fontSize: '15px' }}>No other deals from this store yet.</p>
                        )}
                    </div>
                </div>

                </>
                )}
            </div>

            {/* ── STICKY BAR ── */}
            {deal && (
                <div className={`dd-sticky ${showStickyBar ? 'visible' : ''}`}>
                    <div className="container dd-sticky-inner">
                        <div className="dd-sticky-left">
                            <img src={deal.images[0]} alt="Deal" />
                            <div>
                                <p className="dd-sticky-name">{deal.name}</p>
                                <span className="dd-sticky-price">
                                    {deal.currentPrice > 0 ? `LKR ${deal.currentPrice.toLocaleString()}` : `Total Bill: ${deal.discount}% OFF`}
                                </span>
                            </div>
                        </div>
                        <a href={deal.websiteUrl} target="_blank" rel="noopener noreferrer" className="dd-sticky-btn" onClick={() => handleGrabDeal()}>
                            <Globe size={16} /> Grab Deal
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DealsDetail;
