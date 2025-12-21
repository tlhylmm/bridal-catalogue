-- Create From You (Customer Gallery) Table
create table from_you_images (
  id uuid default uuid_generate_v4() primary key,
  image_url text not null,
  caption text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table from_you_images enable row level security;

-- Public can view
create policy "Public from_you_images are viewable by everyone"
  on from_you_images for select
  using ( true );

-- Only authenticated users can modify
create policy "Admins can insert from_you_images"
  on from_you_images for insert
  with check ( auth.role() = 'authenticated' );

create policy "Admins can delete from_you_images"
  on from_you_images for delete
  using ( auth.role() = 'authenticated' );
