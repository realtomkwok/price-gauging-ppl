"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scheduledTracker = void 0;
const scheduler_1 = require("firebase-functions/v2/scheduler");
const app_1 = require("firebase-admin/app");
const wws_browser_tracker_1 = require("./tracker/wws-browser-tracker");
const config_1 = require("./tracker/config");
const firebase_admin_service_1 = require("./services/firebase-admin.service");
const product_mapper_utils_1 = require("./utils/product-mapper.utils");
// Initialize Firebase Admin
(0, app_1.initializeApp)();
// Create a tracker class that uses admin SDK
class CloudWwsBrowserTracker extends wws_browser_tracker_1.WwsBrowserTracker {
    async saveProducts(products) {
        let savedCount = 0;
        const errors = [];
        for (const product of products) {
            try {
                const mappedProduct = (0, product_mapper_utils_1.mapWwsToAppProduct)(product);
                await firebase_admin_service_1.FirebaseAdminService.saveProduct(product.Stockcode.toString(), mappedProduct);
                savedCount++;
            }
            catch (error) {
                console.error(`Error saving product ${product.Stockcode}:`, error);
                errors.push({ stockcode: product.Stockcode.toString(), error });
            }
        }
        console.log(`Saved ${savedCount}/${products.length} products`);
        if (errors.length > 0) {
            console.warn(`Failed to save ${errors.length} products`);
        }
    }
    // Implement the required methods if they're not in WwsBrowserTracker
    async init() {
        // Implementation depends on your needs
        await super.init?.(); // Call parent's init if it exists
    }
    async trackCategory(categoryId, name, urlFriendlyName, options) {
        const products = await super.trackCategory(categoryId, name, urlFriendlyName, options);
        return products;
    }
    async close() {
        // Implementation depends on your needs
        await super.close?.(); // Call parent's close if it exists
    }
}
// Schedule the tracker to run at Sydney time 05:00 and 17:00 [UTC+10] every day
exports.scheduledTracker = (0, scheduler_1.onSchedule)("0 19,7 * * *", async () => {
    const tracker = new CloudWwsBrowserTracker();
    try {
        await tracker.init();
        console.log("Browser initialized successfully");
        for (const category of config_1.TRACKER_CONFIG.categories) {
            try {
                await tracker.trackCategory(category.id, category.name, category.urlFriendlyName, {
                    maxPages: Infinity,
                    delayBetweenRequests: 5000,
                });
            }
            catch (error) {
                console.error(`Error tracking category ${category.name}:`, error);
                continue;
            }
        }
    }
    finally {
        await tracker.close();
    }
});
//# sourceMappingURL=scheduledTracker.js.map