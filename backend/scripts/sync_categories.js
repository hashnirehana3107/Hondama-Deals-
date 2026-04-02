const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env
dotenv.config({ path: path.join(__dirname, '../.env') });

const Category = require('../models/Category');
const connectDB = require('../config/db');

const categoriesToSync = [
    {
        name: "Restaurant",
        color: "#c2410c",
        icon: "/assets/images/Restaurant.png",
        image: "/assets/images/RestaurantCat.png",
        badge: "DINE & TASTE",
        subtitle: "Discover the best cuisines around you",
        customFilters: [
            {
                title: "Restaurants & Cafes",
                options: ["Burger King", "KFC", "Domino's Pizza", "Pizza Hut", "Barista", "Java Lounge", "Café 64", "Perera & Sons"]
            }
        ]
    },
    {
        name: "Fashion",
        color: "#047857",
        icon: "/assets/images/Fashion.png",
        image: "/assets/images/FashionCat.jpg",
        badge: "TRENDS & STYLE",
        subtitle: "Step up your style with latest fashion deals",
        customFilters: [
            {
                title: "Clothing & Apparel",
                options: ["Cool Planet", "House of Fashions", "Nolimit", "Fashion Bug", "Cotton Collection", "Odel", "Kandy"]
            }
        ]
    },
    {
        name: "Salon",
        color: "#be123c",
        icon: "/assets/images/Salon.png",
        image: "/assets/images/SalonCat.png",
        badge: "BEAUTY & HAIR",
        subtitle: "Expert grooming and hair care offers",
        customFilters: [
            {
                title: "Beauty & Grooming",
                options: ["Salon Liyo", "Chandani Bandara", "Crown Salon", "Cutting Station", "Ramani Fernando"]
            }
        ]
    },
    {
        name: "Hotel",
        color: "#6d28d9",
        icon: "/assets/images/Hotel.png",
        image: "/assets/images/HotelCat.png",
        badge: "LUXURY STAYS",
        subtitle: "Unwind at the finest hotels and resorts",
        customFilters: [
            {
                title: "Hotels & Stays",
                options: ["Cinnamon", "Jetwing", "Heritance", "Hilton", "Shangri-La", "The Kingsbury"]
            }
        ]
    },
    {
        name: "Spa",
        color: "#1d4ed8",
        icon: "/assets/images/Spa.png",
        image: "/assets/images/spaCat.png",
        badge: "RELAX & REVIVE",
        subtitle: "Premier wellness and spa treatments",
        customFilters: [
            {
                title: "Wellness & Spa",
                options: ["Spa Ceylon", "Janet", "Luv Esence", "Sanctuary", "White Lotus"]
            }
        ]
    },
    {
        name: "Groceries",
        color: "#b45309",
        icon: "/assets/images/Groceries.png",
        image: "/assets/images/GroceriesCat.png",
        badge: "DAILY DEALS",
        subtitle: "Fresh groceries and household essentials",
        customFilters: [
            {
                title: "Supermarkets & Grocery",
                options: ["Keells", "Arpico", "Cargills Food City", "Sathosa", "Spar"]
            }
        ]
    },
    {
        name: "Electronics",
        color: "#76a81e",
        icon: "/assets/images/electronics.png",
        image: "/assets/images/ElectronicsCat.png",
        badge: "GADGETS & TECH",
        subtitle: "Modern electronics at unbeatable prices",
        customFilters: [
            {
                title: "Gadgets & Appliances",
                options: ["Singer", "Abans", "Damro", "Softlogic", "Dialog", "Mobitel"]
            }
        ]
    },
    {
        name: "Health & Beauty",
        color: "#be185d",
        icon: "/assets/images/Health&Beauty.png",
        image: "/assets/images/Health&BeautyCat.png",
        badge: "WELLNESS & BEAUTY",
        subtitle: "Everything you need to look and feel your best",
        customFilters: [
            {
                title: "Organic & Beauty Care",
                options: ["Spa Ceylon", "Janet", "Luv Esence", "Standard Homeopathy", "Healthguard"]
            }
        ]
    }
];

const syncCategories = async () => {
    try {
        await connectDB();
        console.log('Connected to DB for Category Sync...');

        for (const catData of categoriesToSync) {
            console.log(`Syncing category: ${catData.name}...`);
            
            // Manual slug generation for robust matching
            const generatedSlug = catData.name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');

            let category = await Category.findOne({ name: catData.name });
            
            if (!category) {
                category = new Category({ name: catData.name });
            }

            category.color = catData.color;
            category.icon = catData.icon;
            category.image = catData.image;
            category.badge = catData.badge;
            category.subtitle = catData.subtitle;
            category.customFilters = catData.customFilters;
            category.isActive = true;
            category.slug = generatedSlug; // Explicitly set to avoid null unique issues

            await category.save();
        }

        console.log('✅ All categories synchronized successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Sync Error:', error);
        process.exit(1);
    }
};

syncCategories();
