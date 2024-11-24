-- Drop table if exists public.products;
DROP TABLE IF EXISTS public.products;

CREATE TABLE
    public.products
(
    retailer_id    text                        NOT NULL,
    external_id    character varying(50)       NOT NULL,
    name           character varying(255)      NOT NULL,
    brand          character varying(50)       NULL,
    description    text                        NULL,
    package_size   character varying(100)      NOT NULL,
    barcode        character varying(100)      NULL,
    image_urls     text[]                      NOT NULL DEFAULT '{}'::text[],
    categories     text[]                      NOT NULL DEFAULT '{}'::text[],
    metadata       jsonb                       NULL     DEFAULT '{}'::jsonb,
    is_available   boolean                     NULL     DEFAULT TRUE,
    last_synced_at timestamp without time zone NULL,
    created_at     timestamp without time zone NULL     DEFAULT CURRENT_TIMESTAMP,
    updated_at     timestamp without time zone NULL     DEFAULT CURRENT_TIMESTAMP,
    search_vector  tsvector                    NULL,
    CONSTRAINT products_pkey PRIMARY KEY (retailer_id, external_id),
    CONSTRAINT products_retailer_id_fkey FOREIGN KEY (retailer_id) REFERENCES retailers (id)
) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_products_name ON public.products USING btree (name) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_products_barcode ON public.products USING btree (barcode) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_products_search ON public.products USING gin (search_vector) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_products_categories ON public.products USING gin (categories) TABLESPACE pg_default;

CREATE TRIGGER update_product_updated_at
    BEFORE
        UPDATE
    ON products
    FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER products_search_vector_update
    BEFORE INSERT
        OR
        UPDATE
    ON products
    FOR EACH ROW
EXECUTE FUNCTION update_search_vector();