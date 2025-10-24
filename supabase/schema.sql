-- Multi-tenant schema for foodtruck ordering
create table if not exists vendors (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  logo_url text,
  theme_primary text default '#111827',
  theme_bg text default '#ffffff',
  stripe_account_id text,
  notification_channel text default 'push',
  created_at timestamp with time zone default now()
);

create table if not exists vendor_staff (
  vendor_id uuid references vendors(id) on delete cascade,
  user_id uuid not null,
  role text default 'admin',
  primary key (vendor_id, user_id)
);

create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  vendor_id uuid references vendors(id) on delete cascade,
  name text not null,
  sort int default 0
);

create table if not exists items (
  id uuid primary key default gen_random_uuid(),
  vendor_id uuid references vendors(id) on delete cascade,
  category_id uuid references categories(id) on delete set null,
  name text not null,
  description text,
  price_cents int not null,
  image_url text,
  is_available boolean default true,
  sort int default 0
);

create table if not exists modifiers (
  id uuid primary key default gen_random_uuid(),
  vendor_id uuid references vendors(id) on delete cascade,
  item_id uuid references items(id) on delete cascade,
  name text not null,
  type text check (type in ('single','multi')) not null,
  required boolean default false
);

create table if not exists modifier_options (
  id uuid primary key default gen_random_uuid(),
  vendor_id uuid references vendors(id) on delete cascade,
  modifier_id uuid references modifiers(id) on delete cascade,
  name text not null,
  price_delta_cents int default 0
);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  vendor_id uuid references vendors(id) on delete cascade,
  order_number int not null,
  customer_name text,
  phone text,
  status text check (status in ('received','preparing','ready','picked_up','cancelled')) default 'received',
  subtotal_cents int not null,
  total_cents int not null,
  payment_status text check (payment_status in ('unpaid','paid','refunded')) default 'unpaid',
  created_at timestamp with time zone default now()
);

create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade,
  item_id uuid references items(id) on delete set null,
  qty int not null,
  unit_price_cents int not null,
  notes text
);

create table if not exists order_item_options (
  id uuid primary key default gen_random_uuid(),
  order_item_id uuid references order_items(id) on delete cascade,
  option_id uuid references modifier_options(id) on delete set null,
  price_delta_cents int default 0
);

create table if not exists push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  vendor_id uuid references vendors(id) on delete cascade,
  order_id uuid references orders(id) on delete cascade,
  endpoint text not null,
  p256dh text not null,
  auth text not null,
  created_at timestamp with time zone default now()
);

-- Simple order number sequence per vendor/day (store number in orders; generate via RPC in app)
