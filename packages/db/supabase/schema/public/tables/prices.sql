DROP TABLE IF EXISTS public.prices;

CREATE TABLE
    public.prices
(
    retailer_id      text                     NOT NULL,
    external_id      character varying(50)    NOT NULL,
    tracked_at       timestamp with time zone NOT NULL,
    current_price    numeric(10, 2)           NOT NULL,
    was_price        numeric(10, 2)           NULL,
    unit_price       numeric(10, 2)           NOT NULL,
    unit_measurement character varying(50)    NOT NULL,
    is_on_special    boolean                  NULL     DEFAULT FALSE,
    special_type     text[]                   NOT NULL DEFAULT '{}'::text[],
    created_at       timestamp with time zone NULL     DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT prices_pkey PRIMARY KEY (retailer_id, external_id, tracked_at),
    CONSTRAINT prices_product_fkey FOREIGN KEY (retailer_id, external_id)
        REFERENCES products (retailer_id, external_id)
) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_prices_tracked_at ON public.prices USING btree (tracked_at);
CREATE INDEX IF NOT EXISTS idx_prices_on_special ON public.prices USING btree (is_on_special)
    WHERE (is_on_special = TRUE);
CREATE INDEX IF NOT EXISTS idx_prices_special_type ON public.prices USING gin (special_type);