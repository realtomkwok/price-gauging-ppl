export interface BrowserConfig {
	id: string
	name: string
	baseUrl: string
	requestHeaders: Record<string, string>
	userAgent: string
	viewport: { width: number; height: number }
	selectors?: {
		nextPageButton?: string
		loadMoreButton?: string
		productContainer?: string
	}
	interceptPatterns: string[]
	pagination: {
		enabled: boolean
		type: "url" | "button"
		itemsPerPage: number
		urlPattern?: string // e.g., "?pageNumber={page}" for Woolworths
	}
}
