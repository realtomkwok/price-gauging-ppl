import { TRACKER_CONFIG } from '../tracker/config';
import { USER_AGENTS } from './constants';

export const getRandomUserAgent = () => {
	if (!USER_AGENTS?.length) {
		throw new Error("USER_AGENTS is not properly configured");
	}
	const index = Math.floor(Math.random() * USER_AGENTS.length);
	return USER_AGENTS[index];
};

export const formatError = (error: any): string => {
	if (error.response) {
		return `HTTP ${error.response.status}: ${JSON.stringify(
			error.response.data
		)}`
	}
	return error.message || "Unknown error occurred"
}

export const generateRequestBody = (
	categoryId: string,
	name: string,
	urlFriendlyName: string,
	pageNumber: number
): any => ({
	categoryId,
	pageNumber,
	pageSize: TRACKER_CONFIG.defaultPageSize,
	sortType: "TraderRelevance",
	url: `/shop/browse/${urlFriendlyName}`,
	location: `/shop/browse/${urlFriendlyName}`,
	formatObject: JSON.stringify({ name: name }),
	isSpecial: false,
	isBundle: false,
	isMobile: false,
	filters: [],
	token: "",
	gpBoost: 0,
	isHideUnavailableProducts: false,
	isRegisteredRewardCardPromotion: false,
	enableAdReRanking: false,
	groupEdmVariants: true,
	categoryVersion: "v2",
})

export const generateRequestId = (length: number = 32): string => {
	const chars = "abcdef0123456789"
	let result = ""
	for (let i = 0; i < length; i++) {
		result += chars.charAt(Math.floor(Math.random() * chars.length))
	}
	return result
}

export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));