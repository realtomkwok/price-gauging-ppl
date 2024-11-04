import { Timestamp } from 'firebase/firestore';
import { WwsProduct, AppProduct } from '../types';

// export const parseNutritionalInfo = (nipJson: string): AppProduct['nutritionalInfo'] | undefined => {
//   if (!nipJson) {
//     console.debug('No nutritional info provided');
//     return undefined;
//   }
  
//   try {
//     const nip = JSON.parse(nipJson);
    
//     if (!nip.Attributes || !Array.isArray(nip.Attributes)) {
//       console.warn('Invalid nutritional info format:', nip);
//       return undefined;
//     }

//     const per100g: Record<string, string> = {};
//     const perServing: Record<string, string> = {};
//     let servingSize = '';
//     let servingsPerPack = '';

//     nip.Attributes.forEach((attr: any) => {
//       try {
//         if (!attr.Name || typeof attr.Value === 'undefined') {
//           console.warn('Invalid attribute format:', attr);
//           return;
//         }

//         if (attr.Name.includes('Per 100g')) {
//           const name = attr.Name.replace(' Quantity Per 100g - Total - NIP', '').toLowerCase();
//           per100g[name] = attr.Value;
//         } else if (attr.Name.includes('Per Serve')) {
//           const name = attr.Name.replace(' Quantity Per Serve - Total - NIP', '').toLowerCase();
//           perServing[name] = attr.Value;
//         } else if (attr.Name === 'Serving Size - Total - NIP') {
//           servingSize = attr.Value;
//         } else if (attr.Name === 'Servings Per Pack - Total - NIP') {
//           servingsPerPack = attr.Value;
//         }
//       } catch (attrError) {
//         console.error('Error processing nutritional attribute:', attrError, attr);
//       }
//     });

//     return {
//       servingSize,
//       servingsPerPack,
//       per100g,
//       perServing
//     };
//   } catch (e) {
//     console.error('Error parsing nutritional information:', e, { nipJson });
//     return undefined;
//   }
// };

// export const parseAllergens = (
//   containsStr: string | null,
//   mayContainStr: string | null
// ): AppProduct['allergens'] | undefined => {
//   try {
//     const allergens: AppProduct['allergens'] = {
//       contains: [],
//       mayContain: []
//     };

//     if (containsStr) {
//       allergens.contains = containsStr.split(',')
//         .map(a => a.trim())
//         .filter(a => a.length > 0);
//     }

//     if (mayContainStr) {
//       allergens.mayContain = mayContainStr.split(',')
//         .map(a => a.trim())
//         .filter(a => a.length > 0);
//     }

//     return allergens.contains.length || allergens.mayContain.length ? allergens : undefined;
//   } catch (e) {
//     console.error('Error parsing allergens:', e, { containsStr, mayContainStr });
//     return undefined;
//   }
// };

export const mapWwsToAppProduct = (woolworthsProduct: WwsProduct): AppProduct => {
  try {
    if (!woolworthsProduct.Stockcode || !woolworthsProduct.Name) {
      throw new Error(`Invalid Woolworths product data: missing required fields`);
    }

    const sanitizeString = (value: string | null | undefined, fieldName?: string): string => {
      const result = value?.toString().trim() || '';
      if (fieldName && !result) {
        console.debug(`Empty string value for field: ${fieldName}`);
      }
      return result;
    };

    const sanitizeNumber = (value: number | null | undefined, fieldName?: string): number => {
      if (typeof value !== 'number' || isNaN(value)) {
        console.debug(`Invalid number value for field: ${fieldName}`, value);
        return 0;
      }
      return value;
    };

    const sanitizeBoolean = (value: boolean | null | undefined, fieldName?: string): boolean => {
      if (typeof value !== 'boolean') {
        console.debug(`Non-boolean value for field: ${fieldName}`, value);
      }
      return Boolean(value);
    };

    return {
      basic: {
        barcode: sanitizeString(woolworthsProduct.Barcode),
        name: sanitizeString(woolworthsProduct.Name),
        displayName: sanitizeString(woolworthsProduct.DisplayName || woolworthsProduct.Name),
        urlFriendlyName: sanitizeString(woolworthsProduct.UrlFriendlyName),
        description: sanitizeString(woolworthsProduct.Description).replace(/<br>/g, ' '),
        images: {
          small: sanitizeString(woolworthsProduct.SmallImageFile),
          medium: sanitizeString(woolworthsProduct.MediumImageFile),
          large: sanitizeString(woolworthsProduct.LargeImageFile),
        },
        brand: woolworthsProduct.Brand,
        variety: sanitizeString(woolworthsProduct.Variety),
        packageSize: sanitizeString(woolworthsProduct.PackageSize),
        unit: sanitizeString(woolworthsProduct.Unit),
        minimumQuantity: sanitizeNumber(woolworthsProduct.MinimumQuantity),
      },
      status: {
        isNew: sanitizeBoolean(woolworthsProduct.IsNew),
        isHalfPrice: sanitizeBoolean(woolworthsProduct.IsHalfPrice),
        isOnlineOnly: sanitizeBoolean(woolworthsProduct.IsOnlineOnly),
        isOnSpecial: sanitizeBoolean(woolworthsProduct.IsOnSpecial),
        isAvailable: sanitizeBoolean(woolworthsProduct.IsAvailable),
        isPurchasable: sanitizeBoolean(woolworthsProduct.IsPurchasable),
        ageRestricted: sanitizeBoolean(woolworthsProduct.AgeRestricted),
        supplyLimit: sanitizeNumber(woolworthsProduct.SupplyLimit),
        productLimit: sanitizeNumber(woolworthsProduct.ProductLimit),
      },
      pricing: {
        current: {
          price: sanitizeNumber(woolworthsProduct.Price),
          wasPrice: sanitizeNumber(woolworthsProduct.WasPrice),
          cupPrice: sanitizeNumber(woolworthsProduct.CupPrice),
          cupMeasure: sanitizeString(woolworthsProduct.CupMeasure),
          savingsAmount: sanitizeNumber(woolworthsProduct.SavingsAmount),
          effectiveDate: Timestamp.fromDate(new Date()),
        },
      },
    };
  } catch (e) {
    console.error('Error mapping Woolworths product:', e, {
      stockcode: woolworthsProduct.Stockcode,
      name: woolworthsProduct.Name
    });
    throw e;
  }
};