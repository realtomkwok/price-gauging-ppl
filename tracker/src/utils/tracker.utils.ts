export const sleep = (ms: number) =>
	new Promise((resolve) => setTimeout(resolve, ms))

export function generateRequestBody(
    categoryId: string,
    categoryName: string,
    urlFriendlyName: string,
    pageNumber: number
) {
    return {
        categoryId,
        categoryName,
        pageNumber,
        pageSize: 48,
        url: urlFriendlyName,
        location: "National",
        formatObject: {
            name: categoryName
        }
    };
}
