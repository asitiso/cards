import { isOngoing, parseRange, stripTags, visibleMarkup } from "../events/html.ts";
import type { PharmaCompany } from "./companies.ts";
import type { PharmaEvent, PharmaKind } from "./types.ts";

const SKIP = /로그인|로그아웃|회원가입|아이디찾기|비밀번호|장바구니|마이페이지|고객센터|이용약관|개인정보|회사소개/;
const FAIL = /비밀번호가\s*(틀|다릅|일치하지)|로그인에 실패|로그인 실패|아이디 또는 비밀번호|없는 회원|인증에 실패|회원이 아닙니다/;

export type LoginField = { name: string; value: string; type: string };
export type LoginForm = {
  action: string;
  fields: LoginField[];
  userField: string;
  passField: string;
};

export type CollectResult = {
  ok: boolean;
  message: string;
  events: PharmaEvent[];
};

export function classifyKind(text: string): PharmaKind | null {
  const flat = text.replace(/\s+/g, " ");
  if (/신제품|신상|신규\s*출시|새로\s*나온|출시/.test(flat)) return "new";
  if (/응모|추첨/.test(flat)) return "entry";
  if (/할인|특가|세일/.test(flat)) return "sale";
  return null;
}

export function findLoginForm(html: string, pageUrl: string): LoginForm | null {
  const forms = [...html.matchAll(/<form\b([^>]*)>([\s\S]*?)<\/form>/gi)];
  let best: LoginForm | null = null;
  let bestScore = -1;
  for (const match of forms) {
    const inputs = [...match[2].matchAll(/<input\b([^>]*)>/gi)].map((input) => readInput(input[1]));
    const pass = inputs.find((input) => input.type === "password" && input.name);
    if (!pass) continue;
    const user =
      inputs.find(
        (input) =>
          input.name &&
          input.type !== "password" &&
          input.type !== "hidden" &&
          input.type !== "submit" &&
          input.type !== "button" &&
          /user|id|login|mem|email|account|mb_/i.test(`${input.name}`),
      ) ??
      inputs.find(
        (input) =>
          input.name &&
          input.type !== "password" &&
          input.type !== "hidden" &&
          input.type !== "submit" &&
          input.type !== "button",
      );
    if (!user?.name) continue;
    const actionAttr = attr(match[1], "action");
    let action = pageUrl;
    try {
      action = new URL(actionAttr || pageUrl, pageUrl).href;
    } catch {
      action = pageUrl;
    }
    const form: LoginForm = {
      action,
      fields: inputs.filter((input) => input.name),
      userField: user.name,
      passField: pass.name,
    };
    const score = (/login|signin|member/i.test(action) ? 2 : 0) + (user ? 1 : 0);
    if (score > bestScore) {
      best = form;
      bestScore = score;
    }
  }
  return best;
}

export function extractOffers(html: string, pageUrl: string, companyId: string, today: string): PharmaEvent[] {
  const source = visibleMarkup(html);
  const found: PharmaEvent[] = [];
  const seen = new Set<string>();
  const blocks = source.matchAll(/<(a|h[1-4]|li|button|strong)\b([^>]*)>([\s\S]*?)<\/\1>/gi);
  for (const block of blocks) {
    const title = stripTags(block[3]).replace(/\s+/g, " ").trim();
    if (title.length < 4 || title.length > 80 || SKIP.test(title)) continue;
    const kind = classifyKind(title);
    if (!kind) continue;
    const href = block[1].toLowerCase() === "a" ? attr(block[2], "href") : "";
    let url = pageUrl;
    if (href && !href.startsWith("javascript:") && href !== "#") {
      try {
        url = new URL(href, pageUrl).href;
      } catch {
        url = pageUrl;
      }
    }
    if (!/^https?:/i.test(url)) continue;
    const around = stripTags(source.slice(block.index ?? 0, (block.index ?? 0) + block[0].length + 240));
    const range = parseRange(around);
    if (range && !isOngoing(range.end, today)) continue;
    const key = `${kind}:${title}`;
    if (seen.has(key)) continue;
    seen.add(key);
    found.push({
      id: eventId(companyId, title, url),
      companyId,
      title,
      summary: title,
      kind,
      conditions: [
        range
          ? `${range.start} ~ ${range.end}`
          : "기간이 페이지에 없습니다. 해당 몰에서 확인하세요.",
      ],
      startDate: range?.start ?? "",
      endDate: range?.end ?? "",
      url,
    });
    if (found.length >= 12) break;
  }
  return found;
}

export async function collectCompany(
  company: PharmaCompany,
  username: string,
  password: string,
  today: string,
): Promise<CollectResult> {
  const jar = new Map<string, string>();
  try {
    let page = await request(company.loginUrl, jar);
    let form = findLoginForm(page.html, page.url);
    if (!form) {
      const link = loginLink(page.html, page.url);
      if (link) {
        page = await request(link, jar);
        form = findLoginForm(page.html, page.url);
      }
    }
    if (!form) {
      const offers = extractOffers(page.html, page.url, company.id, today);
      if (offers.length > 0) {
        return { ok: true, message: `로그인 없이 보이는 ${offers.length}건입니다.`, events: offers };
      }
      return { ok: false, message: "로그인 칸을 찾지 못했습니다.", events: [] };
    }
    const body = new URLSearchParams();
    for (const field of form.fields) {
      if (field.name === form.userField) body.set(field.name, username);
      else if (field.name === form.passField) body.set(field.name, password);
      else if (field.type === "hidden" || field.type === "text") body.set(field.name, field.value);
    }
    if (!body.has(form.userField)) body.set(form.userField, username);
    body.set(form.passField, password);
    const logged = await request(form.action, jar, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded", Referer: page.url },
      body,
    });
    const text = stripTags(visibleMarkup(logged.html));
    if (FAIL.test(text)) return { ok: false, message: "로그인에 실패했습니다. 아이디를 확인해 주세요.", events: [] };
    const events = extractOffers(logged.html, logged.url, company.id, today);
    if (/type=["']?password/i.test(logged.html) && events.length === 0) {
      return { ok: false, message: "로그인 화면에서 벗어나지 못했습니다.", events: [] };
    }
    if (text.length < 40 && events.length === 0) {
      return { ok: false, message: "이 몰은 스크립트로만 열려 목록을 읽지 못했습니다.", events: [] };
    }
    return {
      ok: true,
      message:
        events.length > 0
          ? `응모·할인·신제품 ${events.length}건입니다.`
          : "로그인했지만 응모·할인·신제품을 찾지 못했습니다.",
      events,
    };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "읽지 못했습니다.",
      events: [],
    };
  }
}

function loginLink(html: string, pageUrl: string): string | null {
  for (const match of html.matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)) {
    const href = match[1];
    const label = stripTags(match[2]);
    if (!/로그인|login/i.test(`${label} ${href}`)) continue;
    try {
      const url = new URL(href, pageUrl);
      if (url.protocol === "http:" || url.protocol === "https:") return url.href;
    } catch {
      continue;
    }
  }
  return null;
}

function eventId(companyId: string, title: string, url: string): string {
  let hash = 0;
  const value = `${companyId}\n${title}\n${url}`;
  for (let i = 0; i < value.length; i += 1) hash = (Math.imul(hash, 31) + value.charCodeAt(i)) | 0;
  return `${companyId}:${(hash >>> 0).toString(36)}`;
}

function readInput(tag: string): LoginField {
  return {
    name: attr(tag, "name"),
    value: attr(tag, "value"),
    type: (attr(tag, "type") || "text").toLowerCase(),
  };
}

function attr(tag: string, name: string): string {
  const match = new RegExp(`${name}\\s*=\\s*("([^"]*)"|'([^']*)'|([^\\s>]+))`, "i").exec(tag);
  return (match?.[2] ?? match?.[3] ?? match?.[4] ?? "").trim();
}

async function request(
  url: string,
  jar: Map<string, string>,
  init: RequestInit = {},
): Promise<{ url: string; html: string }> {
  let current = url;
  let method = init.method ?? "GET";
  let body = init.body;
  const extra = init.headers;
  for (let hop = 0; hop < 5; hop += 1) {
    const response = await fetch(current, {
      method,
      body: method === "GET" ? undefined : body,
      redirect: "manual",
      signal: AbortSignal.timeout(8000),
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
        "Accept-Language": "ko-KR,ko;q=0.9",
        Accept: "text/html,application/xhtml+xml,*/*;q=0.8",
        Cookie: [...jar.entries()].map(([key, value]) => `${key}=${value}`).join("; "),
        ...(extra ?? {}),
      },
    });
    const listed =
      typeof response.headers.getSetCookie === "function" ? response.headers.getSetCookie() : [];
    const cookies = listed.length > 0 ? listed : [response.headers.get("set-cookie") ?? ""];
    for (const line of cookies) {
      const pair = line.split(";")[0] ?? "";
      const cut = pair.indexOf("=");
      if (cut > 0) jar.set(pair.slice(0, cut).trim(), pair.slice(cut + 1).trim());
    }
    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get("location");
      if (!location) break;
      current = new URL(location, current).href;
      method = "GET";
      body = undefined;
      continue;
    }
    const buffer = await response.arrayBuffer();
    const utf8 = new TextDecoder("utf-8").decode(buffer);
    const html =
      utf8.includes("\uFFFD") || /charset=euc-kr/i.test(utf8.slice(0, 400))
        ? new TextDecoder("euc-kr").decode(buffer)
        : utf8;
    if (!response.ok && response.status !== 200) {
      throw new Error(`${response.status} ${current}`);
    }
    return { url: current, html };
  }
  throw new Error("로그인이 너무 많이 이동했습니다.");
}
