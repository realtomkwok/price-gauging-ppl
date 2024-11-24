CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. First create the matched_products table since it's new
CREATE TABLE IF NOT EXISTS public.matched_products
(
    match_id         uuid                  NOT NULL DEFAULT gen_random_uuid(),
    retailer_id      text                  NOT NULL,
    external_id      character varying(50) NOT NULL,
    match_confidence numeric(4, 3)         NULL,
    created_at       timestamp with time zone       DEFAULT CURRENT_TIMESTAMP,
    updated_at       timestamp with time zone       DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT matched_products_pkey PRIMARY KEY (match_id, retailer_id, external_id),
    CONSTRAINT match_confidence_range CHECK (match_confidence >= 0 AND match_confidence <= 1)
);

CREATE INDEX IF NOT EXISTS idx_matched_products_match_id ON public.matched_products USING btree (match_id);
CREATE INDEX IF NOT EXISTS idx_matched_products_confidence ON public.matched_products USING btree (match_confidence);

-- 2. Modify the products table
-- First, drop existing constraints and indexes
ALTER TABLE public.prices DROP CONSTRAINT IF EXISTS prices_product_id_fkey;
ALTER TABLE public.prices DROP CONSTRAINT IF EXISTS prices_product_id_key;
ALTER TABLE public.products DROP CONSTRAINT IF EXISTS prodcuts_pkey;
ALTER TABLE public.products DROP CONSTRAINT IF EXISTS prodcuts_retailer_id_external_id_key;
DROP INDEX IF EXISTS idx_products_retailer;
DROP INDEX IF EXISTS idx_products_external;

-- Add temporary column to preserve existing IDs if needed
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS old_id uuid;
UPDATE public.products SET old_id = id WHERE old_id IS NULL;

-- Drop the id column
ALTER TABLE public.products DROP COLUMN IF EXISTS id CASCADE;

-- Add new primary key
ALTER TABLE public.products 
    ADD CONSTRAINT products_pkey PRIMARY KEY (retailer_id, external_id);

-- 3. Modify the prices table
-- First, drop existing constraints
ALTER TABLE public.prices DROP CONSTRAINT IF EXISTS prices_pkey;
ALTER TABLE public.prices DROP CONSTRAINT IF EXISTS prices_product_id_key;

-- Add new columns
ALTER TABLE public.prices 
    ADD COLUMN IF NOT EXISTS retailer_id text,
    ADD COLUMN IF NOT EXISTS external_id character varying(50);

-- Update new columns using the products table's old_id
UPDATE public.prices p
SET 
    retailer_id = pr.retailer_id,
    external_id = pr.external_id
FROM public.products pr
WHERE p.product_id = pr.old_id;

-- Make new columns NOT NULL after populating data
ALTER TABLE public.prices 
    ALTER COLUMN retailer_id SET NOT NULL,
    ALTER COLUMN external_id SET NOT NULL;

-- Drop old column
ALTER TABLE public.prices DROP COLUMN IF EXISTS product_id;

-- Add new primary key and foreign key
ALTER TABLE public.prices 
    ADD CONSTRAINT prices_pkey PRIMARY KEY (retailer_id, external_id, tracked_at),
    ADD CONSTRAINT prices_product_fkey FOREIGN KEY (retailer_id, external_id) 
        REFERENCES products (retailer_id, external_id);

-- 4. Add foreign key to matched_products after tables are updated
ALTER TABLE public.matched_products 
    ADD CONSTRAINT matched_products_product_fkey 
    FOREIGN KEY (retailer_id, external_id) 
    REFERENCES products (retailer_id, external_id) 
    ON DELETE CASCADE;

-- 5. Clean up: drop temporary column after ensuring data migration is successful
-- ALTER TABLE public.products DROP COLUMN IF EXISTS old_id; 