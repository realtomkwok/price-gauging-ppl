-- Update timestamp trigger
CREATE OR REPLACE FUNCTION products.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

-- Update search vector trigger
CREATE OR REPLACE FUNCTION products.update_search_vector()
RETURNS TRIGGER AS $$
BEGIN
    NEW.search_vector :=
        setweight(to_tsvector('english', coalesce(NEW.name, '')), 'A') ||
        setweight(to_tsvector('english', coalesce(NEW.description, '')), 'B') ||
        setweight(to_tsvector('english', coalesce(NEW.brand, '')), 'C') ||
        setweight(to_tsvector('english', coalesce(NEW.categories::text, '')), 'D');
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

-- Create triggers
CREATE TRIGGER update_retailer_updated_at
    BEFORE UPDATE ON products.retailers
    FOR EACH ROW
    EXECUTE FUNCTION products.update_updated_at_column();

CREATE TRIGGER update_product_updated_at
    BEFORE UPDATE ON products.items
    FOR EACH ROW
    EXECUTE FUNCTION products.update_updated_at_column();

CREATE TRIGGER products_search_vector_update
    BEFORE INSERT OR UPDATE ON products.items
    FOR EACH ROW
    EXECUTE FUNCTION products.update_search_vector();