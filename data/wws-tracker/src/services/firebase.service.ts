import { initializeApp } from "firebase/app"
import {initializeFirestore} from "firebase/firestore"
import {
	doc,
	setDoc,
	getDoc,
} from "firebase/firestore"
import { AppProduct } from "../types"
import 'dotenv/config'

// Validate required Firebase config values
const requiredConfig = [
	'FIREBASE_API_KEY',
	'FIREBASE_AUTH_DOMAIN', 
	'FIREBASE_PROJECT_ID',
	'FIREBASE_STORAGE_BUCKET',
	'FIREBASE_MESSAGING_SENDER_ID',
	'FIREBASE_APP_ID'
];

const missingConfig = requiredConfig.filter(key => !process.env[key]);
if (missingConfig.length > 0) {
	throw new Error(`Missing required Firebase config: ${missingConfig.join(', ')}`);
}

const firebaseConfig = {
	apiKey: process.env.FIREBASE_API_KEY,
	authDomain: process.env.FIREBASE_AUTH_DOMAIN,
	projectId: process.env.FIREBASE_PROJECT_ID,
	storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
	messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
	appId: process.env.FIREBASE_APP_ID,
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

const db = initializeFirestore(app, {
		experimentalForceLongPolling: true,
		// useFetchStreams: false,
})

export const FirebaseService = {
	async saveProduct(stockcode: string, product: AppProduct): Promise<void> {
		if (!stockcode) {
			throw new Error("Cannot save product: stockcode is required")
		}

		try {
			const docRef = doc(db, "products", stockcode)
			const historyRef = doc(db, "product-history", stockcode)

			// Save current product data
			await setDoc(docRef, product, { merge: true })

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

			// Save historical pricing data separately
			await setDoc(historyRef, priceData, { merge: true })
		} catch (error) {
			console.error("Error saving product to Firebase:", error, {
				stockcode,
				productName: product.basic.name,
			})
			throw error
		}
	},

	async getProductHistory(stockcode: string): Promise<Record<string, any>> {
		if (!stockcode) {
			throw new Error("Cannot get product history: stockcode is required")
		}

		try {
			const historyRef = doc(db, "product-history", stockcode)
			const snapshot = await getDoc(historyRef)

			if (!snapshot.exists()) {
				console.debug(`No history found for product: ${stockcode}`)
				return {}
			}

			return snapshot.data()
		} catch (error) {
			console.error("Error fetching product history:", error, {
				stockcode,
			})
			throw error
		}
	},
}
