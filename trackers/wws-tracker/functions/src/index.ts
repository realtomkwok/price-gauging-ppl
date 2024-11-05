import {onRequest} from "firebase-functions/v2/https";

import {onSchedule} from "firebase-functions/v2/scheduler";
import {initializeApp} from "firebase-admin/app";
import {TrackerService} from "./services/tracker.service";
import {FirestoreService} from "./services/firestore.service";
import { TRACKER_CONFIG } from "./config/tracker.config";

// Initialize Firebase Admin
initializeApp();

// Scheduled product tracker
export const scheduledProductTracker = onSchedule(
  {
    schedule: "0 6 * * *", // Run every 6 hours
    memory: "2GiB",
    // timeoutSeconds: 540, // 9 minutes
    retryCount: 3,
    region: "australia-southeast1",
    timeZone: "Australia/Sydney",
  },
  async () => {
    console.log("Starting scheduled product tracking...");

    try {
      // Initialize services (matching triggerProductTracker's initialization)
      const trackerService = new TrackerService();
      const firestoreService = new FirestoreService();

      await trackerService.initialize();

      try {
        const categories = TRACKER_CONFIG.categories;

        const results = [];

        for (const category of categories) {
          try {
            console.log(`Processing category: ${category.name}`);
            const products = await trackerService.trackCategory(category);

            // Process in batches of 500 (keeping original batch size)
            const batchSize = 500;
            for (let i = 0; i < products.length; i += batchSize) {
              const batch = products.slice(i, i + batchSize);
              await firestoreService.saveBatchProducts(batch);
            }

            results.push({
              category: category.name,
              productsProcessed: products.length,
              status: "success",
            });

            console.log(
              `Processed ${products.length} products for category ${category.name}`,
            );
          } catch (error: any) {
            console.error(`Error processing category ${category.name}:`, error);
            results.push({
              category: category.name,
              error: error.message,
              status: "error",
            });
          }
        }

        console.log("Scheduled tracking completed", { results });
      } finally {
        await trackerService.cleanup();
      }
    } catch (error: any) {
      console.error("Fatal error in scheduled product tracker:", error);
      throw error;
    }
  },
);

export const triggerProductTracker = onRequest(
  {
    memory: "2GiB",
    // timeoutSeconds: 540, // 9 minutes
    region: "australia-southeast1",
  },
  async (req, res) => {
    console.log("Starting triggered product tracking...");

    try {
      // Optional: Add authentication check
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).send("Unauthorized");
        return;
      }

      // Initialize services
      const trackerService = new TrackerService();
      const firestoreService = new FirestoreService();

      await trackerService.initialize();

      try {
        // Get categories from request or fetch all
        // console.log("Categories requested:", req.body.categories);
        const categories = TRACKER_CONFIG.categories;

        const results = [];

        for (const category of categories) {
          try {
            console.log(`Processing category: ${category.name}`);
            const products = await trackerService.trackCategory(category);

            // Process in batches of 100
            const batchSize = 100;
            for (let i = 0; i < products.length; i += batchSize) {
              const batch = products.slice(i, i + batchSize);
              await firestoreService.saveBatchProducts(batch);
            }

            results.push({
              category: category.name,
              productsProcessed: products.length,
              status: "success",
            });

            console.log(
              `Processed ${products.length} products for category ${category.name}`,
            );
          } catch (error: any) {
            console.error(`Error processing category ${category.name}:`, error);
            results.push({
              category: category.name,
              error: error.message,
              status: "error",
            });
          }
        }

        res.status(200).json({
          success: true,
          results,
        });
      } finally {
        await trackerService.cleanup();
      }
    } catch (error: any) {
      console.error("Fatal error in product tracker:", error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  },
);
