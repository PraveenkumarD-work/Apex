-- Story Bank (STAR+R stories for interview prep)
create table story_bank (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  situation text not null,
  task text not null,
  action text not null,
  result text not null,
  reflection text,
  tags text[] default '{}',
  linked_jobs uuid[] default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Company Research
create table company_research (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  job_id uuid references jobs(id) on delete cascade,
  company text not null,
  research jsonb not null default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Outreach Drafts
create table outreach (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  job_id uuid references jobs(id) on delete cascade,
  company text not null,
  role text not null,
  hiring_manager jsonb,
  recruiter jsonb,
  connection_message text,
  follow_up_message text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Application Form Answers
create table application_answers (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  job_id uuid references jobs(id) on delete cascade,
  answers jsonb not null default '[]',
  cover_letter text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Update jobs table: add archetype and enhanced_analysis
alter table jobs add column if not exists archetype text;
alter table jobs add column if not exists enhanced_analysis jsonb;

-- RLS for all new tables
alter table story_bank enable row level security;
alter table company_research enable row level security;
alter table outreach enable row level security;
alter table application_answers enable row level security;

-- Story Bank policies
create policy "Users can view own stories" on story_bank for select using (auth.uid() = user_id);
create policy "Users can insert own stories" on story_bank for insert with check (auth.uid() = user_id);
create policy "Users can update own stories" on story_bank for update using (auth.uid() = user_id);
create policy "Users can delete own stories" on story_bank for delete using (auth.uid() = user_id);

-- Company Research policies
create policy "Users can view own research" on company_research for select using (auth.uid() = user_id);
create policy "Users can insert own research" on company_research for insert with check (auth.uid() = user_id);
create policy "Users can update own research" on company_research for update using (auth.uid() = user_id);
create policy "Users can delete own research" on company_research for delete using (auth.uid() = user_id);

-- Outreach policies
create policy "Users can view own outreach" on outreach for select using (auth.uid() = user_id);
create policy "Users can insert own outreach" on outreach for insert with check (auth.uid() = user_id);
create policy "Users can update own outreach" on outreach for update using (auth.uid() = user_id);
create policy "Users can delete own outreach" on outreach for delete using (auth.uid() = user_id);

-- Application Answers policies
create policy "Users can view own answers" on application_answers for select using (auth.uid() = user_id);
create policy "Users can insert own answers" on application_answers for insert with check (auth.uid() = user_id);
create policy "Users can update own answers" on application_answers for update using (auth.uid() = user_id);
create policy "Users can delete own answers" on application_answers for delete using (auth.uid() = user_id);

-- Updated_at triggers for new tables
create trigger update_story_bank_updated_at before update on story_bank
  for each row execute function update_updated_at();
create trigger update_company_research_updated_at before update on company_research
  for each row execute function update_updated_at();
create trigger update_outreach_updated_at before update on outreach
  for each row execute function update_updated_at();
create trigger update_application_answers_updated_at before update on application_answers
  for each row execute function update_updated_at();
