import { WwsTracker } from "../services/wws.service"
import { WWS_CONFIG } from "../config/wws.config"
import { connectToMongoDB } from "../config/mongodb.config"

async function testTracker() {
	try {
		// Connect to MongoDB
		await connectToMongoDB()

		// Initialize tracker
		const wwsTracker = new WwsTracker()
		await wwsTracker.initialize()

		// Test with just one category first
		const testCategory = WWS_CONFIG.categories[0] // Fruit & Veg category
		console.log(`Testing tracker with category: ${testCategory.name}`)

		// Track products
		const products = await wwsTracker.trackCategory(testCategory, {
			maxPages: 1,
		})
		console.log(`Successfully tracked ${products.length} products`)

		// Cleanup
		await wwsTracker.cleanup()
		process.exit(0)
	} catch (error) {
		console.error("Test failed:", error)
		process.exit(1)
	}
}

testTracker()
