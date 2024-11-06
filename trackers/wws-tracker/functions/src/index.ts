import {onRequest} from "firebase-functions/v2/https";
import {onSchedule} from "firebase-functions/v2/scheduler";
import {initializeApp} from "firebase-admin/app";
import {TrackerService} from "./services/tracker.service";
import {FirestoreService} from "./services/firestore.service";
import {TRACKER_CONFIG} from "./config/tracker.config";
import {Timestamp} from "firebase-admin/firestore";
import {Category} from "./types";

const functionConfig = {
  token: process.env.FUNCTION_TOKEN || process.env.FIREBASE_CONFIG_FUNCTION_TOKEN,
  region: process.env.FUNCTION_REGION || "australia-southeast1",
  projectId: process.env.PROJECT_ID || "price-gauging-ppl",
};

// Initialize Firebase Admin
initializeApp();

export const processSingleCategory = onRequest(
  {
    memory: "2GiB",
    region: "australia-southeast1",
    // 15 minutes for each category
    timeoutSeconds: 3600,
  },
  async (req, res) => {
    console.log("Starting single category processing...");

    try {
      // Validate request
      const {categoryId} = req.query;
      if (!categoryId) {
        res.status(400).json({
          success: false,
          error: "Category ID is required",
        });
        return;
      }

      // Validate auth
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).send("Unauthorized");
        return;
      }

      // Find category
      const category = TRACKER_CONFIG.categories.find((c) => c.id === categoryId);
      if (!category) {
        res.status(404).json({
          success: false,
          error: "Category not found",
        });
        return;
      }

      // Initialize services
      const trackerService = new TrackerService();
      const firestoreService = new FirestoreService();

      try {
        // Check if category was updated today
        const isUpdatedToday = await firestoreService.isProductsUpdatedToday(category);
        // Inside processSingleCategory function, replace the isUpdatedToday check with:
        if (isUpdatedToday) {
          console.log(`Category ${category.name} already updated today, skipping...`);
          res.status(200).json({
            success: true,
            category: category.name,
            status: "skipped",
            reason: "already_updated_today",
          });
          return;
        }

        await trackerService.initialize();
        console.log(`Processing category: ${category.name}`);

        const products = await trackerService.trackCategory(category);
        const productsWithTimestamp = products.map((product) => ({
          ...product,
          lastUpdated: Timestamp.now(),
          category: {
            id: category.id,
            name: category.name,
          },
        }));

        // Process in batches
        const batchSize = 500;
        for (let i = 0; i < productsWithTimestamp.length; i += batchSize) {
          const batch = productsWithTimestamp.slice(i, i + batchSize);
          await firestoreService.saveBatchProducts(batch);
        }

        res.status(200).json({
          success: true,
          category: category.name,
          productsProcessed: products.length,
        });
      } finally {
        await trackerService.cleanup();
      }
    } catch (error: any) {
      console.error("Error processing category:", error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
);

export const scheduledProductTracker = onSchedule(
  {
    schedule: "0 6 * * *",
    memory: "1GiB",
    region: "australia-southeast1",
    timeZone: "Australia/Sydney",
    // 1 hour for all categories
    timeoutSeconds: 3600,
  },
  async (context) => {
    console.log("Starting scheduled product tracking distribution... ", context.jobName);

    try {
      const firestoreService = new FirestoreService();
      const categories = TRACKER_CONFIG.categories;
      const results = [];

      // Process categories in parallel with a concurrency limit
      const concurrencyLimit = 3; // Adjust based on your needs
      const chunks = [];

      for (let i = 0; i < categories.length; i += concurrencyLimit) {
        chunks.push(categories.slice(i, i + concurrencyLimit));
      }

      for (const categoryChunk of chunks) {
        const chunkPromises = categoryChunk.map(async (category) => {
          try {
            // Check if category was updated today
            const isUpdatedToday = await firestoreService.isProductsUpdatedToday(category);
            if (isUpdatedToday) {
              console.log(`Category ${category.name} already updated today, skipping...`);
              return {
                category: category.name,
                status: "skipped",
                reason: "already_updated_today",
              };
            }

            // Call the single category processor function
            const response = await fetch(
              `http://127.0.0.1:5001/${functionConfig.projectId}/${functionConfig.region}/processSingleCategory?categoryId=${category.id}`,
              {
                method: "POST",
                headers: {
                  "Authorization": `Bearer ${functionConfig.token}`,
                  "Content-Type": "application/json",
                },
              }
            );

            const result = await response.json();
            return {
              category: category.name,
              status: result.success ? "success" : "error",
              productsProcessed: result.productsProcessed,
            };
          } catch (error: any) {
            console.error(`Error processing category ${category.name}:`, error);
            return {
              category: category.name,
              status: "error",
              error: error.message,
            };
          }
        });

        const chunkResults = await Promise.all(chunkPromises);
        results.push(...chunkResults);

        // Add delay between chunks to avoid rate limiting
        await new Promise((resolve) => setTimeout(resolve, 5000));
      }

      console.log("Scheduled tracking distribution completed", {results});
    } catch (error: any) {
      console.error("Fatal error in scheduled product tracker:", error);
      throw error;
    }
  }
);

export const triggerProductTracker = onRequest(
  {
    memory: "2GiB",
    region: "australia-southeast1",
    // 1 hour for all categories
    timeoutSeconds: 3600,
  },
  async (req, res) => {
    console.log("Starting triggered product tracking distribution...");

    try {
      // Validate auth
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).send("Unauthorized");
        return;
      }

      // Get categories from request or use all categories
      const categories = req.body?.categories || TRACKER_CONFIG.categories;
      const results = [];

      // Process categories in parallel with a concurrency limit
      const concurrencyLimit = 3;
      const chunks = [];

      for (let i = 0; i < categories.length; i += concurrencyLimit) {
        chunks.push(categories.slice(i, i + concurrencyLimit));
      }

      for (const categoryChunk of chunks) {
        const chunkPromises = categoryChunk.map(async (category: Category) => {
          try {
            // Call the single category processor function
            const response = await fetch(
              `http://127.0.0.1:5001/${functionConfig.projectId}/${functionConfig.region}/processSingleCategory?categoryId=${category.id}`,
              {
                method: "POST",
                headers: {
                  "Authorization": `Bearer ${functionConfig.token}`,
                  "Content-Type": "application/json",
                },
              }
            );

            const result = await response.json();
            return {
              category: category.name,
              status: result.success ? "success" : "error",
              productsProcessed: result.productsProcessed,
            };
          } catch (error: any) {
            console.error(`Error processing category ${category.name}:`, error);
            return {
              category: category.name,
              status: "error",
              error: error.message,
            };
          }
        });

        const chunkResults = await Promise.all(chunkPromises);
        results.push(...chunkResults);

        // Add delay between chunks to avoid rate limiting
        await new Promise((resolve) => setTimeout(resolve, 5000));
      }

      res.status(200).json({
        success: true,
        results,
      });
    } catch (error: any) {
      console.error("Fatal error in triggered product tracker:", error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
);
