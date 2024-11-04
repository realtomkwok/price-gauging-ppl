import { onRequest } from "firebase-functions/v2/https"

import { onSchedule } from "firebase-functions/v2/scheduler"
import { initializeApp } from "firebase-admin/app"
import { TrackerService } from "./services/tracker.service"
import { FirestoreService } from "./services/firestore.service"

// Initialize Firebase Admin
initializeApp()

const trackerService = new TrackerService()
const firestoreService = new FirestoreService()

// Scheduled product tracker
export const scheduledProductTracker = onSchedule(
	{
		schedule: "0 */6 * * *", // Run every 6 hours
		memory: "1GiB",
		timeoutSeconds: 540, // 9 minutes
		retryCount: 3,
		region: "australia-southeast1",
	},
	async (event) => {
		console.log("Starting scheduled product tracking...")

		try {
			await trackerService.initialize()
			const categories = await firestoreService.getCategoriesToTrack()

			for (const category of categories) {
				try {
					console.log(`Processing category: ${category.name}`)
					const products = await trackerService.trackCategory(
						category
					)

					// Process in batches of 500 to optimize Firestore writes
					const batchSize = 500
					for (let i = 0; i < products.length; i += batchSize) {
						const batch = products.slice(i, i + batchSize)
						await firestoreService.saveBatchProducts(batch)
					}
				} catch (error) {
					console.error(
						`Error processing category ${category.name}:`,
						error
					)
					continue
				}
			}
		} catch (error) {
			console.error("Fatal error in product tracker:", error)
			throw error
		} finally {
			await trackerService.cleanup()
		}
	}
)

// Triggered product tracker
/**
 * Use the following cURL command to trigger the product tracker:
 * curl -X POST https://australia-southeast1-price-gauging-ppl.cloudfunctions.net/triggerProductTracker \
 *   -H "Authorization: Bearer your-secret-token" \
 *   -H "Content-Type: application/json" \
 *   -d '{"categories": [{"id": "1_D5A2236", "name": "Poultry, Meat & Seafood", "urlFriendlyName": "poultry-meat-seafood"}]}'
 */
// ////////////////////////////////////////////////////////////////////////////////////////////

export const triggerProductTracker = onRequest(
	{
		memory: "1GiB",
		timeoutSeconds: 540, // 9 minutes
		region: "australia-southeast1",
	},
	async (req, res) => {
		console.log("Starting triggered product tracking...")

		try {
			// Optional: Add authentication check
			const authHeader = req.headers.authorization
			if (!authHeader || !authHeader.startsWith("Bearer ")) {
				res.status(401).send("Unauthorized")
				return
			}

			// Initialize services
			const trackerService = new TrackerService()
			const firestoreService = new FirestoreService()

			await trackerService.initialize()

			try {
				// Get categories from request or fetch all
				const categories =
					req.body.categories ||
					(await firestoreService.getCategoriesToTrack())

				const results = []

				for (const category of categories) {
					try {
						console.log(`Processing category: ${category.name}`)
						const products = await trackerService.trackCategory(
							category
						)

						// Process in batches of 100
						const batchSize = 100
						for (let i = 0; i < products.length; i += batchSize) {
							const batch = products.slice(i, i + batchSize)
							await firestoreService.saveBatchProducts(batch)
						}

						results.push({
							category: category.name,
							productsProcessed: products.length,
							status: "success",
						})

						console.log(`Processed ${products.length} products for category ${category.name}`)
					} catch (error: any) {
						console.error(
							`Error processing category ${category.name}:`,
							error
						)
						results.push({
							category: category.name,
							error: error.message,
							status: "error",
						})
					}
				}

				res.status(200).json({
					success: true,
					results,
				})
			} finally {
				await trackerService.cleanup()
			}
		} catch (error: any) {
			console.error("Fatal error in product tracker:", error)
			res.status(500).json({
				success: false,
				error: error.message,
			})
		}
	}
)
