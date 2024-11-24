create table
  public.retailer_categories (
    retailer_id text not null,
    category_id uuid not null,
    external_id character varying(100) not null,
    external_name character varying(255) not null,
    external_endpoint text not null,
    created_at timestamp without time zone null default current_timestamp,
    updated_at timestamp without time zone null default current_timestamp,
    product_count integer null default 0,
    category_level integer null default 0,
    constraint retailer_categories_pkey primary key (external_id, category_id),
    constraint retailer_categories_retailer_id_external_id_key unique (retailer_id, external_id),
    constraint retailer_categories_retailer_id_fkey foreign key (retailer_id) references retailers (id) on update restrict
  ) tablespace pg_default;