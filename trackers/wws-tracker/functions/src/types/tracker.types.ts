export interface Category {
  id: string;
  name: string;
  urlFriendlyName: string;
}

export interface ScraperOptions {
  maxPages?: number;
  delayBetweenRequests?: number;
  userAgentRotation?: boolean;
}

export interface TrackerConfig {
  baseUrl: string;
  endpoints: {
    category: string;
    product: string;
    api: string;
  };
  defaultPageSize: number;
  maxRetries: number;
  delayBetweenRequests: number;
  userAgents: string[];
  cookies: {
    auth: string;
    session: string;
  };
  headers: {
    "Content-Type": string;
    Accept: string;
    "User-Agent": string;
  };
  categories: Category[];
}
