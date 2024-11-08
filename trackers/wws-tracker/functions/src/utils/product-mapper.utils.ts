import {Timestamp} from "firebase-admin/firestore";
import {WwsProduct, AppProduct, Category} from "../types";

export const mapWwsToAppProduct = (
  woolworthsProduct: WwsProduct,
  category: Category,
): AppProduct => {
  try {
    if (!woolworthsProduct.Stockcode || !woolworthsProduct.Name) {
      throw new Error(
        "Invalid Woolworths product data: missing required fields",
      );
    }

    const sanitizeString = (
      value: string | null | undefined,
      fieldName?: string,
    ): string => {
      const result = value?.toString().trim() || "";
      if (fieldName && !result) {
        console.debug(`Empty string value for field: ${fieldName}`);
      }
      return result;
    };

    const sanitizeNumber = (
      value: number | null | undefined,
      fieldName?: string,
    ): number => {
      if (typeof value !== "number" || isNaN(value)) {
        console.debug(
          `Invalid number value for field "${fieldName || "unknown"}":`,
          {
            value,
            type: typeof value,
            isNaN: isNaN(value as number),
            fieldPath: new Error().stack, // This will show the call stack
          });
        return 0;
      }
      return value;
    };

    const sanitizeBoolean = (
      value: boolean | null | undefined,
      fieldName?: string,
    ): boolean => {
      if (typeof value !== "boolean") {
        console.debug(`Non-boolean value for field: ${fieldName}`, value);
      }
      return Boolean(value);
    };

    return {
      basic: {
        barcode: sanitizeString(woolworthsProduct.Barcode),
        name: sanitizeString(woolworthsProduct.Name),
        displayName: sanitizeString(
          woolworthsProduct.DisplayName || woolworthsProduct.Name,
        ),
        urlFriendlyName: sanitizeString(woolworthsProduct.UrlFriendlyName),
        description: sanitizeString(woolworthsProduct.Description).replace(
          /<br>/g,
          " ",
        ),
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
        category: {
          id: category.id,
          name: category.name,
          urlFriendlyName: category.urlFriendlyName,
        },
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
      lastUpdated: Timestamp.now(),
    };
  } catch (e) {
    console.error("Error mapping Woolworths product:", e, {
      stockcode: woolworthsProduct.Stockcode,
      name: woolworthsProduct.Name,
    });
    throw e;
  }
};
