create view
  public.wws_tracking_categories as
select
  c.external_id as id,
  c.external_name as name,
  c.external_endpoint as endpoint,
  c.product_count,
  c.updated_at
from
  retailer_categories c
where
  c.retailer_id = 'wws'::text
  and c.category_level = 1
  and (
    c.external_name::text <> all (
      array[
        'Specials'::character varying::text,
        'Front of Store'::character varying::text,
        'Tobacco'::character varying::text,
        'Christmas'::character varying::text,
        'Down Down'::character varying::text,
        'Next Day Delivery Range'::character varying::text
      ]
    )
  );