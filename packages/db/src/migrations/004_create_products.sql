CREATE TABLE products.items (
    -- Product identifiers
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    retailer_id UUID NOT NULL REFERENCES products.retailers(id),
    external_id VARCHAR(50) NOT NULL,

    -- Basic product information
    name VARCHAR(255) NOT NULL,
    brand VARCHAR(50) NOT NULL,
    description TEXT,
    package_size VARCHAR(100) NOT NULL,
    barcode VARCHAR(100),        -- Nullable as Coles does not provide barcode
    image_urls TEXT[] NOT NULL DEFAULT '{}',

    -- Categories
    categories TEXT[] NOT NULL DEFAULT '{}',

    -- Flexible additional attributes
    metadata JSONB DEFAULT '{}',

    -- Product and tracking status
    is_available BOOLEAN DEFAULT true,      -- Product availability status
    last_synced_at TIMESTAMP,               -- Last time product was synced from retailers

    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Constraints
    UNIQUE(retailer_id, external_id)
);