import { BaseTracker } from "./base"
import { IWooliesProduct, IWooliesResponse } from "../types/responses.types"
import { SupabaseClient } from "@supabase/supabase-js"
import { Database, Tables, TablesInsert } from "../types/database.types"
import UserAgent from "user-agents"
import { BrowserConfig } from "../types/tracker.types"

export class WooliesTracker extends BaseTracker<IWooliesResponse> {
	constructor(
		db: SupabaseClient<Database>,
		testCategories?: Tables<"wws_tracking_categories">[]
	) {
		const config: BrowserConfig = {
			id: "wws",
			name: "Woolworths",
			baseUrl: "https://www.woolworths.com.au/shop/browse",
			userAgent: new UserAgent({ deviceCategory: "desktop" }).toString(),
			viewport: { width: 1280, height: 800 },
			requestHeaders: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
			interceptPatterns: ["apis/ui/browse/category"],
			pagination: {
				enabled: true,
				type: "url",
				itemsPerPage: 36,
				urlPattern: "?pageNumber={page}",
			},
		}
		super(config, db, testCategories)
	}

	protected async getCategories(): Promise<
		Tables<"wws_tracking_categories">[]
	> {
		const { data, error } = await this.db
			.from("wws_tracking_categories")
			.select("*")

		if (error) throw error
		return data as Tables<"wws_tracking_categories">[]
	}

	protected async handleInterception(
		url: string,
		res: IWooliesResponse
	): Promise<void> {
		try {
			// Log the intercepted response for debugging
			console.log("Intercepted URL:", url)
			console.log("Response res structure:", Object.keys(res))

			// Store the intercepted response
			this.interceptedData.set(url, res)
			this.totalPages = Math.ceil(
				res.TotalRecordCount / this.config.pagination.itemsPerPage
			)
		} catch (error) {
			console.error("Error handling interception:", error)
		}
	}

	protected async getProducts(endpoint: string): Promise<IWooliesProduct[]> {
		if (!this.page) throw new Error("Page not initialized")

		// Clear previous intercepted data
		this.interceptedData.clear()

		// Navigate to the category page
		await this.page.goto(`${this.config.baseUrl}${endpoint}`, {
			waitUntil: "networkidle0",
		})

		// Wait for the category API response
		await this.page.waitForResponse(
			(response) =>
				response.url().includes("apis/ui/Browse/category") &&
				response.status() === 200,
			{ timeout: 10000 }
		)

		// Get the intercepted category data
		let products: IWooliesProduct[] = []
		for (const [_, data] of this.interceptedData) {
			if (data?.Bundles?.length > 0) {
				products = [
					...products,
					...data.Bundles.flatMap((bundle) => bundle.Products),
				]
			}
		}

		console.log(`Found ${products.length} products in category`)
		return products
	}

	protected async saveProducts(products: IWooliesProduct[]): Promise<void> {
		// First normalize the products
		const normalizedProducts = products.map((product) =>
			this.normalizeProduct(product)
		)

		// Insert products
		const { error: productsError } = await this.db
			.from("products")
			.upsert(normalizedProducts, {
				onConflict: "external_id",
				ignoreDuplicates: false,
			})

		if (productsError) {
			console.error("Error saving products:", productsError)
			throw productsError
		}

		// Then normalize the price data
		const prices = products.map((product) => this.normalizePricing(product))

		const { error: pricesError } = await this.db
			.from("prices")
			.insert(prices)

		if (pricesError) {
			console.error("Error saving prices:", pricesError)
			throw pricesError
		}
	}

	protected normalizeProduct(
		product: IWooliesProduct
	): TablesInsert<"products"> {
		return {
			retailer_id: this.config.id,
			external_id: product.Stockcode.toString(),
			name: product.Name,
			brand: product.Brand,
			description: product.Description || "",
			image_urls: [product.LargeImageFile],
			categories: [product.Variety || ""],
			package_size: product.PackageSize,
			metadata: {
				url: `${this.config.baseUrl}/shop/productdetails/${product.Stockcode}`,
			},
		}
	}

	protected normalizePricing(
		product: IWooliesProduct
	): TablesInsert<"prices"> {
		const special_types = []

		switch ((product.IsHalfPrice, product.IsOnSpecial)) {
			case product.IsHalfPrice:
				special_types.push("half_price")
				break
			case product.IsOnSpecial:
				special_types.push("on_special")
				break
			default:
				break
		}

		return {
			retailer_id: this.config.id,
			external_id: product.Stockcode.toString(),
			updated_at: new Date().toISOString(),
			current_price: product.Price,
			in_store_price: product.InstorePrice,
			was_price: product.WasPrice,
			unit_price: product.CupPrice,
			unit_measurement: product.PackageSize,
			is_on_special: Boolean(product.IsOnSpecial),
			special_type: special_types,
		}
	}
}
