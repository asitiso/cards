create table if not exists pharma_companies (
  id text primary key,
  name text not null,
  short text not null,
  login_url text not null,
  position integer not null default 0
);

create table if not exists pharma_seed (
  id integer primary key
);

delete from pharma_credentials
where company_id in ('baekje', 'boksan', 'geoyoung', 'sehwa', 'samwon', 'pico');

delete from pharma_events
where company_id in ('baekje', 'boksan', 'geoyoung', 'sehwa', 'samwon', 'pico');
