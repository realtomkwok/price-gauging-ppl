export interface IProduct {
    id: string
    retailerId: string
    productId: string
    barcode: string
	name: string
	brand: string
	description: string
    packageSize: string

    // Pricing history array
    pricing: [{
        trackedAt: Date
        current: number
        was: number
        unit: {
            price: number
            measure: string
        }
        isOnSpecial: boolean
        specialType: string[]
        offerDescription: string
    }]

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

export interface IWoolworthsProduct extends IProduct {
    retailerId: 'wws'
}

export interface IColesProduct extends IProduct {
    retailerId: 'coles'
}
