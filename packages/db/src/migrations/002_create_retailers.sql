CREATE TABLE products.retailers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(10) NOT NULL UNIQUE,
    name VARCHAR(50) NOT NULL UNIQUE,
    category_endpoint VARCHAR(255),
    product_endpoint VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON COLUMN products.retailers.category_endpoint IS 'Fetch products from categories: https://www.woolworths.com.au/shop/browse/{category}';
COMMENT ON COLUMN products.retailers.product_endpoint IS 'Fetch a single product from: https://www.woolworths.com.au/shop/productdetails/{stockcode}';

