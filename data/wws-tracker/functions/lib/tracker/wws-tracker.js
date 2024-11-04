"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WwsApiTracker = void 0;
const axios_1 = __importDefault(require("axios"));
const config_1 = require("./config");
const firebase_service_1 = require("../services/firebase.service");
const product_mapper_utils_1 = require("../utils/product-mapper.utils");
const tracker_utils_1 = require("../utils/tracker.utils");
class WwsApiTracker {
    constructor() {
        this.currentRetries = 0;
        this.axiosInstance = axios_1.default.create({
            baseURL: config_1.TRACKER_CONFIG.baseUrl,
            timeout: 60000,
            headers: {
                accept: "application/json, text/plain, */*",
                "accept-language": "en-US,en;q=0.9",
                "content-type": "application/json",
                priority: "u=1, i",
                "sec-ch-ua": '"Chromium";v="130", "Google Chrome";v="130", "Not?A_Brand";v="99"',
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": '"macOS"',
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "User-Agent": config_1.TRACKER_CONFIG.headers["User-Agent"],
                Referer: "https://www.woolworths.com.au/shop/browse",
                Origin: "https://www.woolworths.com.au",
            },
            withCredentials: true,
        });
        // Add request interceptor to add dynamic headers
        this.axiosInstance.interceptors.request.use((config) => {
            const requestId = (0, tracker_utils_1.generateRequestId)();
            config.headers["request-id"] = `|${requestId}.${(0, tracker_utils_1.generateRequestId)(8)}`;
            config.headers["traceparent"] = `00-${requestId}-${(0, tracker_utils_1.generateRequestId)(8)}-01`;
            // Add cookies if they exist in config
            if (config_1.TRACKER_CONFIG.cookies.auth || config_1.TRACKER_CONFIG.cookies.session) {
                config.headers["Cookie"] = `${config_1.TRACKER_CONFIG.cookies.auth}; ${config_1.TRACKER_CONFIG.cookies.session}`;
            }
            return config;
        });
        // Add response interceptor for debugging
        this.axiosInstance.interceptors.response.use((response) => response, (error) => {
            if (error.response) {
                console.error("Response error:", {
                    status: error.response.status,
                    headers: error.response.headers,
                    data: error.response.data,
                });
            }
            else if (error.request) {
                console.error("Request error:", error.message);
            }
            return Promise.reject(error);
        });
    }
    async trackCategory(categoryId, name, urlFriendlyName, options = {}) {
        const { maxPages = Infinity, delayBetweenRequests = config_1.TRACKER_CONFIG.delayBetweenRequests, } = options;
        console.log(`Starting to track category: ${name} (${categoryId})`);
        let currentPage = 1;
        let hasMorePages = true;
        const trackedProducts = [];
        while (hasMorePages && currentPage <= maxPages) {
            try {
                const requestBody = (0, tracker_utils_1.generateRequestBody)(categoryId, name, urlFriendlyName, currentPage);
                console.log(`Fetching page ${currentPage}...`);
                const response = await this.axiosInstance.post(config_1.TRACKER_CONFIG.endpoints.browse, requestBody);
                if (!response.data?.Bundles) {
                    throw new Error(`Invalid response: ${JSON.stringify(response.data)}`);
                }
                const products = response.data.Bundles.flatMap((bundle) => bundle.Products);
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
                const errorMessage = error.response
                    ? `HTTP ${error.response.status}: ${JSON.stringify(error.response.data)}`
                    : error.message;
                console.error(`Error tracking category ${name}, page ${currentPage}:`, errorMessage);
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
        console.log(`Saving ${products.length} products to Firebase...`);
        for (const product of products) {
            try {
                const appProduct = (0, product_mapper_utils_1.mapWwsToAppProduct)(product);
                await firebase_service_1.FirebaseService.saveProduct(product.Stockcode.toString(), appProduct);
            }
            catch (error) {
                console.error(`Error saving product ${product.Stockcode}:`, error);
            }
        }
    }
}
exports.WwsApiTracker = WwsApiTracker;
//# sourceMappingURL=wws-tracker.js.map