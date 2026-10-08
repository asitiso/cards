-- Only the server-side PostgreSQL connection can access this schema.
-- No public/Data API grants; never store pharmacy login credentials here.
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
