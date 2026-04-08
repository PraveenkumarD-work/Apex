-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles table (one row per user, extends auth.users)
create table profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null,
  claude_api_key text,
  master_resume text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Jobs table
create table jobs (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  company text not null,
  location text,
  salary text,
  status text not null default 'new' check (status in ('new','applied','interview','rejected','offer')),
  jd_text text,
  analysis jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Post-mortems table
create table post_mortems (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  company text not null,
  role text not null,
  round text not null check (round in ('Screening','Technical','Case Study','Culture Fit','Final')),
  outcome text not null check (outcome in ('Passed','Rejected','Ghosted','Withdrew')),
  went_well text,
  struggled text,
  questions_asked text,
  vibe_notes text,
  prep_tips jsonb default '[]',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Row Level Security: enable on all tables
alter table profiles enable row level security;
alter table jobs enable row level security;
alter table post_mortems enable row level security;

-- RLS Policies: users can only access their own rows
create policy "Users can view own profile"
  on profiles for select using (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update using (auth.uid() = id);

create policy "Users can insert own profile"
  on profiles for insert with check (auth.uid() = id);

create policy "Users can view own jobs"
  on jobs for select using (auth.uid() = user_id);

create policy "Users can insert own jobs"
  on jobs for insert with check (auth.uid() = user_id);

create policy "Users can update own jobs"
  on jobs for update using (auth.uid() = user_id);

create policy "Users can delete own jobs"
  on jobs for delete using (auth.uid() = user_id);

create policy "Users can view own post_mortems"
  on post_mortems for select using (auth.uid() = user_id);

create policy "Users can insert own post_mortems"
  on post_mortems for insert with check (auth.uid() = user_id);

create policy "Users can update own post_mortems"
  on post_mortems for update using (auth.uid() = user_id);

create policy "Users can delete own post_mortems"
  on post_mortems for delete using (auth.uid() = user_id);

-- Auto-create profile when user signs up
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- Updated_at trigger function
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_jobs_updated_at before update on jobs
  for each row execute function update_updated_at();

create trigger update_post_mortems_updated_at before update on post_mortems
  for each row execute function update_updated_at();

create trigger update_profiles_updated_at before update on profiles
  for each row execute function update_updated_at();
