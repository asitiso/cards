import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight, ChevronDown, RefreshCw, Search } from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";
import { getBoard, reloadBoard } from "@/lib/events/board.functions";
import { openApply } from "@/lib/events/open-apply";
import { ISSUERS, MARKETS, issuerMeta, type Board, type EntryEvent, type IssuerId, type Market } from "@/lib/events/types";

export const Route = createFileRoute("/")({
  loader: () => getBoard(),
  component: Home,
});

function Home() {
  const initial = Route.useLoaderData();
  const [board, setBoard] = useState<Board>(initial);
  const [market, setMarket] = useState<Market>("card");
  const [issuer, setIssuer] = useState<IssuerId | "all">("all");
  const [sort, setSort] = useState<"soon" | "new">("soon");
  const [query, setQuery] = useState("");
  const [openIds, setOpenIds] = useState<string[]>([]);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return board.events
      .filter((event) => issuerMeta(event.issuer).market === market)
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
  }, [board.events, issuer, market, query, sort]);

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
    <main className="mx-auto min-h-screen w-full max-w-5xl px-3 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-6 sm:py-6">
      <header className="flex items-center justify-between gap-2">
        <h1 className="shrink-0 text-2xl font-semibold tracking-tight">ㅇㅁㅁㅇ</h1>
        <div className="flex min-w-0 items-center gap-2">
          <p className="min-w-0 truncate text-right text-[11px] tabular-nums leading-tight text-muted sm:text-xs">
            수집 {formatWhen(board.collectedAt)}
          </p>
          <button
            type="button"
            onClick={() => void refresh()}
            disabled={pending}
            className="inline-flex h-8 shrink-0 items-center gap-1 rounded-full bg-ink px-3 text-xs font-medium text-paper disabled:opacity-60"
          >
            <RefreshCw className={pending ? "size-3.5 animate-spin" : "size-3.5"} />
            {pending ? "수집 중" : "다시 수집"}
          </button>
        </div>
      </header>

      {error ? <p className="mt-2 text-sm text-accent">{error}</p> : null}

      <div className="mt-3 grid grid-cols-3 gap-1 rounded-full border border-line bg-card p-0.5" role="tablist" aria-label="종류">
        {MARKETS.map((item) => {
          const count = board.events.filter((event) => issuerMeta(event.issuer).market === item.id).length;
          const active = market === item.id;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => {
                setMarket(item.id);
                setIssuer("all");
              }}
              className={
                active
                  ? "h-8 rounded-full bg-ink text-xs font-medium text-paper sm:text-sm"
                  : "h-8 rounded-full text-xs text-muted sm:text-sm"
              }
            >
              {item.label} {count}
            </button>
          );
        })}
      </div>

      <div className="mt-2 flex items-center gap-1.5">
        <label className="flex h-8 min-w-0 flex-1 items-center gap-1.5 rounded-full border border-line bg-card px-3">
          <Search className="size-3.5 shrink-0 text-muted" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="혜택, 회사, 조건"
            className="w-full bg-transparent text-base leading-none outline-none placeholder:text-muted sm:text-sm"
          />
        </label>
        <div className="flex h-8 shrink-0 rounded-full border border-line bg-card p-0.5">
          <SortButton active={sort === "soon"} onClick={() => setSort("soon")}>
            <span className="sm:hidden">마감</span>
            <span className="hidden sm:inline">마감 임박</span>
          </SortButton>
          <SortButton active={sort === "new"} onClick={() => setSort("new")}>
            <span className="sm:hidden">최근</span>
            <span className="hidden sm:inline">최근 시작</span>
          </SortButton>
        </div>
      </div>

      <div className="-mx-3 mt-2 flex gap-1.5 overflow-x-auto px-3 pb-0.5 sm:mx-0 sm:px-0">
        <Chip active={issuer === "all"} onClick={() => setIssuer("all")}>
          전체 {board.events.filter((event) => issuerMeta(event.issuer).market === market).length}
        </Chip>
        {ISSUERS.filter((item) => item.market === market).map((item) => {
          const count = board.events.filter((event) => event.issuer === item.id).length;
          return (
            <Chip key={item.id} active={issuer === item.id} onClick={() => setIssuer(item.id)}>
              {item.short} {count}
            </Chip>
          );
        })}
      </div>

      <p className="mt-2 text-xs text-muted">{visible.length}건</p>

      {visible.length === 0 ? (
        <p className="mt-2 rounded-2xl border border-dashed border-line bg-card px-4 py-6 text-center text-sm text-muted">
          이 종류에서 응모·쿠폰·추첨 이벤트가 없습니다. 아래 회사 앱에서 확인하세요.
        </p>
      ) : (
        <ul className="mt-1.5 overflow-hidden rounded-2xl border border-line bg-card">
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

      <section className="mt-6 border-t border-line pt-4">
        <h2 className="text-sm font-semibold">수집 현황</h2>
        <ul className="mt-2 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-card">
          {board.issuers
            .filter((item) => issuerMeta(item.id).market === market)
            .map((item) => (
            <li key={item.id} className="flex items-center justify-between gap-3 px-3 py-2">
              <div className="min-w-0">
                <p className="text-sm font-medium leading-snug">
                  {item.name}
                  <span className="ml-2 font-normal tabular-nums text-muted">{item.count}건</span>
                </p>
                <p className="truncate text-xs leading-snug text-muted">{item.message}</p>
              </div>
              <a
                href={item.listUrl}
                onClick={(click) => {
                  click.preventDefault();
                  const meta = issuerMeta(item.id);
                  openApply(item.listUrl, meta.androidPackage, "app", meta.iosAppId);
                }}
                className="inline-flex h-7 shrink-0 items-center gap-0.5 text-xs font-medium text-accent"
              >
                바로가기
                <ArrowUpRight className="size-3.5" />
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
  return (
    <li className="border-b border-line last:border-b-0">
      <div className="px-2.5 py-1.5 sm:hidden">
        <div className="flex items-center gap-1.5">
          <Deadline end={event.endDate} today={today} />
          <span className="text-[11px] font-medium text-muted">{issuerShort(event.issuer)}</span>
          <span className="text-[11px] tabular-nums text-muted">~{formatDay(event.endDate).slice(5)}</span>
          <a
            href={event.applyUrl}
            target="_blank"
            rel="noreferrer"
            onClick={(click) => {
              click.preventDefault();
              openApply(event.applyUrl, issuerMeta(event.issuer).androidPackage);
            }}
            className="ml-auto inline-flex h-6 shrink-0 items-center gap-0.5 rounded-full bg-accent px-2 text-[11px] font-medium text-accent-ink"
          >
            응모
            <ArrowUpRight className="size-3" />
          </a>
        </div>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={`${panelId}-m`}
          className="mt-0.5 flex w-full items-start gap-1 text-left"
        >
          <span
            className={
              open
                ? "min-w-0 flex-1 text-pretty text-[13px] font-semibold leading-snug"
                : "min-w-0 flex-1 line-clamp-2 text-[13px] font-medium leading-snug"
            }
          >
            {event.title}
          </span>
          <ChevronDown
            className={`mt-0.5 size-3.5 shrink-0 text-muted transition-transform ${open ? "rotate-180" : ""}`}
            aria-hidden
          />
        </button>
        {open ? <EventBody event={event} id={`${panelId}-m`} /> : null}
      </div>

      <div className="hidden sm:block">
        <div className="flex items-center">
          <button
            type="button"
            onClick={onToggle}
            aria-expanded={open}
            aria-controls={panelId}
            className="flex min-h-9 min-w-0 flex-1 items-center gap-2 py-1 pl-3 text-left"
          >
            <Deadline end={event.endDate} today={today} />
            <span className="w-10 shrink-0 text-[11px] font-medium text-muted">{issuerShort(event.issuer)}</span>
            <span className="min-w-0 flex-1 truncate text-sm font-medium">{event.title}</span>
            <span className="shrink-0 text-[11px] tabular-nums text-muted">
              {formatDay(event.startDate).slice(5)}–{formatDay(event.endDate).slice(5)}
            </span>
            <ChevronDown
              className={`size-3.5 shrink-0 text-muted transition-transform ${open ? "rotate-180" : ""}`}
              aria-hidden
            />
          </button>
          <a
            href={event.applyUrl}
            target="_blank"
            rel="noreferrer"
            onClick={(click) => {
              click.preventDefault();
              openApply(event.applyUrl, issuerMeta(event.issuer).androidPackage);
            }}
            className="mr-3 inline-flex h-6 shrink-0 items-center gap-0.5 rounded-full bg-accent px-2 text-[11px] font-medium text-accent-ink"
          >
            응모
            <ArrowUpRight className="size-3" />
          </a>
        </div>
        {open ? (
          <div className="border-t border-line">
            <EventBody event={event} id={panelId} />
          </div>
        ) : null}
      </div>
    </li>
  );
}

function EventBody({ event, id }: { event: EntryEvent; id: string }) {
  const benefit =
    event.benefit && event.benefit !== event.summary && event.benefit !== event.title
      ? event.benefit
      : "";
  return (
    <div id={id} className="mt-1.5 rounded-xl bg-paper px-2.5 py-2.5 sm:mt-0 sm:rounded-none sm:px-3">
      <h2 className="hidden text-pretty text-sm font-semibold leading-snug sm:block">{event.title}</h2>
      <p className="text-pretty text-sm leading-relaxed sm:mt-1">{event.summary}</p>
      {benefit ? <p className="mt-1 text-sm font-medium">{benefit}</p> : null}
      <p className="mt-1.5 text-xs tabular-nums text-muted">
        {issuerName(event.issuer)} · {formatDay(event.startDate)} – {formatDay(event.endDate)}
      </p>
      <h3 className="mt-2 text-sm font-semibold">응모 조건</h3>
      <ul className="mt-1 list-disc space-y-0.5 pl-5 text-sm leading-relaxed text-muted">
        {(event.conditions.length ? event.conditions : ["카드사 페이지의 조건을 확인하세요."]).map(
          (line) => (
            <li key={line}>{line}</li>
          ),
        )}
      </ul>
      {event.exclusions.length ? (
        <>
          <h3 className="mt-2 text-sm font-semibold">제외·유의사항</h3>
          <ul className="mt-1 list-disc space-y-0.5 pl-5 text-sm leading-relaxed text-muted">
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
        onClick={(click) => {
          click.preventDefault();
          openApply(event.applyUrl, issuerMeta(event.issuer).androidPackage);
        }}
        className="mt-2.5 inline-flex h-9 w-full items-center justify-center gap-1 rounded-full bg-accent px-4 text-sm font-medium text-accent-ink sm:w-auto"
      >
        {issuerName(event.issuer)}에서 응모
        <ArrowUpRight className="size-4" />
      </a>
    </div>
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
          ? "h-7 rounded-full bg-ink px-2.5 text-xs font-medium text-paper"
          : "h-7 rounded-full px-2.5 text-xs text-muted"
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
          ? "h-7 shrink-0 rounded-full bg-ink px-2.5 text-xs font-medium text-paper"
          : "h-7 shrink-0 rounded-full border border-line bg-card px-2.5 text-xs text-ink"
      }
    >
      {children}
    </button>
  );
}

function Deadline({ end, today }: { end: string; today: string }) {
  const days = daysUntil(end, today);
  const label = days < 0 ? "종료" : days === 0 ? "오늘" : `D-${days}`;
  const hot = days >= 0 && days <= 7;
  return (
    <span
      className={
        hot
          ? "inline-flex h-5 w-12 shrink-0 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-medium tabular-nums text-accent-ink"
          : "inline-flex h-5 w-12 shrink-0 items-center justify-center rounded-full bg-paper px-1 text-[10px] font-medium tabular-nums text-muted"
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
  const parts = new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const get = (type: Intl.DateTimeFormatPartTypes) => parts.find((part) => part.type === type)?.value ?? "";
  return `${get("month")}.${get("day")} ${get("hour")}:${get("minute")}`;
}
