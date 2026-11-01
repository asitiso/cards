-- Isolated IPO snapshot. No read/write path from the finance homepage.
create table if not exists ipo_board_snapshot (
  id integer primary key check (id = 1),
  collected_at timestamptz not null,
  board_json text not null
);
