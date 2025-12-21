-- Create Collections Table
create table collections (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  slug text not null unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create Dresses Table
create table dresses (
  id uuid default uuid_generate_v4() primary key,
  collection_id uuid references collections(id) on delete set null,
  name text not null,
  slug text not null unique,
  description text,
  main_image text,
  gallery_images text[], -- Array of image URLs
  silhouette text,
  fabric text,
  neckline text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Storage for Images
insert into storage.buckets (id, name)
values ('images', 'images');

-- Set up Access Policies (RLS)
-- 1. Everyone can view data (Public)
alter table collections enable row level security;
create policy "Public collections are viewable by everyone"
  on collections for select
  using ( true );

alter table dresses enable row level security;
create policy "Public dresses are viewable by everyone"
  on dresses for select
  using ( true );

-- 2. Only authenticated users (Admins) can insert/update/delete
create policy "Admins can insert collections"
  on collections for insert
  with check ( auth.role() = 'authenticated' );

create policy "Admins can update collections"
  on collections for update
  using ( auth.role() = 'authenticated' );

create policy "Admins can delete collections"
  on collections for delete
  using ( auth.role() = 'authenticated' );

create policy "Admins can insert dresses"
  on dresses for insert
  with check ( auth.role() = 'authenticated' );

create policy "Admins can update dresses"
  on dresses for update
  using ( auth.role() = 'authenticated' );

create policy "Admins can delete dresses"
  on dresses for delete
  using ( auth.role() = 'authenticated' );

-- Storage Policies
create policy "Public Images are viewable by everyone"
  on storage.objects for select
  using ( bucket_id = 'images' );

create policy "Admins can upload images"
  on storage.objects for insert
  with check ( bucket_id = 'images' and auth.role() = 'authenticated' );

create policy "Admins can delete images"
  on storage.objects for delete
  using ( bucket_id = 'images' and auth.role() = 'authenticated' );
