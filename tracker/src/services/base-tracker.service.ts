import { Browser, Page } from "puppeteer"
import { Category, TrackerOptions } from "@/types/tracker.types"
import { IProduct } from "@/types/product.types"
import UserAgent from "user-agents"
import { sleep } from "@/utils/tracker.utils"
import { Product } from "@/models/product.model"

export abstract class BaseTrackerService {
	protected browser: Browser | null = null
	protected page: Page | null = null
	protected retryCount = 0
	protected abstract retailerId: "coles" | "wws"

	constructor(
		protected readonly maxRetries: number = 5,
		protected readonly delayBetweenRequests: number = 2000
	) {}

	protected abstract extractProducts(category: Category, currentPage: number): Promise<any[]>
	protected abstract buildUrl(category: Category, page: number): string
	protected abstract checkNextPage(
		currentPage: number,
		products: any[]
	): Promise<boolean>
	protected abstract handleError(error: any, context: string): boolean
	protected abstract transformToCommonFormat(product: any): IProduct

	protected async saveProduct(product: IProduct): Promise<void> {
		try {
			// Find existing product by id
			const existingProduct = await Product.findOne({
				id: product.id,
				retailerId: product.retailerId
			});

			if (existingProduct) {
				// Update existing product
				existingProduct.name = product.name;
				existingProduct.brand = product.brand;
				existingProduct.description = product.description;
				existingProduct.packageSize = product.packageSize;
				existingProduct.department = product.department;
				existingProduct.category = product.category;
				existingProduct.subCategory = product.subCategory;
				
				// Add new pricing data
				existingProduct.pricing.push(...product.pricing);
				
				// Update metadata
				existingProduct.metadata.lastUpdated = new Date();
				existingProduct.metadata.imageUrls = product.metadata.imageUrls;

				await existingProduct.save();
				console.log(`Updated ${product.retailerId} product: ${product.name} (${product.id})`);
			} else {
				// Create new product using the base model
				const newProduct = new Product(product);
				await newProduct.save();
				console.log(`Created new ${product.retailerId} product: ${product.name} (${product.id})`);
			}
		} catch (error) {
			console.error(`Error saving ${product.retailerId} product ${product.id}:`, error);
			throw error;
		}
	}

	async trackCategory(
		category: Category,
		options: TrackerOptions = {}
	): Promise<IProduct[]> {
		if (!this.page) throw new Error("Browser not initialized")

		const {
			maxPages = Infinity,
			delayBetweenRequests = this.delayBetweenRequests,
		} = options

		console.log(
			`Starting to track ${this.retailerId} category: ${category.name}`
		)

		let currentPage = 1
		let hasMorePages = true
		const products: IProduct[] = []

		while (hasMorePages && currentPage <= maxPages) {
			try {
				const url = this.buildUrl(category, currentPage)
				await this.page.goto(url)
				await sleep(2000)

				await this.page.setUserAgent(new UserAgent().toString())

				const pageProducts = await this.extractProducts(category, currentPage)

				for (const product of pageProducts) {
					const transformedProduct = this.transformToCommonFormat(product)
					await this.saveProduct(transformedProduct)
					products.push(transformedProduct)
				}

				hasMorePages = await this.checkNextPage(
					currentPage,
					pageProducts
				)
				currentPage++
				this.retryCount = 0

				if (hasMorePages) {
					await sleep(delayBetweenRequests + Math.random() * 200)
				}
			} catch (error) {
				if (
					!this.handleError(
						error,
						`${this.retailerId} category ${category.name}`
					)
				)
					break
			}
		}

		return products
	}

	async cleanup(): Promise<void> {
		if (this.browser) {
			await this.browser.close()
			this.browser = null
			this.page = null
		}
		this.retryCount = 0
		console.log(`${this.retailerId} cleanup complete`)
	}
}
