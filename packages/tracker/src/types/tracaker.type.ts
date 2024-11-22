export interface TrackerConfig {
	id: string
	name: string
	baseUrl: string
	userAgent: string
	viewport: { width: number; height: number }
	requestHeaders: Record<string, string>
	interceptPatterns: string[]
	selectors?: {
		nextPageButton?: string
		loadMoreButton?: string
		productContainer?: string
	}
	requiresPagination: boolean
	maxProductsPerPage: number
}