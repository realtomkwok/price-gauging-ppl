import {getFirestore, Timestamp} from "firebase-admin/firestore";
import {WwsProduct, AppProduct, Category} from "../types";
import {mapWwsToAppProduct} from "../utils/product-mapper.utils";
import { TRACKER_CONFIG } from "../config/tracker.config"

export class FirestoreService {
  private db = getFirestore();
  
  async saveBatchCategories(): Promise<void> {
      const batch = this.db.batch()
      
      TRACKER_CONFIG.categories.forEach((category: Category) => {
        const docRef = this.db.collection("categories").doc(category.id)
        batch.set(docRef, {
          ...category,
          isActive: true,
        })
      })
      
      await batch.commit()
      console.log("Categories seeded successfully")
  }

  async saveBatchProducts(products: WwsProduct[]): Promise<void> {
    const batches = [];
    let currentBatch = this.db.batch();
    let operationCount = 0;

    for (const product of products) {
      try {
        if (operationCount >= 499) {
          batches.push(currentBatch);
          currentBatch = this.db.batch();
          operationCount = 0;
        }

        const mappedProduct = mapWwsToAppProduct(product);
        // const stockcode = product.Stockcode.toString();
        const barcode = product.Barcode.toString();

        const productRef = this.db.collection("products").doc(barcode);
        const historyRef = this.db.collection("product-history").doc(barcode);

        currentBatch.set(productRef, mappedProduct, {merge: true});
        currentBatch.set(historyRef, this.formatHistoryData(mappedProduct), {
          merge: true,
        });

        operationCount += 2;
      } catch (error) {
        console.error(`Error processing product ${product.Barcode} - ${product.DisplayName}:`, error);
      }
    }

    if (operationCount > 0) {
      batches.push(currentBatch);
    }

    try {
      await Promise.all(batches.map((batch) => batch.commit()));
      console.log(`Successfully saved ${products.length} products`);
    } catch (error) {
      console.error("Error committing batches:", error);
      throw error;
    }
  }

  private formatHistoryData(product: AppProduct) {
    return {
      [`prices.${Date.now()}`]: {
        price: product.pricing.current.price,
        wasPrice: product.pricing.current.wasPrice,
        cupPrice: product.pricing.current.cupPrice,
        cupMeasure: product.pricing.current.cupMeasure,
        isOnSpecial: product.status.isOnSpecial,
        isHalfPrice: product.status.isHalfPrice,
        timestamp: Timestamp.now(),
      },
    };
  }

  async getCategoriesToTrack(): Promise<Category[]> {
    const snapshot = await this.db
      .collection("categories")
      .where("isActive", "==", true)
      .get();

    return snapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        }) as Category,
    );
  }
}

