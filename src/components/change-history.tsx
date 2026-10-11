import { ChevronDown } from "lucide-react";
import { useState } from "react";
import type { ChangeRecord } from "@/lib/change-history/types";

const ACTION_NAMES = { added: "신규", updated: "변경", removed: "목록 제외" } as const;

export function ChangeHistory({
  changes,
  sourceName,
  loadChanges,
  loadOlderChanges,
}: {
  changes: readonly ChangeRecord[];
  sourceName: (sourceId: string) => string;
  loadChanges?: () => Promise<ChangeRecord[]>;
  loadOlderChanges?: (before: string) => Promise<ChangeRecord[]>;
}) {
  const [expanded, setExpanded] = useState(false);
  const [visibleChanges, setVisibleChanges] = useState<readonly ChangeRecord[]>(changes);
  const [loaded, setLoaded] = useState(!loadChanges);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [loadingOlder, setLoadingOlder] = useState(false);
  const [olderError, setOlderError] = useState("");
  const [hasOlder, setHasOlder] = useState(Boolean(loadOlderChanges));
  // Without a lazy loader (for example on the pharma screen), props stay authoritative.
  const currentChanges = loadChanges ? visibleChanges : changes;

  async function toggle() {
    if (expanded) {
      setExpanded(false);
      return;
    }
    setExpanded(true);
    if (!loadChanges || loaded || loading) return;
    setLoading(true);
    setError("");
    try {
      const firstPage = await loadChanges();
      setVisibleChanges(firstPage);
      setHasOlder(Boolean(loadOlderChanges) && firstPage.length === 60);
      setLoaded(true);
    } catch {
      setError("변경목록을 불러오지 못했습니다. 닫았다가 다시 열어 주세요.");
    } finally {
      setLoading(false);
    }
  }

  async function loadOlder() {
    if (!loadOlderChanges || loadingOlder || !hasOlder || !visibleChanges.length) return;
    setLoadingOlder(true);
    setOlderError("");
    try {
      const older = await loadOlderChanges(visibleChanges[visibleChanges.length - 1].id);
      setVisibleChanges((current) => {
        const seen = new Set(current.map((item) => item.id));
        return [...current, ...older.filter((item) => !seen.has(item.id))];
      });
      setHasOlder(older.length === 60);
    } catch {
      setOlderError("이전 변경기록을 불러오지 못했습니다. 다시 시도해 주세요.");
    } finally {
      setLoadingOlder(false);
    }
  }

  return (
    <section className="mt-3 overflow-hidden rounded-2xl border border-line bg-card">
      <button
        type="button"
        onClick={() => void toggle()}
        aria-expanded={expanded}
        className="flex min-h-10 w-full items-center justify-between gap-3 px-3 text-left"
      >
        <span className="text-sm font-semibold">
          변경목록 <span className="font-normal text-muted">{loaded ? `최근 ${currentChanges.length}건` : "최근 기록"}</span>
        </span>
        <span className="flex items-center gap-1 text-xs text-muted">
          자동 기록
          <ChevronDown className={`size-4 transition-transform ${expanded ? "rotate-180" : ""}`} />
        </span>
      </button>
      {expanded ? (
        loading ? (
          <p role="status" className="border-t border-line px-3 py-4 text-sm text-muted">변경목록을 불러오는 중입니다.</p>
        ) : error ? (
          <p role="alert" className="border-t border-line px-3 py-4 text-sm text-accent">{error}</p>
        ) : currentChanges.length ? (
          <>
            <ul className="divide-y divide-line border-t border-line">
              {currentChanges.map((change) => (
                <li key={change.id} className="flex items-start gap-2 px-3 py-2">
                  <span className="mt-0.5 shrink-0 rounded-md bg-paper px-1.5 py-0.5 text-[11px] font-medium text-ink">
                    {ACTION_NAMES[change.action]}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-pretty text-sm leading-snug">{change.title}</p>
                    <p className="mt-0.5 text-[11px] leading-snug text-muted">
                      {sourceName(change.sourceId)}
                      {change.fields.length ? ` · ${change.fields.join("·")}` : ""}
                      {" · "}
                      {formatWhen(change.changedAt)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
            {olderError ? <p role="alert" className="border-t border-line px-3 py-2 text-xs text-accent">{olderError}</p> : null}
            {loadOlderChanges && hasOlder ? (
              <button type="button" disabled={loadingOlder}
                onClick={() => void loadOlder()}
                className="w-full border-t border-line px-3 py-3 text-center text-xs font-semibold text-muted disabled:opacity-60">
                {loadingOlder ? "이전 기록 불러오는 중…" : "이전 변경 기록 더보기"}
              </button>
            ) : null}
          </>
        ) : (
          <p className="border-t border-line px-3 py-4 text-sm text-muted">
            아직 기록된 변경사항이 없습니다. 다음 정상 수집부터 자동 저장됩니다.
          </p>
        )
      ) : null}
    </section>
  );
}

function formatWhen(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(date);
}
