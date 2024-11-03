"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scheduledTracker = void 0;
const scheduler_1 = require("firebase-functions/v2/scheduler");
const cloud_tracker_1 = require("@shared/tracker/cloud-tracker");
const config_1 = require("@shared/tracker/config");
// Schedule the tracker to run at Sydney time 05:00 and 17:00 [UTC+10] every day
// TODO: Daylight saving time
exports.scheduledTracker = (0, scheduler_1.onSchedule)("0 19,7 * * *", async () => {
    const tracker = new cloud_tracker_1.CloudWwsBrowserTracker();
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