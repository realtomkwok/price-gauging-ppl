export interface IWooliesResponse {
    SeoMetaTags: {
        Title: string
        MetaDescription: string
        Groups: []
    }
    Bundles: [
        {
            Products: IWolliesProduct[]
            Name: string
            DisplayName: string
        }
    ]
    TotalRecordCount: number
    UpperDynamicContent: {}
    LowerDynamicContent: {}
    RichRevalancePlacement: {}
    Aggregations: []
    HasRewardsCard: boolean
    HasTobaccoItems: boolean
    Success: boolean
}

export interface IWolliesProduct {
    TileId: number
    Stockcode: number
    Barcode: string
    GtinFormat: number
    CupPrice: number
    InstoreCupPrice: number
    HasCupPrice: boolean
    InstoreHasCupPrice: boolean
    Price: number
    InstorePrice: number
    Name: string
    DisplayName: string
    UrlFriendlyName: string
    Description: string
    SmallImageFile: string
    MediumImageFile: string
    LargeImageFile: string
    IsNew: boolean
    IsHalfPrice: boolean
    IsOnlineOnly: boolean
    IsOnSpecial: boolean
    InstoreIsOnSpecial: boolean
    IsEdrSpecial: boolean
    SavingsAmount: number
    InstoreSavingsAmount: number
    WasPrice: number
    InstoreWasPrice: number
    QuantityInTrolley: number
    Unit: string
    UnitWeightInGrams: number
    MinimumQuantity: number
    HasBeenBoughtBefore: boolean
    Source: string
    SupplyLimit: number
    ProductLimit: number
    MaxSupplyLimitMessage: string
    IsRanged: boolean
    IsInStock: boolean
    PackageSize: string
    IsPmDelivery: boolean
    IsForCollection: boolean
    IsForDelivery: boolean
    IsForExpress: boolean
    ProductRestrictionMessage: string | null
    ProductWarningMessage: string | null
    IsAvailable: boolean
    InstoreIsAvailable: boolean
    IsPurchasable: boolean
    InstoreIsPurchasable: boolean
    HideWasSavedPrice: boolean
    Brand: string | null
    FullDescription: string
    Variety: string | null

}

export interface IColesResponse {
    pageProps: {
        assetUrl: string
        _sentryTraceData: string
        _sentryBaggage: string
        isMobile: boolean
        searchResults: {
            didYouMean: string | null
            noOfResults: number
            start: number
            pageSize: number
            keyword: null
            resultType: number
            alternateResults: boolean
            filters: []
            banners: []
            adMemoryToken: string
            pageRestrictions: {}
            results: IColesProduct[],
            catalogGroupView: {}[],
            excludedCatalogGroupView: {}
        }
        searchSessionId: string
        sortByValue: string
        isRestricted: boolean
        aemContentFragment: {}
        aemBrandFragment: {}
        initialState: {}
    },
    initialState: {}
}

export interface IColesProduct {
	_type: string
	id: number
	adId: null
	adSource: null
	featured: boolean
	name: string
	brand: string
	price: number
	description: string
	size: string
	availability: boolean
	availabilityType: string
	imageUrl: [{ altText: string; type: string; url: string }]
    location: {}[]
	restrictions: {}
	merchandiseHeir: {
		tradeProfitCentre: string
		categoryGroup: string
		category: string
		subCategory: string
		className: string
	}
	onlineHeirs: [
		{
			aisle: string
			aisleId: string
			category: string
			categoryId: string
			subCategory: string
			subCategoryId: string
		},
    ]
    pricing: {
        now: number
        was: number
		unit: {
			quantity: number
			ofMeasureQuantity: number
			ofMeasureUnit: string
			price: number
			ofMeasureType: string
			isWeighted: boolean
			isIncremental: boolean
		}
		comparable: string
		onlineSpecial: boolean
	}
}
