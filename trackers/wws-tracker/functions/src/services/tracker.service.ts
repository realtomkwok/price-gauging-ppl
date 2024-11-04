import puppeteer, { Browser, Page } from "puppeteer"
import {
	Category,
	WwsProduct,
	ScraperOptions,
	WwsCategoryResponse,
} from "../types"
import {
	sleep,
	generateRequestBody,
	getRandomUserAgent,
} from "../utils/tracker.utils"
import { TRACKER_CONFIG } from "../config/tracker.config"

export class TrackerService {
	private browser: Browser | null = null
	private page: Page | null = null
	private retryCount = 0

	// Initialize headless browser
	async initialize() {
		try {
			this.browser = await puppeteer.launch({
				headless: true,
				args: [
					"--no-sandbox",
					"--disable-setuid-sandbox",
					"--disable-dev-shm-usage",
					"--disable-gpu",
				],
			})

			this.page = await this.browser.newPage()
			await this.page.setUserAgent(getRandomUserAgent())
			await this.page.setViewport({ width: 1920, height: 1080 })

			// Set default timeout
			this.page.setDefaultNavigationTimeout(30000)
			this.page.setDefaultTimeout(30000)
		} catch (error) {
			console.error("Failed to initialize browser:", error)
			throw error
		}
	}

	// Track products in a category
	async trackCategory(
		category: Category,
		options: ScraperOptions = {}
	): Promise<WwsProduct[]> {
		if (!this.page) throw new Error("Browser not initialized")

		const {
			maxPages = Infinity,
			delayBetweenRequests = TRACKER_CONFIG.delayBetweenRequests,
		} = options

		console.log(
			`Starting to track category: ${category.name} (${category.id})`
		)
		let currentPage = 1
		let hasMorePages = true
		let trackedProducts = 0
		const products: WwsProduct[] = []

		// First visit the category page to get cookies
		await this.page.goto(
			`${TRACKER_CONFIG.baseUrl}/shop/browse/${category.urlFriendlyName}`
		)
		await sleep(2000)

		while (hasMorePages && currentPage <= maxPages) {
			try {
				// Navigate to the next page if not on first page
				if (currentPage > 1) {
					const nextPageUrl = `${TRACKER_CONFIG.baseUrl}/shop/browse/${category.urlFriendlyName}?pageNumber=${currentPage}`
					await this.page.goto(nextPageUrl)
					await sleep(2000) // Wait for page load
				}

				// Generate request body
				const requestBody = generateRequestBody(
					category.id,
					category.name,
					category.urlFriendlyName,
					currentPage
				)
				console.log(`Fetching page ${currentPage}...`)

				// Make the API request through the browser
				const response: WwsCategoryResponse = await this.page.evaluate(
					async (body, apiUrl) => {
						try {
							const resp = await fetch(apiUrl, {
								method: "POST",
								headers: {
									"Content-Type": "application/json",
									Accept: "application/json",
								},
								body: JSON.stringify(body),
								credentials: "include",
							})

							// Log response status and headers
							console.log(`Response status: ${resp.status}`)

							// Get response text first
							const text = await resp.text()
							console.log("Raw response:", text)

							// Try to parse JSON
							try {
								return JSON.parse(text)
							} catch (e) {
								console.error("JSON parse error:", e)
								throw new Error(
									`Failed to parse JSON: ${text.substring(
										0,
										200
									)}...`
								)
							}
						} catch (error) {
							console.error("Fetch error:", error)
							throw error
						}
					},
					requestBody,
					`${TRACKER_CONFIG.baseUrl}${TRACKER_CONFIG.endpoints.api}`
				)

				if (!response?.Bundles) {
					throw new Error(
						`Invalid response: ${JSON.stringify(response)}`
					)
				}

				const totalProducts = response.TotalRecordCount
				const pageCount = Math.round(totalProducts! / TRACKER_CONFIG.defaultPageSize) + 1

				const pageProducts = response.Bundles.flatMap(
					(bundle) => bundle.Products
				)
				products.push(...pageProducts)
				trackedProducts += pageProducts.length
				console.log(
					`Found ${pageProducts.length} products on page ${currentPage}. Expected ${totalProducts! - trackedProducts} products to be tracked. \n Page: ${currentPage} of ${String(pageCount)}`
				)

				hasMorePages =
					pageProducts.length === TRACKER_CONFIG.defaultPageSize ||
				trackedProducts < (totalProducts || 0)


				currentPage++
				this.retryCount = 0

				if (hasMorePages) {
					const delay = delayBetweenRequests + Math.random() * 1000
					await sleep(delay)
				}
			} catch (error) {
				if (!this.handleError(error, category, currentPage)) break
			}
		}

		return products
	}

	private handleError(
		error: any,
		category: Category,
		currentPage: number
	): boolean {
		console.error(
			`Error tracking category ${category.name}, page ${currentPage}:`,
			error
		)

		if (this.retryCount < TRACKER_CONFIG.maxRetries) {
			this.retryCount++
			const retryDelay =
				TRACKER_CONFIG.delayBetweenRequests * (this.retryCount + 1)
			console.log(
				`Retrying... Attempt ${this.retryCount} of ${TRACKER_CONFIG.maxRetries}`
			)
			sleep(retryDelay)
			return true
		}

		return false
	}

	async cleanup() {
		if (this.browser) {
			await this.browser.close()
			this.browser = null
			this.page = null
		}
	}
}