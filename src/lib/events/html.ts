export function seoulToday(now = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

export function visibleMarkup(html: string): string {
  return html
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ");
}

export function decodeEntities(value: string): string {
  return value
    .replace(/&nbsp;/gi, " ")
    .replace(/&middot;/g, "·")
    .replace(/</g, "<")
    .replace(/>/g, ">")
    .replace(/"/g, '"')
    .replace(/&#39;|'/g, "'")
    .replace(/&#(\d+);/g, (_, code: string) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code: string) => String.fromCharCode(parseInt(code, 16)))
    .replace(/&/g, "&");
}

export function stripTags(value: string): string {
  return decodeEntities(
    value
      .replace(/<li[^>]*>/gi, "\n")
      .replace(/<\/p>/gi, "\n")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<[^>]+>/g, " "),
  )
    .replace(/\r/g, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/[ \t]{2,}/g, " ")
    .replace(/\n{2,}/g, "\n")
    .trim();
}

export function parseRange(value: string): { start: string; end: string } | null {
  // Card, bank and broker lists use dots, slashes, dashes and Korean date text.
  // Keep strict four-digit years and reject invalid calendar dates.
  const nums = [...value.matchAll(/(20\d{2})\s*(?:년|[.\/-])\s*(\d{1,2})\s*(?:월|[.\/-])\s*(\d{1,2})/g)]
    .map((match) => {
      const month = Number(match[2]), day = Number(match[3]);
      const year = Number(match[1]);
      const date = new Date(Date.UTC(year, month - 1, day));
      if (date.getUTCFullYear() !== year || date.getUTCMonth() + 1 !== month ||
          date.getUTCDate() !== day) return "";
      return `${match[1]}-${match[2].padStart(2, "0")}-${match[3].padStart(2, "0")}`;
    }).filter(Boolean);
  if (nums.length < 2) return null;
  return { start: nums[0], end: nums[1] };
}

export function ymd(compact: string): string {
  const match = compact.match(/^(\d{4})(\d{2})(\d{2})$/);
  if (!match) return compact;
  return `${match[1]}-${match[2]}-${match[3]}`;
}

export function isOngoing(endDate: string, today: string): boolean {
  return endDate >= today;
}

const NEGATIVE =
  /응모\s*없이|무응모|별도\s*응모\s*(없|불필요)|별도\s*신청\s*(없|불필요)|응모가\s*불필요|응모\s*불필요|신청\s*없이\s*적용/;
const POSITIVE = /응모하기|응모\s*필수|응모하고|응모\s*후|이벤트\s*응모|응모하시면|이벤트\s*신청|참여\s*신청|쿠폰\s*(?:다운로드|받기)|마이태그/;

export function isEntryCopy(text: string): boolean {
  const flat = text.replace(/\s+/g, " ");
  const positive = POSITIVE.test(flat);
  const negative = NEGATIVE.test(flat);
  if (!positive) return false;
  if (!negative) return true;
  return /응모하기|응모\s*필수|응모하고/.test(flat);
}

export function linesFrom(text: string): string[] {
  const seen = new Set<string>();
  const lines: string[] = [];
  for (const raw of text.split("\n")) {
    const line = raw.replace(/\s+/g, " ").trim();
    if (line.length < 10 || line.length > 180) continue;
    if (seen.has(line)) continue;
    seen.add(line);
    lines.push(line);
  }
  return lines;
}

export function splitRules(text: string): { conditions: string[]; exclusions: string[] } {
  const lines = linesFrom(text);
  const exclusions = lines
    .filter((line) => /제외|불가|않을 경우|않은 경우|중복|조기 종료/.test(line))
    .slice(0, 4);
  const conditions = lines
    .filter(
      (line) =>
        !exclusions.includes(line) &&
        /대상|회원|실적|이상|기간|결제|이용|카드|응모/.test(line),
    )
    .slice(0, 5);
  return { conditions, exclusions };
}

export async function fetchText(
  url: string,
  init: RequestInit = {},
  timeoutMs = 12000,
): Promise<string> {
  const response = await fetch(url, {
    ...init,
    signal: AbortSignal.timeout(timeoutMs),
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
      "Accept-Language": "ko-KR,ko;q=0.9",
      Accept: "text/html,application/json;q=0.9,*/*;q=0.8",
      ...(init.headers ?? {}),
    },
  });
  if (!response.ok) throw new Error(`${response.status} ${url}`);
  const buffer = await response.arrayBuffer();
  const utf8 = new TextDecoder("utf-8").decode(buffer);
  if (utf8.includes("\uFFFD") || /charset=euc-kr/i.test(utf8.slice(0, 400))) {
    try {
      return new TextDecoder("euc-kr").decode(buffer);
    } catch {
      return utf8;
    }
  }
  return utf8;
}

export async function mapPool<T, R>(
  items: T[],
  size: number,
  task: (item: T) => Promise<R>,
): Promise<R[]> {
  const out: R[] = new Array(items.length);
  let cursor = 0;
  async function worker() {
    while (cursor < items.length) {
      const index = cursor;
      cursor += 1;
      out[index] = await task(items[index]);
    }
  }
  await Promise.all(Array.from({ length: Math.min(size, items.length) }, () => worker()));
  return out;
}
