import { ArrowUpRight, ChevronDown, RefreshCw, Search } from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";
import { openApply } from "@/lib/events/open-apply";
import { removePharmaLogin, reloadPharma, storePharmaLogin, createPharmaCompany, editPharmaCompany, removePharmaCompany } from "@/lib/pharma/board.functions";
import { PHARMA_KIND_LABEL, type PharmaBoard, type PharmaEvent } from "@/lib/pharma/types";

export function PharmaScreen({
  initial,
  onFinance,
}: {
  initial: PharmaBoard;
  onFinance: () => void;
}) {
  const [board, setBoard] = useState(initial);
  const [company, setCompany] = useState<string>("all");
  const [adding, setAdding] = useState(false);
  const [draftName, setDraftName] = useState("");
  const [draftUrl, setDraftUrl] = useState("");
  const [sort, setSort] = useState<"soon" | "new">("soon");
  const [query, setQuery] = useState("");
  const [openIds, setOpenIds] = useState<string[]>([]);
  const [pending, setPending] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const selected = board.companies.find((item) => item.id === company);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return board.events
      .filter((event) => company === "all" || event.companyId === company)
      .filter((event) => {
        if (!q) return true;
        const blob = [event.title, event.summary, companyName(board, event.companyId), PHARMA_KIND_LABEL[event.kind]]
          .join(" ")
          .toLowerCase();
        return blob.includes(q);
      })
      .sort((a, b) =>
        sort === "new"
          ? (b.startDate || "0000").localeCompare(a.startDate || "0000")
          : (a.endDate || "9999").localeCompare(b.endDate || "9999") || a.title.localeCompare(b.title, "ko"),
      );
  }, [board, company, query, sort]);

  function pick(id: string) {
    setAdding(false);
    setCompany(id);
    const row = board.companies.find((item) => item.id === id);
    setUsername(row?.username ?? "");
    setDraftName(row?.name ?? "");
    setDraftUrl(row?.loginUrl ?? "");
    setPassword("");
    setError("");
  }

  function startAdd() {
    setCompany("all");
    setAdding(true);
    setUsername("");
    setPassword("");
    setDraftName("");
    setDraftUrl("https://");
    setError("");
  }

  async function saveCompany() {
    setSaving(true);
    setError("");
    try {
      if (adding) {
        const created = await createPharmaCompany({ data: { name: draftName, loginUrl: draftUrl } });
        setBoard(created.board);
        setAdding(false);
        setCompany(created.id);
        const row = created.board.companies.find((item) => item.id === created.id);
        setDraftName(row?.name ?? draftName);
        setDraftUrl(row?.loginUrl ?? draftUrl);
        setUsername("");
      } else if (company !== "all") {
        const next = await editPharmaCompany({ data: { companyId: company, name: draftName, loginUrl: draftUrl } });
        setBoard(next);
        const row = next.companies.find((item) => item.id === company);
        setDraftName(row?.name ?? draftName);
        setDraftUrl(row?.loginUrl ?? draftUrl);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "저장하지 못했습니다.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteCompany() {
    if (company === "all") return;
    setSaving(true);
    setError("");
    try {
      setBoard(await removePharmaCompany({ data: { companyId: company } }));
      setCompany("all");
      setDraftName("");
      setDraftUrl("");
      setUsername("");
      setPassword("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "지우지 못했습니다.");
    } finally {
      setSaving(false);
    }
  }

  async function refresh() {
    setPending(true);
    setError("");
    try {
      setBoard(await reloadPharma({ data: { companyId: company === "all" ? "" : company } }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "다시 수집하지 못했습니다.");
    } finally {
      setPending(false);
    }
  }

  async function saveLogin() {
    if (company === "all") return;
    setSaving(true);
    setError("");
    try {
      const next = await storePharmaLogin({ data: { companyId: company, username, password } });
      setBoard(next);
      setPassword("");
      setUsername(next.companies.find((item) => item.id === company)?.username ?? username);
    } catch (err) {
      setError(err instanceof Error ? err.message : "저장하지 못했습니다.");
    } finally {
      setSaving(false);
    }
  }

  async function clearLogin() {
    if (company === "all") return;
    setSaving(true);
    setError("");
    try {
      setBoard(await removePharmaLogin({ data: { companyId: company } }));
      setUsername("");
      setPassword("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "지우지 못했습니다.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl px-3 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-6 sm:py-6">
      <header className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <button type="button" onClick={onFinance} className="shrink-0 text-2xl font-medium tracking-tight text-muted">
            ㅇㅁㅁㅇ
          </button>
          <h1 className="shrink-0 text-2xl font-semibold tracking-tight">ㅈㅇㅅ</h1>
        </div>
        <div className="flex min-w-0 items-center gap-2">
          <p className="min-w-0 truncate text-right text-[11px] tabular-nums leading-tight text-muted sm:text-xs">
            수집 {board.collectedAt ? formatWhen(board.collectedAt) : "없음"}
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

      <div className="mt-3 flex items-center gap-1.5">
        <label className="flex h-8 min-w-0 flex-1 items-center gap-1.5 rounded-full border border-line bg-card px-3">
          <Search className="size-3.5 shrink-0 text-muted" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="행사, 회사"
            className="w-full bg-transparent text-base leading-none outline-none placeholder:text-muted sm:text-sm"
          />
        </label>
        <div className="flex h-8 shrink-0 rounded-full border border-line bg-card p-0.5">
          <SortButton active={sort === "soon"} onClick={() => setSort("soon")}>
            마감
          </SortButton>
          <SortButton active={sort === "new"} onClick={() => setSort("new")}>
            최근
          </SortButton>
        </div>
      </div>

      <div className="-mx-3 mt-2 flex gap-1.5 overflow-x-auto px-3 pb-0.5 sm:mx-0 sm:px-0">
        <Chip active={company === "all" && !adding} onClick={() => pick("all")}>
          전체 {board.events.length}
        </Chip>
        {board.companies.map((item) => (
          <Chip key={item.id} active={company === item.id} onClick={() => pick(item.id)}>
            {item.short} {item.count}
          </Chip>
        ))}
        <Chip active={adding} onClick={startAdd}>
          추가
        </Chip>
      </div>

      {adding || company !== "all" ? (
        <form
          className="mt-2 flex flex-wrap items-center gap-1.5"
          onSubmit={(event) => {
            event.preventDefault();
            void saveCompany();
          }}
        >
          <input
            value={draftName}
            onChange={(event) => setDraftName(event.target.value)}
            placeholder="회사 이름"
            className="h-8 min-w-0 flex-1 rounded-full border border-line bg-card px-3 text-base outline-none sm:text-sm"
          />
          <input
            value={draftUrl}
            onChange={(event) => setDraftUrl(event.target.value)}
            placeholder="홈페이지 주소"
            className="h-8 min-w-0 flex-[2] rounded-full border border-line bg-card px-3 text-base outline-none sm:text-sm"
          />
          <button
            type="submit"
            disabled={saving}
            className="inline-flex h-8 shrink-0 items-center rounded-full bg-ink px-3 text-xs font-medium text-paper disabled:opacity-60"
          >
            {adding ? "추가" : "수정"}
          </button>
          {company !== "all" ? (
            <button
              type="button"
              onClick={() => void deleteCompany()}
              disabled={saving}
              className="inline-flex h-8 shrink-0 items-center rounded-full border border-line px-3 text-xs text-muted"
            >
              회사 삭제
            </button>
          ) : null}
        </form>
      ) : (
        <p className="mt-2 text-xs text-muted">회사를 고르면 이름·주소·로그인을 바꿀 수 있습니다.</p>
      )}

      {company !== "all" ? (
        <form
          className="mt-2 flex flex-wrap items-center gap-1.5"
          onSubmit={(event) => {
            event.preventDefault();
            void saveLogin();
          }}
        >
          <input
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            placeholder="아이디"
            autoComplete="off"
            className="h-8 min-w-0 flex-1 rounded-full border border-line bg-card px-3 text-base outline-none sm:text-sm"
          />
          <input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            type="password"
            placeholder={selected?.saved ? "비밀번호 변경" : "비밀번호"}
            autoComplete="off"
            className="h-8 min-w-0 flex-1 rounded-full border border-line bg-card px-3 text-base outline-none sm:text-sm"
          />
          <button
            type="submit"
            disabled={saving}
            className="inline-flex h-8 shrink-0 items-center rounded-full bg-ink px-3 text-xs font-medium text-paper disabled:opacity-60"
          >
            {saving ? "확인 중" : "저장"}
          </button>
          {selected?.saved ? (
            <button
              type="button"
              onClick={() => void clearLogin()}
              disabled={saving}
              className="inline-flex h-8 shrink-0 items-center rounded-full border border-line px-3 text-xs text-muted"
            >
              로그인 삭제
            </button>
          ) : null}
        </form>
      ) : (
        <p className="mt-2 text-xs text-muted">회사를 고르고 아이디를 저장하세요. 저장된 곳만, 한 번에 4곳씩 읽습니다.</p>
      )}

      <p className="mt-2 text-xs text-muted">{visible.length}건</p>

      {visible.length === 0 ? (
        <p className="mt-2 rounded-2xl border border-dashed border-line bg-card px-4 py-6 text-center text-sm text-muted">
          응모·할인·신제품이 없습니다. 로그인 정보를 저장한 뒤 다시 수집하세요.
        </p>
      ) : (
        <ul className="mt-1.5 overflow-hidden rounded-2xl border border-line bg-card">
          {visible.map((event) => (
            <PharmaRow
              key={event.id}
              event={event}
              companyLabel={companyShort(board, event.companyId)}
              companyFull={companyName(board, event.companyId)}
              today={board.today}
              open={openIds.includes(event.id)}
              onToggle={() =>
                setOpenIds((current) =>
                  current.includes(event.id) ? current.filter((item) => item !== event.id) : [...current, event.id],
                )
              }
            />
          ))}
        </ul>
      )}

      <section className="mt-6 border-t border-line pt-4">
        <h2 className="text-sm font-semibold">수집 현황</h2>
        <ul className="mt-2 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-card">
          {board.companies.map((item) => (
              <li key={item.id} className="flex items-center justify-between gap-3 px-3 py-2">
                <div className="min-w-0">
                  <p className="text-sm font-medium leading-snug">
                    {item.name}
                    <span className="ml-2 font-normal tabular-nums text-muted">{item.count}건</span>
                  </p>
                  <p className="truncate text-xs leading-snug text-muted">{item.message}</p>
                </div>
                <a
                  href={item.loginUrl}
                  onClick={(click) => {
                    click.preventDefault();
                    openApply(item.loginUrl);
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

function PharmaRow({
  event,
  companyLabel,
  companyFull,
  today,
  open,
  onToggle,
}: {
  event: PharmaEvent;
  companyLabel: string;
  companyFull: string;
  today: string;
  open: boolean;
  onToggle: () => void;
}) {
  const label = PHARMA_KIND_LABEL[event.kind];
  return (
    <li className="border-b border-line last:border-b-0">
      <div className="px-2.5 py-1.5 sm:hidden">
        <div className="flex items-center gap-1.5">
          <Deadline end={event.endDate} today={today} />
          <span className="text-[11px] font-medium text-muted">{companyLabel}</span>
          <span className="text-[11px] tabular-nums text-muted">{event.endDate ? `~${event.endDate.slice(5)}` : "기간 확인"}</span>
          <a
            href={event.url}
            onClick={(click) => {
              click.preventDefault();
              openApply(event.url);
            }}
            className="ml-auto inline-flex h-6 shrink-0 items-center gap-0.5 rounded-full bg-accent px-2 text-[11px] font-medium text-accent-ink"
          >
            {label}
            <ArrowUpRight className="size-3" />
          </a>
        </div>
        <button type="button" onClick={onToggle} className="mt-0.5 flex w-full items-start gap-1 text-left">
          <span className={open ? "min-w-0 flex-1 text-pretty text-[13px] font-semibold leading-snug" : "min-w-0 flex-1 line-clamp-2 text-[13px] font-medium leading-snug"}>
            {event.title}
          </span>
          <ChevronDown className={`mt-0.5 size-3.5 shrink-0 text-muted transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
        {open ? <PharmaBody event={event} companyFull={companyFull} /> : null}
      </div>
      <div className="hidden sm:block">
        <div className="flex items-center">
          <button type="button" onClick={onToggle} className="flex min-h-9 min-w-0 flex-1 items-center gap-2 py-1 pl-3 text-left">
            <Deadline end={event.endDate} today={today} />
            <span className="w-14 shrink-0 truncate text-[11px] font-medium text-muted">{companyLabel}</span>
            <span className="min-w-0 flex-1 truncate text-sm font-medium">{event.title}</span>
            <span className="shrink-0 text-[11px] tabular-nums text-muted">
              {event.endDate ? `${(event.startDate || event.endDate).slice(5)}–${event.endDate.slice(5)}` : "기간 확인"}
            </span>
            <ChevronDown className={`size-3.5 shrink-0 text-muted transition-transform ${open ? "rotate-180" : ""}`} />
          </button>
          <a
            href={event.url}
            onClick={(click) => {
              click.preventDefault();
              openApply(event.url);
            }}
            className="mr-3 inline-flex h-6 shrink-0 items-center gap-0.5 rounded-full bg-accent px-2 text-[11px] font-medium text-accent-ink"
          >
            {label}
            <ArrowUpRight className="size-3" />
          </a>
        </div>
        {open ? (
          <div className="border-t border-line">
            <PharmaBody event={event} companyFull={companyFull} />
          </div>
        ) : null}
      </div>
    </li>
  );
}

function PharmaBody({ event, companyFull }: { event: PharmaEvent; companyFull: string }) {
  return (
    <div className="mt-1.5 rounded-xl bg-paper px-2.5 py-2.5 sm:mt-0 sm:rounded-none sm:px-3">
      <p className="text-pretty text-sm leading-relaxed">{event.summary}</p>
      <p className="mt-1.5 text-xs tabular-nums text-muted">
        {companyFull} · {PHARMA_KIND_LABEL[event.kind]}
        {event.startDate && event.endDate ? ` · ${event.startDate} – ${event.endDate}` : ""}
      </p>
      <ul className="mt-1 list-disc space-y-0.5 pl-5 text-sm leading-relaxed text-muted">
        {event.conditions.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
      <a
        href={event.url}
        onClick={(click) => {
          click.preventDefault();
          openApply(event.url);
        }}
        className="mt-2.5 inline-flex h-9 w-full items-center justify-center gap-1 rounded-full bg-accent px-4 text-sm font-medium text-accent-ink sm:w-auto"
      >
        {companyFull}에서 보기
        <ArrowUpRight className="size-4" />
      </a>
    </div>
  );
}

function SortButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={active ? "h-7 rounded-full bg-ink px-2.5 text-xs font-medium text-paper" : "h-7 rounded-full px-2.5 text-xs text-muted"}
    >
      {children}
    </button>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
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
  if (!end) {
    return (
      <span className="inline-flex h-5 w-12 shrink-0 items-center justify-center rounded-full bg-paper px-1 text-[10px] font-medium text-muted">
        확인
      </span>
    );
  }
  const days = Math.round((Date.parse(`${end}T00:00:00+09:00`) - Date.parse(`${today}T00:00:00+09:00`)) / 86_400_000);
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

function companyName(board: PharmaBoard, id: string): string {
  return board.companies.find((item) => item.id === id)?.name ?? id;
}

function companyShort(board: PharmaBoard, id: string): string {
  return board.companies.find((item) => item.id === id)?.short ?? id;
}

function formatWhen(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "없음";
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
