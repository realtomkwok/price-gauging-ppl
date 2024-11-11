import { TrackerConfig } from "@/types/tracker.types"
import { WWS_CONFIG } from "@config/wws.config"
import { COLES_CONFIG } from "./coles.config";

// export const TRACKER_CONFIG: TrackerConfig = {

// 	defaultPageSize: 36,
// 	maxRetries: 5,
// 	delayBetweenRequests: 5000, // 5 seconds
// 	cookies: WWS_CONFIG.cookies,
// 	},
// 	headers: {
// 		"Content-Type": "application/json",
// 		Accept: "application/json"
// 	}
// }

export const createTrackerConfig = (store: 'wws' | 'coles'): TrackerConfig => {
	const config = store === 'wws' ? WWS_CONFIG : COLES_CONFIG;
	
	return {
		baseUrl: config.baseUrl,
		endpoints: config.endpoints,
		defaultPageSize: 36,
		maxRetries: 5,
		delayBetweenRequests: 5000, // 5 seconds
		cookies: config.cookies,
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json"
		}
	};
};