CREATE TABLE products.prices (
    -- Identifiers
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products.items(id),
    tracked_at TIMESTAMPTZ NOT NULL,

    -- Price information
    current_price NUMERIC(10, 2) NOT NULL,
    was_price NUMERIC(10, 2),       -- Nullable as not all retailers provide was price
    unit_price NUMERIC(10, 2) NOT NULL,
    unit_measurement VARCHAR(50) NOT NULL,      -- e.g. per 100g, per kg, per item
    is_on_special BOOLEAN DEFAULT false,
    special_type TEXT[] NOT NULL DEFAULT '{}',  -- e.g. half price, 2 for 1, etc.
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE products.prices IS 'Historical product prices';