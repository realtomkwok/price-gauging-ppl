CREATE TABLE
    public.retailers
(
    id                text                     NOT NULL,
    name              text                     NOT NULL,
    category_endpoint text                     NULL,
    product_endpoint  text                     NULL,
    created_at        timestamp with time zone NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at        timestamp with time zone NULL DEFAULT CURRENT_TIMESTAMP,
    base_url          text                     NULL,
    CONSTRAINT retailers_pkey PRIMARY KEY (id),
    CONSTRAINT retailers_id_key UNIQUE (id),
    CONSTRAINT retailers_name_key UNIQUE (name)
) TABLESPACE pg_default;

CREATE TRIGGER update_retailer_updated_at
    BEFORE
        UPDATE
    ON retailers
    FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();