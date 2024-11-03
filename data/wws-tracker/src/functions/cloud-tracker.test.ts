import { TRACKER_CONFIG } from "../tracker/config"
import { WwsBrowserTracker } from "../tracker/wws-browser-tracker"
import { formatError } from "../utils/tracker.utils"

async function main() {
	console.log("Starting test tracker...")
	const tracker = new WwsBrowserTracker()

	try {
		// Initialize the browser
		await tracker.init()
		console.log("Browser initialized successfully")

		// Select a test category from config
		const testCategory = TRACKER_CONFIG.categories[0]
		console.log(
			`Testing tracker with category: ${testCategory.name} (${testCategory.id})`
		)

		// Track the category
		const products = await tracker.trackCategory(
			testCategory.id,
			testCategory.name,
			testCategory.urlFriendlyName,
			{
				maxPages: 2,
				delayBetweenRequests: 5000,
			}
		)

		console.log(`Successfully tracked ${products.length} products`)

		// Log some sample data from the first product if available
		if (products.length > 0) {
			const sample = products[0]
			console.log("Sample product data:", {
				name: sample.Name,
				price: sample.Price,
				stockcode: sample.Stockcode,
				isAvailable: sample.IsAvailable,
			})
		}
	} catch (error) {
		console.error("Error during tracking:", formatError(error))
		process.exit(1)
	} finally {
		console.log("Cleaning up...")
		await tracker.close()
		console.log("Test tracker completed")
	}
}

main()
