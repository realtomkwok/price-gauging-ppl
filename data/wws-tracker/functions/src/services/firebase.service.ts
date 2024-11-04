// import { initializeApp } from "firebase/app"
// import { initializeFirestore } from "firebase/firestore"
// import { doc, setDoc, getDoc } from "firebase/firestore"
// import { AppProduct } from "../types"
//
// const firebaseConfig = {
// 	apiKey: process.env.FIREBASE_CONFIG.fb.api_key,
// 	authDomain: process.env.FIREBASE_CONFIG.fb.auth_domain,
// 	projectId: process.env.FIREBASE_CONFIG.fb.project_id,
// 	storageBucket: process.env.FIREBASE_CONFIG.firebase.storage_bucket,
// 	messagingSenderId: process.env.FIREBASE_CONFIG.firebase.messaging_sender_id,
// 	appId: process.env.FIREBASE_CONFIG.firebase.app_id,
// }
//
// // Initialize Firebase
// const app = initializeApp(firebaseConfig)
//
// const db = initializeFirestore(app, {
// 	experimentalForceLongPolling: true,
// 	// useFetchStreams: false,
// })
//
// export const FirebaseService = {
// 	async saveProduct(stockcode: string, product: AppProduct): Promise<void> {
// 		if (!stockcode) {
// 			throw new Error("Cannot save product: stockcode is required")
// 		}
//
// 		try {
// 			const docRef = doc(db, "products", stockcode)
// 			const historyRef = doc(db, "product-history", stockcode)
//
// 			// Save current product data
// 			await setDoc(docRef, product, { merge: true })
//
// 			const priceData = {
// 				[`prices.${Date.now()}`]: {
// 					price: product.pricing.current.price,
// 					wasPrice: product.pricing.current.wasPrice,
// 					cupPrice: product.pricing.current.cupPrice,
// 					cupMeasure: product.pricing.current.cupMeasure,
// 					savingsAmount: product.pricing.current.savingsAmount,
// 					effectiveDate: product.pricing.current.effectiveDate,
// 				},
// 			}
//
// 			// Save historical pricing data separately
// 			await setDoc(historyRef, priceData, { merge: true })
// 		} catch (error) {
// 			console.error("Error saving product to Firebase:", error, {
// 				stockcode,
// 				productName: product.basic.name,
// 			})
// 			throw error
// 		}
// 	},
//
// 	async getProductHistory(stockcode: string): Promise<Record<string, any>> {
// 		if (!stockcode) {
// 			throw new Error("Cannot get product history: stockcode is required")
// 		}
//
// 		try {
// 			const historyRef = doc(db, "product-history", stockcode)
// 			const snapshot = await getDoc(historyRef)
//
// 			if (!snapshot.exists()) {
// 				console.debug(`No history found for product: ${stockcode}`)
// 				return {}
// 			}
//
// 			return snapshot.data()
// 		} catch (error) {
// 			console.error("Error fetching product history:", error, {
// 				stockcode,
// 			})
// 			throw error
// 		}
// 	},
// }
