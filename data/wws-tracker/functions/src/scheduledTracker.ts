import { onSchedule } from "firebase-functions/v2/scheduler"
import { initializeApp } from "firebase-admin/app"
import { WwsBrowserTracker } from "./tracker/wws-browser-tracker"
import { TRACKER_CONFIG } from "./tracker/config"
import { FirebaseAdminService } from "./services/firebase-admin.service"
import { mapWwsToAppProduct } from "@/utils/product-mapper.utils"
import { ScraperOptions, WwsProduct } from "@/types"
// Initialize Firebase Admin
initializeApp()

// Create a tracker class that uses admin SDK
class CloudWwsBrowserTracker extends WwsBrowserTracker {
	protected async saveProducts(products: any[]) {
		let savedCount = 0
		const errors: Array<{ stockcode: string; error: any }> = []

		for (const product of products) {
			try {
				const mappedProduct = mapWwsToAppProduct(product)
				await FirebaseAdminService.saveProduct(
					product.Stockcode.toString(),
					mappedProduct
				)
				savedCount++
			} catch (error) {
				console.error(
					`Error saving product ${product.Stockcode}:`,
					error
				)
				errors.push({ stockcode: product.Stockcode.toString(), error })
			}
		}

		console.log(`Saved ${savedCount}/${products.length} products`)
		if (errors.length > 0) {
			console.warn(`Failed to save ${errors.length} products`)
		}
	}

	// Implement the required methods if they're not in WwsBrowserTracker
	async init() {
		// Implementation depends on your needs
		await super.init?.() // Call parent's init if it exists
	}

	async trackCategory(categoryId: string, name: string, urlFriendlyName: string, options?: ScraperOptions): Promise<WwsProduct[]> {
		const products = await super.trackCategory(categoryId, name, urlFriendlyName, options);
		return products;
	}

	async close() {
		// Implementation depends on your needs
		await super.close?.() // Call parent's close if it exists
	}
}

// Schedule the tracker to run at Sydney time 05:00 and 17:00 [UTC+10] every day
export const scheduledTracker = onSchedule("0 19,7 * * *", async () => {
	const tracker = new CloudWwsBrowserTracker()

	try {
		await tracker.init()
		console.log("Browser initialized successfully")

		for (const category of TRACKER_CONFIG.categories) {
			try {
				await tracker.trackCategory(
					category.id,
					category.name,
					category.urlFriendlyName,
					{
						maxPages: Infinity,
						delayBetweenRequests: 5000,
					}
				)
			} catch (error) {
				console.error(
					`Error tracking category ${category.name}:`,
					error
				)
				continue
			}
		}
	} finally {
		await tracker.close()
	}
})
