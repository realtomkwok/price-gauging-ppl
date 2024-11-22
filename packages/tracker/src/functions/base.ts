import puppeteer, { Browser, HTTPResponse, Page } from "puppeteer"
import { IColesResponse, IWooliesResponse } from "../types/responses.type"
import { SupabaseClient } from "@supabase/supabase-js"
import { Database } from "../types/supabase.type"
// import { Product, Price } from '../types';、 】=
export interface BrowserConfig {
	id: string
	name: string
	baseUrl: string
	requestHeaders: Record<string, string>
	userAgent: string
	viewport: { width: number; height: number }
	selectors: {
		nextPageButton?: string
		loadMoreButton?: string
		productContainer?: string
	}
	interceptPatterns: string[]
}

export abstract class BaseTracker {
	protected browser: Browser | null = null
	protected page: Page | null = null
	protected config: BrowserConfig
	protected db: SupabaseClient<Database>
	protected interceptedData: Map<string, any> = new Map()

	constructor(config: BrowserConfig, db: SupabaseClient<Database>) {
		this.config = config
		this.db = db
	}

	// Abstract methods to be specific for retailers
	protected abstract getCategories(): Promise<
		{ id: string; name: string; endpoint: string }[]
	>
	protected abstract getProducts(endpoint: string): Promise<any[]> // TODO: Define Product Type
	protected abstract saveProducts(products: any[]): Promise<void>
	protected abstract handleInterception(url: string, data: any): Promise<void>
	protected abstract normalizeProduct(product: any): any

	async track(): Promise<void> {
		try {
			await this.init() // TODO: Initialize the browser and page
			await this.setupInterception() // TODO: Setup interception

			const categoriesRes = await this.getCategories()

			for (const category of categoriesRes) {
				try {
					console.log(`Tracking category: ${category.name}`)
					const products = await this.getProducts(category.endpoint)
					await this.saveProducts(products)

					// Random delay between 3-7 seconds
					await this.randomDelay(3000, 7000)
				} catch (error) {
					console.error(`Error tracking category: ${category.name}`)
				}
			}
		} finally {
			await this.cleanup()
		}
	}

	protected async init(): Promise<void> {
		this.browser = await puppeteer.launch({
			headless: true,
			args: [
				"--no-sandbox",
				"--disable-setuid-sandbox",
				"disable-dev-shm-usage",
			],
		})

		this.page = await this.browser.newPage()

		// Viewport configuration
		// await this.page.setViewport({ width: 1280, height: 800 })
		await this.page.setViewport(this.config.viewport)

		// User agent
		await this.page.setUserAgent(this.config.userAgent)

		// Randomize arguments for more human-like behavior
		await this.page.setExtraHTTPHeaders(this.config.requestHeaders)
    }
    
	protected async setupInterception(): Promise<void> {
        if (!this.page) throw new Error("Page not initialized")

		// Setup request interception
        await this.page.setRequestInterception(true)

		this.page.on("request", async (req) => {
			const url = req.url()
			if (this.config.interceptPatterns.some((pattern) => url.includes(pattern))) {
				req.continue()
			} else {
				req.abort()
			}
        })
        
        this.page.on("response", async (res) => {
            const url = res.url()
            if (this.config.interceptPatterns.some((pattern) => url.includes(pattern))) {
				try {
					const data = await res.json()
					await this.handleInterception(url, data)
				} catch (error) {
					console.error(`Error handling interception: ${error}`)
				}
			}
		})
    }
    
    protected async randomDelay(min: number, max: number): Promise<void> {
        const delay = Math.floor(Math.random() * (max - min + 1)) + min
        await new Promise((resolve) => setTimeout(resolve, delay))
    }

    protected async cleanup(): Promise<void> {
        if (this.page) {
            await this.page.close()
			this.page = null
		}

		if (this.browser) {
			await this.browser.close()
			this.browser = null
		}
	}
}
