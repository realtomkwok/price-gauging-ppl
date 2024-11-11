export const COLES_CONFIG = {
    // TODO: Add Coles-related cookies
    baseUrl: "https://shop.coles.com.au",
    endpoints: {
        browse: "/browse",
        product: "/product",
    },
    defaultPageSize: 48,
    cookies: {
        auth: "",
        session: "",
    },
    categories: [
        { id: "7238", name: "Meat & Seafood", urlFriendlyName: "meat-seafood" },
        { id: "2100", name: "Fruit & Vegetables", urlFriendlyName: "fruit-vegetables" },
        { id: "1300", name: "Dairy, Eggs & Fridge", urlFriendlyName: "dairy-eggs-fridge" },
        { id: "8892906", name: "Bakery", urlFriendlyName: "bakery" },
        { id: "8892715", name: "Deli", urlFriendlyName: "deli" },
        { id: "10302", name: "Pantry", urlFriendlyName: "pantry" },
        { id: "11456", name: "Drinks", urlFriendlyName: "drinks" },
        { id: "85471", name: "Frozen", urlFriendlyName: "frozen" },
        { id: "14003", name: "Household", urlFriendlyName: "household" },
        { id: "15083", name: "Health & Beauty", urlFriendlyName: "health-beauty" },
        { id: "15603", name: "Baby", urlFriendlyName: "baby" },
        { id: "16427", name: "Pet", urlFriendlyName: "pet" },
        { id: "85946", name: "Liquor", urlFriendlyName: "liquor" },
        { id: "17490", name: "Tobacco", urlFriendlyName: "tobacco" },
    ],    
    tracking: {
        maxRetries: 3,
        delayBetweenRequests: 2000,
        timeout: 30000,
    }
};
