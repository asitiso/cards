import { ChevronDown } from "lucide-react";
import { useState } from "react";
import type { ChangeRecord } from "@/lib/change-history/types";

const ACTION_NAMES = { added: "신규", updated: "변경", removed: "목록 제외" } as const;

export function ChangeHistory({
  changes,
  sourceName,
  loadChanges,
}: {
  changes: readonly ChangeRecord[];
  sourceName: (sourceId: string) => string;
  loadChanges?: () => Promise<ChangeRecord[]>;
}) {
  const [expanded, setExpanded] = useState(false);
  const [visibleChanges, setVisibleChanges] = useState<readonly ChangeRecord[]>(changes);
  const [loaded, setLoaded] = useState(!loadChanges);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
      setVisibleChanges(await loadChanges());
      setLoaded(true);
    } catch {
      setError("변경목록을 불러오지 못했습니다. 닫았다가 다시 열어 주세요.");
    } finally {
      setLoading(false);
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
          변경목록 <span className="font-normal text-muted">{loaded ? `최근 ${visibleChanges.length}건` : "최근 기록"}</span>
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
        ) : visibleChanges.length ? (
          <ul className="divide-y divide-line border-t border-line">
            {visibleChanges.map((change) => (
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
