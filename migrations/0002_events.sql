create table if not exists entry_events (
  id text primary key,
  issuer text not null,
  title text not null,
  summary text not null,
  benefit text not null,
  conditions text not null,
  exclusions text not null,
  start_date date,
  end_date date,
  apply_url text not null,
  list_url text not null,
  active boolean not null default true,
  collected_at timestamptz not null default now()
);

create index if not exists entry_events_issuer_idx on entry_events (issuer);
create index if not exists entry_events_end_idx on entry_events (end_date);

create table if not exists collect_state (
  id integer primary key,
  collected_at timestamptz not null,
  report text not null
);
