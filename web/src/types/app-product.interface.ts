import { Timestamp } from 'firebase/firestore';

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
    history?: Record<string, {
      price: number;
      wasPrice: number;
      cupPrice: number;
      cupMeasure: string;
      savingsAmount: number;
      effectiveDate: Timestamp;
    }>;
  };
  nutritionalInfo?: {
    servingSize: string;
    servingsPerPack: string;
    per100g: Record<string, string>;
    perServing: Record<string, string>;
  };
  allergens?: {
    contains: string[];
    mayContain: string[];
  };
  tags: Record<string, {
    type: string;
    position: string;
    content: Record<string, string>;
  }>;
}