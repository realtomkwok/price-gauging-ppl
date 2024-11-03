import { WwsProduct } from "./wws-product.interface";

export type UserAgent = string;

export interface CategoryRequest {
  categoryId: string;
  pageNumber: number;
  pageSize: number;
  sortType: string;
  url: string;
  location: string;
  formatObject: string;
  isSpecial: boolean;
  isBundle: boolean;
  isMobile: boolean;
  filters: any[];
  token: string;
  gpBoost: number;
  isHideUnavailableProducts: boolean;
  isRegisteredRewardCardPromotion: boolean;
  enableAdReRanking: boolean;
  groupEdmVariants: boolean;
  categoryVersion: string;
}

export interface ScraperOptions {
  maxPages?: number;
  delayBetweenRequests?: number;
  userAgentRotation?: boolean;
}

export interface CategoryResponse {
  Bundles: Array<{
    Products: WwsProduct[];
  }>;
  TotalRecordCount: number;
  Page: number;
  PageSize: number;
}