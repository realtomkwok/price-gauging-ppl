import {WwsProduct} from "./wws-product.interface";

export interface WwsCategoryResponse {
  SeoMetaTags?: {
    Title: string;
    MetaDescription: string;
    Groups: any[];
  };
  Bundles: {
    Products: WwsProduct[];
    Name: string;
    DisplayName: string;
  }[];
  TotalRecordCount?: number;
  UpperDynamicContent?: any;
  LowerDynamicContent?: any;
  RichRelevancePlacement?: {
    placement_name: string | null;
    message: string | null;
    Products: any[];
    Items: any[];
    StockcodesForDiscover: any[];
  };
  Aggregations?: Array<{
    Name: string;
    DisplayName: string;
    Type: string;
    FilterType: string;
    FilterDataType: string;
    Results: any[] | null;
    ResultsGrouped: Array<{
      Alphabet: string;
      Filters: Array<{
        Name: string;
        Term: string;
        ExtraOutputFields: Record<string, any>;
        Min: number | null;
        Max: number | null;
        Applied: boolean;
        Count: number;
        Statement: string | null;
        DisplayCoachMarks: boolean;
      }>;
    }> | null;
    State: string;
    Rank: number;
    AdditionalResults: boolean;
    DesignType: string;
    ShowFilter: boolean;
    Statement: string | null;
    DisplayCoachMarks: boolean;
    DisplayIcons: boolean;
  }>;
  HasRewardsCard?: boolean;
  HasTobaccoItems?: boolean;
  Success?: boolean;
}
