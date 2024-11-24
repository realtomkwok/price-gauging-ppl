CREATE TABLE
    public.retailer_categories
(
    retailer_id       text                        NOT NULL,
    category_id       uuid                        NOT NULL,
    external_id       character varying(100)      NOT NULL,
    external_name     character varying(255)      NOT NULL,
    external_endpoint text                        NOT NULL,
    created_at        timestamp without time zone NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at        timestamp without time zone NULL DEFAULT CURRENT_TIMESTAMP,
    product_count     integer                     NULL DEFAULT 0,
    category_level    integer                     NULL DEFAULT 0,
    CONSTRAINT retailer_categories_pkey PRIMARY KEY (external_id, category_id),
    CONSTRAINT retailer_categories_retailer_id_external_id_key UNIQUE (retailer_id, external_id),
    CONSTRAINT retailer_categories_retailer_id_fkey FOREIGN KEY (retailer_id) REFERENCES retailers (id) ON UPDATE RESTRICT
) TABLESPACE pg_default;