import { Document } from "mongoose"

interface RetailerProductStatus {
	isAvailable?: boolean
	isHalfPrice?: boolean
	isOnSpecial: boolean
}

export interface IProduct extends Document {
	barcode: string
	lastUpdated: Date

	// Common product info
	name: string // WWS - basic.name
	description?: string
	urlFriendlyName: string
	imagesUrl: string
	packageInfo: {
		size?: string
		unit?: string
		packageSize?: string
		brand?: string
		weightBasedPricing?: boolean
	}
	variety: string // Like a specif type or category of product

	// Retailer specific data
    retailers: {
        woolworths?: {
            stockcode: number
            productUrl: string
            status: RetailerProductStatus & {
                isPurchasable: boolean
                inStoreIsOnSpecial: boolean
                isNew: boolean
                isOnlineOnly: boolean
                productLimit: number
                supplyLimit: number
            }
        }
        coles?: {
            productId: string
            productUrl: string
            status: RetailerProductStatus
        }
    }

    priceHistory: Array<{
        retailerId: string
        timestamp: Date
        price: number
        unit: {
            value: number
            unit: string
        }
        onSpecial: [
            {
                retailerId: string
                isOnSpecial: boolean
            }
        ]
    }>

		categories: Array<{
			retailerId: string
			categoryId: string
			name: string
			path: string[]
		}>
	}
