-- The app uses server-side PostgreSQL, never the public Supabase Data API.
-- Keep change history in an unexposed schema with RLS enabled.
create schema if not exists cards_private;

create table if not exists cards_private.change_history (
  id bigint generated always as identity primary key,
  domain text not null check (domain in ('finance', 'pharma')),
  source_id text not null,
  event_id text not null,
  action text not null check (action in ('added', 'updated', 'removed')),
  title text not null,
  fields jsonb not null default '[]'::jsonb,
  changed_at timestamptz not null default now()
);

create index if not exists cards_change_history_recent_idx
  on cards_private.change_history (domain, id desc);

alter table cards_private.change_history enable row level security;

-- Important: older Supabase projects auto-grant public-schema table access.
-- Existing app tables include pharma_credentials and pharma_secret (encryption key).
-- No browser needs direct SQL/Data API access: deny anon/authenticated entirely.
alter table public.entry_events enable row level security;
alter table public.collect_state enable row level security;
alter table public.pharma_events enable row level security;
alter table public.pharma_credentials enable row level security;
alter table public.pharma_secret enable row level security;
alter table public.pharma_state enable row level security;
alter table public.pharma_companies enable row level security;
alter table public.pharma_seed enable row level security;
alter table public._migrations enable row level security;

-- The embedded PGLite fallback does not define Supabase roles.
-- Conditional revokes work on both databases without touching unrelated tables.
do $$
declare
  role_name text;
begin
  foreach role_name in array array['anon', 'authenticated']
  loop
    if exists (select 1 from pg_roles where rolname = role_name) then
      execute format(
        'revoke all privileges on table public.entry_events, public.collect_state, ' ||
        'public.pharma_events, public.pharma_credentials, public.pharma_secret, ' ||
        'public.pharma_state, public.pharma_companies, public.pharma_seed, ' ||
        'public._migrations from %I',
        role_name
      );
    end if;
  end loop;
end $$;
