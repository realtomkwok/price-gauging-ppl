import { getFirestore } from "firebase-admin/firestore"
import { AppProduct } from "../types"

const db = getFirestore()

export const FirebaseAdminService = {
	async saveProduct(stockcode: string, product: AppProduct): Promise<void> {
		if (!stockcode) {
			throw new Error("Cannot save product: stockcode is required")
		}

		try {
			const docRef = db.collection("products").doc(stockcode)
			const historyRef = db.collection("product-history").doc(stockcode)

			// Save current product data
			await docRef.set(product, { merge: true })

			const priceData = {
				[`prices.${Date.now()}`]: {
					price: product.pricing.current.price,
					wasPrice: product.pricing.current.wasPrice,
					cupPrice: product.pricing.current.cupPrice,
					cupMeasure: product.pricing.current.cupMeasure,
					savingsAmount: product.pricing.current.savingsAmount,
					effectiveDate: product.pricing.current.effectiveDate,
				},
			}

			// Save historical pricing data
			await historyRef.set(priceData, { merge: true })
		} catch (error) {
			console.error("Error saving product:", error)
			throw error
		}
	},
}
