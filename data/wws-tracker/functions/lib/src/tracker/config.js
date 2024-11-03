"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TRACKER_CONFIG = void 0;
const constants_1 = require("../utils/constants");
const tracker_utils_1 = require("../utils/tracker.utils");
exports.TRACKER_CONFIG = {
    baseUrl: 'https://www.woolworths.com.au/apis/ui',
    endpoints: {
        browse: '/browse/category',
        product: '/product',
    },
    defaultPageSize: 24,
    maxRetries: 5,
    delayBetweenRequests: 5000, // 5 seconds
    cookies: {
        auth: 'prodwow-auth-token=...; wow-auth-token=...; w-rctx=...',
        session: '_abck=...; ak_bmsc=...; bm_mi=...; bm_sv=...; bm_sz=...; dtCookie=...; INGRESSCOOKIE=...; akaalb_woolworths.com.au=...'
    },
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': (0, tracker_utils_1.getRandomUserAgent)()
    },
    categories: [
        { id: '1_D5A2236', name: 'Poultry, Meat & Seafood', urlFriendlyName: 'poultry-meat-seafood' },
        { id: '1_DEB537E', name: 'Bakery', urlFriendlyName: 'bakery' },
        { id: '1_F229FBE', name: 'International Foods', urlFriendlyName: 'international-foods' },
        { id: '1_39FD49C', name: 'Pantry', urlFriendlyName: 'pantry' },
        { id: '1_717A94B', name: 'Baby', urlFriendlyName: 'baby' },
        { id: '1_DEA3ED5', name: 'Home & Lifestyle', urlFriendlyName: 'home-lifestyle' },
        { id: '1_2432B58', name: 'Cleaning & Maintenance', urlFriendlyName: 'cleaning-maintenance' },
        { id: '1_5AF3A0A', name: 'Drinks', urlFriendlyName: '/shop/browse/drinks' },
        { id: '1_894D0A8', name: 'Beauty & Personal Care', urlFriendlyName: 'beauty-personal-care' },
        { id: '1_8E4DA6F', name: 'Beer, Wine & Spirits', urlFriendlyName: 'beer-wine-spirits' },
        { id: '1_3151F6F', name: 'Deli & Chilled Meals', urlFriendlyName: 'deli-chilled-meals' },
        { id: '1_717445A', name: 'Snacks & Confectionery', urlFriendlyName: 'snacks-confectionery' },
        { id: '1_6E4F4E4', name: 'Dairy, Eggs & Fridge', urlFriendlyName: 'dairy-eggs-fridge' },
        { id: '1_61D6FEB', name: 'Pet', urlFriendlyName: 'pet' },
        { id: '1_9E92C35', name: 'Lunch Box', urlFriendlyName: 'lunch-box' },
        { id: '1_B63CF9E', name: 'Front of Store', urlFriendlyName: 'front-of-store' },
        { id: '1-E5BEE36E', name: 'Fruit & Veg', urlFriendlyName: 'fruit-veg' },
        { id: '1_9851658', name: 'Health & Wellness', urlFriendlyName: 'health-wellness' },
        { id: '1_ACA2FC2', name: 'Freezer', urlFriendlyName: 'freezer' }
    ],
    userAgents: constants_1.USER_AGENTS
};
//# sourceMappingURL=config.js.map