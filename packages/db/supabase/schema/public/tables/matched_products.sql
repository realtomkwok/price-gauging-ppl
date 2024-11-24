create table
  public.matched_products (
    match_id uuid not null default extensions.uuid_generate_v4(),
    retailer_id text not null,
    external_id character varying(50) not null,
    match_confidence numeric(4,3) null,
    created_at timestamp with time zone default current_timestamp,
    updated_at timestamp with time zone default current_timestamp,
    constraint matched_products_pkey primary key (match_id, retailer_id, external_id),
    constraint matched_products_product_fkey foreign key (retailer_id, external_id) 
      references products (retailer_id, external_id) on delete cascade,
    constraint match_confidence_range check (match_confidence >= 0 and match_confidence <= 1)
  ) tablespace pg_default;

create index idx_matched_products_match_id on public.matched_products using btree (match_id);
create index idx_matched_products_confidence on public.matched_products using btree (match_confidence); 