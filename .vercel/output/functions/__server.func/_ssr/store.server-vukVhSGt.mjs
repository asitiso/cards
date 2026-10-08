import { a as mapPool, i as isOngoing, l as stripTags, n as getSql, o as parseRange, s as seoulToday, u as visibleMarkup } from "./html-C1SEj9i4.mjs";
import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";
//#region node_modules/.nitro/vite/services/ssr/assets/store.server-vukVhSGt.js
/** Bookmark list without the wholesale folder. 바로팜만 남겼다. */
var SEED_COMPANIES = [
	{
		id: "baropharm",
		name: "바로팜",
		short: "바로팜",
		loginUrl: "https://www.baropharm.com/"
	},
	{
		id: "theshop",
		name: "theSHOP·대웅",
		short: "대웅",
		loginUrl: "http://www.shop.co.kr/front/theshop/main/main"
	},
	{
		id: "hmp",
		name: "HMP몰·한미",
		short: "HMP",
		loginUrl: "http://www.hmpmall.co.kr/login.do"
	},
	{
		id: "ildong",
		name: "일동 SHOP",
		short: "일동",
		loginUrl: "https://www.ildongshop.com/w/login/login.do"
	},
	{
		id: "onnuri",
		name: "온누리약국",
		short: "온누리",
		loginUrl: "http://www.onnuridrugstore.co.kr/"
	},
	{
		id: "hubase",
		name: "Hubase",
		short: "Hubase",
		loginUrl: "https://www.hubase.kr/"
	},
	{
		id: "dapmall",
		name: "DAPmall·동아",
		short: "동아",
		loginUrl: "https://www.dapmall.com/auth/login?redirectUrl=/main/index"
	},
	{
		id: "dongwha",
		name: "동화eMall",
		short: "동화",
		loginUrl: "https://www.dw1897.co.kr/emall/home/main"
	},
	{
		id: "premion",
		name: "녹십자 프리미온",
		short: "녹십자",
		loginUrl: "https://premion.gccorp.com/login"
	},
	{
		id: "pharmstreet",
		name: "팜스트리트·보령",
		short: "보령",
		loginUrl: "https://www.pharm-street.com/"
	},
	{
		id: "kdshop",
		name: "광동제약",
		short: "광동",
		loginUrl: "https://kdshop.co.kr/main/index.do"
	},
	{
		id: "jwshop",
		name: "JW중외제약",
		short: "중외",
		loginUrl: "https://www.jwshop.co.kr/member/login2.do?type=2"
	},
	{
		id: "pharmsnet",
		name: "팜스넷",
		short: "팜스넷",
		loginUrl: "http://www.pharmsnet.com/jsp/main/a_main.jsp"
	},
	{
		id: "dspmall",
		name: "동성몰",
		short: "동성",
		loginUrl: "https://www.dspmall.kr/"
	},
	{
		id: "platpharm",
		name: "종근당플랫팜",
		short: "종근당",
		loginUrl: "https://www.platpharm.co.kr/"
	},
	{
		id: "sozo",
		name: "소조몰·신일",
		short: "신일",
		loginUrl: "https://www.sozomall.co.kr/"
	},
	{
		id: "ondama",
		name: "온다몰·대원",
		short: "대원",
		loginUrl: "https://www.ondamall.co.kr/user/login?target=/#none"
	},
	{
		id: "hdp",
		name: "현대약품",
		short: "현대약품",
		loginUrl: "https://hdpmall.co.kr/intro/member.php?returnUrl=%2F"
	},
	{
		id: "mianutra",
		name: "MIA점막면역학회",
		short: "MIA",
		loginUrl: "https://mianutra.com/"
	},
	{
		id: "nutri",
		name: "뉴트리파마",
		short: "뉴트리",
		loginUrl: "http://www.nutripharma.co.kr/"
	},
	{
		id: "danaumv",
		name: "다나음(비타민디)",
		short: "다나음D",
		loginUrl: "http://www.danaum.com/index.html"
	},
	{
		id: "duolac",
		name: "듀오락 전문가몰",
		short: "듀오락",
		loginUrl: "http://expert.duolac.co.kr/shop/main/index.php"
	},
	{
		id: "desimone",
		name: "드시모네 약국몰",
		short: "드시모네",
		loginUrl: "http://bio11.or.kr/main/index"
	},
	{
		id: "buwelly",
		name: "Buwelly",
		short: "Buwelly",
		loginUrl: "http://greensun365.shop.blogpay.co.kr/"
	},
	{
		id: "cellonix",
		name: "셀로몰",
		short: "셀로몰",
		loginUrl: "http://www.cellonixmall.com/login/login_form.page"
	},
	{
		id: "cellromax",
		name: "셀로맥스",
		short: "셀로맥스",
		loginUrl: "https://www.cellromax.co.kr/"
	},
	{
		id: "natures",
		name: "네이처스팜",
		short: "네이처스",
		loginUrl: "http://www.naturespharm.co.kr/"
	},
	{
		id: "pharmtalk",
		name: "팜톡",
		short: "팜톡",
		loginUrl: "http://pharmtalk.co.kr/"
	},
	{
		id: "braun",
		name: "브라운 다이렉트",
		short: "브라운",
		loginUrl: "http://braundirect.co.kr/"
	},
	{
		id: "pharmadia",
		name: "한화·파마디아",
		short: "파마디아",
		loginUrl: "http://pharmadia.com/member/password_change.php"
	},
	{
		id: "lsk",
		name: "엘스케이",
		short: "LSK",
		loginUrl: "https://www.pharmsacademy.com/mall/index.php"
	},
	{
		id: "pharmsmetic",
		name: "팜스메틱",
		short: "팜스메틱",
		loginUrl: "http://pharmsmetic.com/"
	},
	{
		id: "kheart",
		name: "k하트",
		short: "k하트",
		loginUrl: "http://kheart.co.kr/"
	},
	{
		id: "petn",
		name: "펫앤팜",
		short: "펫앤팜",
		loginUrl: "https://www.petnpharm.com/main/index.html"
	},
	{
		id: "danaum",
		name: "다나음 약사몰",
		short: "다나음",
		loginUrl: "https://danaum.com/index.html"
	},
	{
		id: "bereum",
		name: "테라바이오틱스",
		short: "테라",
		loginUrl: "https://bereum.shop/"
	},
	{
		id: "hangaram",
		name: "한가람약품",
		short: "한가람",
		loginUrl: "http://hangarampharm.com/Contents/Main/Main0.asp"
	},
	{
		id: "solvit",
		name: "솔빛피앤에프",
		short: "솔빛",
		loginUrl: "https://www.solvitpf.com/"
	},
	{
		id: "yeskin",
		name: "예스킨샵",
		short: "예스킨",
		loginUrl: "https://yeskinshop.co.kr/"
	},
	{
		id: "idahum",
		name: "아이다움",
		short: "아이다움",
		loginUrl: "https://www.idahummall.co.kr/shop/intro.php"
	},
	{
		id: "drs",
		name: "디알에스",
		short: "DRS",
		loginUrl: "https://drskorea.kr/login?back_url=Lw%3D%3D&used_login_btn=Y"
	},
	{
		id: "pharmev",
		name: "팜에비던스",
		short: "팜에비던스",
		loginUrl: "https://pharmev.kr/login?back_url=LzQx&used_login_btn=N"
	},
	{
		id: "onyak",
		name: "온약몰",
		short: "온약",
		loginUrl: "https://www.onyak.co.kr/login?back_url=Lw%3D%3D"
	},
	{
		id: "pstn",
		name: "피에스티엔",
		short: "PSTN",
		loginUrl: "https://www.pstnmall.com/Login"
	},
	{
		id: "medipharm",
		name: "메디팜",
		short: "메디팜",
		loginUrl: "https://tv.medipharm.co.kr/shop/index"
	},
	{
		id: "pyunhanga",
		name: "편한가",
		short: "편한가",
		loginUrl: "https://pyunhangamall.cafe24.com/index.html"
	},
	{
		id: "cellmed",
		name: "셀메드",
		short: "셀메드",
		loginUrl: "https://cellmedmall.co.kr/products/member"
	}
];
function chipLabel(name) {
	return (name.split(/[·\s]/)[0]?.trim() || name.trim()).slice(0, 8);
}
var SKIP = /로그인|로그아웃|회원가입|아이디찾기|비밀번호|장바구니|마이페이지|고객센터|이용약관|개인정보|회사소개/;
var FAIL = /비밀번호가\s*(틀|다릅|일치하지)|로그인에 실패|로그인 실패|아이디 또는 비밀번호|없는 회원|인증에 실패|회원이 아닙니다/;
function classifyKind(text) {
	const flat = text.replace(/\s+/g, " ");
	if (/신제품|신상|신규\s*출시|새로\s*나온|출시/.test(flat)) return "new";
	if (/응모|추첨/.test(flat)) return "entry";
	if (/할인|특가|세일/.test(flat)) return "sale";
	return null;
}
function findLoginForm(html, pageUrl) {
	const forms = [...html.matchAll(/<form\b([^>]*)>([\s\S]*?)<\/form>/gi)];
	let best = null;
	let bestScore = -1;
	for (const match of forms) {
		const inputs = [...match[2].matchAll(/<input\b([^>]*)>/gi)].map((input) => readInput(input[1]));
		const pass = inputs.find((input) => input.type === "password" && input.name);
		if (!pass) continue;
		const user = inputs.find((input) => input.name && input.type !== "password" && input.type !== "hidden" && input.type !== "submit" && input.type !== "button" && /user|id|login|mem|email|account|mb_/i.test(`${input.name}`)) ?? inputs.find((input) => input.name && input.type !== "password" && input.type !== "hidden" && input.type !== "submit" && input.type !== "button");
		if (!user?.name) continue;
		const actionAttr = attr(match[1], "action");
		let action = pageUrl;
		try {
			action = new URL(actionAttr || pageUrl, pageUrl).href;
		} catch {
			action = pageUrl;
		}
		const methodAttr = attr(match[1], "method").toLowerCase();
		const form = {
			action,
			fields: inputs.filter((input) => input.name && input.type !== "checkbox" && input.type !== "radio"),
			userField: user.name,
			passField: pass.name,
			method: methodAttr === "get" ? "get" : "post"
		};
		const score = (/login|signin|member/i.test(action) ? 2 : 0) + (user ? 1 : 0);
		if (score > bestScore) {
			best = form;
			bestScore = score;
		}
	}
	return best;
}
function extractOffers(html, pageUrl, companyId, today) {
	const source = visibleMarkup(html);
	const found = [];
	const seen = /* @__PURE__ */ new Set();
	const blocks = source.matchAll(/<(a|h[1-4]|li|button|strong)\b([^>]*)>([\s\S]*?)<\/\1>/gi);
	for (const block of blocks) {
		const title = stripTags(block[3]).replace(/\s+/g, " ").trim();
		if (title.length < 4 || title.length > 80 || SKIP.test(title)) continue;
		const kind = classifyKind(title);
		if (!kind) continue;
		const href = block[1].toLowerCase() === "a" ? attr(block[2], "href") : "";
		let url = pageUrl;
		if (href && !href.startsWith("javascript:") && href !== "#") try {
			url = new URL(href, pageUrl).href;
		} catch {
			url = pageUrl;
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
			conditions: [range ? `${range.start} ~ ${range.end}` : "기간이 페이지에 없습니다. 해당 몰에서 확인하세요."],
			startDate: range?.start ?? "",
			endDate: range?.end ?? "",
			url
		});
		if (found.length >= 12) break;
	}
	return found;
}
async function describeLogin(loginUrl) {
	if (knownLoginHost(loginUrl)) return null;
	const jar = /* @__PURE__ */ new Map();
	let page = await request(loginUrl, jar);
	let form = findLoginForm(page.html, page.url);
	if (!form) {
		const link = loginLink(page.html, page.url);
		if (link) {
			page = await request(link, jar);
			form = findLoginForm(page.html, page.url);
		}
	}
	if (!form) return null;
	return {
		action: form.action,
		method: form.method,
		charset: pageCharset(page.html),
		userField: form.userField,
		passField: form.passField,
		fields: form.fields.filter((field) => field.type === "hidden" || field.type === "text" || field.name === form.userField || field.name === form.passField).map((field) => ({
			name: field.name,
			value: field.name === form.passField ? "" : field.value
		}))
	};
}
async function collectCompany(company, username, password, today) {
	const jar = /* @__PURE__ */ new Map();
	try {
		const known = await loginKnown(company.loginUrl, username, password, jar);
		if (known) {
			if (!known.ok) return {
				ok: false,
				message: known.message,
				events: []
			};
			const events = extractOffers(known.html, known.url, company.id, today);
			return {
				ok: true,
				message: events.length > 0 ? `로그인했습니다. 응모·할인·신제품 ${events.length}건입니다.` : "로그인했지만 응모·할인·신제품을 찾지 못했습니다.",
				events
			};
		}
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
			if (offers.length > 0) return {
				ok: true,
				message: `로그인 없이 보이는 ${offers.length}건입니다.`,
				events: offers
			};
			return {
				ok: false,
				message: "로그인 칸을 찾지 못했습니다.",
				events: []
			};
		}
		const body = new URLSearchParams();
		for (const field of form.fields) if (field.name === form.userField) body.set(field.name, username);
		else if (field.name === form.passField) body.set(field.name, password);
		else if (field.type === "hidden" || field.type === "text") body.set(field.name, field.value);
		if (!body.has(form.userField)) body.set(form.userField, username);
		body.set(form.passField, password);
		const logged = await request(form.action, jar, {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
				Referer: page.url
			},
			body
		});
		const text = stripTags(visibleMarkup(logged.html));
		if (FAIL.test(text)) return {
			ok: false,
			message: "로그인에 실패했습니다. 아이디를 확인해 주세요.",
			events: []
		};
		const events = extractOffers(logged.html, logged.url, company.id, today);
		if (/type=["']?password/i.test(logged.html) && events.length === 0 && /login|signin/i.test(logged.url)) return {
			ok: false,
			message: "로그인 화면에서 벗어나지 못했습니다.",
			events: []
		};
		if (text.length < 40 && events.length === 0) return {
			ok: false,
			message: "이 몰은 스크립트로만 열려 목록을 읽지 못했습니다.",
			events: []
		};
		return {
			ok: true,
			message: events.length > 0 ? `응모·할인·신제품 ${events.length}건입니다.` : "로그인했지만 응모·할인·신제품을 찾지 못했습니다.",
			events
		};
	} catch (error) {
		return {
			ok: false,
			message: error instanceof Error ? error.message : "읽지 못했습니다.",
			events: []
		};
	}
}
function knownLoginHost(loginUrl) {
	try {
		return /(?:^|\.)(?:baropharm\.com|shop\.co\.kr|hmpmall\.co\.kr)$/i.test(new URL(loginUrl).hostname);
	} catch {
		return false;
	}
}
async function loginKnown(loginUrl, username, password, jar) {
	let host = "";
	try {
		host = new URL(loginUrl).hostname;
	} catch {
		return null;
	}
	if (/(?:^|\.)baropharm\.com$/i.test(host)) return loginBaropharm(username, password, jar);
	if (/(?:^|\.)shop\.co\.kr$/i.test(host)) return loginTheshop(username, password, jar);
	if (/(?:^|\.)hmpmall\.co\.kr$/i.test(host)) return loginHmp(username, password, jar);
	return null;
}
async function loginBaropharm(username, password, jar) {
	const sent = await exchange("https://api-v2.baropharm.com/auth/login", jar, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json",
			Origin: "https://www.baropharm.com",
			Referer: "https://www.baropharm.com/"
		},
		body: JSON.stringify({
			username,
			password
		})
	});
	if (sent.status === 401 || sent.status === 403) return {
		ok: false,
		message: jsonMessage(sent.html) || "아이디 또는 비밀번호를 확인해 주세요.",
		url: sent.url,
		html: ""
	};
	if (sent.status >= 400) return {
		ok: false,
		message: `바로팜 로그인에 실패했습니다. (${sent.status})`,
		url: sent.url,
		html: ""
	};
	const home = await exchange("https://app.baropharm.com/", jar);
	return {
		ok: true,
		message: "로그인했습니다.",
		url: home.url,
		html: home.html
	};
}
async function loginTheshop(username, password, jar) {
	await exchange("https://www.shop.co.kr/front/intro/login", jar);
	const sent = await exchange("https://www.shop.co.kr/front/api/auth/mimsLogin", jar, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json",
			Origin: "https://www.shop.co.kr",
			Referer: "https://www.shop.co.kr/front/intro/login"
		},
		body: JSON.stringify({
			identifier: username,
			password,
			clientIP: "127.0.0.1",
			redirectUrl: "https://www.shop.co.kr/front/theshop/main/main"
		})
	});
	let payload = {};
	try {
		payload = JSON.parse(sent.html);
	} catch {
		payload = {};
	}
	if (sent.status >= 400 || payload.code === "FAIL") return {
		ok: false,
		message: "아이디 또는 비밀번호를 확인해 주세요.",
		url: sent.url,
		html: ""
	};
	const home = await exchange(typeof payload.data === "string" && /^https?:/i.test(payload.data) ? payload.data : "https://www.shop.co.kr/front/theshop/main/main", jar);
	return {
		ok: true,
		message: "로그인했습니다.",
		url: home.url,
		html: home.html
	};
}
async function loginHmp(username, password, jar) {
	await exchange("https://www.hmpmall.co.kr/login.do", jar);
	const generated = await exchange("https://www.hmpmall.co.kr/dwr/call/plaincall/__System.generateId.dwr", jar, {
		method: "POST",
		headers: {
			"Content-Type": "text/plain",
			Referer: "https://www.hmpmall.co.kr/login.do"
		},
		body: dwrBody({
			script: "__System",
			method: "generateId",
			session: "",
			batchId: "0"
		})
	});
	const token = /handleCallback\("[^"]+","[^"]+","([^"]+)"\)/.exec(generated.html)?.[1] ?? "";
	if (!token) return {
		ok: false,
		message: "HMP 로그인 세션을 열지 못했습니다.",
		url: generated.url,
		html: ""
	};
	jar.set("DWRSESSIONID", token);
	const sent = await exchange("https://www.hmpmall.co.kr/dwr/call/plaincall/common/Login.execute.dwr", jar, {
		method: "POST",
		headers: {
			"Content-Type": "text/plain",
			Referer: "https://www.hmpmall.co.kr/login.do",
			Origin: "https://www.hmpmall.co.kr"
		},
		body: dwrBody({
			script: "common/Login",
			method: "execute",
			session: `${token}/1`,
			batchId: "1",
			params: {
				memId: username,
				memPw: password,
				loginPathDivCode: "2350001"
			}
		})
	});
	if (/CSRF Security Error/.test(sent.html)) return {
		ok: false,
		message: "HMP 로그인 확인에 실패했습니다.",
		url: sent.url,
		html: ""
	};
	const received = /isReceived\s*:\s*(true|false)/.exec(sent.html)?.[1] === "true";
	const message = dwrMessage(sent.html);
	if (!received) return {
		ok: false,
		message: message || "아이디 또는 비밀번호를 확인해 주세요.",
		url: sent.url,
		html: ""
	};
	const home = await exchange("https://www.hmpmall.co.kr/home.do", jar, { headers: { Referer: "https://www.hmpmall.co.kr/login.do" } });
	return {
		ok: true,
		message: "로그인했습니다.",
		url: home.url,
		html: home.html
	};
}
function dwrBody(input) {
	const lines = [
		"callCount=1",
		"windowName=",
		`c0-scriptName=${input.script}`,
		`c0-methodName=${input.method}`,
		"c0-id=0",
		`batchId=${input.batchId}`,
		"instanceId=0",
		"page=%2Flogin.do",
		`scriptSessionId=${input.session}`
	];
	const params = input.params ?? {};
	const names = Object.keys(params);
	if (names.length > 0) {
		const refs = names.map((name, index) => `${encodeURIComponent(name)}:reference:c0-e${index + 1}`);
		lines.push(`c0-param0=Object_Object:{${refs.join(", ")}}`);
		names.forEach((name, index) => {
			lines.push(`c0-e${index + 1}=string:${encodeURIComponent(params[name] ?? "")}`);
		});
	}
	return `${lines.join("\n")}\n`;
}
function dwrMessage(text) {
	const raw = /message\s*:\s*"((?:\\.|[^"\\])*)"/.exec(text)?.[1] ?? "";
	if (!raw) return "";
	try {
		return JSON.parse(`"${raw}"`).replace(/\s+/g, " ").trim();
	} catch {
		return raw;
	}
}
function jsonMessage(text) {
	try {
		const payload = JSON.parse(text);
		return typeof payload.message === "string" ? payload.message : "";
	} catch {
		return "";
	}
}
function pageCharset(html) {
	const value = (/charset\s*=\s*["']?\s*([a-z0-9_-]+)/i.exec(html.slice(0, 2e3))?.[1] ?? "utf-8").toLowerCase();
	return value.includes("euc") || value.includes("ks_c") ? "euc-kr" : "utf-8";
}
function loginLink(html, pageUrl) {
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
function eventId(companyId, title, url) {
	let hash = 0;
	const value = `${companyId}\n${title}\n${url}`;
	for (let i = 0; i < value.length; i += 1) hash = Math.imul(hash, 31) + value.charCodeAt(i) | 0;
	return `${companyId}:${(hash >>> 0).toString(36)}`;
}
function readInput(tag) {
	return {
		name: attr(tag, "name"),
		value: attr(tag, "value"),
		type: (attr(tag, "type") || "text").toLowerCase()
	};
}
function attr(tag, name) {
	const match = new RegExp(`${name}\\s*=\\s*("([^"]*)"|'([^']*)'|([^\\s>]+))`, "i").exec(tag);
	return (match?.[2] ?? match?.[3] ?? match?.[4] ?? "").trim();
}
async function request(url, jar, init = {}) {
	const page = await exchange(url, jar, init);
	if (page.status >= 400) throw new Error(`${page.status} ${page.url}`);
	return page;
}
async function exchange(url, jar, init = {}) {
	let current = url;
	let method = init.method ?? "GET";
	let body = init.body;
	const extra = init.headers;
	for (let hop = 0; hop < 5; hop += 1) {
		const response = await fetch(current, {
			method,
			body: method === "GET" ? void 0 : body,
			redirect: "manual",
			signal: AbortSignal.timeout(8e3),
			headers: {
				"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
				"Accept-Language": "ko-KR,ko;q=0.9",
				Accept: "text/html,application/xhtml+xml,application/json,*/*;q=0.8",
				Cookie: [...jar.entries()].map(([key, value]) => `${key}=${value}`).join("; "),
				...extra ?? {}
			}
		});
		const listed = typeof response.headers.getSetCookie === "function" ? response.headers.getSetCookie() : [];
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
			body = void 0;
			continue;
		}
		const buffer = await response.arrayBuffer();
		const utf8 = new TextDecoder("utf-8").decode(buffer);
		const html = utf8.includes("�") || /charset=euc-kr/i.test(utf8.slice(0, 400)) ? new TextDecoder("euc-kr").decode(buffer) : utf8;
		return {
			status: response.status,
			url: current,
			html
		};
	}
	throw new Error("로그인이 너무 많이 이동했습니다.");
}
function newPharmaKey() {
	return randomBytes(32).toString("base64");
}
function encryptText(plain, keyB64) {
	const key = keyBytes(keyB64);
	const iv = randomBytes(12);
	const cipher = createCipheriv("aes-256-gcm", key, iv);
	const enc = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
	const tag = cipher.getAuthTag();
	return [
		iv.toString("base64"),
		tag.toString("base64"),
		enc.toString("base64")
	].join(".");
}
function decryptText(payload, keyB64) {
	const [ivB, tagB, dataB] = payload.split(".");
	if (!ivB || !tagB || !dataB) throw new Error("저장된 비밀번호 형식이 아닙니다.");
	const decipher = createDecipheriv("aes-256-gcm", keyBytes(keyB64), Buffer.from(ivB, "base64"));
	decipher.setAuthTag(Buffer.from(tagB, "base64"));
	return Buffer.concat([decipher.update(Buffer.from(dataB, "base64")), decipher.final()]).toString("utf8");
}
function keyBytes(keyB64) {
	const key = Buffer.from(keyB64, "base64");
	if (key.length !== 32) throw new Error("비밀번호 키가 올바르지 않습니다.");
	return key;
}
var BATCH = 4;
function asList(value) {
	try {
		const parsed = JSON.parse(value);
		return Array.isArray(parsed) ? parsed.filter((item) => typeof item === "string") : [];
	} catch {
		return [];
	}
}
function toEvent(row) {
	const kind = row.kind === "sale" || row.kind === "new" ? row.kind : "entry";
	return {
		id: row.id,
		companyId: row.company_id,
		title: row.title,
		summary: row.summary,
		kind,
		conditions: asList(row.conditions),
		startDate: row.start_date ?? "",
		endDate: row.end_date ?? "",
		url: row.url
	};
}
async function secretKey() {
	const sql = await getSql();
	const rows = await sql`select key from pharma_secret where id = 1`;
	if (rows[0]?.key) return rows[0].key;
	const key = newPharmaKey();
	await sql`
    insert into pharma_secret (id, key) values (1, ${key})
    on conflict (id) do nothing
  `;
	return (await sql`select key from pharma_secret where id = 1`)[0]?.key ?? key;
}
async function listCompanies() {
	const sql = await getSql();
	if ((await sql`select id from pharma_seed where id = 1`).length === 0) {
		for (const [index, company] of SEED_COMPANIES.entries()) await sql`
        insert into pharma_companies (id, name, short, login_url, position)
        values (${company.id}, ${company.name}, ${company.short}, ${company.loginUrl}, ${index})
        on conflict (id) do nothing
      `;
		await sql`insert into pharma_seed (id) values (1) on conflict (id) do nothing`;
	}
	return (await sql`
    select id, name, short, login_url
    from pharma_companies
    order by position asc, name asc
  `).map((row) => ({
		id: row.id,
		name: row.name,
		short: row.short,
		loginUrl: row.login_url
	}));
}
function cleanCompany(name, loginUrl) {
	const trimmed = name.trim();
	if (!trimmed || trimmed.length > 40) throw new Error("회사 이름은 1~40자로 입력하세요.");
	let url;
	try {
		url = new URL(loginUrl.trim());
	} catch {
		throw new Error("홈페이지 주소가 올바르지 않습니다.");
	}
	if (url.protocol !== "http:" && url.protocol !== "https:") throw new Error("http 주소만 저장할 수 있습니다.");
	return {
		name: trimmed,
		short: chipLabel(trimmed),
		loginUrl: url.href
	};
}
async function getCompany(id) {
	return (await listCompanies()).find((company) => company.id === id);
}
async function readReport() {
	const state = await (await getSql())`select report from pharma_state where id = 1`;
	try {
		const parsed = JSON.parse(state[0]?.report ?? "[]");
		return Array.isArray(parsed) ? parsed : [];
	} catch {
		return [];
	}
}
async function loadPharmaBoard() {
	const sql = await getSql();
	const today = seoulToday();
	const catalog = await listCompanies();
	const rows = await sql`
    select id, company_id, title, summary, kind, conditions,
           start_date::text as start_date, end_date::text as end_date, url
    from pharma_events
    where active = true
    order by end_date asc nulls last, title asc
  `;
	const creds = await sql`
    select company_id, username from pharma_credentials
  `;
	const saved = new Map(creds.map((row) => [row.company_id, row.username]));
	const state = await sql`
    select collected_at::text as collected_at from pharma_state where id = 1
  `;
	const report = await readReport();
	const known = new Set(catalog.map((company) => company.id));
	const events = rows.map(toEvent).filter((event) => known.has(event.companyId)).filter((event) => !event.endDate || event.endDate >= today);
	const counts = /* @__PURE__ */ new Map();
	for (const event of events) counts.set(event.companyId, (counts.get(event.companyId) ?? 0) + 1);
	const companies = catalog.map((company) => {
		const hit = report.find((item) => item.id === company.id);
		const username = saved.get(company.id) ?? "";
		return {
			id: company.id,
			name: company.name,
			short: company.short,
			loginUrl: company.loginUrl,
			count: counts.get(company.id) ?? 0,
			ok: hit?.ok ?? false,
			saved: username.length > 0,
			username,
			message: hit?.message ?? (username ? "저장되어 있습니다. 다시 수집하면 읽습니다." : "아이디를 저장하면 응모·할인·신제품을 읽습니다.")
		};
	});
	return {
		collectedAt: state[0]?.collected_at ?? "",
		today,
		events,
		companies
	};
}
async function writeEvents(companyId, result) {
	if (!result.ok) return;
	const sql = await getSql();
	const collectedAt = (/* @__PURE__ */ new Date()).toISOString();
	await sql`update pharma_events set active = false where company_id = ${companyId}`;
	for (const event of result.events) await sql`
      insert into pharma_events (
        id, company_id, title, summary, kind, conditions, start_date, end_date, url, active, collected_at
      ) values (
        ${event.id}, ${event.companyId}, ${event.title}, ${event.summary}, ${event.kind},
        ${JSON.stringify(event.conditions)}, ${event.startDate || null}, ${event.endDate || null},
        ${event.url}, true, ${collectedAt}
      )
      on conflict (id) do update set
        title = excluded.title,
        summary = excluded.summary,
        kind = excluded.kind,
        conditions = excluded.conditions,
        start_date = excluded.start_date,
        end_date = excluded.end_date,
        url = excluded.url,
        active = true,
        collected_at = excluded.collected_at
    `;
}
async function saveReport(updates, cursor) {
	const sql = await getSql();
	const prior = await readReport();
	const merged = (await listCompanies()).map((company) => updates.find((item) => item.id === company.id) ?? prior.find((item) => item.id === company.id)).filter((item) => Boolean(item));
	const state = await sql`select cursor from pharma_state where id = 1`;
	const next = cursor ?? state[0]?.cursor ?? 0;
	await sql`
    insert into pharma_state (id, collected_at, cursor, report)
    values (1, ${(/* @__PURE__ */ new Date()).toISOString()}, ${next}, ${JSON.stringify(merged)})
    on conflict (id) do update set
      collected_at = excluded.collected_at,
      cursor = excluded.cursor,
      report = excluded.report
  `;
}
async function credentialsFor(ids) {
	const sql = await getSql();
	const key = await secretKey();
	const rows = await sql`
    select company_id, username, password_enc from pharma_credentials
  `;
	const out = /* @__PURE__ */ new Map();
	for (const row of rows) {
		if (!ids.includes(row.company_id)) continue;
		try {
			out.set(row.company_id, {
				username: row.username,
				password: decryptText(row.password_enc, key)
			});
		} catch {
			out.set(row.company_id, {
				username: row.username,
				password: ""
			});
		}
	}
	return out;
}
async function runCompanies(companies) {
	const creds = await credentialsFor(companies.map((company) => company.id));
	const today = seoulToday();
	return mapPool(companies, 2, async (company) => {
		const cred = creds.get(company.id);
		if (!cred?.password) return {
			id: company.id,
			ok: false,
			count: 0,
			message: cred ? "저장된 비밀번호를 읽지 못했습니다. 다시 저장해 주세요." : "아이디를 저장하면 읽습니다."
		};
		const result = await collectCompany(company, cred.username, cred.password, today);
		await writeEvents(company.id, result);
		return {
			id: company.id,
			ok: result.ok,
			count: result.events.length,
			message: result.message
		};
	});
}
async function refreshPharma(companyId) {
	const sql = await getSql();
	if (companyId) {
		const company = await getCompany(companyId);
		if (!company) throw new Error("없는 회사입니다.");
		await saveReport(await runCompanies([company]), null);
		return loadPharmaBoard();
	}
	const rows = await sql`
    select company_id from pharma_credentials order by company_id asc
  `;
	const catalog = await listCompanies();
	const byId = new Map(catalog.map((company) => [company.id, company]));
	const saved = rows.map((row) => byId.get(row.company_id)).filter((company) => Boolean(company));
	if (saved.length === 0) {
		await saveReport([], 0);
		return loadPharmaBoard();
	}
	const start = ((await sql`select cursor from pharma_state where id = 1`)[0]?.cursor ?? 0) % saved.length;
	const take = Math.min(BATCH, saved.length);
	await saveReport(await runCompanies(Array.from({ length: take }, (_, index) => saved[(start + index) % saved.length])), (start + take) % saved.length);
	return loadPharmaBoard();
}
async function savePharmaLogin(companyId, username, password) {
	const company = await getCompany(companyId);
	if (!company) throw new Error("없는 회사입니다.");
	const name = username.trim();
	if (!name || name.length > 120) throw new Error("아이디를 입력하세요.");
	if (password.length > 200) throw new Error("비밀번호가 너무 깁니다.");
	const sql = await getSql();
	const key = await secretKey();
	const existing = await sql`
    select password_enc from pharma_credentials where company_id = ${companyId}
  `;
	const secret = password ? encryptText(password, key) : existing[0]?.password_enc;
	if (!secret) throw new Error("비밀번호를 입력하세요.");
	await sql`
    insert into pharma_credentials (company_id, username, password_enc, updated_at)
    values (${companyId}, ${name}, ${secret}, now())
    on conflict (company_id) do update set
      username = excluded.username,
      password_enc = excluded.password_enc,
      updated_at = now()
  `;
	const loginPromise = describeLogin(company.loginUrl).catch(() => null);
	await saveReport(await runCompanies([company]), null);
	return {
		board: await loadPharmaBoard(),
		login: await loginPromise
	};
}
async function clearPharmaLogin(companyId) {
	if (!await getCompany(companyId)) throw new Error("없는 회사입니다.");
	const sql = await getSql();
	await sql`delete from pharma_credentials where company_id = ${companyId}`;
	await sql`update pharma_events set active = false where company_id = ${companyId}`;
	await saveReport([{
		id: companyId,
		ok: false,
		count: 0,
		message: "로그인 정보를 지웠습니다."
	}], null);
	return loadPharmaBoard();
}
async function addPharmaCompany(name, loginUrl) {
	const cleaned = cleanCompany(name, loginUrl);
	const sql = await getSql();
	await listCompanies();
	const id = `c-${Date.now().toString(36)}`;
	const position = ((await sql`select max(position) as max from pharma_companies`)[0]?.max ?? 0) + 1;
	await sql`
    insert into pharma_companies (id, name, short, login_url, position)
    values (${id}, ${cleaned.name}, ${cleaned.short}, ${cleaned.loginUrl}, ${position})
  `;
	return {
		board: await loadPharmaBoard(),
		id
	};
}
async function updatePharmaCompany(companyId, name, loginUrl) {
	if (!await getCompany(companyId)) throw new Error("없는 회사입니다.");
	const cleaned = cleanCompany(name, loginUrl);
	await (await getSql())`
    update pharma_companies
    set name = ${cleaned.name}, short = ${cleaned.short}, login_url = ${cleaned.loginUrl}
    where id = ${companyId}
  `;
	return loadPharmaBoard();
}
async function deletePharmaCompany(companyId) {
	if (!await getCompany(companyId)) throw new Error("없는 회사입니다.");
	const sql = await getSql();
	await sql`delete from pharma_credentials where company_id = ${companyId}`;
	await sql`delete from pharma_events where company_id = ${companyId}`;
	await sql`delete from pharma_companies where id = ${companyId}`;
	return loadPharmaBoard();
}
//#endregion
export { refreshPharma as a, loadPharmaBoard as i, clearPharmaLogin as n, savePharmaLogin as o, deletePharmaCompany as r, updatePharmaCompany as s, addPharmaCompany as t };
