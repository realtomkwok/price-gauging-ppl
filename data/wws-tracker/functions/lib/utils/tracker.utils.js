"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sleep = exports.generateRequestId = exports.generateRequestBody = exports.formatError = exports.getRandomUserAgent = void 0;
const config_1 = require("../tracker/config");
const constants_1 = require("./constants");
const getRandomUserAgent = () => {
    if (!constants_1.USER_AGENTS?.length) {
        throw new Error("USER_AGENTS is not properly configured");
    }
    const index = Math.floor(Math.random() * constants_1.USER_AGENTS.length);
    return constants_1.USER_AGENTS[index];
};
exports.getRandomUserAgent = getRandomUserAgent;
const formatError = (error) => {
    if (error.response) {
        return `HTTP ${error.response.status}: ${JSON.stringify(error.response.data)}`;
    }
    return error.message || "Unknown error occurred";
};
exports.formatError = formatError;
const generateRequestBody = (categoryId, name, urlFriendlyName, pageNumber) => ({
    categoryId,
    pageNumber,
    pageSize: config_1.TRACKER_CONFIG.defaultPageSize,
    sortType: "TraderRelevance",
    url: `/shop/browse/${urlFriendlyName}`,
    location: `/shop/browse/${urlFriendlyName}`,
    formatObject: JSON.stringify({ name: name }),
    isSpecial: false,
    isBundle: false,
    isMobile: false,
    filters: [],
    token: "",
    gpBoost: 0,
    isHideUnavailableProducts: false,
    isRegisteredRewardCardPromotion: false,
    enableAdReRanking: false,
    groupEdmVariants: true,
    categoryVersion: "v2",
});
exports.generateRequestBody = generateRequestBody;
const generateRequestId = (length = 32) => {
    const chars = "abcdef0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};
exports.generateRequestId = generateRequestId;
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
exports.sleep = sleep;
//# sourceMappingURL=tracker.utils.js.map