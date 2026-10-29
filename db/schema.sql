create table if not exists categories (
  slug text primary key,
  name text not null,
  tagline text not null default '',
  image text not null,
  position int not null default 0
);

create table if not exists products (
  id serial primary key,
  slug text not null unique,
  name text not null,
  category_slug text not null references categories (slug) on update cascade,
  price numeric(10, 2) not null check (price >= 0),
  stock int not null default 0 check (stock >= 0),
  image text not null,
  description text not null default '',
  detailed_description text not null default '',
  highlights text[] not null default '{}',
  featured boolean not null default false,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists orders (
  id serial primary key,
  number text not null unique,
  status text not null default 'pending'
    check (status in ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  email text not null,
  phone text not null,
  name text not null,
  address text not null,
  city text not null,
  postal_code text not null,
  subtotal numeric(10, 2) not null,
  shipping numeric(10, 2) not null,
  total numeric(10, 2) not null,
  invoice_html text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists order_items (
  id serial primary key,
  order_id int not null references orders (id) on delete cascade,
  product_id int references products (id) on delete set null,
  name text not null,
  image text not null,
  price numeric(10, 2) not null,
  quantity int not null check (quantity > 0)
);

create index if not exists order_items_order_id_idx on order_items (order_id);
create index if not exists orders_created_at_idx on orders (created_at desc);
create index if not exists products_category_idx on products (category_slug);
