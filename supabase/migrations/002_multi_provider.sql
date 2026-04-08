-- Add multi-provider AI keys, LinkedIn profile, and theme preference
alter table profiles add column if not exists ai_keys jsonb default '{}';
alter table profiles add column if not exists preferred_provider text default 'anthropic';
alter table profiles add column if not exists preferred_model text default 'claude-sonnet-4-20250514';
alter table profiles add column if not exists linkedin_profile text;
alter table profiles add column if not exists theme text default 'dark';

-- Migrate existing claude_api_key to ai_keys jsonb
update profiles
set ai_keys = jsonb_build_object('anthropic', claude_api_key)
where claude_api_key is not null and (ai_keys = '{}' or ai_keys is null);
