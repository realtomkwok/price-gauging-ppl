import { Timestamp } from 'firebase/firestore';
import { WoolworthsProduct } from '../types/wws-product.interface.ts';
import { AppProduct } from '../types/app-product.interface.ts';
import { parseNutritionalInfo, parseAllergens } from './wws-additional-info.helper.ts';

export function mapWoolworthsToAppProduct(woolworthsProduct: WoolworthsProduct): AppProduct {
  const nutritionalInfo = parseNutritionalInfo(woolworthsProduct.AdditionalAttributes.nutritionalinformation);
  const allergens = parseAllergens(
    woolworthsProduct.AdditionalAttributes.allergencontains,
    woolworthsProduct.AdditionalAttributes.allergenmaybepresent
  );

  return {
    basic: {
      barcode: woolworthsProduct.Barcode,
      name: woolworthsProduct.Name,
      displayName: woolworthsProduct.DisplayName,
      urlFriendlyName: woolworthsProduct.UrlFriendlyName,
      description: woolworthsProduct.Description.replace(/<br>/g, ' '),
      images: {
        small: woolworthsProduct.SmallImageFile,
        medium: woolworthsProduct.MediumImageFile,
        large: woolworthsProduct.LargeImageFile,
      },
      brand: woolworthsProduct.Brand,
      variety: woolworthsProduct.Variety,
      packageSize: woolworthsProduct.PackageSize,
      unit: woolworthsProduct.Unit,
      minimumQuantity: woolworthsProduct.MinimumQuantity,
    },
    status: {
      isNew: woolworthsProduct.IsNew,
      isHalfPrice: woolworthsProduct.IsHalfPrice,
      isOnlineOnly: woolworthsProduct.IsOnlineOnly,
      isOnSpecial: woolworthsProduct.IsOnSpecial,
      isAvailable: woolworthsProduct.IsAvailable,
      isPurchasable: woolworthsProduct.IsPurchasable,
      ageRestricted: woolworthsProduct.AgeRestricted,
      supplyLimit: woolworthsProduct.SupplyLimit,
      productLimit: woolworthsProduct.ProductLimit,
    },
    pricing: {
      current: {
        price: woolworthsProduct.Price,
        wasPrice: woolworthsProduct.WasPrice,
        cupPrice: woolworthsProduct.CupPrice,
        cupMeasure: woolworthsProduct.CupMeasure,
        savingsAmount: woolworthsProduct.SavingsAmount,
        effectiveDate: Timestamp.now(),
      }
    },
    tags: woolworthsProduct.Tags.reduce((acc, tag) => {
      const tagId = `${tag.Content.Type}-${Date.now()}`;
      acc[tagId] = {
        type: tag.Content.Type,
        position: tag.Content.Position,
        content: tag.Content.Attributes
      };
      return acc;
    }, {} as AppProduct['tags']),
    ...(nutritionalInfo && { nutritionalInfo }),
    ...(allergens && { allergens }),
  };
}