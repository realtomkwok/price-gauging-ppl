-- Levels of categories
-- 1. Department, 2: Category, 3: Subcategory

-- Create enum types for category levels
CREATE TYPE products.category_level AS ENUM ('department', 'category', 'subcategory');

-- Normalized product categories
CREATE TABLE products.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    level products.category_level NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(name, level)
);

-- Retailer specific product categories mappings
CREATE TABLE products.retailer_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    retailer_id UUID NOT NULL REFERENCES products.retailers(id),
    category_id UUID NOT NULL REFERENCES products.categories(id),
    external_id VARCHAR(100) NOT NULL,       -- Retailer specific category ID
    external_name VARCHAR(255) NOT NULL,     -- Retailer specific category name
    external_endpoint TEXT NOT NULL ,        -- Retailer specific category URL
    external_parent_id VARCHAR(100),         -- Retailer specific parent category ID
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (retailer_id, external_id)
);