CREATE OR REPLACE FUNCTION products.search_products(
    keywords TEXT,                              -- parameter: search keywords
    min_rank FLOAT DEFAULT 0.01                 -- parameter: minimum relevance score (0-1)
) RETURNS TABLE (                               -- return type: table with columns
    product_id UUID,
    retailer_id UUID,
    name VARCHAR(255),
    brand VARCHAR(50),
    categories TEXT[],
    search_rank FLOAT
                ) AS $func$
BEGIN
    RETURN QUERY
    SELECT
        p.id AS product_id,
        p.retailer_id,
        p.name,
        p.brand,
        p.categories,
        ts_rank_cd(p.search_vector, query) AS search_rank
    FROM
        products.items p,
        -- Convert keywords to tsquery and replace spaces with ' & '
        to_tsquery('english', regexp_replace(keywords, '\s+', ' & ', 'g')) query
    WHERE
        p.search_vector @@ query
        AND p.is_available = true
        AND ts_rank_cd(p.search_vector, query) >= min_rank
    ORDER BY
        search_rank DESC;            -- Order by relevance score
END;
$func$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION products.get_latest_price(
     internal_product_id UUID
) RETURNS TABLE (
    current_price DECIMAL(10, 2),
    was_price DECIMAL(10, 2),
    unit_price DECIMAL(10, 2),
    unit_measurement VARCHAR(50),
    is_on_special BOOLEAN,
    special_type TEXT[],
    tracked_at TIMESTAMPTZ
                ) AS $$
BEGIN
    RETURN QUERY
    SELECT
        p.current_price,
        p.was_price,
        p.unit_price,
        p.unit_measurement,
        p.is_on_special,
        p.special_type,
        p.tracked_at
    FROM
        products.prices p
    WHERE
        p.product_id = internal_product_id
    ORDER BY
        p.tracked_at DESC
    LIMIT 1;
END;
$$ LANGUAGE plpgsql;