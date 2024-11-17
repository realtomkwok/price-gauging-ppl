-- Product details view
CREATE OR REPLACE VIEW products.product_details AS
SELECT p.*,
       r.name        AS retailer_name,
       lp.current_price,
       lp.was_price,
       lp.unit_price,
       lp.unit_measurement,
       lp.is_on_special,
       lp.special_type,
       lp.tracked_at AS price_tracked_at
FROM products.items p
         JOIN products.retailers r ON p.retailer_id = r.id
         LEFT JOIN LATERAL (
    SELECT *
    FROM products.prices pp
    WHERE pp.product_id = p.id
    ORDER BY pp.tracked_at DESC
    LIMIT 1
    ) lp ON true
WHERE p.is_available = true;

-- Category view
CREATE OR REPLACE VIEW products.category_stats AS
SELECT unnest(categories)          AS category,
       count(*)                    as product_count,
       count(DISTINCT retailer_id) as retailer_count,
       avg(COALESCE((SELECT current_price
                     FROM products.prices
                     WHERE product_id = products.items.id
                     ORDER BY tracked_at DESC
                     LIMIT 1), 0)) as avg_price
FROM products.items
WHERE is_available = true
GROUP BY category
ORDER BY product_count DESC;