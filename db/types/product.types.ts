import { Document } from "mongoose"

export interface IProduct {
	id: string //e.g. "retailerId-productId"
	retailerId: string //e.g. "coles", "wws"
	productId: string //e.g. Different for each retailer. `Stockcode` for Woolworths. `id` for Coles.
	barcode: string // e.g. 931172000000. Coles doesn't have this.
	name: string
	brand: string
	description: string
	packageSize: string

	// Pricing
	pricing: [
		{
			trackedAt: Date
			current: number
			was: number // Claimed by retailer
			unit: {
				price: number
				measure: string
			}
			isOnSpecial: boolean
			specialType: string[]
			offerDescription: string
		}
	]

	// Availability & Status

	// Categories
	department: string
	category: string
	subCategory: string

	// Metadata
	metadata: {
		createdAt: Date
		lastUpdated: Date
		imageUrls: string[]
	}
}

export interface IWoolworthsProduct extends Document<IProduct> {}

export interface IColesProduct extends Document<IProduct> {}
