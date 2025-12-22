-- Create Sales Points Table
-- Each sales point has a name and can have multiple locations (city/address/map)
create table sales_points (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  locations jsonb not null default '[]',  -- Array of {city, address, mapLink}
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table sales_points enable row level security;

-- Public can view
create policy "Public sales_points are viewable by everyone"
  on sales_points for select
  using ( true );

-- Only authenticated users can modify
create policy "Admins can insert sales_points"
  on sales_points for insert
  with check ( auth.role() = 'authenticated' );

create policy "Admins can update sales_points"
  on sales_points for update
  using ( auth.role() = 'authenticated' );

create policy "Admins can delete sales_points"
  on sales_points for delete
  using ( auth.role() = 'authenticated' );
