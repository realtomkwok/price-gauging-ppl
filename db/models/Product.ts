import mongoose, { Schema } from 'mongoose';
import { IProduct } from "@/types/product.types";

const productSchema = new Schema<IProduct>(
	{
		barcode: {
			type: String,
			required: true,
			unique: true,
			index: true,
		},
		lastUpdated: {
			type: Date,
			required: true,
			index: true,
		},

		// Common product info
		name: { type: String, required: true },
		description: String,
		urlFriendlyName: { type: String, required: true },
		imagesUrl: String, // Default to Woolworths' large image if available
		packageInfo: {
			size: String,
			unit: String,
			brand: String,
			weightBasedPricing: Boolean,
		},

		// Retailer specific data
		retailers: {
			woolworths: {
				stockcode: Number,
				productUrl: String,
				status: {
					isAvailable: Boolean,
					isHalfPrice: Boolean,
					isOnSpecial: Boolean,
					isPurchasable: Boolean,
					inStoreIsOnSpecial: Boolean,
					isNew: Boolean,
					isOnlineOnly: Boolean,
					productLimit: Number,
					supplyLimit: Number,
				},
			},
			coles: {
				productId: String,
				productUrl: String,
				status: {
					isAvailable: Boolean,
					isHalfPrice: Boolean,
					isOnSpecial: Boolean,
				},
			},
		},

		priceHistory: [{
			retailerId: { type: Schema.Types.String, required: true },
			timestamp: { type: Schema.Types.Date, required: true },
			price: { type: Schema.Types.Number, required: true },
			unit: {
				value: Number,
					unit: String,
				},
				onSpecial: [
					{
						retailerId: String,
						isOnSpecial: Boolean,
					},
				],
			},
		],

		categories: [
			{
				retailerId: { type: String, required: true },
				categoryId: { type: String, required: true },
				name: { type: String, required: true },
				path: [String],
			},
		],
	},
	{
		timestamps: true,
		collection: "products",
	}
)

// Indexes
productSchema.index({ 'categories.categoryId': 1 });
productSchema.index({ 'retailers.woolworths.stockcode': 1 });
productSchema.index({ 'retailers.coles.productCode': 1 });
productSchema.index({ lastUpdated: 1, 'categories.categoryId': 1 });
productSchema.index({ 'priceHistory.timestamp': 1, 'priceHistory.retailerId': 1 });

export const Product = mongoose.model<IProduct>('Product', productSchema);