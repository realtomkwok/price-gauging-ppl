"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WwsBrowserTracker = void 0;
const puppeteer_1 = __importDefault(require("puppeteer"));
const config_1 = require("./config");
const tracker_utils_1 = require("../utils/tracker.utils");
const firebase_service_1 = require("../services/firebase.service");
const product_mapper_utils_1 = require("../utils/product-mapper.utils");
class WwsBrowserTracker {
    constructor() {
        this.browser = null;
        this.page = null;
        this.currentRetries = 0;
    }
    async init() {
        this.browser = await puppeteer_1.default.launch({
            headless: true,
            args: ["--no-sandbox", "--disable-setuid-sandbox"],
        });
        this.page = await this.browser.newPage();
        // Set a realistic viewport
        await this.page.setViewport({ width: 1280, height: 800 });
        // Set user agent
        await this.page.setUserAgent(config_1.TRACKER_CONFIG.headers["User-Agent"]);
    }
    async close() {
        if (this.browser) {
            await this.browser.close();
        }
    }
    async trackCategory(categoryId, name, urlFriendlyName, options = {}) {
        if (!this.page)
            throw new Error("Browser not initialized");
        const { maxPages = Infinity, delayBetweenRequests = config_1.TRACKER_CONFIG.delayBetweenRequests, } = options;
        console.log(`Starting to track category: ${name} (${categoryId})`);
        let currentPage = 1;
        let hasMorePages = true;
        const trackedProducts = [];
        // First visit the category page to get cookies
        await this.page.goto(`https://www.woolworths.com.au/shop/browse/${urlFriendlyName}`);
        await (0, tracker_utils_1.sleep)(2000); // Wait for cookies to be set
        while (hasMorePages && currentPage <= maxPages) {
            try {
                // Navigate to the next page if not on first page
                if (currentPage > 1) {
                    const nextPageUrl = `https://www.woolworths.com.au/shop/browse/${urlFriendlyName}?pageNumber=${currentPage}`;
                    await this.page.goto(nextPageUrl);
                    await (0, tracker_utils_1.sleep)(2000); // Wait for page load
                }
                const requestBody = (0, tracker_utils_1.generateRequestBody)(categoryId, name, urlFriendlyName, currentPage);
                console.log(`Fetching page ${currentPage}...`);
                // Make the API request through the browser
                const response = (await this.page.evaluate(async (body, apiUrl) => {
                    const resp = await fetch(apiUrl, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Accept: "application/json",
                        },
                        body: JSON.stringify(body),
                        credentials: "include",
                    });
                    return resp.json();
                }, requestBody, `${config_1.TRACKER_CONFIG.baseUrl}${config_1.TRACKER_CONFIG.endpoints.browse}`));
                if (!response?.Bundles) {
                    throw new Error(`Invalid response: ${JSON.stringify(response)}`);
                }
                const products = response.Bundles.flatMap((bundle) => bundle.Products);
                trackedProducts.push(...products);
                console.log(`Found ${products.length} products on page ${currentPage}`);
                await this.saveProducts(products);
                hasMorePages =
                    products.length === config_1.TRACKER_CONFIG.defaultPageSize;
                currentPage++;
                this.currentRetries = 0;
                if (hasMorePages) {
                    const delay = delayBetweenRequests + Math.random() * 1000;
                    console.log(`Waiting ${delay}ms before next request...`);
                    await (0, tracker_utils_1.sleep)(delay);
                }
            }
            catch (error) {
                console.error(`Error tracking category ${name}, page ${currentPage}:`, error);
                if (this.currentRetries < config_1.TRACKER_CONFIG.maxRetries) {
                    this.currentRetries++;
                    const retryDelay = delayBetweenRequests * (this.currentRetries + 1);
                    console.log(`Retrying... Attempt ${this.currentRetries} of ${config_1.TRACKER_CONFIG.maxRetries} after ${retryDelay}ms`);
                    await (0, tracker_utils_1.sleep)(retryDelay);
                    continue;
                }
                break;
            }
        }
        return trackedProducts;
    }
    async saveProducts(products) {
        let savedCount = 0;
        const errors = [];
        for (const product of products) {
            try {
                const mappedProduct = (0, product_mapper_utils_1.mapWwsToAppProduct)(product);
                await firebase_service_1.FirebaseService.saveProduct(product.Stockcode.toString(), mappedProduct);
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
}
exports.WwsBrowserTracker = WwsBrowserTracker;
//# sourceMappingURL=wws-browser-tracker.js.map