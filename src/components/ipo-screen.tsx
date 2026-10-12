import { ArrowUpRight, ChevronDown, RefreshCw, Search, X } from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { reloadIpoBoard } from "@/lib/ipo/board.functions";
import { getIpoTerms } from "@/lib/ipo/terms.functions";
import { getVerifiedIpoDetail } from "@/lib/ipo/verified-detail.functions";
import { getIpoDetailsBatch } from "@/lib/ipo/verified-batch.functions";
import type { VerifiedIpoDetail } from "@/lib/ipo/verified-detail.server";
import type { IpoTerms } from "@/lib/ipo/terms.server";
import type { IpoBoard, IpoItem } from "@/lib/ipo/types";

type Scope = "all" | "open" | "upcoming" | "ended";

const BROKER_SITES: Record<string, string> = {
  "미래에셋증권": "https://securities.miraeasset.com",
  "삼성증권": "https://www.samsungpop.com",
  "한국투자증권": "https://www.truefriend.com",
  "KB증권": "https://www.kbsec.com",
  "NH투자증권": "https://www.nhqv.com",
  "키움증권": "https://www.kiwoom.com",
  "신한투자증권": "https://www.shinhansec.com",
  "하나증권": "https://www.hanaw.com",
  "대신증권": "https://www.daishin.com",
  "메리츠증권": "https://home.imeritz.com",
  "IBK투자증권": "https://www.ibks.com",
  "유진투자증권": "https://www.eugenefn.com",
  "SK증권": "https://www.sks.co.kr",
  "DB증권": "https://www.db-fi.com",
  "한화투자증권": "https://www.hanwhawm.com",
  "신영증권": "https://www.shinyoung.com",
  "교보증권": "https://www.iprovest.com",
  "현대차증권": "https://www.hmsec.com",
  "유안타증권": "https://www.myasset.com",
  "LS증권": "https://www.ls-sec.co.kr",
  "부국증권": "https://www.bookook.co.kr",
  "토스증권": "https://corp.tossinvest.com",
  "카카오페이증권": "https://www.kakaopaysec.com",
};

function formatDate(value: string): string {
  return value ? value.replace(/-/g, ".") : "미확인";
}

function money(value: number | null): string {
  return value === null ? "미확인" : new Intl.NumberFormat("ko-KR").format(value) + "원";
}

function stateOf(item: IpoItem, today: string): Exclude<Scope, "all"> {
  return item.subscriptionEnd < today ? "ended"
    : item.subscriptionStart > today ? "upcoming" : "open";
}

function stateLabel(item: IpoItem, today: string) {
  const state = stateOf(item, today);
  if (state === "open") return "청약 중";
  if (state === "ended") return "마감";
  const days = Math.round(
    (Date.parse(item.subscriptionStart + "T00:00:00+09:00") -
      Date.parse(today + "T00:00:00+09:00")) / 86400000,
  );
  return days >= 0 && days <= 30 ? "D-" + days : "예정";
}

export function IpoScreen({
  initial,
  onFinance,
  onPharma,
}: {
  initial: IpoBoard;
  onFinance: () => void;
  onPharma: () => void;
}) {
  const [board, setBoard] = useState(initial);
  const [scope, setScope] = useState<Scope>("all");
  const [broker, setBroker] = useState("all");
  const [query, setQuery] = useState("");
  const [openIds, setOpenIds] = useState<string[]>([]);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [expandedBrokers, setExpandedBrokers] = useState(false);
  const [detailById, setDetailById] = useState<Record<string, VerifiedIpoDetail>>({});
  const [batchStatus, setBatchStatus] = useState<"checking" | "ready" | "failed">("checking");

  // Start verification after the schedule has already rendered. Finance home
  // and the first IPO paint never await external issuer-specific page fetches.
  useEffect(() => {
    let active = true;
    const inputs = board.items.map(item => ({
      id: item.id, name: item.name, subscriptionStart: item.subscriptionStart,
      offerPrice: item.offerPrice, brokers: item.brokers,
    }));
    setDetailById({});
    setBatchStatus("checking");
    if (!inputs.length) {
      setBatchStatus("ready");
      return () => { active = false; };
    }
    // Chunk large calendars so NO stock is silently omitted by the server
    // request limit. Show completed chunks without waiting for the slowest.
    const chunks = Array.from({ length: Math.ceil(inputs.length / 30) },
      (_, i) => inputs.slice(i * 30, (i + 1) * 30));
    void Promise.allSettled(chunks.map(chunk =>
      getIpoDetailsBatch({ data: { items: chunk } }).then(records => {
        if (active) setDetailById(current => ({
          ...current,
          ...Object.fromEntries(records.map(record => [record.id, record.detail])),
        }));
      }),
    )).then(results => {
      if (!active) return;
      setBatchStatus(results.some(result => result.status === "fulfilled") ? "ready" : "failed");
    });
    return () => { active = false; };
  }, [board.items]);

  const brokers = useMemo(() =>
    [...new Set(board.items.flatMap((item) => item.brokers))].sort((a, b) => a.localeCompare(b, "ko")),
    [board.items],
  );
  const brokerSlotCount = board.items.reduce((sum, item) => sum + item.brokers.length, 0);
  const verifiedSlots = board.items.reduce((sum, item) =>
    sum + (detailById[item.id]?.brokerTerms.filter(term =>
      term.termsVerified && term.minimumDeposit !== null).length ?? 0), 0);
  const sourcedFees = board.items.reduce((sum, item) =>
    sum + (detailById[item.id]?.brokerTerms.filter(term => term.feeSourceUrl).length ?? 0), 0);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return board.items
      .filter((item) => scope === "all" || stateOf(item, board.today) === scope)
      .filter((item) => broker === "all" || item.brokers.includes(broker))
      .filter((item) => !q || [item.name, item.market, ...item.brokers]
        .join(" ").toLowerCase().includes(q))
      .sort((a, b) => {
        const aDone = a.subscriptionEnd < board.today ? 1 : 0;
        const bDone = b.subscriptionEnd < board.today ? 1 : 0;
        return aDone - bDone ||
          a.subscriptionStart.localeCompare(b.subscriptionStart) ||
          a.name.localeCompare(b.name, "ko");
      });
  }, [board, scope, broker, query]);

  async function refresh() {
    setPending(true);
    setError("");
    try {
      setBoard(await reloadIpoBoard());
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "공모주 자료를 다시 불러오지 못했습니다.");
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl px-3 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-6 sm:py-6">
      <header className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-1">
          <button type="button" onClick={onFinance} className="shrink-0 text-xl sm:text-2xl font-medium tracking-tight text-muted">ㅇㅁㅁㅇ</button>
          <h1 className="shrink-0 text-xl sm:text-2xl font-semibold tracking-tight">ㄱㅁ</h1>
          <button type="button" onClick={onPharma} className="shrink-0 text-xl sm:text-2xl font-medium tracking-tight text-muted">ㅈㅇㅅ</button>
        </div>
        <div className="flex min-w-0 items-center gap-2">
          <p className="min-w-0 truncate text-right text-[11px] tabular-nums leading-tight text-muted sm:text-xs">
            조회 {new Intl.DateTimeFormat("ko-KR", {timeZone: "Asia/Seoul", month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit"}).format(new Date(board.collectedAt))}
          </p>
          <button type="button" disabled={pending} onClick={() => void refresh()}
            className="inline-flex h-8 shrink-0 items-center gap-1 rounded-full bg-ink px-3 text-xs font-medium text-paper disabled:opacity-60">
            <RefreshCw className={pending ? "size-3.5 animate-spin" : "size-3.5"} />
            {pending ? "조회 중" : "다시 조회"}
          </button>
        </div>
      </header>

      <section className="mt-3 rounded-xl border border-line bg-card px-3 py-2.5">
        <p className="text-sm font-semibold">전체 증권사 공모주 일정</p>
        <p className="mt-1 text-xs leading-relaxed text-muted">
          청약 종목·주관사·공모가·환불일·상장일을 한곳에서 확인합니다. 최소 청약주수·증거금률·계좌 개설 기준·수수료는 종목과 증권사마다 달라 반드시 청약 공고를 확인해야 합니다.
        </p>
        <p role="status" className="mt-1 text-xs leading-relaxed text-muted">
          {board.message}
        </p>
      </section>
      {error ? <p role="alert" className="mt-2 text-sm text-accent">{error}</p> : null}

      <div className="mt-3 grid grid-cols-4 gap-1 rounded-full border border-line bg-card p-0.5" role="group" aria-label="청약 상태">
        {([
          ["all", "전체"], ["open", "청약 중"], ["upcoming", "예정"], ["ended", "마감"],
        ] as const).map(([id, label]) => (
          <button key={id} type="button" aria-pressed={scope === id}
            onClick={() => setScope(id)}
            className={scope === id
              ? "h-8 rounded-full bg-ink text-xs font-medium text-paper"
              : "h-8 rounded-full text-xs text-muted"}>
            {label} {id === "all" ? board.items.length : board.items.filter((item) => stateOf(item, board.today) === id).length}
          </button>
        ))}
      </div>

      <label className="mt-2 flex h-9 items-center gap-1.5 rounded-full border border-line bg-card px-3">
        <Search className="size-3.5 shrink-0 text-muted" />
        <input aria-label="공모주 검색" placeholder="종목명 또는 증권사 검색"
          value={query} onChange={(event) => setQuery(event.target.value)}
          className="min-w-0 flex-1 bg-transparent text-base leading-none outline-none placeholder:text-muted sm:text-sm" />
        {query ? (
          <button type="button" aria-label="검색어 지우기" onClick={() => setQuery("")} className="flex size-6 items-center justify-center text-muted">
            <X className="size-3.5" />
          </button>
        ) : null}
      </label>

      <div className={expandedBrokers
        ? "mt-2 flex flex-wrap gap-1.5"
        : "-mx-3 mt-2 flex gap-1.5 overflow-x-auto px-3 pb-1 sm:mx-0 sm:px-0"}>
        <FilterChip active={broker === "all"} onClick={() => setBroker("all")}>전체 증권사</FilterChip>
        {brokers.map((name) => (
          <FilterChip key={name} active={broker === name} onClick={() => setBroker(name)}>
            {name.replace(/투자증권|증권/g, "")} {board.items.filter((item) => item.brokers.includes(name)).length}
          </FilterChip>
        ))}
      </div>
      {brokers.length > 5 ? (
        <button type="button" aria-expanded={expandedBrokers} onClick={() => setExpandedBrokers((value) => !value)}
          className="mt-1 flex w-full items-center justify-center gap-1 rounded-lg py-1 text-xs text-muted">
          {expandedBrokers ? "증권사 접기" : "증권사 전체 펼치기"}
          <ChevronDown className={expandedBrokers ? "size-3.5 rotate-180" : "size-3.5"} />
        </button>
      ) : null}

      <p className="mt-2 text-xs leading-relaxed text-muted" role="status">
        {filtered.length}건 · {batchStatus === "checking" ? "전 종목·증권사 청약조건 병렬 확인 중…" :
          batchStatus === "failed" ? "자동 검증 연결 실패 · 종목을 누르면 개별 재확인" :
          "최소 증거금 확인 " + verifiedSlots + "/" + brokerSlotCount +
          " · 공식 수수료표 확인 " + sourcedFees + "/" + brokerSlotCount}
      </p>
      {filtered.length ? (
        <ul className="mt-1.5 overflow-hidden rounded-2xl border border-line bg-card">
          {filtered.map((item) => (
            <IpoRow key={item.id} item={item} today={board.today}
              prefetched={detailById[item.id]}
              open={openIds.includes(item.id)}
              onToggle={() => setOpenIds((current) => current.includes(item.id)
                ? current.filter((id) => id !== item.id) : [...current, item.id])} />
          ))}
        </ul>
      ) : (
        <p className="mt-2 rounded-2xl border border-dashed border-line bg-card px-4 py-6 text-center text-sm leading-relaxed text-muted">
          {board.status !== "ok"
            ? "일정 수집을 확인해야 합니다. 아래 공식 원문을 열어 직접 확인해 주세요."
            : "현재 조건에 맞는 공모주가 없습니다. KRX 공개 표에 아직 반영되지 않은 공모주는 원문에서 확인해 주세요."}
        </p>
      )}

      <section className="mt-6 border-t border-line pt-4">
        <h2 className="text-sm font-semibold">청약 전 확인할 것</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          ① 청약 주관사 계좌 보유 및 개설 기한 ② 최소 청약주수·증거금률 ③ 고객 등급·온라인 청약 수수료 ④ 마감 시각 ⑤ 환불일·상장일. 같은 공모주라도 증권사별 최소 수량과 조건은 다를 수 있습니다.
        </p>
        <a href={board.sourceUrl} target="_blank" rel="noopener noreferrer"
          className="mt-3 inline-flex h-9 items-center justify-center gap-1 rounded-full bg-accent px-4 text-sm font-medium text-accent-ink">
          KRX KIND 공모기업 공식 원문 <ArrowUpRight className="size-4" />
        </a>
        <p className="mt-2 text-xs leading-relaxed text-muted">
          이 화면은 투자 권유가 아닌 일정 확인용입니다. KIND 공개 목록은 페이지별로 제공되며 일정 변경이나 누락 가능성이 있습니다. 최종 청약조건은 주관사의 투자설명서·청약 공고가 우선합니다.
        </p>
      </section>
    </main>
  );
}

function FilterChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button type="button" onClick={onClick} aria-pressed={active}
      className={active
        ? "h-7 shrink-0 rounded-full bg-ink px-2.5 text-xs font-medium text-paper"
        : "h-7 shrink-0 rounded-full border border-line bg-card px-2.5 text-xs text-ink"}>
      {children}
    </button>
  );
}

function IpoRow({ item, today, prefetched, open, onToggle }: {
  item: IpoItem;
  today: string;
  prefetched?: VerifiedIpoDetail;
  open: boolean;
  onToggle: () => void;
}) {
  const status = stateLabel(item, today);
  const hot = stateOf(item, today) === "open";
  return (
    <li className="border-b border-line last:border-b-0">
      <div className="flex items-center gap-2 px-3 py-2">
        <button type="button" aria-expanded={open} onClick={onToggle}
          className="flex min-w-0 flex-1 items-center gap-2 text-left">
          <span className={hot
            ? "inline-flex w-12 shrink-0 justify-center rounded-full bg-accent px-1 py-1 text-[10px] font-medium text-accent-ink"
            : "inline-flex w-12 shrink-0 justify-center rounded-full bg-paper px-1 py-1 text-[10px] font-medium text-muted"}>
            {status}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-semibold">{item.name}</span>
            <span className="block truncate text-[11px] text-muted">{item.brokers.join(" · ")} · ~{formatDate(item.subscriptionEnd).slice(5)}</span>
            {prefetched?.brokerTerms.length === 1 &&
            prefetched.brokerTerms[0].termsVerified &&
            prefetched.brokerTerms[0].minimumDeposit !== null ? (
              <span className="block truncate text-[11px] font-medium text-ink">
                최소 {money(prefetched.brokerTerms[0].minimumDeposit)}
                {prefetched.brokerTerms[0].onlineFee !== null
                  ? " · 수수료 " + money(prefetched.brokerTerms[0].onlineFee) : ""}
              </span>
            ) : null}
          </span>
          <span className="shrink-0 text-right">
            <span className="block text-xs font-medium tabular-nums">{item.offerPrice === null ? "미확정" : money(item.offerPrice)}</span>
            <span className="block text-[10px] text-muted">{item.offerPrice === null && item.indicativePriceRange ? "희망가 별도" : "공모가"}</span>
          </span>
          <ChevronDown className={open
            ? "size-3.5 shrink-0 rotate-180 text-muted" : "size-3.5 shrink-0 text-muted"} />
        </button>
      </div>
      {open ? <IpoDetails item={item} prefetched={prefetched} /> : null}
    </li>
  );
}

function IpoDetails({ item, prefetched }: { item: IpoItem; prefetched?: VerifiedIpoDetail }) {
  const [shares, setShares] = useState("10");
  const [percent, setPercent] = useState("50");
  const [terms, setTerms] = useState<IpoTerms | null>(null);
  const [termsPending, setTermsPending] = useState(false);
  const [verifiedDetail, setVerifiedDetail] = useState<VerifiedIpoDetail | null>(prefetched ?? null);
  const [verifiedPending, setVerifiedPending] = useState(true);
  useEffect(() => {
    if (prefetched) {
      setVerifiedDetail(prefetched);
      const single = prefetched.brokerTerms.length === 1 ? prefetched.brokerTerms[0] : null;
      if (single?.termsVerified && single.minimumShares !== null)
        setShares(String(single.minimumShares));
      if (single?.termsVerified && single.depositPercent !== null)
        setPercent(String(single.depositPercent));
      setVerifiedPending(false);
      return;
    }
    let active = true;
    setVerifiedPending(true);
    getVerifiedIpoDetail({ data: {
      name: item.name, subscriptionStart: item.subscriptionStart,
      offerPrice: item.offerPrice, brokers: item.brokers,
    } })
      .then(result => {
        if (!active) return;
        setVerifiedDetail(result);
        const single = result.brokerTerms.length === 1 ? result.brokerTerms[0] : null;
        if (single?.termsVerified && single.minimumShares !== null)
          setShares(String(single.minimumShares));
        if (single?.termsVerified && single.depositPercent !== null)
          setPercent(String(single.depositPercent));
      })
      .catch(() => { /* Failure leaves unavailable information unverified. */ })
      .finally(() => { if (active) setVerifiedPending(false); });
    return () => { active = false; };
  }, [item.name, item.subscriptionStart, item.offerPrice, item.brokers.join("|"), prefetched]);
  useEffect(() => {
    if (!item.sourceUrl.startsWith("https://www.38.co.kr/")) return;
    let active = true;
    setTermsPending(true);
    getIpoTerms({ data: { url: item.sourceUrl, name: item.name } })
      .then((result) => {
        if (!active) return;
        setTerms(result);
        if (result.minimumShares !== null) setShares(String(result.minimumShares));
        if (result.depositPercent !== null) setPercent(String(result.depositPercent));
      })
      .catch(() => { /* Terms are best-effort; unknown remains unknown. */ })
      .finally(() => { if (active) setTermsPending(false); });
    return () => { active = false; };
  }, [item.name, item.sourceUrl]);
  const verifiedSingle = verifiedDetail?.brokerTerms.length === 1
    ? verifiedDetail.brokerTerms[0] : null;
  const legacySingle = item.brokers.length === 1 ? terms : null;
  const minimumShares = verifiedSingle?.minimumShares ?? (
    item.brokers.length === 1 ? (item.minimumShares ?? legacySingle?.minimumShares ?? null) : null
  );
  const depositPercent = verifiedSingle?.depositPercent ?? (
    item.brokers.length === 1 ? (item.depositPercent ?? legacySingle?.depositPercent ?? null) : null
  );
  const actualMinimum = verifiedSingle?.termsVerified && verifiedSingle.minimumDeposit !== null
    ? verifiedSingle.minimumDeposit
    : minimumShares !== null && depositPercent !== null && item.offerPrice !== null
      ? Math.ceil(item.offerPrice * minimumShares * depositPercent / 100) : null;
  const onlineFee = verifiedSingle?.onlineFee ?? null;
  const totalReady = actualMinimum !== null && onlineFee !== null
    ? actualMinimum + onlineFee : null;
  const detailLoading = termsPending || verifiedPending;
  const amount = item.offerPrice !== null &&
    Number(shares) > 0 && Number.isInteger(Number(shares)) && Number(shares) <= 10000000 &&
    Number(percent) > 0 && Number(percent) <= 100
      ? Math.ceil(item.offerPrice * Number(shares) * Number(percent) / 100) : null;

  return (
    <div className="border-t border-line bg-paper px-3 py-3">
      <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
        <Info label="청약 기간" value={formatDate(item.subscriptionStart) + " ~ " + formatDate(item.subscriptionEnd)} />
        <Info label="확정 공모가" value={money(item.offerPrice)} />
        {item.indicativePriceRange ? <Info label="희망 공모가 범위" value={item.indicativePriceRange} /> : null}
        <Info label="환불일" value={formatDate(item.refundDate || verifiedDetail?.refundDate || terms?.refundDate || "")} />
        <Info label="상장 예정일" value={formatDate(item.listingDate || verifiedDetail?.listingDate || terms?.listingDate || "")} />
        <Info label="최소 청약주수" value={minimumShares === null
          ? detailLoading ? "조건 확인 중" : "주관사별 미확인"
          : minimumShares + "주"} />
        <Info label="청약 증거금률" value={depositPercent === null
          ? detailLoading ? "확인 중" : "주관사별 미확인" : depositPercent + "%"} />
        <Info label="최소 증거금" value={actualMinimum !== null
          ? money(actualMinimum)
          : detailLoading ? "확인 중" : "주관사별 미확인"} />
        <Info label="온라인 청약 수수료 (일반)" value={onlineFee !== null
          ? money(onlineFee) : detailLoading ? "확인 중" : "주관사별 미확인"} />
        <Info label="준비 금액 (일반 기준)" value={totalReady === null
          ? "확인 필요" : money(totalReady) + " (참고)"} />
      </div>
      {verifiedDetail?.brokerTerms.length ? (
        <section className="mt-3 rounded-xl border border-line bg-card p-3">
          <p className="text-xs font-semibold">주관사별 청약조건 · 일반 온라인 기준</p>
          <div className="mt-2 space-y-3">
            {verifiedDetail.brokerTerms.map(row => (
              <div key={row.broker} className="border-t border-line pt-2 first:border-t-0 first:pt-0">
                <p className="text-sm font-semibold">{row.broker}</p>
                <div className="mt-1 grid grid-cols-2 gap-x-3 gap-y-2">
                  <Info label="최소 청약" value={row.termsVerified && row.minimumShares !== null
                    ? row.minimumShares + "주" : "종목별 미확인"} />
                  <Info label="증거금률" value={row.termsVerified && row.depositPercent !== null
                    ? row.depositPercent + "%" : "종목별 미확인"} />
                  <Info label="최소 증거금" value={row.termsVerified && row.minimumDeposit !== null
                    ? money(row.minimumDeposit) : "종목별 미확인"} />
                  <Info label="일반 온라인 수수료" value={row.onlineFee === null
                    ? "공식 미확인" : money(row.onlineFee)} />
                </div>
                <p className="mt-1 text-xs text-muted">{row.onlineFeeNote}</p>
                {row.feeSourceUrl ? <a href={row.feeSourceUrl} target="_blank"
                  rel="noopener noreferrer" className="text-xs underline">
                    증권사 공식 수수료 원문 <ArrowUpRight className="inline size-3" />
                </a> : null}
              </div>
            ))}
          </div>
          <p className="mt-2 text-[11px] leading-relaxed text-muted">
            수수료는 고객등급·채널·미배정 여부에 따라 달라집니다.
            공동 주관 종목은 각 증권사 최소 청약수량을 별도로 확인해야 합니다.
          </p>
        </section>
      ) : null}
      <div className="mt-3 rounded-xl border border-line bg-card px-3 py-3">
        <p className="text-xs font-semibold">청약 증거금 계산 <span className="font-normal text-muted">· 참고 계산, 수수료 제외</span></p>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <label className="text-xs text-muted">청약 주수
            <input type="number" min="1" step="1" max="10000000" inputMode="numeric"
              value={shares} onChange={(event) => setShares(event.target.value)}
              className="mt-1 h-9 w-full rounded-lg border border-line bg-paper px-2 text-sm text-ink" />
          </label>
          <label className="text-xs text-muted">증거금률 (%)
            <input type="number" min="1" max="100" step="1" inputMode="numeric"
              value={percent} onChange={(event) => setPercent(event.target.value)}
              className="mt-1 h-9 w-full rounded-lg border border-line bg-paper px-2 text-sm text-ink" />
          </label>
        </div>
        <p className="mt-2 text-sm font-semibold tabular-nums">
          계산 예시 {money(amount)}
        </p>
        <p className="mt-1 text-xs leading-relaxed text-muted">{minimumShares !== null || depositPercent !== null
          ? verifiedSingle?.termsVerified
            ? "종목별 공개 상세에서 최소 청약조건을 확인하고 증거금 계산을 교차 검증했습니다. 주관사 최종 공고가 우선합니다."
            : "참고 공모주 상세표에 나온 조건입니다. 최종 적용 조건은 주관사 공식 공고에서 확인하세요."
          : "기본 입력값 10주·50%는 단순 계산 예시이며 확정 최소금액이 아닙니다."} 계좌 개설 시한·우대 청약한도·수수료는 증권사별 확인이 필요합니다.</p>
      </div>
      <p className="mt-3 text-xs leading-relaxed text-muted">
        주관사: {item.brokers.join(", ")} · {item.market || "시장 확인 필요"} · 자료: {item.sourceLabel}
      </p>
      {verifiedDetail?.sourceUrl ? (
        <p className="mt-1 text-xs text-muted">
          최소 청약·환불일 참고: <a href={verifiedDetail.sourceUrl} target="_blank"
          rel="noopener noreferrer" className="underline">{verifiedDetail.sourceLabel}</a>
          {verifiedDetail.note ? " · " + verifiedDetail.note : ""}
        </p>
      ) : (
        <p className="mt-1 text-xs text-muted">
          {verifiedPending ? "공모주 상세 자료 확인 중…" : "종목별 세부 청약조건을 자동 검증하지 못했습니다. 주관사 공고를 확인하세요."}
        </p>
      )}
      <div className="mt-2 flex flex-wrap gap-1.5">
        {item.brokers.map((name) => BROKER_SITES[name] ? (
          <a key={name} href={BROKER_SITES[name]} target="_blank" rel="noopener noreferrer"
            className="inline-flex h-8 items-center gap-1 rounded-full border border-line bg-card px-3 text-xs font-medium">
            {name} <ArrowUpRight className="size-3" />
          </a>
        ) : null)}
        <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer"
          className="inline-flex h-8 items-center gap-1 rounded-full bg-accent px-3 text-xs font-medium text-accent-ink">
          {item.sourceLabel.startsWith("38") ? "청약 상세표" : "공식 공모 목록"} <ArrowUpRight className="size-3" />
        </a>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="text-[11px] text-muted">{label}</p>
      <p className="mt-0.5 break-keep text-sm font-medium tabular-nums">{value}</p>
    </div>
  );
}
