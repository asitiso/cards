import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight, ChevronDown, RefreshCw, Search } from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";
import { getBoard, reloadBoard } from "@/lib/events/board.functions";
import { ISSUERS, type Board, type EntryEvent, type IssuerId } from "@/lib/events/types";

export const Route = createFileRoute("/")({
  loader: () => getBoard(),
  component: Home,
});

function Home() {
  const initial = Route.useLoaderData();
  const [board, setBoard] = useState<Board>(initial);
  const [issuer, setIssuer] = useState<IssuerId | "all">("all");
  const [sort, setSort] = useState<"soon" | "new">("soon");
  const [query, setQuery] = useState("");
  const [openIds, setOpenIds] = useState<string[]>([]);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return board.events
      .filter((event) => issuer === "all" || event.issuer === issuer)
      .filter((event) => {
        if (!q) return true;
        const blob = [
          event.title,
          event.summary,
          event.benefit,
          issuerName(event.issuer),
          ...event.conditions,
        ]
          .join(" ")
          .toLowerCase();
        return blob.includes(q);
      })
      .sort((a, b) =>
        sort === "new"
          ? b.startDate.localeCompare(a.startDate) || a.endDate.localeCompare(b.endDate)
          : a.endDate.localeCompare(b.endDate) || a.title.localeCompare(b.title, "ko"),
      );
  }, [board.events, issuer, query, sort]);

  function toggle(id: string) {
    setOpenIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  }

  async function refresh() {
    setPending(true);
    setError("");
    try {
      setBoard(await reloadBoard());
    } catch (err) {
      setError(err instanceof Error ? err.message : "다시 수집하지 못했습니다.");
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl px-4 py-5 sm:px-6 sm:py-8">
      <header className="flex flex-col gap-4 border-b border-line pb-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-xl">
          <p className="text-sm font-medium tracking-wide text-accent">카드사 응모만</p>
          <h1 className="mt-1 text-balance text-3xl font-semibold tracking-tight">응모만</h1>
          <p className="mt-2 text-pretty text-sm leading-relaxed text-muted">
            신한·삼성·현대·KB·롯데·우리·하나·NH·BC·IBK·카카오뱅크·토스뱅크 안에서, 버튼을 눌러
            신청하는 이벤트만 골랐습니다. 행을 누르면 조건이 펼쳐지고, 응모는 카드사에서 합니다.
          </p>
        </div>
        <div className="flex flex-col items-start gap-2 sm:items-end">
          <button
            type="button"
            onClick={() => void refresh()}
            disabled={pending}
            className="inline-flex h-11 items-center gap-2 rounded-full bg-ink px-4 text-sm font-medium text-paper disabled:opacity-60"
          >
            <RefreshCw className={pending ? "size-4 animate-spin" : "size-4"} />
            {pending ? "수집 중" : "다시 수집"}
          </button>
          <p className="text-sm tabular-nums text-muted">마지막 수집 {formatWhen(board.collectedAt)}</p>
        </div>
      </header>

      {error ? <p className="mt-4 text-sm text-accent">{error}</p> : null}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="flex h-11 flex-1 items-center gap-2 rounded-full border border-line bg-card px-4">
          <Search className="size-4 text-muted" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="혜택, 카드사, 조건 검색"
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted"
          />
        </label>
        <div className="flex h-11 rounded-full border border-line bg-card p-1">
          <SortButton active={sort === "soon"} onClick={() => setSort("soon")}>
            마감 임박
          </SortButton>
          <SortButton active={sort === "new"} onClick={() => setSort("new")}>
            최근 시작
          </SortButton>
        </div>
      </div>

      <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
        <Chip active={issuer === "all"} onClick={() => setIssuer("all")}>
          전체 {board.events.length}
        </Chip>
        {ISSUERS.map((item) => {
          const count = board.events.filter((event) => event.issuer === item.id).length;
          return (
            <Chip key={item.id} active={issuer === item.id} onClick={() => setIssuer(item.id)}>
              {item.short} {count}
            </Chip>
          );
        })}
      </div>

      <p className="mt-3 text-sm text-muted">{visible.length}건 · 행을 눌러 접고 펼칩니다</p>

      {visible.length === 0 ? (
        <p className="mt-4 rounded-2xl border border-dashed border-line bg-card px-5 py-8 text-center text-sm text-muted">
          이 조건의 응모 이벤트가 없습니다. 다른 카드사를 보거나 아래 수집 현황에서 카드사로
          이동하세요.
        </p>
      ) : (
        <ul className="mt-2 overflow-hidden rounded-2xl border border-line bg-card">
          {visible.map((event) => (
            <EventRow
              key={event.id}
              event={event}
              today={board.today}
              open={openIds.includes(event.id)}
              onToggle={() => toggle(event.id)}
            />
          ))}
        </ul>
      )}

      <section className="mt-8 border-t border-line pt-5">
        <h2 className="text-base font-semibold">수집 현황</h2>
        <p className="mt-1 text-sm text-muted">
          막힌 카드사는 마지막 목록을 유지하고, 응모는 항상 카드사로 넘어갑니다.
        </p>
        <ul className="mt-3 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-card">
          {board.issuers.map((item) => (
            <li key={item.id} className="flex items-center justify-between gap-3 px-3 py-2 sm:px-4">
              <div className="min-w-0">
                <p className="text-sm font-medium leading-snug">
                  {item.name}
                  <span className="ml-2 font-normal tabular-nums text-muted">{item.count}건</span>
                </p>
                <p className="text-xs leading-snug text-muted">{item.message}</p>
              </div>
              <a
                href={item.listUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-9 shrink-0 items-center gap-0.5 text-sm font-medium text-accent"
              >
                카드사로
                <ArrowUpRight className="size-4" />
              </a>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

function EventRow({
  event,
  today,
  open,
  onToggle,
}: {
  event: EntryEvent;
  today: string;
  open: boolean;
  onToggle: () => void;
}) {
  const panelId = `event-panel-${event.id.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
  const benefit =
    event.benefit && event.benefit !== event.summary && event.benefit !== event.title
      ? event.benefit
      : "";
  return (
    <li className="border-b border-line last:border-b-0">
      <div className="flex items-center">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={panelId}
          className="flex min-h-11 min-w-0 flex-1 items-center gap-2 py-1 pl-3 text-left sm:gap-3 sm:pl-4"
        >
          <Deadline end={event.endDate} today={today} />
          <span className="w-9 shrink-0 text-xs font-medium text-muted sm:w-12">
            {issuerShort(event.issuer)}
          </span>
          <span className="min-w-0 flex-1 truncate text-sm font-medium">{event.title}</span>
          <span className="hidden shrink-0 text-xs tabular-nums text-muted sm:inline">
            {formatDay(event.startDate).slice(5)}–{formatDay(event.endDate).slice(5)}
          </span>
          <ChevronDown
            className={`size-4 shrink-0 text-muted transition-transform ${open ? "rotate-180" : ""}`}
            aria-hidden
          />
        </button>
        <a
          href={event.applyUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-11 shrink-0 items-center gap-0.5 pr-3 text-xs font-medium text-accent sm:pr-4"
        >
          응모
          <ArrowUpRight className="size-3.5" />
        </a>
      </div>
      {open ? (
        <div id={panelId} className="border-t border-line bg-paper px-3 py-3 sm:px-4">
          <h2 className="text-pretty text-sm font-semibold leading-snug">{event.title}</h2>
          <p className="mt-1.5 text-pretty text-sm leading-relaxed">{event.summary}</p>
          {benefit ? <p className="mt-1 text-sm font-medium text-ink">{benefit}</p> : null}
          <p className="mt-2 text-xs tabular-nums text-muted">
            {issuerName(event.issuer)} · {formatDay(event.startDate)} – {formatDay(event.endDate)}
          </p>
          <h3 className="mt-3 text-sm font-semibold">응모 조건</h3>
          <ul className="mt-1 list-disc space-y-1 pl-5 text-sm leading-relaxed text-muted">
            {(event.conditions.length ? event.conditions : ["카드사 페이지의 조건을 확인하세요."]).map(
              (line) => (
                <li key={line}>{line}</li>
              ),
            )}
          </ul>
          {event.exclusions.length ? (
            <>
              <h3 className="mt-3 text-sm font-semibold">제외·유의사항</h3>
              <ul className="mt-1 list-disc space-y-1 pl-5 text-sm leading-relaxed text-muted">
                {event.exclusions.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </>
          ) : null}
          <a
            href={event.applyUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex h-10 items-center gap-1 rounded-full bg-accent px-4 text-sm font-medium text-accent-ink"
          >
            {issuerName(event.issuer)}에서 응모
            <ArrowUpRight className="size-4" />
          </a>
        </div>
      ) : null}
    </li>
  );
}

function SortButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        active
          ? "h-9 rounded-full bg-ink px-3 text-sm font-medium text-paper"
          : "h-9 rounded-full px-3 text-sm text-muted"
      }
    >
      {children}
    </button>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        active
          ? "h-11 shrink-0 rounded-full bg-ink px-4 text-sm font-medium text-paper"
          : "h-11 shrink-0 rounded-full border border-line bg-card px-4 text-sm text-ink"
      }
    >
      {children}
    </button>
  );
}

function Deadline({ end, today }: { end: string; today: string }) {
  const days = daysUntil(end, today);
  const label = days < 0 ? "종료" : days === 0 ? "오늘 마감" : `D-${days}`;
  const hot = days >= 0 && days <= 7;
  return (
    <span
      className={
        hot
          ? "inline-flex w-[4.75rem] shrink-0 justify-center rounded-full bg-accent px-1 py-0.5 text-xs font-medium tabular-nums text-accent-ink"
          : "inline-flex w-[4.75rem] shrink-0 justify-center rounded-full bg-paper px-1 py-0.5 text-xs font-medium tabular-nums text-muted"
      }
    >
      {label}
    </span>
  );
}

function issuerName(id: IssuerId): string {
  return ISSUERS.find((item) => item.id === id)?.name ?? id;
}

function issuerShort(id: IssuerId): string {
  return ISSUERS.find((item) => item.id === id)?.short ?? id;
}

function daysUntil(end: string, today: string): number {
  const endMs = Date.parse(`${end}T00:00:00+09:00`);
  const todayMs = Date.parse(`${today}T00:00:00+09:00`);
  return Math.round((endMs - todayMs) / 86_400_000);
}

function formatDay(iso: string): string {
  const [year, month, day] = iso.split("-");
  return `${year}.${month}.${day}`;
}

function formatWhen(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}
