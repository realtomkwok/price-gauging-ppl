import { connectToMongoDB } from "./config/mongodb.config"
import { ProductModel, WoolworthsProduct, ColesProduct } from "./models/product.model"

// Export models
export { ProductModel, WoolworthsProduct, ColesProduct }

// Export connection function
export { connectToMongoDB }

// Default export for convenience
export default {
	connect: connectToMongoDB,
	models: {
		Product: ProductModel,
		WoolworthsProduct,
		ColesProduct,
	},
}
