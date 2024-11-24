# Trackers
## File Structure
```
tracker/
├── data/
├── src/
│   ├── config/
│   ├── functions/
│   │   ├── base.ts
│   │   ├── coles.ts
│   │   ├── woolies.ts
│   ├── services/
│   ├── types/
│   ├── utils/
│   ├── index.ts
│   ├── env.ts
├── .gitignore
├── package.json
├── tsconfig.json
├── README.md
```

##  Woolworths
When visiting each category page, the client will make a request to Woolworths' API to get the products in that category. Taking [Fruit & Veg](https://www.woolworths.com.au/shop/browse/fruit-veg]) as an example, the request body is as follows:
```json
{
    "categoryId": "1-E5BEE36E",
    "pageNumber": 1,
    "pageSize": 36,         
    "sortType": "TraderRelevance",
    "url": "/shop/browse/fruit-veg?pageNumber=1",
    "location": "/shop/browse/fruit-veg?pageNumber=1",
    "formatObject": "{\"name\":\"Fruit & Veg\"}",
    "isSpecial": false,
    "isBundle": false,
    "isMobile": false,
    "filters": [],
    "token": "",
    "gpBoost": 0,
    "isHideUnavailableProducts": false,
    "isRegisteredRewardCardPromotion": false,
    "enableAdReRanking": false,
    "groupEdmVariants": true,
    "categoryVersion": "v2"
}

```
The response contains a query of maximum 36 products and category information. The tracker then extract the product information and price, normalize the data and save it to the database.
### Pagination

### Extracting Product Information
Product information is store in the first object of `"Products"` array. The object contains the following information and can be mapped into our data's structure:
```text
retailer_id+wooliesProducts.Stockcode => products.id
wooliesProducts.Barcode => products.barcode
```



## Coles
Coles' data endpoint is available but more hidden. When visiting the category page via the pagination button, a response is made to the API endpoint: `[category_endpoint].json?slug=[category_slug]` (`endpoint` and `slug` are the same in this case). The response contains 51 items under `pageProps/searchResults/results` and category information. Among the 51 items, only 48 are products and they are labelled as `"PRODUCT"` by the key `"_type"`. Rest of them are promotion cards whc=ich are labelled as `"SINGLE_TILE"`. 

### Pagination

## Types
```bash
`supabase gen types typescript --project-id etqqqzwmkaaxuhdicypa > src/types/database.types.ts
````