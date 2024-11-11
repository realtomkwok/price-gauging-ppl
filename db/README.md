# PGP Database

**Outdated. Need update to align with the current data schema**

This directory contains the database schema and data for the `price-gauging-ppl`'s database.

## File Structure

### Models

-   `ProductModel.ts`: Defines the database schema for a product.

### Types

-   `product.type.ts`: Defines the type for a product.

### Config

-   `mongodb.config.ts`: Configuration for the MongoDB connection.

## Database Schema
### ProductModel Schema

The product schema represents a retail product with its pricing and historical data across different retailers.

#### Core Fields
- `barcode` (String): Unique identifier for the product, used as primary key
- `retailerId` (String): Identifier for the retailer this product data is from
- `lastUpdated` (Date): Timestamp of when this product was last updated

#### Basic ProductModel Information 
Basic product details are the same across all retailers and will be displayed on the price tracker app.

_Notes: Data from Woolworths and Coles may be different._

- `basic`: Core product details
  - `name`: ProductModel name
  - `description`: ProductModel description
  - `urlFriendlyName`: URL-safe version of product name (format: `retailerId-barcode-barcode-name`)
  - `images`: ProductModel images in different sizes
    - `small`: Small image URL
    - `medium`: Medium image URL
    - `large`: Large image URL

#### Retailer-Specific Data
- `retailerData`: Contains retailer-specific product information
  - `woolworths`: Woolworths-specific data
    - `stockcode`: Internal Woolworths product code
    - `gtinFormat`: GTIN format code
    - `isBundle`: Whether product is sold as a bundle
    - `price`: Current pricing information
      - `current`: Current price
      - `claimedWas`: Previous price claimed by retailer
      - `cup`: Unit pricing information
      - `isOnSpecial`: Whether product is on special
      - `savingsAmount`: Amount saved if on special
    - `details`: Additional product details
  - `coles`: Coles-specific data (_Similar structure to Woolworths, with retailer-specific fields_)
    - `mfr`: Manufacturer-specific data (_Similar structure to Woolworths, with retailer-specific fields_)

#### Historical Data
- `priceHistory`: Array of historical price records
  - `retailerId`: Retailer identifier
  - `timestamp`: When price was recorded
  - `price`: Price at that time
  - `wasPrice`: Previous price if applicable
  - `isSpecial`: Whether was on special
  - `specialType`: Type of special if applicable
  - `promotions`: Additional promotion details

#### Categorization
- `categories`: ProductModel categories across retailers
  - `retailerId`: Retailer identifier
  - `categoryId`: Category identifier
  - `name`: Category name
  - `path`: Full category hierarchy path
