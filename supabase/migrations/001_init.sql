-- Enable UUID extension
create extension if not exists "pgcrypto";

-- Panic events (fully anonymous)
create table panic_events (
  id uuid default gen_random_uuid() primary key,
  session_id text not null,
  latitude decimal(10, 8) not null,
  longitude decimal(11, 8) not null,
  created_at timestamptz default now(),
  is_resolved boolean default false
);

-- Incident reports (community map)
create table incident_reports (
  id uuid default gen_random_uuid() primary key,
  incident_type text not null,
  description text check (char_length(description) <= 200),
  incident_time timestamptz not null,
  latitude decimal(10, 8) not null,
  longitude decimal(11, 8) not null,
  created_at timestamptz default now()
);

-- Row Level Security
alter table panic_events enable row level security;
alter table incident_reports enable row level security;

-- Allow anonymous inserts and public reads
create policy "Allow anonymous insert" on panic_events
  for insert with check (true);

create policy "Allow public read" on panic_events
  for select using (true);

create policy "Allow anonymous update resolved" on panic_events
  for update using (true) with check (true);

create policy "Allow anonymous insert" on incident_reports
  for insert with check (true);

create policy "Allow public read" on incident_reports
  for select using (true);
