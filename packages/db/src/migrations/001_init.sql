CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE SCHEMA IF NOT EXISTS products;
COMMENT ON SCHEMA products IS 'Schema for normalized product data and price history';
