create table
  public.retailers (
    id text not null,
    name text not null,
    category_endpoint text null,
    product_endpoint text null,
    created_at timestamp with time zone null default current_timestamp,
    updated_at timestamp with time zone null default current_timestamp,
    base_url text null,
    constraint retailers_pkey primary key (id),
    constraint retailers_id_key unique (id),
    constraint retailers_name_key unique (name)
  ) tablespace pg_default;

create trigger update_retailer_updated_at before
update on retailers for each row
execute function update_updated_at_column ();