create table if not exists pharma_events (
  id text primary key,
  company_id text not null,
  title text not null,
  summary text not null,
  kind text not null,
  conditions text not null,
  start_date date,
  end_date date,
  url text not null,
  active boolean not null default true,
  collected_at timestamptz not null default now()
);

create index if not exists pharma_events_company_idx on pharma_events (company_id);

create table if not exists pharma_credentials (
  company_id text primary key,
  username text not null,
  password_enc text not null,
  updated_at timestamptz not null default now()
);

create table if not exists pharma_secret (
  id integer primary key,
  key text not null
);

create table if not exists pharma_state (
  id integer primary key,
  collected_at timestamptz not null,
  cursor integer not null default 0,
  report text not null
);
