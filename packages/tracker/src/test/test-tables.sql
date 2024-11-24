-- Test category table
CREATE TABLE IF NOT EXISTS wws_tracking_categories_test (
    LIKE wws_tracking_categories INCLUDING ALL
);

-- Insert a single test category
INSERT INTO wws_tracking_categories_test (id, name, endpoint)
VALUES (
    1,
    'Test Category - Bread',
    '/shop/browse/bakery/bread'
);

-- Test products table
CREATE TABLE IF NOT EXISTS products_test (
    LIKE products INCLUDING ALL
);

-- Test prices table
CREATE TABLE IF NOT EXISTS prices_test (
    LIKE prices INCLUDING ALL
); 