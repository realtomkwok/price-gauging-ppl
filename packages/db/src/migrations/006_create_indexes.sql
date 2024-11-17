-- Products indexes
CREATE INDEX idx_products_retailer ON products.items (retailer_id);
CREATE INDEX idx_products_external ON products.items (external_id);
CREATE INDEX idx_products_name ON products.items (name);
CREATE INDEX idx_products_barcode ON products.items (barcode);
CREATE INDEX idx_products_categories ON products.items USING GIN (categories);

-- Add `search_vector` column to each product for full-text search
-- Uses weights for different fields (A > B > C > D)
---- A: Name (highest weight) -> B: Description -> C: Brand -> D: Categories (the least weight)
ALTER TABLE products.items ADD COLUMN search_vector TSVECTOR;
CREATE INDEX idx_products_search ON products.items USING GIN (search_vector);

-- Price history indexes
CREATE INDEX idx_prices_product ON products.prices (product_id);
CREATE INDEX idx_prices_tracked_at ON products.prices (tracked_at);
CREATE INDEX idx_prices_on_special ON products.prices (is_on_special)
    WHERE is_on_special = true;
CREATE INDEX idx_prices_special_type ON products.prices USING GIN (special_type);