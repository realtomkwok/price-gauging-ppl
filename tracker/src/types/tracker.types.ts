export interface TrackerOptions {
	maxPages?: number
	delayBetweenRequests?: number
}

export interface Category {
	id: string
	name: string
	urlFriendlyName: string
}