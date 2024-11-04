import axios, { AxiosInstance } from "axios"
import { TRACKER_CONFIG } from "./config"
import { ScraperOptions, CategoryResponse, WwsProduct } from "../types"
import { FirebaseService } from "../services/firebase.service"
import { mapWwsToAppProduct } from "../utils/product-mapper.utils"
import {
	sleep,
	generateRequestBody,
	generateRequestId,
} from "../utils/tracker.utils"

export class WwsApiTracker {
	private axiosInstance: AxiosInstance
	private currentRetries: number = 0

	constructor() {
		this.axiosInstance = axios.create({
			baseURL: TRACKER_CONFIG.baseUrl,
			timeout: 60000,
			headers: {
				accept: "application/json, text/plain, */*",
				"accept-language": "en-US,en;q=0.9",
				"content-type": "application/json",
				priority: "u=1, i",
				"sec-ch-ua":
					'"Chromium";v="130", "Google Chrome";v="130", "Not?A_Brand";v="99"',
				"sec-ch-ua-mobile": "?0",
				"sec-ch-ua-platform": '"macOS"',
				"sec-fetch-dest": "empty",
				"sec-fetch-mode": "cors",
				"sec-fetch-site": "same-origin",
				"User-Agent": TRACKER_CONFIG.headers["User-Agent"],
				Referer: "https://www.woolworths.com.au/shop/browse",
				Origin: "https://www.woolworths.com.au",
			},
			withCredentials: true,
		})

		// Add request interceptor to add dynamic headers
		this.axiosInstance.interceptors.request.use((config) => {
			const requestId = generateRequestId()
			config.headers["request-id"] = `|${requestId}.${generateRequestId(
				8
			)}`
			config.headers[
				"traceparent"
			] = `00-${requestId}-${generateRequestId(8)}-01`

			// Add cookies if they exist in config
			if (TRACKER_CONFIG.cookies.auth || TRACKER_CONFIG.cookies.session) {
				config.headers[
					"Cookie"
				] = `${TRACKER_CONFIG.cookies.auth}; ${TRACKER_CONFIG.cookies.session}`
			}

			return config
		})

		// Add response interceptor for debugging
		this.axiosInstance.interceptors.response.use(
			(response) => response,
			(error) => {
				if (error.response) {
					console.error("Response error:", {
						status: error.response.status,
						headers: error.response.headers,
						data: error.response.data,
					})
				} else if (error.request) {
					console.error("Request error:", error.message)
				}
				return Promise.reject(error)
			}
		)
	}

	async trackCategory(
		categoryId: string,
		name: string,
		urlFriendlyName: string,
		options: ScraperOptions = {}
	) {
		const {
			maxPages = Infinity,
			delayBetweenRequests = TRACKER_CONFIG.delayBetweenRequests,
		} = options

		console.log(`Starting to track category: ${name} (${categoryId})`)
		let currentPage = 1
		let hasMorePages = true
		const trackedProducts: WwsProduct[] = []

		while (hasMorePages && currentPage <= maxPages) {
			try {
				const requestBody = generateRequestBody(
					categoryId,
					name,
					urlFriendlyName,
					currentPage
				)
				console.log(`Fetching page ${currentPage}...`)

				const response =
					await this.axiosInstance.post<CategoryResponse>(
						TRACKER_CONFIG.endpoints.browse,
						requestBody
					)

				if (!response.data?.Bundles) {
					throw new Error(
						`Invalid response: ${JSON.stringify(response.data)}`
					)
				}

				const products = response.data.Bundles.flatMap(
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
				const errorMessage = error.response
					? `HTTP ${error.response.status}: ${JSON.stringify(
							error.response.data
					  )}`
					: error.message

				console.error(
					`Error tracking category ${name}, page ${currentPage}:`,
					errorMessage
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

	private async saveProducts(products: WwsProduct[]) {
		console.log(`Saving ${products.length} products to Firebase...`)

		for (const product of products) {
			try {
				const appProduct = mapWwsToAppProduct(product)
				await FirebaseService.saveProduct(
					product.Stockcode.toString(),
					appProduct
				)
			} catch (error) {
				console.error(
					`Error saving product ${product.Stockcode}:`,
					error
				)
			}
		}
	}
}
