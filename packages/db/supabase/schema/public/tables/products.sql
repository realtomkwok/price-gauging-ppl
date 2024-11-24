create table
  public.products (
    retailer_id text not null,
    external_id character varying(50) not null,
    name character varying(255) not null,
    brand character varying(50) null,
    description text null,
    package_size character varying(100) not null,
    barcode character varying(100) null,
    image_urls text[] not null default '{}'::text[],
    categories text[] not null default '{}'::text[],
    metadata jsonb null default '{}'::jsonb,
    is_available boolean null default true,
    last_synced_at timestamp without time zone null,
    created_at timestamp without time zone null default current_timestamp,
    updated_at timestamp without time zone null default current_timestamp,
    search_vector tsvector null,
    constraint products_pkey primary key (retailer_id, external_id),
    constraint products_retailer_id_fkey foreign key (retailer_id) references retailers (id)
  ) tablespace pg_default;

create index if not exists idx_products_name on public.products using btree (name) tablespace pg_default;
create index if not exists idx_products_barcode on public.products using btree (barcode) tablespace pg_default;
create index if not exists idx_products_search on public.products using gin (search_vector) tablespace pg_default;
create index if not exists idx_products_categories on public.products using gin (categories) tablespace pg_default;

create trigger update_product_updated_at before
update on products for each row
execute function update_updated_at_column ();

create trigger products_search_vector_update before insert
or
update on products for each row
execute function update_search_vector ();