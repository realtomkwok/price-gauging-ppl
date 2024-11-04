import {Timestamp} from "firebase-admin/firestore";

export interface AppProduct {
  basic: {
    barcode: string;
    name: string;
    displayName: string;
    urlFriendlyName: string;
    description: string;
    images: {
      small: string;
      medium: string;
      large: string;
    };
    brand: string | null;
    variety: string;
    packageSize: string;
    unit: string;
    minimumQuantity: number;
  };
  status: {
    isNew: boolean;
    isHalfPrice: boolean;
    isOnlineOnly: boolean;
    isOnSpecial: boolean;
    isAvailable: boolean;
    isPurchasable: boolean;
    ageRestricted: boolean;
    supplyLimit: number;
    productLimit: number;
  };
  pricing: {
    current: {
      price: number;
      wasPrice: number;
      cupPrice: number;
      cupMeasure: string;
      savingsAmount: number;
      effectiveDate: Timestamp;
    };
  };
}
