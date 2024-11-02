export interface WoolworthsProduct {
  Stockcode: number;
  Barcode: string;
  Name: string;
  DisplayName: string;
  Description: string;
  UrlFriendlyName: string;
  SmallImageFile: string;
  MediumImageFile: string;
  LargeImageFile: string;
  Brand: string | null;
  Variety: string;
  PackageSize: string;
  Unit: string;
  MinimumQuantity: number;
  Price: number;
  WasPrice: number;
  CupPrice: number;
  CupMeasure: string;
  SavingsAmount: number;
  IsNew: boolean;
  IsHalfPrice: boolean;
  IsOnlineOnly: boolean;
  IsOnSpecial: boolean;
  IsAvailable: boolean;
  IsPurchasable: boolean;
  AgeRestricted: boolean;
  SupplyLimit: number;
  ProductLimit: number;
  Tags: Array<{
    Content: {
      Type: string;
      Position: string;
      Attributes: Record<string, string>;
    };
  }>;
  AdditionalAttributes: {
    nutritionalinformation: string;
    allergencontains: string | null;
    allergenmaybepresent: string | null;
  };
}