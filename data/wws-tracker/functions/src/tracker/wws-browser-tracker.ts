import puppeteer, { Browser, Page } from "puppeteer"
import { TRACKER_CONFIG } from "./config"
import { ScraperOptions, WwsProduct } from "../types"
import { sleep, generateRequestBody } from "../utils/tracker.utils"
import { FirebaseService } from "../services/firebase.service"
import { mapWwsToAppProduct } from "../utils/product-mapper.utils"
import { WwsCategoryResponse } from "../types"

export class WwsBrowserTracker {
	private browser: Browser | null = null
	private page: Page | null = null
	private currentRetries: number = 0

	async init() {
		this.browser = await puppeteer.launch({
			headless: true,
			args: ["--no-sandbox", "--disable-setuid-sandbox"],
		})
		this.page = await this.browser.newPage()

		// Set a realistic viewport
		await this.page.setViewport({ width: 1280, height: 800 })

		// Set user agent
		await this.page.setUserAgent(TRACKER_CONFIG.headers["User-Agent"])
	}

	async close() {
		if (this.browser) {
			await this.browser.close()
		}
	}

	async trackCategory(
		categoryId: string,
		name: string,
		urlFriendlyName: string,
		options: ScraperOptions = {}
	) {
		if (!this.page) throw new Error("Browser not initialized")

		const {
			maxPages = Infinity,
			delayBetweenRequests = TRACKER_CONFIG.delayBetweenRequests,
		} = options

		console.log(`Starting to track category: ${name} (${categoryId})`)
		let currentPage = 1
		let hasMorePages = true
		const trackedProducts: WwsProduct[] = []

		// First visit the category page to get cookies
		await this.page.goto(
			`https://www.woolworths.com.au/shop/browse/${urlFriendlyName}`
		)
		await sleep(2000) // Wait for cookies to be set

		while (hasMorePages && currentPage <= maxPages) {
			try {
				// Navigate to the next page if not on first page
				if (currentPage > 1) {
					const nextPageUrl = `https://www.woolworths.com.au/shop/browse/${urlFriendlyName}?pageNumber=${currentPage}`
					await this.page.goto(nextPageUrl)
					await sleep(2000) // Wait for page load
				}

				const requestBody = generateRequestBody(
					categoryId,
					name,
					urlFriendlyName,
					currentPage
				)
				console.log(`Fetching page ${currentPage}...`)

				// Make the API request through the browser
				const response = (await this.page.evaluate(
					async (body, apiUrl) => {
						const resp = await fetch(apiUrl, {
							method: "POST",
							headers: {
								"Content-Type": "application/json",
								Accept: "application/json",
							},
							body: JSON.stringify(body),
							credentials: "include",
						})
						return resp.json()
					},
					requestBody,
					`${TRACKER_CONFIG.baseUrl}${TRACKER_CONFIG.endpoints.browse}`
				)) as WwsCategoryResponse

				if (!response?.Bundles) {
					throw new Error(
						`Invalid response: ${JSON.stringify(response)}`
					)
				}

				const products = response.Bundles.flatMap(
					(bundle) => bundle.Products
				)
				trackedProducts.push(...products)

				console.log(
					`Found ${products.length} products on page ${currentPage}`
				)
				await this.saveProducts(products)

				hasMorePages =
					products.length === TRACKER_CONFIG.defaultPageSize
				currentPage++
				this.currentRetries = 0

				if (hasMorePages) {
					const delay = delayBetweenRequests + Math.random() * 1000
					console.log(`Waiting ${delay}ms before next request...`)
					await sleep(delay)
				}
			} catch (error: any) {
				console.error(
					`Error tracking category ${name}, page ${currentPage}:`,
					error
				)

				if (this.currentRetries < TRACKER_CONFIG.maxRetries) {
					this.currentRetries++
					const retryDelay =
						delayBetweenRequests * (this.currentRetries + 1)
					console.log(
						`Retrying... Attempt ${this.currentRetries} of ${TRACKER_CONFIG.maxRetries} after ${retryDelay}ms`
					)
					await sleep(retryDelay)
					continue
				}
				break
			}
		}

		return trackedProducts
	}

	protected async saveProducts(products: WwsProduct[]) {
		let savedCount = 0
		const errors: Array<{ stockcode: string; error: any }> = []

		for (const product of products) {
			try {
				const mappedProduct = mapWwsToAppProduct(product)
				await FirebaseService.saveProduct(
					product.Stockcode.toString(),
					mappedProduct
				)
				savedCount++
			} catch (error) {
				console.error(
					`Error saving product ${product.Stockcode}:`,
					error
				)
				errors.push({ stockcode: product.Stockcode.toString(), error })
			}
		}

		console.log(`Saved ${savedCount}/${products.length} products`)
		if (errors.length > 0) {
			console.warn(`Failed to save ${errors.length} products`)
		}
	}
}
