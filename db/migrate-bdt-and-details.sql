alter table products
  add column if not exists detailed_description text not null default '';

-- Convert legacy USD-scale prices to BDT (only when nothing looks like BDT yet).
update products
set price = round((price * 110)::numeric, 0)
where price < 5000;

update products p
set detailed_description = coalesce(nullif(trim(p.detailed_description), ''), trim(p.description) || E'\n\n' ||
  'We hand-check every item before it ships from Dhaka. Expect careful packaging and nationwide delivery with cash on delivery.' || E'\n\n' ||
  'Changed your mind? Unopened items in original condition qualify for our 7-day return policy.')
where coalesce(nullif(trim(p.detailed_description), ''), '') = '';
