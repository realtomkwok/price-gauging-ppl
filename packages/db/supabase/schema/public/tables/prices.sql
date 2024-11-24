create table
  public.prices (
    retailer_id text not null,
    external_id character varying(50) not null,
    tracked_at timestamp with time zone not null,
    current_price numeric(10, 2) not null,
    was_price numeric(10, 2) null,
    unit_price numeric(10, 2) not null,
    unit_measurement character varying(50) not null,
    is_on_special boolean null default false,
    special_type text[] not null default '{}'::text[],
    created_at timestamp with time zone null default current_timestamp,
    constraint prices_pkey primary key (retailer_id, external_id, tracked_at),
    constraint prices_product_fkey foreign key (retailer_id, external_id) 
      references products (retailer_id, external_id)
  ) tablespace pg_default;

create index if not exists idx_prices_tracked_at on public.prices using btree (tracked_at);
create index if not exists idx_prices_on_special on public.prices using btree (is_on_special) 
  where (is_on_special = true);
create index if not exists idx_prices_special_type on public.prices using gin (special_type);