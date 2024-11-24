import puppeteer, { Browser, HTTPResponse, Page } from "puppeteer"
import { SupabaseClient } from "@supabase/supabase-js"
import { Database, Tables, TablesInsert } from "../types/database.types"
import { IColesProduct, IColesResponse, IWooliesProduct, IWooliesResponse } from "../types/responses.types"
import { BrowserConfig } from "../types/tracker.types"

export abstract class BaseTracker<T> {
    protected browser: Browser | null = null
    protected page: Page | null = null
    protected config: BrowserConfig
    protected db: SupabaseClient<Database>
    protected interceptedData: Map<string, T> = new Map()
    protected totalPages: number | undefined = undefined
    protected testCategories?: Tables<"wws_tracking_categories" | "coles_tracking_categories">[]
    
    protected constructor(
        config: BrowserConfig, 
        db: SupabaseClient<Database>,
        testCategories?: Tables<"wws_tracking_categories" | "coles_tracking_categories">[]
    ) {
        this.config = config
        this.db = db
        this.testCategories = testCategories
    }
    
    // Abstract methods to be specific for retailers
    protected abstract getCategories(): Promise<Tables<"wws_tracking_categories" | "coles_tracking_categories">[]>
    protected abstract handleInterception(url: string, data: IWooliesResponse | IColesResponse): Promise<void>
    protected abstract getProducts(endpoint: string): Promise<IWooliesProduct[] | IColesProduct[]>
    protected abstract saveProducts(products: IWooliesProduct[] | IColesProduct[]): Promise<void>
    
    protected async getAllProducts(endpoint: string): Promise<void> {
        if (!this.page) throw new Error("Page not initialized")
        
        let currentPage = 1
        let hasMoreProducts = true
        
        while (hasMoreProducts) {
            try {
                console.log(`Fetching page ${currentPage}...`)
                
                this.interceptedData.clear()
                
                let navigationSuccessful: boolean
                
                if (currentPage > 1) {
                    if (this.config.pagination.type === 'url') {
                        const pageUrl = `${this.config.baseUrl}${endpoint}${
                            this.config.pagination.urlPattern?.replace('{page}', currentPage.toString())
                        }`
                        navigationSuccessful = await this.safeNavigate(pageUrl)
                    } else {
                        const nextButton = await this.page.$(this.config.selectors!.nextPageButton!)
                        if (!nextButton) {
                            hasMoreProducts = false
                            break
                        }
                        await nextButton.click()
                        await this.page.waitForNetworkIdle()
                        navigationSuccessful = true
                    }
                } else {
                    navigationSuccessful = await this.safeNavigate(`${this.config.baseUrl}${endpoint}`)
                }
                
                if (!navigationSuccessful) {
                    console.error(`Failed to navigate on page ${currentPage}`)
                    break
                }
                
                const pageProducts = await this.getProducts(endpoint)
                if (!pageProducts.length) {
                    hasMoreProducts = false
                    break
                }
                
                await this.saveProducts(pageProducts)
                console.log(`Saved ${pageProducts.length} products from page ${currentPage}`)
                
                if (this.totalPages && currentPage >= this.totalPages) {
                    hasMoreProducts = false
                }
                
                currentPage++
                await this.randomDelay(3000, 6000)
                
            } catch (error) {
                console.error(`Error fetching page ${currentPage}:`, error)
                break
            }
        }
    }
    
	async track(): Promise<void> {
		try {
			await this.init()
			await this.setupInterception()

			// Use test categories if provided, otherwise fetch from database
            const categories: Tables<"wws_tracking_categories" | "coles_tracking_categories">[] = this.testCategories || await this.getCategories()
            
			// Track each category
			for (const category of categories) {
				try {
					console.log(`Tracking category: ${category.name}`)
                    await this.getAllProducts(category.endpoint!)
                    await this.randomDelay(3000, 7000)
                } catch (error) {
                    console.error(`Error tracking category: ${category.name}`, error)
                }
            }
        } finally {
            await this.cleanup()
        }
    }
    
    protected async init(): Promise<void> {
        this.browser = await puppeteer.launch({
            headless: false, // Try with visible browser first for debugging
            args: [
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-dev-shm-usage",
                "--disable-accelerated-2d-canvas",
                "--disable-gpu",
                "--window-size=1920x1080",
                "--disable-web-security",
                "--disable-features=IsolateOrigins,site-per-process",
                "--disable-blink-features=AutomationControlled"
            ],
            ignoreHTTPSErrors: true
        });

        this.page = await this.browser.newPage();
        
        // Mask automation
        await this.page.evaluateOnNewDocument(() => {
            // Pass webdriver check
            Object.defineProperty(navigator, 'webdriver', {
                get: () => false,
            });

            // Pass chrome check
            window.chrome = {
                runtime: {},
                // add other chrome properties as needed
            };

            // Pass notifications check
            const originalQuery = window.navigator.permissions.query;
            window.navigator.permissions.query = (parameters: any): Promise<any> => 
                parameters.name === 'notifications' 
                    ? Promise.resolve({ state: Notification.permission }) 
                    : originalQuery(parameters);
        });

        // Set additional headers
        await this.page.setExtraHTTPHeaders({
            ...this.config.requestHeaders,
            'Accept-Language': 'en-US,en;q=0.9',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
            'sec-ch-ua': '"Google Chrome";v="119", "Chromium";v="119", "Not?A_Brand";v="24"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"'
        });

        await this.page.setViewport(this.config.viewport);
        await this.page.setUserAgent(this.config.userAgent);
    }
    
    protected async setupInterception(): Promise<void> {
        if (!this.page) throw new Error("Page not initialized")
        
        // Setup request interception
        await this.page.setRequestInterception(true)
        
        this.page.on("request", async (req) => {
            const url = req.url()
            if (this.config.interceptPatterns.some((pattern) => url.includes(pattern))) {
                req.continue()
            }
            else {
                req.abort()
                console.log(`Failed to intercept: ${url}`)
            }
        })
        
        this.page.on("response", async (res) => {
            const url = res.url()
            if (this.config.interceptPatterns.some((pattern) => url.includes(pattern))) {
                try {
                    const data = await res.json()
                    // TODO: Parse the response data to the correct type
                    await this.handleInterception(url, data)
                } catch (error) {
                    console.error(`Error handling interception: ${error}`)
                }
            }
        })
    }
    
    protected async randomDelay(min: number, max: number): Promise<void> {
        const delay = Math.floor(Math.random() * ( max - min + 1 )) + min
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
    
    protected async safeNavigate(url: string, maxRetries = 3): Promise<boolean> {
        let attempts = 0;
        while (attempts < maxRetries) {
            try {
                if (!this.page) throw new Error("Page not initialized");
                
                await this.page.goto(url, {
                    waitUntil: 'networkidle0',
                    timeout: 30000 // Increase timeout to 30 seconds
                });
                
                // Check if we hit a CAPTCHA or error page
                const title = await this.page.title();
                if (title.toLowerCase().includes('captcha') || title.toLowerCase().includes('access denied')) {
                    throw new Error('Detected security check page');
                }
                
                return true;
            } catch (error) {
                attempts++;
                console.error(`Navigation attempt ${attempts} failed:`, error);
                
                if (attempts === maxRetries) {
                    console.error(`Failed to navigate to ${url} after ${maxRetries} attempts`);
                    return false;
                }
                
                // Add exponential backoff
                const delay = Math.pow(2, attempts) * 1000;
                await this.randomDelay(delay, delay + 2000);
            }
        }
        return false;
    }
}
