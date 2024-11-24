DROP TABLE IF EXISTS public.matched_products;

CREATE TABLE
    public.matched_products
(
    match_id         uuid                  NOT NULL DEFAULT gen_random_uuid(),
    retailer_id      text                  NOT NULL,
    external_id      character varying(50) NOT NULL,
    match_confidence numeric(4, 3)         NULL,
    created_at       timestamp with time zone       DEFAULT CURRENT_TIMESTAMP,
    updated_at       timestamp with time zone       DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT matched_products_pkey PRIMARY KEY (match_id, retailer_id, external_id),
    CONSTRAINT matched_products_product_fkey FOREIGN KEY (retailer_id, external_id)
        REFERENCES products (retailer_id, external_id) ON DELETE CASCADE,
    CONSTRAINT match_confidence_range CHECK (match_confidence >= 0 AND match_confidence <= 1)
) TABLESPACE pg_default;

CREATE INDEX idx_matched_products_match_id ON public.matched_products USING btree (match_id);
CREATE INDEX idx_matched_products_confidence ON public.matched_products USING btree (match_confidence);