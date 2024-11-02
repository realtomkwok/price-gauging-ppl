import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase.config';
import { AppProduct } from '../types/app-product.interface';

export const FirebaseService = {
  async getProduct(stockcode: string): Promise<AppProduct | null> {
    try {
      const docRef = doc(db, 'products', stockcode);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return docSnap.data() as AppProduct;
      }
      return null;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  },

  async getProducts(filters?: { [key: string]: any }): Promise<AppProduct[]> {
    try {
      let productsQuery = collection(db, 'products');
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          productsQuery = query(productsQuery, where(key, '==', value));
        });
      }
      
      const querySnapshot = await getDocs(productsQuery);
      return querySnapshot.docs.map(doc => doc.data() as AppProduct);
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }
};