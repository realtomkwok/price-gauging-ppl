import { BaseTrackerService } from "./base-tracker.service"
import { IProduct } from "@/types/product.types"
import { WWS_CONFIG } from "@/config/wws.config"
import { IWoolworthsProductJson, IWoolworthsCategoryBundleJson } from "@/types/wws.types"
import puppeteer from "puppeteer"
import { generateRequestBody } from "@/utils/tracker.utils"
import { Category } from "@/types/tracker.types"

export class WwsTracker extends BaseTrackerService {
    protected retailerId: "wws" = "wws"

    protected buildUrl(category: Category, page: number): string {
        const wwsCategory = WWS_CONFIG.categories.find(
            (c) => c.id === category.id
		)
		
        return `${WWS_CONFIG.baseUrl}${WWS_CONFIG.endpoints.category}/${
            wwsCategory?.urlFriendlyName
        }?pageNumber=${page}`
    }

	protected async extractProducts(category: Category, currentPage: number): Promise<IWoolworthsProductJson[]> {
		if (!this.page) {
			throw new Error("Browser not initialized")
		}

        try {
            // Wait for the API response
            const requestBody = generateRequestBody(
                category.id,
                category.name,
                category.urlFriendlyName,
                currentPage
            )

            // Make the API request through the browser
            const response = await this.page.evaluate(
                async (body, apiUrl) => {
                    try {
                        const resp = await fetch(apiUrl, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                "Accept": "application/json",
                            },
                            body: JSON.stringify(body),
                            credentials: "include",
                        });

                        const text = await resp.text();

                        // Check if response is HTML (error page)
                        if (text.trim().startsWith("<!DOCTYPE") || text.trim().startsWith("<html")) {
                            const titleMatch = text.match(/<title>(.*?)<\/title>/i);
                            const h1Match = text.match(/<h1[^>]*>(.*?)<\/h1>/i);
                            const errorMessage = titleMatch?.[1] || h1Match?.[1] || "Unknown HTML response";
                            throw new Error(`Received HTML response: ${errorMessage}`);
                        }

                        // Parse JSON response
                        try {
                            return JSON.parse(text);
                        } catch (error) {
                            throw new Error(
                                `Invalid JSON response. Response starts with: ${text.substring(0, 200)}...`
                            );
                        }
                    } catch (error) {
                        console.error("Fetch error:", error);
                        throw error;
                    }
                },
                requestBody,
                `${WWS_CONFIG.baseUrl}${WWS_CONFIG.endpoints.api}`
            );

            if (!response?.Bundles) {
                throw new Error(
                    `Invalid response: ${JSON.stringify(response)}`
                );
            }

            // Extract products from all bundles
            return response.Bundles.flatMap((bundle: IWoolworthsCategoryBundleJson) => bundle.Bundles.flatMap((b) => b.Products));

        } catch (error) {
            console.error("Error extracting Woolworths products:", error);
            throw error;
        }
    }

    protected transformToCommonFormat(wwsProduct: IWoolworthsProductJson): IProduct {
        const now = new Date()

        return {
            id: `wws_${wwsProduct.Stockcode}`,
            retailerId: "wws",
            productId: wwsProduct.Stockcode.toString(),
            barcode: wwsProduct.Barcode,
            name: wwsProduct.Name,
            brand: wwsProduct.Brand || wwsProduct.AdditionalAttributes?.brand || "",
            description: wwsProduct.Description,
            packageSize: wwsProduct.PackageSize,
            pricing: [
                {
                    trackedAt: now,
                    current: wwsProduct.Price,
                    was: wwsProduct.WasPrice,
                    unit: {
                        price: wwsProduct.CupPrice,
                        measure: wwsProduct.CupMeasure,
                    },
                    isOnSpecial: wwsProduct.IsOnSpecial,
                    specialType: wwsProduct.IsHalfPrice ? ["Half Price"] : [],
                    offerDescription: "",
                },
            ],
            department: wwsProduct.AdditionalAttributes?.sapdepartmentname || "",
            category: wwsProduct.AdditionalAttributes?.sapcategoryname || "",
            subCategory: wwsProduct.AdditionalAttributes?.sapsubcategoryname || "",
            metadata: {
                createdAt: now,
                lastUpdated: now,
                imageUrls: [
                    wwsProduct.SmallImageFile,
                    wwsProduct.MediumImageFile,
                    wwsProduct.LargeImageFile,
                ].filter(Boolean),
            },
        }
    }

    protected async checkNextPage(
        currentPage: number,
        products: any[]
	): Promise<boolean> {
		// TODO: Check if there's a next page
		console.log(`Current page: ${currentPage}`)
		console.log(`Checking next page: ${currentPage + 1}`)
        return products.length === WWS_CONFIG.defaultPageSize
    }

    protected handleError(error: any, context: string): boolean {
        console.error(`Error in ${context}:`, error)
        this.retryCount++

        if (this.retryCount > this.maxRetries) {
            console.error(
                `Max retries (${this.maxRetries}) exceeded for ${context}`
            )
            return false
        }

        console.log(`Retrying... (${this.retryCount}/${this.maxRetries})`)
        return true
    }

    async initialize() {
        this.browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox']
        })
        this.page = await this.browser.newPage()

        // Set cookies if needed
        if (WWS_CONFIG.cookies) {
            const cookies = WWS_CONFIG.cookies.auth.split(';').map(cookie => {
                const [name = '', value = ''] = cookie.trim().split('=')
                return { name, value, domain: '.woolworths.com.au' }
            })
            await this.page.setCookie(...cookies)
        }
    }
}
