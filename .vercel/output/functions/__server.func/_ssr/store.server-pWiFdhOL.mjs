import { a as mapPool, c as splitRules, d as ymd, i as isOngoing, l as stripTags, n as getSql, o as parseRange, r as isEntryCopy, s as seoulToday, t as fetchText, u as visibleMarkup } from "./html-C1SEj9i4.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/store.server-pWiFdhOL.js
var MARKETS = [
	{
		id: "card",
		label: "카드"
	},
	{
		id: "securities",
		label: "증권"
	},
	{
		id: "bank",
		label: "은행"
	}
];
var ISSUERS = [
	{
		id: "shinhan",
		name: "신한카드",
		short: "신한",
		listUrl: "https://www.shinhancard.com/mob/MOBFM829N/MOBFM829R01.shc",
		market: "card",
		androidPackage: "com.shcard.smartpay",
		iosAppId: "572462317"
	},
	{
		id: "samsung",
		name: "삼성카드",
		short: "삼성",
		listUrl: "https://www.samsungcard.com/personal/event/ing/UHPPBE1401M0.jsp",
		market: "card",
		androidPackage: "net.ib.android.smcard",
		iosAppId: "379577046"
	},
	{
		id: "hyundai",
		name: "현대카드",
		short: "현대",
		listUrl: "https://www.hyundaicard.com/cpb/ev/CPBEV0101_01.hc",
		market: "card",
		androidPackage: "com.hyundaicard.appcard",
		iosAppId: "702653088"
	},
	{
		id: "kb",
		name: "KB국민카드",
		short: "KB",
		listUrl: "https://card.kbcard.com/BON/DVIEW/HBBMCXCRVNEC0001",
		market: "card",
		androidPackage: "com.kbcard.cxh.appcard",
		iosAppId: "695436326"
	},
	{
		id: "lotte",
		name: "롯데카드",
		short: "롯데",
		listUrl: "https://m.lottecard.co.kr/app/LPBNFDA_V100.lc",
		market: "card",
		androidPackage: "com.lcacApp",
		iosAppId: "688047200"
	},
	{
		id: "woori",
		name: "우리카드",
		short: "우리",
		listUrl: "https://m.wooricard.com/dcmw/yh1/bnf/bnf02/prgevnt/M1BNF202S00.do",
		market: "card",
		androidPackage: "com.wooricard.smartapp",
		iosAppId: "1499598869"
	},
	{
		id: "hana",
		name: "하나카드",
		short: "하나",
		listUrl: "https://m.hanacard.co.kr/MKEVT1000M.web",
		market: "card",
		androidPackage: "com.hanaskcard.paycla",
		iosAppId: "847268987"
	},
	{
		id: "nh",
		name: "NH농협카드",
		short: "NH",
		listUrl: "https://card.nonghyup.com/IPCC010001.menu",
		market: "card",
		androidPackage: "nh.smart.nhallonepay",
		iosAppId: "1177889176"
	},
	{
		id: "bc",
		name: "BC카드",
		short: "BC",
		listUrl: "https://web.paybooc.co.kr/web/evnt/main",
		market: "card",
		androidPackage: "kvp.jjy.MispAndroid320",
		iosAppId: "369125087"
	},
	{
		id: "ibk",
		name: "IBK기업은행",
		short: "IBK",
		listUrl: "https://www.ibk.co.kr/event/ingListEvent.ibk?pageId=CM01060100&evnt_dscd=H",
		market: "card",
		androidPackage: "com.ibk.android.ionebank",
		iosAppId: "1460543865"
	},
	{
		id: "mirae",
		name: "미래에셋증권",
		short: "미래",
		listUrl: "https://securities.miraeasset.com/hki/hki7000/r05.do",
		market: "securities",
		androidPackage: "com.miraeasset.trade",
		iosAppId: "1248716281"
	},
	{
		id: "samsungsec",
		name: "삼성증권",
		short: "삼성",
		listUrl: "https://m.samsungpop.com/mbw/customer/noticeEvent.do?cmd=eventList",
		market: "securities",
		androidPackage: "com.samsungpop.android.mpop",
		iosAppId: "1150231646"
	},
	{
		id: "koreainvest",
		name: "한국투자증권",
		short: "한투",
		listUrl: "https://m.truefriend.com/",
		market: "securities",
		androidPackage: "com.truefriend.neosmartarenewal",
		iosAppId: "1621986905"
	},
	{
		id: "kbsec",
		name: "KB증권",
		short: "KB",
		listUrl: "https://www.kbsec.com/go.able",
		market: "securities",
		androidPackage: "com.kbsec.mts.iplustarngm2",
		iosAppId: "350742701"
	},
	{
		id: "nhsec",
		name: "NH투자증권",
		short: "NH",
		listUrl: "https://www.mynamuh.com/",
		market: "securities",
		androidPackage: "com.wooriwm.txsmart",
		iosAppId: "486312400"
	},
	{
		id: "kiwoom",
		name: "키움증권",
		short: "키움",
		listUrl: "https://www.kiwoom.com/m/customer/event/VIngEventView",
		market: "securities",
		androidPackage: "com.kiwoom.heromts",
		iosAppId: "1570370057"
	},
	{
		id: "shinhansec",
		name: "신한투자증권",
		short: "신한",
		listUrl: "https://www.shinhansec.com/siw/customer/event/eventList/view.do",
		market: "securities",
		androidPackage: "com.shinhaninvest.nsmts",
		iosAppId: "1168512940"
	},
	{
		id: "hanasec",
		name: "하나증권",
		short: "하나",
		listUrl: "https://www.hanaw.com/corebbs5/eventIng/list/list.cmd",
		market: "securities",
		androidPackage: "com.hanasec.stock",
		iosAppId: "1506702407"
	},
	{
		id: "daishin",
		name: "대신증권",
		short: "대신",
		listUrl: "https://m.daishin.com/",
		market: "securities",
		androidPackage: "com.daishin",
		iosAppId: "414850336"
	},
	{
		id: "meritz",
		name: "메리츠증권",
		short: "메리츠",
		listUrl: "https://home.imeritz.com/cust/ntcevnt/PrgsEvnt.do",
		market: "securities",
		androidPackage: "com.imeritz.smartmeritz",
		iosAppId: "1104272974"
	},
	{
		id: "tosssec",
		name: "토스증권",
		short: "토스",
		listUrl: "https://www.tossinvest.com/",
		market: "securities",
		androidPackage: "viva.republica.toss",
		iosAppId: "839333328"
	},
	{
		id: "kakaopaysec",
		name: "카카오페이증권",
		short: "카카페",
		listUrl: "https://www.kakaopay.com/",
		market: "securities",
		androidPackage: "com.kakaopay.app",
		iosAppId: "1464496236"
	},
	{
		id: "kbbank",
		name: "KB국민은행",
		short: "KB",
		listUrl: "https://obank.kbstar.com/",
		market: "bank",
		androidPackage: "com.kbstar.kbbank",
		iosAppId: "373742138"
	},
	{
		id: "shinhanbank",
		name: "신한은행",
		short: "신한",
		listUrl: "https://bank.shinhan.com/",
		market: "bank",
		androidPackage: "com.shinhan.sbanking",
		iosAppId: "357484932"
	},
	{
		id: "wooribank",
		name: "우리은행",
		short: "우리",
		listUrl: "https://spot.wooribank.com/pot/Dream?withyou=EVEVT0001",
		market: "bank",
		androidPackage: "com.wooribank.smart.npib",
		iosAppId: "1470181651"
	},
	{
		id: "hanabank",
		name: "하나은행",
		short: "하나",
		listUrl: "https://m.kebhana.com/",
		market: "bank",
		androidPackage: "com.hanabank.oqf",
		iosAppId: "6743190232"
	},
	{
		id: "nhbank",
		name: "NH농협은행",
		short: "NH",
		listUrl: "https://banking.nonghyup.com/",
		market: "bank",
		androidPackage: "com.nonghyup.nhallonebank",
		iosAppId: "1641628055"
	},
	{
		id: "ibkbank",
		name: "IBK기업은행",
		short: "IBK",
		listUrl: "https://www.ibk.co.kr/event/ingListEvent.ibk?pageId=CM01060100",
		market: "bank",
		androidPackage: "com.ibk.android.ionebank",
		iosAppId: "1460543865"
	},
	{
		id: "kakaobank",
		name: "카카오뱅크",
		short: "카카오",
		listUrl: "https://www.kakaobank.com/",
		market: "bank",
		androidPackage: "com.kakaobank.channel",
		iosAppId: "1258016944"
	},
	{
		id: "tossbank",
		name: "토스뱅크",
		short: "토스",
		listUrl: "https://www.tossbank.com/",
		market: "bank",
		androidPackage: "viva.republica.toss",
		iosAppId: "839333328"
	},
	{
		id: "kbank",
		name: "케이뱅크",
		short: "케이",
		listUrl: "https://www.kbanknow.com/",
		market: "bank",
		androidPackage: "com.kbankwith.smartbank",
		iosAppId: "1178872627"
	}
];
function issuerMeta(id) {
	const found = ISSUERS.find((item) => item.id === id);
	if (!found) throw new Error(`unknown issuer ${id}`);
	return found;
}
var ENTRY = /응모|쿠폰|추첨|이벤트\s*신청|신청\s*필수|신청하기|참여\s*신청/;
function eventOf(issuer, externalId, title, summary, startDate, endDate, applyUrl, entry = true) {
	const line = summary || (entry ? "회사 화면에서 응모·쿠폰·추첨 조건을 확인하세요." : "회사 화면에서 조건을 확인하세요.");
	return {
		id: `${issuer}:${externalId}`,
		issuer,
		title,
		summary: line,
		benefit: entry ? "응모·쿠폰·추첨" : "자동 적용·안내",
		conditions: [line],
		exclusions: [],
		startDate,
		endDate,
		applyUrl,
		listUrl: issuerMeta(issuer).listUrl,
		entry
	};
}
function dateRange(value) {
	const nums = [];
	for (const match of value.matchAll(/(\d{4})\s*(?:년|[.\-/])\s*(\d{1,2})\s*(?:월|[.\-/])\s*(\d{1,2})/g)) {
		const month = Number(match[2]);
		const day = Number(match[3]);
		if (month < 1 || month > 12 || day < 1 || day > 31) continue;
		nums.push(`${match[1]}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`);
	}
	if (nums.length < 2) return null;
	return {
		start: nums[0],
		end: nums[1]
	};
}
function periodRange(text) {
	const spot = text.match(/(?:이벤트\s*)?기간\s*[:：]?\s*([\s\S]{0,90})/);
	if (!spot) return null;
	return dateRange(spot[1]);
}
function pageText(html) {
	return stripTags(visibleMarkup(html)).replace(/응모한 이벤트/g, "");
}
function isEntry(text) {
	return ENTRY.test(text.replace(/\s+/g, " "));
}
function tidy(value) {
	return stripTags(value).replace(/&bull;|&middot;/gi, "·").replace(/\s+/g, " ").trim();
}
function clue(text, title, blurb = "") {
	const nice = tidy(blurb);
	if (nice.length >= 12 && nice.length <= 140 && nice !== title && !/바로가기|메뉴/.test(nice)) return nice;
	return text.split("\n").map((item) => item.replace(/&bull;/gi, "·").replace(/\s+/g, " ").trim()).find((item) => item.length >= 16 && item.length <= 120 && ENTRY.test(item) && !/바로가기|메뉴|닫기|로그인|copyright/i.test(item)) ?? title;
}
async function keepIfEntry(issuer, externalId, title, blurb, start, end, applyUrl) {
	const preview = `${title} ${blurb}`;
	if (isEntry(preview)) return eventOf(issuer, externalId, title, clue(preview, title, blurb), start, end, applyUrl, true);
	try {
		const text = pageText(await fetchText(applyUrl, { headers: { Referer: issuerMeta(issuer).listUrl } }, 8e3));
		const entry = isEntry(text);
		return eventOf(issuer, externalId, title, entry ? clue(text, title, blurb) : tidy(blurb) || title, start, end, applyUrl, entry);
	} catch {
		return eventOf(issuer, externalId, title, tidy(blurb) || title, start, end, applyUrl, false);
	}
}
async function collectMirae(today) {
	const issuer = "mirae";
	const listUrl = issuerMeta(issuer).listUrl;
	try {
		const pages = await Promise.all([1, 2].map((page) => fetchText(`${listUrl}?currentPage=${page}`, {}, 8e3).catch(() => "")));
		const seen = /* @__PURE__ */ new Set();
		const rows = [];
		for (const html of pages) for (const match of html.matchAll(/doView\('(\d+)'[\s\S]{0,900}?class="evTit">([^<]+)<\/dd>[\s\S]{0,240}?class="evDate">([^<]+)<\/dd>/g)) {
			const id = match[1];
			if (seen.has(id)) continue;
			const title = stripTags(match[2]).replace(/\s+/g, " ").trim();
			const range = dateRange(match[3]);
			if (!range || title.length < 4 || !isOngoing(range.end, today) || range.start > today) continue;
			seen.add(id);
			rows.push({
				id,
				title,
				start: range.start,
				end: range.end
			});
		}
		const events = (await mapPool(rows, 4, (row) => keepIfEntry(issuer, row.id, row.title, row.title, row.start, row.end, `https://securities.miraeasset.com/hki/hki7000/v05.do?cs_ecis_id=${row.id}`))).filter((event) => event !== null);
		return {
			issuer,
			ok: true,
			message: events.length ? `진행 목록에서 응모·쿠폰·추첨 ${events.length}건을 읽었습니다.` : `진행 목록 ${rows.length}건을 읽었지만 응모·쿠폰·추첨은 없습니다.`,
			events
		};
	} catch (error) {
		return {
			issuer,
			ok: false,
			message: `미래에셋증권 목록을 열지 못했습니다. ${error instanceof Error ? error.message : ""}`.trim(),
			events: []
		};
	}
}
async function collectSamsungSec(today) {
	const issuer = "samsungsec";
	const listUrl = issuerMeta(issuer).listUrl;
	try {
		const raw = await fetchText("https://www.samsungpop.com/mbw/customer/noticeEvent.do", {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
				"X-Requested-With": "XMLHttpRequest",
				Referer: listUrl
			},
			body: "cmd=getEventList&currentPage=1&rowsPerPage=30&listRow=30&ntcSect=3&EtcConts4=Y&todayEnd=0"
		}, 8e3);
		const rows = (JSON.parse(raw).list ?? []).map((item) => {
			const range = dateRange(item.period ?? "");
			const title = (item.ntcTitle1 ?? "").replace(/\s+/g, " ").trim();
			if (!item.menuSeqNo || !range || title.length < 4) return null;
			if (!isOngoing(range.end, today) || range.start > today) return null;
			return {
				id: item.menuSeqNo,
				title,
				blurb: item.EtcConts5 ?? "",
				start: range.start,
				end: range.end
			};
		}).filter((row) => row !== null);
		const events = (await mapPool(rows, 4, (row) => keepIfEntry(issuer, row.id, row.title, row.blurb, row.start, row.end, `https://www.samsungpop.com/mbw/customer/noticeEvent.do?cmd=eventView&MenuSeqNo=${row.id}`))).filter((event) => event !== null);
		return {
			issuer,
			ok: true,
			message: events.length ? `진행 ${rows.length}건 중 응모·쿠폰·추첨 ${events.length}건입니다.` : `진행 ${rows.length}건을 읽었지만 응모·쿠폰·추첨은 없습니다.`,
			events
		};
	} catch (error) {
		return {
			issuer,
			ok: false,
			message: `삼성증권 목록을 열지 못했습니다. ${error instanceof Error ? error.message : ""}`.trim(),
			events: []
		};
	}
}
async function collectHanaSec(today) {
	const issuer = "hanasec";
	const listUrl = issuerMeta(issuer).listUrl;
	try {
		const rows = [...(await fetchText(listUrl, {}, 8e3)).matchAll(/bbsSeq=(\d+)[\s\S]{0,360}?class="title">([^<]+)<\/span>[\s\S]{0,240}?class="date">\s*([^<]+)/g)].map((match) => {
			const title = stripTags(match[2]).replace(/\s+/g, " ").trim();
			const range = dateRange(match[3]);
			if (!range || title.length < 4 || !isOngoing(range.end, today) || range.start > today) return null;
			return {
				id: match[1],
				title,
				start: range.start,
				end: range.end
			};
		}).filter((row) => row !== null);
		const unique = [...new Map(rows.map((row) => [row.id, row])).values()];
		const events = (await mapPool(unique, 4, (row) => keepIfEntry(issuer, row.id, row.title, row.title, row.start, row.end, `https://www.hanaw.com/corebbs5/eventIng/view/view.cmd?bbsSeq=${row.id}`))).filter((event) => event !== null);
		return {
			issuer,
			ok: true,
			message: events.length ? `진행 ${unique.length}건 중 응모·쿠폰·추첨 ${events.length}건입니다.` : `진행 ${unique.length}건을 읽었지만 응모·쿠폰·추첨은 없습니다.`,
			events
		};
	} catch (error) {
		return {
			issuer,
			ok: false,
			message: `하나증권 목록을 열지 못했습니다. ${error instanceof Error ? error.message : ""}`.trim(),
			events: []
		};
	}
}
async function collectKbSec(today) {
	const issuer = "kbsec";
	try {
		const raw = await fetchText("https://www.kbsec.com/main/jsp/main_board.jsp?bdgubun=2", {}, 8e3);
		const rows = (JSON.parse(raw).list ?? []).map((item) => {
			const title = (item.title ?? "").replace(/\s+/g, " ").trim();
			const start = dateRange(`${item.date ?? ""} ~ ${item.date ?? ""}`)?.start;
			if (!item.url || !start || title.length < 4 || start > today) return null;
			return {
				id: item.url,
				title,
				start,
				applyUrl: new URL(item.url, "https://www.kbsec.com").href
			};
		}).filter((row) => row !== null).slice(0, 12);
		const events = (await mapPool(rows, 4, async (row) => {
			try {
				const text = pageText(await fetchText(row.applyUrl, {}, 8e3));
				const range = periodRange(text);
				if (!range || !isOngoing(range.end, today) || range.start > today) return null;
				return eventOf(issuer, row.id, row.title, clue(text, row.title), range.start, range.end, row.applyUrl, isEntry(text));
			} catch {
				return null;
			}
		})).filter((event) => event !== null);
		return {
			issuer,
			ok: true,
			message: events.length ? `최근 글에서 기간이 확인된 응모·쿠폰·추첨 ${events.length}건입니다.` : "목록은 열렸지만 기간이 적힌 응모·쿠폰·추첨은 없습니다. 안내가 이미지인 글은 뺐습니다.",
			events
		};
	} catch (error) {
		return {
			issuer,
			ok: false,
			message: `KB증권 목록을 열지 못했습니다. ${error instanceof Error ? error.message : ""}`.trim(),
			events: []
		};
	}
}
async function collectIbkBank(today) {
	const issuer = "ibkbank";
	const listUrl = issuerMeta(issuer).listUrl;
	try {
		const rows = [...(await fetchText(listUrl, {}, 8e3)).matchAll(/evnt_srno=(\d+)&evnt_dscd=([A-Z])[\s\S]{0,500}?alt="([^"]*)"[\s\S]{0,1600}?기간<\/span>([\s\S]*?)<\/li>/g)].map((match) => {
			const title = stripTags(match[3]).replace(/\s+/g, " ").trim();
			const range = dateRange(stripTags(match[4]));
			if (!range || title.length < 4 || /카드/.test(title)) return null;
			if (!isOngoing(range.end, today) || range.start > today) return null;
			return {
				id: `${match[2]}-${match[1]}`,
				srno: match[1],
				code: match[2],
				title,
				start: range.start,
				end: range.end
			};
		}).filter((row) => row !== null);
		const unique = [...new Map(rows.map((row) => [row.id, row])).values()];
		const events = (await mapPool(unique.slice(0, 12), 4, (row) => keepIfEntry(issuer, row.id, row.title, row.title, row.start, row.end, `https://www.ibk.co.kr/event/ingDetailEvent.ibk?evnt_srno=${row.srno}&evnt_dscd=${row.code}&pageId=CM01060100`))).filter((event) => event !== null);
		return {
			issuer,
			ok: true,
			message: events.length ? `카드가 아닌 행사 ${unique.length}건 중 응모·쿠폰·추첨 ${events.length}건입니다.` : `카드가 아닌 행사 ${unique.length}건을 읽었지만 응모·쿠폰·추첨은 없습니다.`,
			events
		};
	} catch (error) {
		return {
			issuer,
			ok: false,
			message: `IBK 행사 목록을 열지 못했습니다. ${error instanceof Error ? error.message : ""}`.trim(),
			events: []
		};
	}
}
async function collectWooriBank(today) {
	const issuer = "wooribank";
	const listUrl = issuerMeta(issuer).listUrl;
	try {
		const blocks = [...(await fetchText(listUrl, {}, 8e3)).matchAll(/<dl class="list-set[\s\S]*?<\/dl>/g)];
		const rows = [];
		for (const block of blocks) {
			const chunk = block[0];
			const id = chunk.match(/goDetail\('(\d+)'/)?.[1];
			const title = stripTags(chunk.match(/<dt><a[^>]*>([\s\S]*?)<\/a>/)?.[1] ?? "");
			const summary = stripTags(chunk.match(/<dd>([\s\S]*?)<\/dd>/)?.[1] ?? "");
			const range = dateRange(chunk.match(/이벤트기간\s*:\s*([^<]+)/)?.[1] ?? "");
			if (!id || title.length < 4 || !range || !isOngoing(range.end, today)) continue;
			rows.push({
				id,
				title,
				summary,
				start: range.start,
				end: range.end
			});
		}
		const events = (await mapPool(rows, 2, async (row) => {
			const applyUrl = listUrl;
			if (isEntry(`${row.title} ${row.summary}`)) return eventOf(issuer, row.id, row.title, row.summary || row.title, row.start, row.end, applyUrl, true);
			try {
				const text = pageText(await fetchText("https://spot.wooribank.com/pot/Dream?withyou=EVEVT0001&cc=c001308:c001386", {
					method: "POST",
					headers: {
						"Content-Type": "application/x-www-form-urlencoded",
						Referer: listUrl
					},
					body: `NO=${row.id}`
				}, 8e3));
				const entry = isEntry(`${row.title} ${row.summary} ${text}`);
				return eventOf(issuer, row.id, row.title, entry ? clue(text, row.summary || row.title) : row.summary || row.title, row.start, row.end, applyUrl, entry);
			} catch {
				return eventOf(issuer, row.id, row.title, row.summary || row.title, row.start, row.end, applyUrl, false);
			}
		})).filter((event) => event !== null);
		return {
			issuer,
			ok: true,
			message: events.length ? `진행 ${blocks.length}건 중 응모·쿠폰·추첨 ${events.length}건입니다.` : `진행 ${blocks.length}건을 읽었지만 본문에 응모·쿠폰·추첨이 없습니다.`,
			events
		};
	} catch (error) {
		return {
			issuer,
			ok: false,
			message: `우리은행 이벤트 목록을 열지 못했습니다. ${error instanceof Error ? error.message : ""}`.trim(),
			events: []
		};
	}
}
function genericEvents(issuer, html, today) {
	const listUrl = issuerMeta(issuer).listUrl;
	const visible = visibleMarkup(html);
	const events = [];
	const seen = /* @__PURE__ */ new Set();
	for (const match of visible.matchAll(/<a[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi)) {
		const href = match[1];
		if (/javascript:|^#|로그인|메뉴/.test(href)) continue;
		const text = stripTags(match[2]).replace(/\s+/g, " ").trim();
		if (text.length < 8 || text.length > 80) continue;
		let applyUrl;
		try {
			applyUrl = new URL(href, listUrl).href;
		} catch {
			continue;
		}
		if (seen.has(applyUrl)) continue;
		const around = visible.slice(match.index ?? 0, (match.index ?? 0) + 500);
		const range = dateRange(stripTags(around));
		if (!range || !isOngoing(range.end, today)) continue;
		seen.add(applyUrl);
		events.push(eventOf(issuer, String(seen.size), text, text, range.start, range.end, applyUrl, ENTRY.test(text)));
		if (events.length >= 12) break;
	}
	return events;
}
async function collectGeneric(issuer, today) {
	const meta = issuerMeta(issuer);
	try {
		const html = await fetchText(meta.listUrl, {}, 8e3);
		const title = stripTags(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? "");
		if (/요청 오류|이용불가|오류페이지|접근.?거부|not found/i.test(title)) return {
			issuer,
			ok: false,
			message: `${meta.name} 목록이 막혀 있습니다. 앱이나 웹에서 확인하세요.`,
			events: []
		};
		const events = genericEvents(issuer, html, today);
		return {
			issuer,
			ok: true,
			message: events.length ? `${meta.name}에서 응모·쿠폰·추첨 ${events.length}건을 읽었습니다.` : `${meta.name} 화면에는 날짜가 있는 응모·쿠폰·추첨이 없습니다. 앱에서 확인하세요.`,
			events
		};
	} catch (error) {
		return {
			issuer,
			ok: false,
			message: `${meta.name} 목록을 열지 못했습니다. ${error instanceof Error ? error.message : ""}`.trim(),
			events: []
		};
	}
}
var SPECIAL = {
	mirae: collectMirae,
	samsungsec: collectSamsungSec,
	hanasec: collectHanaSec,
	kbsec: collectKbSec,
	wooribank: collectWooriBank,
	ibkbank: collectIbkBank
};
async function collectMarkets(today) {
	const targets = ISSUERS.filter((item) => item.market !== "card");
	return mapPool(targets, 4, (item) => {
		const run = SPECIAL[item.id];
		return run ? run(today) : collectGeneric(item.id, today);
	});
}
var SHINHAN_LIST = "https://www.shinhancard.com/mob/static/json/vendor/evnPgsList01.json";
var HYUNDAI_LIST = "https://www.hyundaicard.com/cpb/ev/CPBEV0101_01.hc";
var KB_LIST = "https://card.kbcard.com/BON/DVIEW/HBBMCXCRVNEC0001";
function cleanSummary(title, summary, conditions) {
	const cleaned = summary.replace(/\s+/g, " ").trim();
	if (cleaned.length >= 12 && !cleaned.includes("evt-visual") && !cleaned.startsWith("//") && cleaned !== title) return cleaned.slice(0, 180);
	return (conditions.find((item) => item.length > 18) || title).replace(/\s+/g, " ").trim().slice(0, 180);
}
function eventBase(issuer, externalId, fields) {
	return {
		id: `${issuer}:${externalId}`,
		issuer,
		listUrl: issuerMeta(issuer).listUrl,
		...fields
	};
}
async function collectShinhan(today) {
	const issuer = "shinhan";
	try {
		const raw = await fetchText(SHINHAN_LIST);
		const open = JSON.parse(raw).root.evnlist.map((item) => ({
			item,
			start: ymd(item.mobWbEvtStd),
			end: ymd(item.mobWbEvtEdd)
		})).filter((row) => isOngoing(row.end, today) && row.start <= today).sort((a, b) => a.end.localeCompare(b.end)).slice(0, 28);
		const events = (await mapPool(open, 5, async (row) => {
			const applyUrl = new URL(row.item.hpgEvtDlPgeUrlAr, "https://www.shinhancard.com").href;
			try {
				const html = await fetchText(applyUrl);
				const summaryRaw = stripTags(html.match(/class="evt-visual__summary"\s*>([\s\S]*?)<\/div>/)?.[1] ?? "");
				const detailStart = html.indexOf("evt-detail");
				const detail = stripTags(html.slice(detailStart, detailStart + 14e3));
				const entry = html.includes("응모하기") && isEntryCopy(`${summaryRaw}\n${detail}\n응모하기`);
				const rules = splitRules(detail);
				const summary = cleanSummary(row.item.mobWbEvtNm, summaryRaw, rules.conditions);
				return eventBase(issuer, row.item.mobWbEvtRvN, {
					title: row.item.mobWbEvtNm.replace(/\s+/g, " ").trim(),
					summary,
					benefit: (row.item.evtImgSlTilNm || summary).replace(/\s+/g, " ").trim().slice(0, 80),
					conditions: rules.conditions,
					exclusions: rules.exclusions,
					startDate: row.start,
					endDate: row.end,
					applyUrl,
					entry
				});
			} catch {
				return null;
			}
		})).filter((event) => event !== null);
		return {
			issuer,
			ok: true,
			message: events.length ? `진행 중 목록 ${open.length}건을 읽고 응모 ${events.length}건만 남겼습니다.` : "목록은 열렸지만 응모 버튼을 가진 진행 이벤트가 없습니다.",
			events
		};
	} catch (error) {
		return {
			issuer,
			ok: false,
			message: `신한카드 목록을 열지 못했습니다. ${error instanceof Error ? error.message : ""}`.trim(),
			events: []
		};
	}
}
async function collectHyundai(today) {
	const issuer = "hyundai";
	try {
		const cards = [...(await fetchText(HYUNDAI_LIST)).matchAll(/href="(\/cpb\/ev\/CPBEV0101_06\.hc\?bnftWebEvntCd=[^"]+)"[\s\S]*?txt_title">([\s\S]*?)<\/span>[\s\S]*?txt_date">([\s\S]*?)<\/span>/g)].map((match) => {
			const range = parseRange(stripTags(match[3]));
			if (!range || !isOngoing(range.end, today)) return null;
			return {
				code: match[1].match(/bnftWebEvntCd=([^&]+)/)?.[1] ?? "",
				title: stripTags(match[2]).replace(/\s+/g, " "),
				range,
				applyUrl: new URL(match[1], "https://www.hyundaicard.com").href
			};
		}).filter((row) => row !== null).slice(0, 18);
		const events = (await mapPool(cards, 4, async (card) => {
			try {
				const page = await fetchText(card.applyUrl);
				const start = page.indexOf("class=\"event_content\"");
				const chunk = visibleMarkup(start >= 0 ? page.slice(start, start + 9e3) : "");
				const text = stripTags(chunk);
				const rules = splitRules(text);
				const summary = cleanSummary(card.title, text.split("\n").find((line) => line.length > 12) ?? "", rules.conditions);
				return eventBase(issuer, card.code, {
					title: card.title,
					summary,
					benefit: summary.slice(0, 80),
					conditions: rules.conditions.length ? rules.conditions : [summary],
					exclusions: rules.exclusions,
					startDate: card.range.start,
					endDate: card.range.end,
					applyUrl: card.applyUrl,
					entry: isEntryCopy(text)
				});
			} catch {
				return null;
			}
		})).filter((event) => event !== null);
		return {
			issuer,
			ok: true,
			message: events.length ? `이벤트 ${cards.length}건 중 응모 ${events.length}건입니다.` : "목록은 열렸지만 응모가 필요한 건이 없습니다. 무이자·자동 할인은 뺐습니다.",
			events
		};
	} catch (error) {
		return {
			issuer,
			ok: false,
			message: `현대카드 목록을 열지 못했습니다. ${error instanceof Error ? error.message : ""}`.trim(),
			events: []
		};
	}
}
async function collectKb(today) {
	const issuer = "kb";
	try {
		const cards = [...(await fetchText(KB_LIST)).matchAll(/goDetail\('(\d+)',\s*''\s*,\s*'1'\);[\s\S]*?subject">([\s\S]*?)<\/span>[\s\S]*?date">([\s\S]*?)<\/span>/g)].map((match) => {
			const range = parseRange(stripTags(match[3]));
			if (!range || !isOngoing(range.end, today)) return null;
			return {
				id: match[1],
				title: stripTags(match[2]).replace(/\s+/g, " "),
				range
			};
		}).filter((row) => row !== null);
		const unique = [...new Map(cards.map((card) => [card.id, card])).values()];
		const events = (await mapPool(unique, 4, async (card) => {
			const applyUrl = `https://card.kbcard.com/BON/DVIEW/HBBMCXCRVNEC0001?mainCC=a&eventNum=${card.id}`;
			try {
				const page = await fetchText(applyUrl, {
					method: "POST",
					headers: {
						"Content-Type": "application/x-www-form-urlencoded",
						Referer: KB_LIST
					},
					body: `이벤트일련번호=${card.id}&가맹점분류코드=&대고객게시여부=1`
				});
				const visible = visibleMarkup(page);
				const start = visible.indexOf("eventViewWrap");
				const text = stripTags(visible.slice(start >= 0 ? start : 0, (start >= 0 ? start : 0) + 7e3));
				const entry = /응모하고|응모하기|응모\s*필수|응모\s*후/.test(text);
				const rules = splitRules(text);
				const summary = cleanSummary(card.title, "", rules.conditions);
				return eventBase(issuer, card.id, {
					title: card.title,
					summary,
					benefit: summary.slice(0, 80),
					conditions: rules.conditions,
					exclusions: rules.exclusions,
					startDate: card.range.start,
					endDate: card.range.end,
					applyUrl,
					entry
				});
			} catch {
				return null;
			}
		})).filter((event) => event !== null);
		return {
			issuer,
			ok: true,
			message: events.length ? `진행 이벤트 ${unique.length}건 중 응모 ${events.length}건입니다.` : "목록은 열렸지만 본문에 응모 조건이 있는 건이 없습니다.",
			events
		};
	} catch (error) {
		return {
			issuer,
			ok: false,
			message: `KB국민카드 목록을 열지 못했습니다. ${error instanceof Error ? error.message : ""}`.trim(),
			events: []
		};
	}
}
function addDays(day, days) {
	const [year, month, date] = day.split("-").map(Number);
	return new Date(Date.UTC(year, month - 1, date + days)).toISOString().slice(0, 10);
}
function dotted(value) {
	const match = value.match(/(\d{4})\s*\.\s*(\d{1,2})\s*\.\s*(\d{1,2})/);
	if (!match) return "";
	return `${match[1]}-${match[2].padStart(2, "0")}-${match[3].padStart(2, "0")}`;
}
function compactDay(value) {
	const match = value.match(/(\d{4})(\d{2})(\d{2})/);
	if (!match) return "";
	return `${match[1]}-${match[2]}-${match[3]}`;
}
function rankSoon(rows, today, limit) {
	const horizon = addDays(today, 50);
	return rows.filter((row) => row.end >= today).map((row) => {
		const hot = /응모|캐시백|경품|적립|쿠폰|머니|상품권|태그/.test(row.title);
		const soon = row.end <= horizon;
		return {
			row,
			score: (hot ? 2 : 0) + (soon ? 1 : 0)
		};
	}).sort((a, b) => b.score - a.score || a.row.end.localeCompare(b.row.end)).slice(0, limit).map((item) => item.row);
}
function rulesOr(title, text, fallback) {
	const rules = splitRules(text);
	return {
		summary: cleanSummary(title, text.split("\n").find((line) => line.length > 16) ?? "", rules.conditions),
		conditions: rules.conditions.length ? rules.conditions : [fallback],
		exclusions: rules.exclusions
	};
}
async function samsungService(service, data, referer) {
	const now = /* @__PURE__ */ new Date();
	const pad = (value, size) => String(value).padStart(size, "0");
	const serial = `${pad(now.getHours(), 2)}${pad(now.getMinutes(), 2)}${pad(now.getSeconds(), 2)}${pad(now.getMilliseconds(), 3)}${pad(Math.floor(Math.random() * 9e4) + 1e4, 5)}`;
	const raw = await fetchText(`https://www.samsungcard.com/frontservice/${service}`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json; charset=UTF-8",
			Origin: "https://www.samsungcard.com",
			Referer: referer
		},
		body: JSON.stringify({
			...data,
			common: {
				scrnId: service === "SHPPBE1401S02" ? "UHPPBE1401M0" : "UHPPBE1403M0",
				stdEtxtCrtSysNm: "P0000000",
				stdEtxtSn: serial,
				stdEtxtPrgDvNo: 0,
				stdEtxtPrgNo: 0,
				usid: "USERID0"
			}
		})
	}, 15e3);
	return JSON.parse(raw);
}
async function collectSamsung(today) {
	const issuer = "samsung";
	const referer = "https://www.samsungcard.com/personal/event/ing/UHPPBE1401M0.jsp";
	try {
		const pages = await mapPool([
			0,
			1,
			2
		], 3, async (pageNo) => {
			return (await samsungService("SHPPBE1401S02", {
				cmpId: "M171028654",
				query: "",
				cmpCtgId: "100",
				pgeNo: pageNo,
				enddtAdvtYn: 0,
				onGoing: "1"
			}, referer)).listPeiHPPPrgEvnInqrDVO ?? [];
		});
		const seen = /* @__PURE__ */ new Map();
		for (const item of pages.flat()) {
			const end = compactDay(item.cmsCmpEnddt || "");
			const start = compactDay(item.cmsCmpStrtdt || item.cmpStrtdt || "");
			const title = (item.cmpTitNm || "").replace(/\s+/g, " ").trim();
			if (!item.cmsId || !end || !title || start > today) continue;
			seen.set(String(item.cmsId), {
				cmsId: String(item.cmsId),
				cmpId: item.cmpId || "",
				title,
				start,
				end
			});
		}
		const chosen = rankSoon([...seen.values()], today, 18);
		const events = (await mapPool(chosen, 5, async (card) => {
			try {
				const vo = (await samsungService("SHPPBE1403S00", {
					cmsId: card.cmsId,
					cmpId: card.cmpId,
					chnlExpsrTeryId: "HPP_UHPPBE1403M0_001"
				}, `https://www.samsungcard.com/personal/event/ing/UHPPBE1403M0.jsp?cms_id=${card.cmsId}`)).hPPPrgEvnDtlInqrDVO;
				const path = (vo?.cmpDtlCnUrl || "").trim();
				if (!path.startsWith("/")) return null;
				const html = await fetchText(new URL(path, "https://static11.samsungcard.com").href, { headers: { Referer: referer } });
				const text = stripTags(visibleMarkup(html));
				const simple = vo?.cmpSimpEntrYn === "Y";
				const packed = rulesOr(card.title, text, "삼성카드 이벤트 페이지에서 조건을 확인하세요.");
				return eventBase(issuer, card.cmsId, {
					title: (vo?.cmpTitNm || card.title).replace(/\s+/g, " ").trim(),
					summary: packed.summary,
					benefit: packed.summary.slice(0, 80),
					conditions: packed.conditions,
					exclusions: packed.exclusions,
					startDate: card.start || today,
					endDate: card.end,
					applyUrl: `https://www.samsungcard.com/personal/event/ing/UHPPBE1403M0.jsp?cms_id=${card.cmsId}`,
					entry: simple || isEntryCopy(text)
				});
			} catch {
				return null;
			}
		})).filter((event) => event !== null);
		return {
			issuer,
			ok: true,
			message: events.length ? `진행 목록에서 마감이 가까운 ${chosen.length}건을 읽고 응모 ${events.length}건만 남겼습니다.` : "목록은 열렸지만 응모가 필요한 건이 없습니다.",
			events
		};
	} catch (error) {
		return {
			issuer,
			ok: false,
			message: `삼성카드 목록을 열지 못했습니다. ${error instanceof Error ? error.message : ""}`.trim(),
			events: []
		};
	}
}
async function collectLotte(today) {
	const issuer = "lotte";
	const listUrl = "https://www.lottecard.co.kr/app/LPBNFDA_V100.lc";
	try {
		const pages = await mapPool([
			1,
			2,
			3
		], 3, async (pageNo) => {
			const raw = await fetchText("https://www.lottecard.co.kr/app/LPBNFDA_A100.lc", {
				method: "POST",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
					"X-Requested-With": "XMLHttpRequest",
					Referer: listUrl
				},
				body: `pageNo=${pageNo}&bigTabGubun=2&tabGubun=9999&finishYn=N&sort=EVN_BULT_SDT&evnCtgSeq=9999`
			});
			return [...(JSON.parse(raw).Content ?? "").matchAll(/tlfLoad\('\d+','click','(\d+)','[^']*','[^']*','[^']*','([^']*)'\)[\s\S]{0,700}?<b>([\s\S]*?)<\/b>[\s\S]{0,240}?class="date">([\s\S]*?)<\/span>/g)].map((match) => {
				const range = parseRange(stripTags(match[4]));
				if (!range) return null;
				return {
					id: match[1],
					popup: match[2],
					title: stripTags(match[3]).replace(/\s+/g, " "),
					start: range.start,
					end: range.end
				};
			});
		});
		const unique = [...new Map(pages.flat().filter((row) => row && row.start <= today).map((row) => [row.id, row])).values()];
		const chosen = rankSoon(unique, today, 14);
		const events = (await mapPool(chosen, 4, async (card) => {
			const applyUrl = `https://www.lottecard.co.kr/app/LPBNFDA_V300.lc?evnBultSeq=${card.id}&evnCtgSeq=9999&bigTabGubun=2`;
			try {
				const page = await fetchText(applyUrl, { headers: { Referer: listUrl } });
				const start = page.indexOf("class=\"eventDetail\"");
				const text = stripTags(visibleMarkup(start >= 0 ? page.slice(start, start + 14e3) : ""));
				const packed = rulesOr(card.title, text, "롯데카드 이벤트 화면에서 조건을 확인하세요.");
				return eventBase(issuer, card.id, {
					title: card.title,
					summary: packed.summary,
					benefit: packed.summary.slice(0, 80),
					conditions: packed.conditions,
					exclusions: packed.exclusions,
					startDate: card.start,
					endDate: card.end,
					applyUrl,
					entry: isEntryCopy(text)
				});
			} catch {
				return null;
			}
		})).filter((event) => event !== null);
		return {
			issuer,
			ok: true,
			message: events.length ? `진행 ${unique.length}건 중 ${chosen.length}건을 확인했고 응모 ${events.length}건입니다.` : "목록은 열렸지만 본문에 응모 조건이 있는 건이 없습니다.",
			events
		};
	} catch (error) {
		return {
			issuer,
			ok: false,
			message: `롯데카드 목록을 열지 못했습니다. ${error instanceof Error ? error.message : ""}`.trim(),
			events: []
		};
	}
}
async function collectHana(today) {
	const issuer = "hana";
	const listUrl = "https://m.hanacard.co.kr/MKEVT1000M.web";
	try {
		const cards = [...(await fetchText(listUrl)).matchAll(/detail\('([^']+)','(\d+)'\)[\s\S]{0,900}?usage-default-title[^>]*>([\s\S]*?)<\/div>[\s\S]{0,280}?usage-default-etc-item[^>]*>([\s\S]*?)<\/div>/g)].map((match) => {
			const range = parseRange(stripTags(match[4]));
			const title = stripTags(match[3]).replace(/\s+/g, " ");
			if (!range || range.start > today) return null;
			return {
				id: match[2],
				path: match[1],
				title,
				start: range.start,
				end: range.end
			};
		}).filter((row) => row !== null);
		const unique = [...new Map(cards.map((card) => [card.id, card])).values()];
		const chosen = rankSoon(unique, today, 12);
		const events = (await mapPool(chosen, 4, async (card) => {
			const applyUrl = new URL(`${card.path}?EVN_SEQ=${card.id}`, "https://m.hanacard.co.kr").href;
			try {
				const sections = [...(await fetchText(applyUrl, { headers: { Referer: listUrl } })).matchAll(/<section class="eVgroup[\s\S]*?<\/section>/g)].map((match) => match[0]).join("\n");
				const text = stripTags(visibleMarkup(sections));
				const packed = rulesOr(card.title, text, "하나카드 이벤트 화면에서 조건을 확인하세요.");
				return eventBase(issuer, card.id, {
					title: card.title,
					summary: packed.summary,
					benefit: packed.summary.slice(0, 80),
					conditions: packed.conditions,
					exclusions: packed.exclusions,
					startDate: card.start,
					endDate: card.end,
					applyUrl,
					entry: isEntryCopy(text) || /응모/.test(card.title)
				});
			} catch {
				return null;
			}
		})).filter((event) => event !== null);
		return {
			issuer,
			ok: true,
			message: events.length ? `진행 ${unique.length}건 중 ${chosen.length}건을 확인했고 응모 ${events.length}건입니다.` : "목록은 열렸지만 응모 안내가 있는 건이 없습니다. 무이자 할부는 뺐습니다.",
			events
		};
	} catch (error) {
		return {
			issuer,
			ok: false,
			message: `하나카드 목록을 열지 못했습니다. ${error instanceof Error ? error.message : ""}`.trim(),
			events: []
		};
	}
}
async function collectNh(today) {
	const issuer = "nh";
	try {
		const cards = [...(await fetchText("https://card.nonghyup.com/servlet/IpCb2001R.act", {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
				Referer: "https://card.nonghyup.com/servlet/IPCB010501.menu"
			},
			body: "menu_id=IPCB010501&DTL_CNM=04&DTL_CNM_DT=04&indexNum=1&pageNum=1&pageSize=40&ORDER_CONDITION=DEADLINE&SEARCH_TEXT="
		})).matchAll(/goEvtDtail\('(\d+)','[^']*'\)[\s\S]{0,1400}?class="tit">([\s\S]*?)<\/div>[\s\S]{0,400}?class="date">([\s\S]*?)<\/div>/g)].map((match) => {
			const dateHtml = match[3];
			const start = dotted((dateHtml.match(/<!--\s*(\d{4}\.\d{2}\.\d{2})/) ?? [])[1] ?? "");
			const end = dotted((dateHtml.match(/(\d{4}\.\d{2}\.\d{2})\s*까지/) ?? [])[1] ?? dateHtml);
			const title = stripTags(match[2]).replace(/\s+/g, " ");
			if (!end) return null;
			return {
				id: match[1],
				title,
				start: start || `${end.slice(0, 8)}01`,
				end
			};
		}).filter((row) => row !== null && row.start <= today && row.end >= today);
		const unique = [...new Map(cards.map((card) => [card.id, card])).values()];
		const events = (await mapPool(unique.slice(0, 12), 4, async (card) => {
			const applyUrl = `https://card.nonghyup.com/servlet/IpCb2002R.act?EVT_CRT_SQNO=${card.id}`;
			let text = "";
			try {
				const page = await fetchText(applyUrl, { headers: { Referer: "https://card.nonghyup.com/servlet/IpCb2001R.act" } });
				const start = page.indexOf("id=\"content\"");
				const end = page.indexOf("content_normal_inforbox", start);
				const chunk = start >= 0 ? page.slice(start, end > start ? end : start + 9e3) : "";
				const alts = [...chunk.matchAll(/alt="([^"]{6,90})"/g)].map((match) => stripTags(match[1])).filter((alt) => !/썸네일|카드상세|응모하기|이미지 없음|로고/.test(alt));
				text = `${stripTags(visibleMarkup(chunk))}\n${alts.join("\n")}`;
			} catch {
				text = "";
			}
			const packed = rulesOr(card.title, text, "NH농협카드 응모 탭 이벤트입니다. 대상 카드와 제외 조건은 안내 이미지에 있습니다.");
			return eventBase(issuer, card.id, {
				title: card.title,
				summary: packed.summary,
				benefit: packed.summary.slice(0, 80),
				conditions: packed.conditions,
				exclusions: packed.exclusions.length ? packed.exclusions : ["자세한 제외 업종은 카드사 안내 이미지를 확인하세요."],
				startDate: card.start,
				endDate: card.end,
				applyUrl,
				entry: isEntryCopy(`${text}\n${card.title}`) || /응모/.test(card.title)
			});
		})).filter((event) => event !== null);
		return {
			issuer,
			ok: true,
			message: events.length ? `응모 탭에서 진행 ${events.length}건을 가져왔습니다. 조건 일부가 이미지라 카드사 화면을 함께 보세요.` : "응모 탭은 열렸지만 오늘 진행 중인 건이 없습니다.",
			events
		};
	} catch (error) {
		return {
			issuer,
			ok: false,
			message: `NH농협카드 응모 탭을 열지 못했습니다. ${error instanceof Error ? error.message : ""}`.trim(),
			events: []
		};
	}
}
var PAYBOOC_ENTRY = /* @__PURE__ */ new Set([
	"02",
	"03",
	"06",
	"07"
]);
async function collectBc(today) {
	const issuer = "bc";
	const listUrl = "https://web.paybooc.co.kr/web/evnt/main";
	try {
		const raw = await fetchText("https://web.paybooc.co.kr/web/evnt/lst-evnt-data", { headers: {
			Accept: "application/json",
			Referer: listUrl
		} });
		const chosen = rankSoon((JSON.parse(raw).data?.evntInqrList ?? []).map((item) => {
			const title = [
				item.pybcUnifEvntNm1,
				item.pybcUnifEvntNm2,
				item.pybcUnifEvntNm3
			].filter(Boolean).join(" ").replace(/\s+/g, " ").trim();
			const start = compactDay(item.evntBltnStrtDtm || "");
			const end = compactDay(item.evntBltnEndDtm || "");
			const typed = PAYBOOC_ENTRY.has(item.pybcUnifEvntTypCd || "");
			const tagged = /마이태그|응모/.test(title);
			if (!item.pybcUnifEvntNo || !end || item.endEvent || start > today) return null;
			return {
				id: item.pybcUnifEvntNo,
				title,
				start,
				end,
				typed: typed || tagged
			};
		}).filter((row) => row !== null), today, 16);
		const events = (await mapPool(chosen, 4, async (card) => {
			const applyUrl = `https://web.paybooc.co.kr/web/evnt/evnt-dts?pybcUnifEvntNo=${card.id}`;
			try {
				const page = await fetchText(applyUrl, { headers: { Referer: listUrl } });
				const marker = page.indexOf("const eventData = ");
				const jsonStart = page.indexOf("{", marker);
				let notice = "";
				let groups = "";
				if (jsonStart > 0) {
					let depth = 0;
					let end = jsonStart;
					for (let index = jsonStart; index < page.length; index += 1) {
						const char = page[index];
						if (char === "{") depth += 1;
						else if (char === "}") {
							depth -= 1;
							if (depth === 0) {
								end = index + 1;
								break;
							}
						}
					}
					const eventData = JSON.parse(page.slice(jsonStart, end));
					notice = stripTags(`${eventData.eventNoticeDto?.ntceMainTitlNm ?? ""}\n${eventData.eventNoticeDto?.ntceMainDtCtnt ?? ""}\n${eventData.eventNoticeDto?.ntceSubDtCtnt ?? ""}`);
					groups = (eventData.eventDetailsGroupBaseDtoList ?? []).map((group) => {
						const bits = (group.eventDetailGroupContentDtoList ?? []).map((item) => stripTags(`${item.cntnTitlNm ?? ""}\n${item.cntnDtCtnt ?? ""}\n${item.cntnDtCtnt2 ?? ""}`));
						return `${group.evntDtGrpNm ?? ""}\n${bits.join("\n")}`;
					}).join("\n");
				}
				const text = `${groups}\n${notice}`;
				const mytag = /마이태그/.test(card.title);
				const packed = rulesOr(card.title, text, card.typed ? "페이북이 로그인·비로그인 응모형으로 분류한 이벤트입니다." : "페이북 이벤트입니다. 조건은 카드사 화면에서 확인하세요.");
				return eventBase(issuer, card.id, {
					title: card.title,
					summary: packed.summary,
					benefit: packed.summary.slice(0, 80),
					conditions: packed.conditions,
					exclusions: packed.exclusions,
					startDate: card.start || today,
					endDate: card.end,
					applyUrl,
					entry: card.typed || mytag || isEntryCopy(`${text}\n${card.title}`)
				});
			} catch {
				return eventBase(issuer, card.id, {
					title: card.title,
					summary: card.title,
					benefit: card.title.slice(0, 80),
					conditions: ["대상과 제외 조건은 행사 화면에서 확인하세요."],
					exclusions: [],
					startDate: card.start || today,
					endDate: card.end,
					applyUrl,
					entry: card.typed
				});
			}
		})).filter((event) => event !== null);
		return {
			issuer,
			ok: true,
			message: events.length ? `페이북 진행 목록에서 응모·마이태그 ${events.length}건을 남겼습니다. BC 홈은 여기로 연결됩니다.` : "페이북 목록은 열렸지만 응모·마이태그 건이 없습니다.",
			events
		};
	} catch (error) {
		return {
			issuer,
			ok: false,
			message: `BC·페이북 목록을 열지 못했습니다. ${error instanceof Error ? error.message : ""}`.trim(),
			events: []
		};
	}
}
async function collectIbk(today) {
	const issuer = "ibk";
	const listUrl = "https://www.ibk.co.kr/event/ingListEvent.ibk?pageId=CM01060100&evnt_dscd=H";
	try {
		const cards = [...(await fetchText(listUrl)).matchAll(/evnt_srno=(\d+)&evnt_dscd=H[\s\S]{0,500}?alt="([^"]*)"[\s\S]{0,1600}?기간<\/span>([\s\S]*?)<\/li>/g)].map((match) => {
			const range = parseRange(stripTags(match[3]));
			const title = stripTags(match[2]).replace(/\s+/g, " ");
			if (!range || range.start > today) return null;
			return {
				id: match[1],
				title,
				start: range.start,
				end: range.end
			};
		}).filter((row) => row !== null);
		const unique = [...new Map(cards.map((card) => [card.id, card])).values()];
		const chosen = rankSoon(unique, today, 10);
		const events = (await mapPool(chosen, 4, async (card) => {
			const applyUrl = `https://www.ibk.co.kr/event/ingDetailEvent.ibk?evnt_srno=${card.id}&evnt_dscd=H&pageId=CM01060100`;
			try {
				const text = [...(await fetchText(applyUrl, { headers: { Referer: listUrl } })).matchAll(/<img[^>]*alt="([^"]{20,500})"[^>]*>/g)].map((match) => stripTags(match[1]).replace(/[·•]/g, "\n")).filter((alt) => !/기업은행 로고|이전|다음/.test(alt)).join("\n");
				const entry = /신청하기|응모하기|사전 신청|쿠폰\s*다운로드|이벤트\s*응모/.test(text);
				const packed = rulesOr(card.title, text, "IBK 행사 화면에서 조건을 확인하세요.");
				return eventBase(issuer, card.id, {
					title: card.title,
					summary: packed.summary,
					benefit: packed.summary.slice(0, 80),
					conditions: packed.conditions,
					exclusions: packed.exclusions,
					startDate: card.start,
					endDate: card.end,
					applyUrl,
					entry
				});
			} catch {
				return null;
			}
		})).filter((event) => event !== null);
		return {
			issuer,
			ok: true,
			message: events.length ? `카드 행사 ${unique.length}건 중 신청·응모 ${events.length}건입니다. 예금·청약 행사는 뺐습니다.` : `카드 행사 ${unique.length}건을 읽었지만 신청이나 응모가 필요한 건은 없습니다.`,
			events
		};
	} catch (error) {
		return {
			issuer,
			ok: false,
			message: `IBK 이벤트 목록을 열지 못했습니다. ${error instanceof Error ? error.message : ""}`.trim(),
			events: []
		};
	}
}
async function collectLive(today = seoulToday()) {
	const [cards, markets] = await Promise.all([Promise.all([
		collectShinhan(today),
		collectSamsung(today),
		collectHyundai(today),
		collectKb(today),
		collectLotte(today),
		collectHana(today),
		collectNh(today),
		collectBc(today),
		collectIbk(today)
	]), collectMarkets(today)]);
	return [...cards, ...markets];
}
var SNAPSHOT_AT = "2026-10-08T02:07:37.639Z";
var SNAPSHOT_EVENTS = [
	{
		"id": "shinhan:2026081327HMPG",
		"issuer": "shinhan",
		"listUrl": "https://www.shinhancard.com/mob/MOBFM829N/MOBFM829R01.shc",
		"title": "홈 카페 아이템 SOL께요!",
		"summary": "드롱기 커피 머신, 컵 세트, 허브 티 세트 경품 1원 결제 응모로",
		"benefit": "티타임이 필요한 순간",
		"conditions": [
			"드롱기 커피 머신, 컵 세트, 허브 티 세트 경품 1원 결제 응모로",
			"이벤트 기간 내 이벤트 응모 1원 결제를 완료한 회원",
			"이벤트 페이지 내 ‘응모하기’ 클릭, 경품 선택 (택 1) 후 1원 결제",
			"이벤트기간 종료 후 당첨자에게 배송비 (3000원) 결제 링크 메시지 도착",
			"배송비 결제하면 경품 수령"
		],
		"exclusions": [],
		"startDate": "2026-09-18",
		"endDate": "2026-10-13",
		"applyUrl": "https://www.shinhancard.com/pconts/html/benefit/event/2014391_2239.html"
	},
	{
		"id": "shinhan:2026091019HMPG",
		"issuer": "shinhan",
		"listUrl": "https://www.shinhancard.com/mob/MOBFM829N/MOBFM829R01.shc",
		"title": "신한카드에서 10억이 쏟아진다~",
		"summary": "카드사 최대 규모! 9.5억여 원의 신용카드 동반성장 상품권(서울사랑 상품권) 받아가세요~ 매일 선착순 1,000명씩 혜택 on! 마이샵 캐시백 받아가세요~",
		"benefit": "신용카드 동반성장 상품권+마이샵 혜택",
		"conditions": [
			"신용카드 동반성장 상품권+마이샵 혜택",
			"신한카드에서 10억이 쏟아진다~",
			"카드사 최대 규모! 9.5억여 원의 신용카드 동반성장 상품권(서울사랑 상품권) 받아가세요~",
			"카드사 최대 규모!",
			"9.5억여 원의 신용카드 동반성장 상품권 받아가세요~"
		],
		"exclusions": [
			"* 가족카드 실적은 원회원 실적에 포함, 법인/신한BC/선불/기프트 카드 제외",
			"* 실적 제외 업종 : 대형가맹점, 온라인·PG거래 (배달 앱, 키오스크, 테이블주문 등), 유흥·사행업종 등",
			"상위 경품 추첨에 당첨되지 않은 고객은 자동으로 다음 하위 경품 추첨대상에 포함되며, 중복 당첨은 불가합니다.",
			"이용금액은 서울시 소재 영세·중소 가맹점에서 2026.09.21~10.18 동안 이용한 금액 중 2026.10.29 까지 매입된 건까지 합산되며, 취소거래는 최종 이용금액에서 제외됩니다."
		],
		"startDate": "2026-09-21",
		"endDate": "2026-10-18",
		"applyUrl": "https://www.shinhancard.com/pconts/html/benefit/event/2014449_2239.html"
	},
	{
		"id": "shinhan:2026082008HMPG",
		"issuer": "shinhan",
		"listUrl": "https://www.shinhancard.com/mob/MOBFM829N/MOBFM829R01.shc",
		"title": "해외 10% 캐시백 프로모션",
		"summary": "신한카드 Haru(Hoshino Resorts)",
		"benefit": "신한카드Haru(Hoshino Resort)",
		"conditions": [
			"신한카드 Haru(Hoshino Resorts)",
			"신한카드 Haru(Hoshino Resort)",
			"해외 결제시 최대 10만원 캐시백",
			"신한카드 Haru(Hoshino Resort) 카드 고객",
			"행사 기간 내 신한카드 Haru(Hoshino Resort) 카드로"
		],
		"exclusions": [
			"이용금액은 행사기간 내 합산 기준이며, 중복혜택은 불가합니다.",
			"해외 거래는 원화 결제를 제외한 외화 결제 대상이며, 합산 이용금액은 해외 이용수수료를 제외한 원화 청구금액 누적 기준입니다.",
			"결제 취소 및 할부 결제, 할부전환 거래는 대상에서 제외됩니다.",
			"간편결제 등 제 3의 기관을 통해 결제하는 경우 합산에서 제외될 수 있습니다."
		],
		"startDate": "2026-09-10",
		"endDate": "2026-10-18",
		"applyUrl": "https://www.shinhancard.com/pconts/html/benefit/event/2014217_2239.html"
	},
	{
		"id": "shinhan:2026091803HMPG",
		"issuer": "shinhan",
		"listUrl": "https://www.shinhancard.com/mob/MOBFM829N/MOBFM829R01.shc",
		"title": "쓸수록 High한 적립+2만원 상품권",
		"summary": "포인트 적립 끝장판 카드, Hi-Point Plan 시리즈 발급받고 출시 기념 보너스 상품권까지 Plus!",
		"benefit": "Hi-Point Plan 시리즈 출시 기념",
		"conditions": [
			"포인트 적립 끝장판 카드, Hi-Point Plan 시리즈 발급받고",
			"신한카드 Hi-Point Plan &amp; Hi-Point Plan+ 출시!",
			"쓰는 만큼 쌓이고, 필요할 땐 채워지는 Hi-Point Plan 시리즈 이용하고",
			"응모기간 : 2026.10.01~10.31",
			"이용기간 : 2026.10.01~11.30"
		],
		"exclusions": ["신한카드 Hi-Point Plan+ VISA 브랜드로 발급 및 이용 시에만 이벤트 대상에 해당되며, 로컬 및 Mastercard로 발급 및 이용 시 이벤트 대상에서 제외됩니다.", "신한카드 Hi-Point Plan VISA 브랜드로 발급 및 이용 시에만 이벤트 대상에 해당되며, 로컬 및 Mastercard로 발급 및 이용 시 이벤트 대상에서 제외됩니다."],
		"startDate": "2026-10-01",
		"endDate": "2026-10-31",
		"applyUrl": "https://www.shinhancard.com/pconts/html/benefit/event/2014527_2239.html"
	},
	{
		"id": "shinhan:2026091719HMPG",
		"issuer": "shinhan",
		"listUrl": "https://www.shinhancard.com/mob/MOBFM829N/MOBFM829R01.shc",
		"title": "신세계 상품권 드려요",
		"summary": "이벤트 응모 후 가을 경품도 받아가세요",
		"benefit": "매일 포인트 쌓으면",
		"conditions": [
			"이벤트 응모 후 가을 경품도 받아가세요",
			"이벤트 응모 방법 - 이벤트페이지 하단 ‘응모하기’ 버튼 클릭",
			"①~⑤ 뱃지가 달린 서비스를 각각 1회 이상 참여하면 미션 달성!",
			"1회 - 2026.10.16 *반영 기간 5~11일",
			"2회 - 2026.10.23 *반영 기간 12~18일"
		],
		"exclusions": ["부정한 방법을 통해 광고 미션이나 게임에 참여할 경우 포인트 지급 회수 및 포인트 지급 대상에서 제외될 수 있습니다."],
		"startDate": "2026-10-01",
		"endDate": "2026-10-31",
		"applyUrl": "https://www.shinhancard.com/pconts/html/benefit/event/2014494_2239.html"
	},
	{
		"id": "shinhan:2026091601HMPG",
		"issuer": "shinhan",
		"listUrl": "https://www.shinhancard.com/mob/MOBFM829N/MOBFM829R01.shc",
		"title": "이마트 신한카드 이용 시 10만원 혜택",
		"summary": "이마트 신한카드 이용 시 10만원 혜택",
		"benefit": "이마트에서는 이마트 신한카드!",
		"conditions": [
			"이마트에서는 이마트 신한카드!",
			"이마트 신한카드 이용 시 10만원 혜택",
			"이마트 계열 혜택 집중! 이마트 신한카드",
			"전월실적 따라 최대 5만원까지 15% 청구할인",
			"전원실적 최소 40만원 부터"
		],
		"exclusions": [
			"두낫콜 등록을 통해 마케팅 선택동의가 해지된 경우 행사대상에서 제외됩니다.",
			"이벤트의 이용 금액 산정은 이마트, 트레이더스, 에브리데이, 노브랜드 오프라인 매장 결제 건에 한하며, 일부 임대매장 및 신세계 상품권 구매금액, 온라인채널 이용건, 취소 매출은 제외됩니다.",
			"행사기간 이전 이마트 신한카드로 이마트, 트레이더스, 에브리데이, 노브랜드 오프라인 매장에서 이용한 이력이 있는 경우 대상에서 제외됩니다.",
			"혜택 지급일 기준 카드해지 또는 탈회 회원은 혜택 제공 대상에서 제외됩니다."
		],
		"startDate": "2026-10-01",
		"endDate": "2026-10-31",
		"applyUrl": "https://www.shinhancard.com/pconts/html/benefit/event/2014463_2239.html"
	},
	{
		"id": "shinhan:2026091501HMPG",
		"issuer": "shinhan",
		"listUrl": "https://www.shinhancard.com/mob/MOBFM829N/MOBFM829R01.shc",
		"title": "딱 10월에만, 10만원 드려요!",
		"summary": "신한카드 Hi-point Plan 이용하고 마케팅 동의 & 슈퍼SOL가입 하면 신세계상품권 10만원 제공!",
		"benefit": "Hi-Point Plan 스페셜 이벤트",
		"conditions": [
			"신한카드 Hi-point Plan 이용하고",
			"행사 기간 (응모)",
			"행사 대상 (필수조건)",
			"행사기간 내 이벤트 응모를 완료한 회원",
			"2026.04.01~09.30 동안 신한 개인신용카드 모든 이용 및 탈회이력이 없는 회원"
		],
		"exclusions": [
			"온라인(PC, 모바일) 채널을 통해 대상카드를 보유한 회원 (* 은행 및 오프라인 채널 등 제외)",
			"이벤트 제외 대상, 이용금액기준, 세부 조건 등은 하단의 [꼭 알아두세요]를 확인하시기 바랍니다.",
			"전월 실적, 할인(적립)한도, 적립제외 가맹점 등 상세기준은 [자세히 보기] 참조 바랍니다.",
			"응모는 변경/취소가 불가능하며 다른 이용 이벤트와 중복 응모는 불가합니다 (먼저 응모를 완료한 이벤트 적용을 받습니다)"
		],
		"startDate": "2026-10-01",
		"endDate": "2026-10-31",
		"applyUrl": "https://www.shinhancard.com/pconts/html/benefit/event/2014533_2239.html"
	},
	{
		"id": "hyundai:W41033",
		"issuer": "hyundai",
		"listUrl": "https://www.hyundaicard.com/cpb/ev/CPBEV0101_01.hc",
		"title": "대한항공카드 이벤트 3천 마일리지 + 10만원 캐시백",
		"summary": "class=\"event_content\">",
		"benefit": "이벤트 3천 마일리지 + 10만원 캐시백",
		"conditions": [
			"기간 내 [응모하러 가기]를 통해 응모 후 조건 충족 및 대상 카드로 40만원 이상 이용 시",
			"대한항공카드 060 · 120 : 10만원 캐시백",
			"응모 : 2026. 10. 1 ~ 10. 31",
			"결제 : 2026. 10. 1 ~ 11. 30",
			"대한항공카드 060 · 120"
		],
		"exclusions": [
			"이벤트 혜택은 기간 내 응모한 본인 회원에 한해 1회 제공됩니다.(가족 회원 제외)",
			"본 이벤트는 현대카드의 다른 이벤트와 중복 적용되지 않으며, 이벤트 기간 및 직전 12개월간(2025. 10. 1 ~ 2026. 9. 30) 현대카드의 다른 이용 유도 이벤트에 참여했거나 혜택(캐시백, 포인트, 할인 쿠폰 등)을 받은 경우, 조건을 충족하더라도 혜택이 제공되지 않습니다.",
			"다른 이벤트(종료된 이벤트 포함)와 중복 응모 시 마지막으로 응모한 이벤트 기준으로 혜택이 제공되며, 중복 제공 및 혜택 변경은 불가합니다.",
			"장기카드대출(카드론), 단기카드대출(현금서비스), 연회비, 제수수료, 이자, 결제 취소 건 제외"
		],
		"startDate": "2026-10-01",
		"endDate": "2026-10-31",
		"applyUrl": "https://www.hyundaicard.com/cpb/ev/CPBEV0101_06.hc?bnftWebEvntCd=W41033&searchWord="
	},
	{
		"id": "hyundai:LO1032",
		"issuer": "hyundai",
		"listUrl": "https://www.hyundaicard.com/cpb/ev/CPBEV0101_01.hc",
		"title": "대한항공카드가 준비한 혜택 3천 마일리지 + 최대 24만원 캐시백",
		"summary": "class=\"event_content\">",
		"benefit": "3천 마일리지 + 최대 24만원 캐시백",
		"conditions": [
			"기간 내 [응모하러 가기]를 통해 응모 후 조건 충족 및 대상 카드로 40만원 이상 이용 시",
			"대한항공카드 300 : 12만원 캐시백",
			"대한항공카드 the First Edition2 : 24만원 캐시백",
			"응모 : 2026. 10. 1 ~ 10. 31",
			"결제 : 2026. 10. 1 ~ 11. 30"
		],
		"exclusions": [
			"이벤트 혜택은 기간 내 응모한 본인 회원에 한해 1회 제공됩니다.(가족 회원 제외)",
			"본 이벤트는 현대카드의 다른 이벤트와 중복 적용되지 않으며, 이벤트 기간 및 직전 12개월간(2025. 10. 1 ~ 2026. 9. 30) 현대카드의 다른 이용 유도 이벤트에 참여했거나 혜택(캐시백, 포인트, 할인 쿠폰 등)을 받은 경우, 조건을 충족하더라도 혜택이 제공되지 않습니다.",
			"다른 이벤트(종료된 이벤트 포함)와 중복 응모 시 마지막으로 응모한 이벤트 기준으로 혜택이 제공되며, 중복 제공 및 혜택 변경은 불가합니다.",
			"장기카드대출(카드론), 단기카드대출(현금서비스), 연회비, 제수수료, 이자, 결제 취소 건 제외"
		],
		"startDate": "2026-10-01",
		"endDate": "2026-10-31",
		"applyUrl": "https://www.hyundaicard.com/cpb/ev/CPBEV0101_06.hc?bnftWebEvntCd=LO1032&searchWord="
	},
	{
		"id": "kb:1002268",
		"issuer": "kb",
		"listUrl": "https://card.kbcard.com/BON/DVIEW/HBBMCXCRVNEC0001",
		"title": "돌아온 해외이용수수료 최대 100만 포인트백!",
		"summary": "응모하고 행사 기간 동안 대상카드로 해외가맹점에서 원화환산금액 기준 20만원 이상 이용하면 이용금액의 1.1% 포인트리 지급(최대 100만 포인트리)",
		"benefit": "응모하고 행사 기간 동안 대상카드로 해외가맹점에서 원화환산금액 기준 20만원 이상 이용하면 이용금액의 1.1% 포인트리 지급(최대 100만 포인",
		"conditions": [
			"돌아온 해외이용수수료",
			"응모하고 행사 기간 동안 대상카드로 해외가맹점에서 원화환산금액 기준 20만원 이상 이용하면 이용금액의 1.1% 포인트리 지급(최대 100만 포인트리)",
			"* 총 원화 결제금액의 1.1% 지급되며, 백포인트 단위까지 지급(십포인트 단위에서 반올림)",
			"2027.1.15(금) 안에 본인 회원에게 제공",
			"이용 전 확인해주세요"
		],
		"exclusions": [
			"KB국민 Visa 개인 신용/체크카드 기보유 고객 (KB국민 기업, 비씨카드 제외)",
			"해외 승인 시에만 인정되며 카카오페이 등록 이용 등의 국내 이용금액은 제외됩니다.",
			"이용금액 중 정상 매입되지 않은 금액은 실적 산정 시 제외됩니다.",
			"이용금액 중 승인거절, 승인취소, 부분취소, 매입취소, 반품/환불등의 사유로 정상처리 되지 않을 경우 이용금액에 포함되지 않습니다."
		],
		"startDate": "2026-10-06",
		"endDate": "2026-10-31",
		"applyUrl": "https://card.kbcard.com/BON/DVIEW/HBBMCXCRVNEC0001?mainCC=a&eventNum=1002268"
	},
	{
		"id": "woori:30006273",
		"issuer": "woori",
		"title": "[2026 우다페] 5대 온라인몰 캐시백 50만원 이상 이용하면, 최대 1만원 캐시백",
		"summary": "[2026 우다페] 5대 온라인몰 캐시백 50만원 이상 이용하면, 최대 1만원 캐시백",
		"benefit": "캐시백",
		"conditions": ["[2026 우다페] 5대 온라인몰 캐시백 50만원 이상 이용하면, 최대 1만원 캐시백", "우리카드가 응모형으로 분류한 이벤트입니다. 대상 카드·실적·제외 업종은 응모 화면에서 확인하세요."],
		"exclusions": ["로그인 응모가 필요할 수 있습니다."],
		"startDate": "2026-10-01",
		"endDate": "2026-10-31",
		"applyUrl": "https://pc.wooricard.com/dcpc/yh1/bnf/bnf02/prgevnt/H1BNF202S00.do",
		"listUrl": "https://pc.wooricard.com/dcpc/yh1/bnf/bnf02/prgevnt/H1BNF202S00.do"
	},
	{
		"id": "woori:30006224",
		"issuer": "woori",
		"title": "[2026 우다페] 우리은행 결제계좌 더블 혜택 이벤트 우다페 기간한정 최대 2만원 캐시백에 커피 한 잔까지 받을 수 있는 기회!",
		"summary": "[2026 우다페] 우리은행 결제계좌 더블 혜택 이벤트 우다페 기간한정 최대 2만원 캐시백에 커피 한 잔까지 받을 수 있는 기회!",
		"benefit": "캐시백",
		"conditions": ["[2026 우다페] 우리은행 결제계좌 더블 혜택 이벤트 우다페 기간한정 최대 2만원 캐시백에 커피 한 잔까지 받을 수 있는 기회!", "우리카드가 응모형으로 분류한 이벤트입니다. 대상 카드·실적·제외 업종은 응모 화면에서 확인하세요."],
		"exclusions": ["로그인 응모가 필요할 수 있습니다."],
		"startDate": "2026-10-01",
		"endDate": "2026-10-31",
		"applyUrl": "https://pc.wooricard.com/dcpc/yh1/bnf/bnf02/prgevnt/H1BNF202S00.do",
		"listUrl": "https://pc.wooricard.com/dcpc/yh1/bnf/bnf02/prgevnt/H1BNF202S00.do"
	},
	{
		"id": "woori:30006223",
		"issuer": "woori",
		"title": "[2026 우다페] 동양생명 보험료 캐시백 이벤트 우리카드로 동양생명 보험료를 납부하면 5천원 캐시백 혜택을 드려요",
		"summary": "[2026 우다페] 동양생명 보험료 캐시백 이벤트 우리카드로 동양생명 보험료를 납부하면 5천원 캐시백 혜택을 드려요",
		"benefit": "캐시백",
		"conditions": ["[2026 우다페] 동양생명 보험료 캐시백 이벤트 우리카드로 동양생명 보험료를 납부하면 5천원 캐시백 혜택을 드려요", "우리카드가 응모형으로 분류한 이벤트입니다. 대상 카드·실적·제외 업종은 응모 화면에서 확인하세요."],
		"exclusions": ["로그인 응모가 필요할 수 있습니다."],
		"startDate": "2026-10-01",
		"endDate": "2026-10-31",
		"applyUrl": "https://pc.wooricard.com/dcpc/yh1/bnf/bnf02/prgevnt/H1BNF202S00.do",
		"listUrl": "https://pc.wooricard.com/dcpc/yh1/bnf/bnf02/prgevnt/H1BNF202S00.do"
	},
	{
		"id": "woori:30006333",
		"issuer": "woori",
		"title": "해외에서 SUPER 이용하고 최대 150만원 SUPER한 할인 혜택까지",
		"summary": "해외에서 SUPER 이용하고 최대 150만원 SUPER한 할인 혜택까지",
		"benefit": "할인",
		"conditions": ["해외에서 SUPER 이용하고 최대 150만원 SUPER한 할인 혜택까지", "우리카드가 응모형으로 분류한 이벤트입니다. 대상 카드·실적·제외 업종은 응모 화면에서 확인하세요."],
		"exclusions": ["로그인 응모가 필요할 수 있습니다."],
		"startDate": "2026-10-01",
		"endDate": "2026-10-31",
		"applyUrl": "https://pc.wooricard.com/dcpc/yh1/bnf/bnf02/prgevnt/H1BNF202S00.do",
		"listUrl": "https://pc.wooricard.com/dcpc/yh1/bnf/bnf02/prgevnt/H1BNF202S00.do"
	},
	{
		"id": "woori:30006298",
		"issuer": "woori",
		"title": "[우리 365 챌린지 : 10월] 3번, 60만원씩 쓰면 5% 캐시백 3 : 3번 결제, 6 : 60만원씩 쓰면 5 : 5% 캐시백 드려요",
		"summary": "[우리 365 챌린지 : 10월] 3번, 60만원씩 쓰면 5% 캐시백 3 : 3번 결제, 6 : 60만원씩 쓰면 5 : 5% 캐시백 드려요",
		"benefit": "캐시백",
		"conditions": ["[우리 365 챌린지 : 10월] 3번, 60만원씩 쓰면 5% 캐시백 3 : 3번 결제, 6 : 60만원씩 쓰면 5 : 5% 캐시백 드려요", "우리카드가 응모형으로 분류한 이벤트입니다. 대상 카드·실적·제외 업종은 응모 화면에서 확인하세요."],
		"exclusions": ["로그인 응모가 필요할 수 있습니다."],
		"startDate": "2026-10-01",
		"endDate": "2026-10-31",
		"applyUrl": "https://pc.wooricard.com/dcpc/yh1/bnf/bnf02/prgevnt/H1BNF202S00.do",
		"listUrl": "https://pc.wooricard.com/dcpc/yh1/bnf/bnf02/prgevnt/H1BNF202S00.do"
	},
	{
		"id": "woori:30006360",
		"issuer": "woori",
		"title": "해외에서 커피 마시면, 메가커피 2잔 드려요 스타벅스, 블루보틀, 루이싱커피 등 해외 이용 시 커피 쿠폰 제공!",
		"summary": "해외에서 커피 마시면, 메가커피 2잔 드려요 스타벅스, 블루보틀, 루이싱커피 등 해외 이용 시 커피 쿠폰 제공!",
		"benefit": "응모",
		"conditions": ["해외에서 커피 마시면, 메가커피 2잔 드려요 스타벅스, 블루보틀, 루이싱커피 등 해외 이용 시 커피 쿠폰 제공!", "우리카드가 응모형으로 분류한 이벤트입니다. 대상 카드·실적·제외 업종은 응모 화면에서 확인하세요."],
		"exclusions": ["로그인 응모가 필요할 수 있습니다."],
		"startDate": "2026-10-01",
		"endDate": "2026-12-31",
		"applyUrl": "https://pc.wooricard.com/dcpc/yh1/bnf/bnf02/prgevnt/H1BNF202S00.do",
		"listUrl": "https://pc.wooricard.com/dcpc/yh1/bnf/bnf02/prgevnt/H1BNF202S00.do"
	},
	{
		"id": "woori:30006359",
		"issuer": "woori",
		"title": "해외 택시 50% 캐시백 우버(Uber) / 그랩(Grab) / DiDi(디디) 해외에서 택시타고 캐시백 받아가세요!",
		"summary": "해외 택시 50% 캐시백 우버(Uber) / 그랩(Grab) / DiDi(디디) 해외에서 택시타고 캐시백 받아가세요!",
		"benefit": "캐시백",
		"conditions": ["해외 택시 50% 캐시백 우버(Uber) / 그랩(Grab) / DiDi(디디) 해외에서 택시타고 캐시백 받아가세요!", "우리카드가 응모형으로 분류한 이벤트입니다. 대상 카드·실적·제외 업종은 응모 화면에서 확인하세요."],
		"exclusions": ["로그인 응모가 필요할 수 있습니다."],
		"startDate": "2026-10-01",
		"endDate": "2026-12-31",
		"applyUrl": "https://pc.wooricard.com/dcpc/yh1/bnf/bnf02/prgevnt/H1BNF202S00.do",
		"listUrl": "https://pc.wooricard.com/dcpc/yh1/bnf/bnf02/prgevnt/H1BNF202S00.do"
	},
	{
		"id": "woori:30006328",
		"issuer": "woori",
		"title": "내 라이프스타일에 맞는 혜택을 찾아라! 400분께 경품을 드려요 카드의정석2 시리즈 이용하고 다양한 경품 혜택 받으세요!",
		"summary": "내 라이프스타일에 맞는 혜택을 찾아라! 400분께 경품을 드려요 카드의정석2 시리즈 이용하고 다양한 경품 혜택 받으세요!",
		"benefit": "경품",
		"conditions": ["내 라이프스타일에 맞는 혜택을 찾아라! 400분께 경품을 드려요 카드의정석2 시리즈 이용하고 다양한 경품 혜택 받으세요!", "우리카드가 응모형으로 분류한 이벤트입니다. 대상 카드·실적·제외 업종은 응모 화면에서 확인하세요."],
		"exclusions": ["로그인 응모가 필요할 수 있습니다."],
		"startDate": "2026-10-01",
		"endDate": "2026-10-31",
		"applyUrl": "https://pc.wooricard.com/dcpc/yh1/bnf/bnf02/prgevnt/H1BNF202S00.do",
		"listUrl": "https://pc.wooricard.com/dcpc/yh1/bnf/bnf02/prgevnt/H1BNF202S00.do"
	}
];
var SNAPSHOT_REPORT = [
	{
		"id": "shinhan",
		"ok": true,
		"message": "진행 중 목록 28건을 읽고 응모 7건만 남겼습니다.",
		"count": 7
	},
	{
		"id": "hyundai",
		"ok": true,
		"message": "이벤트 18건 중 응모 2건입니다.",
		"count": 2
	},
	{
		"id": "kb",
		"ok": true,
		"message": "진행 이벤트 12건 중 응모 1건입니다.",
		"count": 1
	},
	{
		"id": "woori",
		"ok": true,
		"message": "응모형 필터로 8건을 가져왔습니다. 상세 약관은 카드사 화면에서 확인하세요.",
		"count": 8
	}
];
var EXTRA_AT = "2026-10-08T11:54:56.281717+09:00";
var EXTRA_EVENTS = [
	{
		"id": "samsung:3758066",
		"issuer": "samsung",
		"listUrl": "https://www.samsungcard.com/personal/event/ing/UHPPBE1401M0.jsp",
		"title": "모니모페이로 결제하면 최대 100만 모니머니 행운",
		"summary": "2,323명 에게 모니머니 선물!",
		"benefit": "2,323명 에게 모니머니 선물!",
		"conditions": [
			"모니모페이로 결제하면",
			"간편하게 결제하고 최대 100만 모니머니에 도전해 보세요!",
			"행사기간 2026.10.1(목)~10.31(토) (카드 승인일 기준) 대상카드 삼성개인신용카드 (가족카드 포함) 혜택",
			"아래 &lsquo;응모하기&rsquo;를 눌러 행사 응모",
			"모니모페이에 등록된 대상카드로 1,000원 이상 결제"
		],
		"exclusions": [
			"2026.11.20까지 삼성카드에 휴대폰번호가 등록되어 있지 않거나 정확하지 않을 경우 혜택이 제공되지 않음",
			"네이버페이, 카카오페이, PAYCO, Paypal, 유비페이 등을 통한 간편결제건 제외(모니모페이에 등록된 삼성 페이 결제건은 포함)",
			"세금/공과금/제약/대학등록금 결제건 제외",
			"일부 이용금액(쿠폰 할인, 포인트 사용 결제건 등) 및 결제 취소건 제외"
		],
		"startDate": "2026-10-01",
		"endDate": "2026-10-31",
		"applyUrl": "https://www.samsungcard.com/personal/event/ing/UHPPBE1403M0.jsp?cms_id=3758066"
	},
	{
		"id": "samsung:3757273",
		"issuer": "samsung",
		"listUrl": "https://www.samsungcard.com/personal/event/ing/UHPPBE1401M0.jsp",
		"title": "SC제일은행 삼성카드 최대 11만원 캐시백",
		"summary": "26.10.01 ~ 26.10.31",
		"benefit": "26.10.01 ~ 26.10.31",
		"conditions": [
			"SC제일은행 삼성카드",
			"혜택 1 행사 기간 2026.10.01~2026.10.31 대상회원",
			"행사 직전 6개월(2026.04.01~2026.09.30) 동안 삼성개인신용카드 결제 및 탈회 이력이 없는 회원",
			"결제 이력은 후불하이패스카드, 무승인 결제건(대중교통, 이동통신 등 정기결제건, 문자알림서비스 결제건 등) 포함",
			"2022.1.1(토)부터 혜택 지급일까지 삼성카드의 다른 행사 혜택(캐시백, 포인트, 마일리지 등) 을 받은 이력이 없는 회원"
		],
		"exclusions": [
			"오프라인 채널(모집인, 텔레마케팅&trade; 등)을 통해 보유한 경우 행사대상에서 제외",
			"혜택이 잘못 제공된 경우(중복 제공 등) 받은 혜택이 카드 결제계좌에서 자동 출금될 수 있음",
			"신규 회원 연회비 캐시백 행사 등 삼성카드의 다른 행사 혜택(캐시백,포인트,쿠폰 등)과 중복 제공되지않음",
			"이용금액은 할인, 쿠폰/포인트 사용 등을 제외한 최종 결제금액 기준 으로 합산하여 산정"
		],
		"startDate": "2026-10-01",
		"endDate": "2026-10-31",
		"applyUrl": "https://www.samsungcard.com/personal/event/ing/UHPPBE1403M0.jsp?cms_id=3757273"
	},
	{
		"id": "samsung:3757207",
		"issuer": "samsung",
		"listUrl": "https://www.samsungcard.com/personal/event/ing/UHPPBE1401M0.jsp",
		"title": "나의 퍼스트 프리미엄, 15만원 캐시백!",
		"summary": "행사기간 26.10.01(목)~26.10.31(토)(카드 신청일 기준)",
		"benefit": "행사기간 26.10.01(목)~26.10.31(토)(카드 신청일 기준)",
		"conditions": [
			"행사기간 26.10.01(목)~26.10.31(토)(카드 신청일 기준)",
			"혜택 행사기간 내 대상카드 최초 발급 시 15만원 캐시백",
			"2022.01.01(토) 부터 혜택 제공일 전까지 삼성카드의 다른 이벤트 혜택(캐시백, 포인트/마일리지 적립 등)을 받은 경우 제공 조건을 충족하더라도 혜택을 받을 수 없음",
			"아래 &lsquo;응모하기&rsquo;를 눌러 이벤트 응모",
			"삼성카드 홈페이지/모니모앱에서 대상 카드 신규 발급"
		],
		"exclusions": [
			"행사기간 시작일 기준, 직전 6개월 동안 삼성개인신용카드 탈회 이력이 있는 회원의 경우 행사대상에서 제외",
			"기존 삼성카드 회원의 추가/교체 발급 건은 제외",
			"혜택이 중복 제공되거나 혜택을 받은 달로부터 12개월 내에 삼성카드 탈회 시, 받은 혜택은 카드 결제계좌에서 자동 출금될 수 있음",
			"이용금액 산정시 선불카드 충전, 대중교통 이용 건 제외"
		],
		"startDate": "2026-10-01",
		"endDate": "2026-10-31",
		"applyUrl": "https://www.samsungcard.com/personal/event/ing/UHPPBE1403M0.jsp?cms_id=3757207"
	},
	{
		"id": "samsung:3757150",
		"issuer": "samsung",
		"listUrl": "https://www.samsungcard.com/personal/event/ing/UHPPBE1401M0.jsp",
		"title": "프리미엄 카드 혜택 연회비 100% 캐시백",
		"summary": "26.10.01 ~ 26.10.31",
		"benefit": "26.10.01 ~ 26.10.31",
		"conditions": [
			"프리미엄 카드 혜택",
			"행사기간 2026.10.01(목)~10.31(토) (카드 신청일 기준)",
			"행사기간 동안 아래 &lsquo;응모하기&rsquo;를 눌러 행사 응모",
			"삼성카드 홈페이지, 모니모 앱, 네이버 광고채널에서 대상카드 신규 신청 및 발급",
			"2026.10.01(목)~2026.11.30(월) (승인일 기준, 무승인 결제건은 매출전표 접수일 기준) 동안 대상카드로 국내외 가맹점에서 일시불 및 할부 합산 50만원 이상 이용"
		],
		"exclusions": [
			"대상카드 중복 발급의 경우 신규 발급건에 한해 제공",
			"기존 삼성카드 회원의 추가/교체 발급건 제외",
			"토스, 삼성페이, 네이버페이, 카카오페이, 카카오뱅크, 카드고릴라 등 제휴채널을 통한 신청 및 발급건은 제외",
			"행사 직전 6개월(2026.04.01~2026.09.30) 동안 삼성개인신용카드 탈회 이력이 있는 회원의 경우 행사대상에서 제외"
		],
		"startDate": "2026-10-01",
		"endDate": "2026-10-31",
		"applyUrl": "https://www.samsungcard.com/personal/event/ing/UHPPBE1403M0.jsp?cms_id=3757150"
	},
	{
		"id": "samsung:3756954",
		"issuer": "samsung",
		"listUrl": "https://www.samsungcard.com/personal/event/ing/UHPPBE1401M0.jsp",
		"title": "Visa 삼성카드 해외 최대 100만원 캐시백",
		"summary": "26.10.01 ~ 26.10.31",
		"benefit": "26.10.01 ~ 26.10.31",
		"conditions": [
			"행사기간 2026.10.01(목)~10.31(토)(카드 승인일 기준)",
			"카드 승인일은 한국 표준시 기준",
			"대상카드 Visa 브랜드로 표시된 삼성개인신용카드 (가족카드 포함) 혜택 응모 후 해외가맹점(온·오프라인)에서 대상카드로 일시불 및 할부 합산 100/300/500/1,000/2,000/3,000/5,000만원 이상 이용 시",
			"혜택제공 2027.01.22(금) 이후 카드 결제대금내역에서 확인 가능",
			"본인 회원에 한해 응모 가능"
		],
		"exclusions": [
			"예산 소진 시 조기 종료될 수 있음",
			"해외 결제 후 취소 시 혜택 지급 대상에서 제외될 수 있으며, 이미 혜택이 지급된 경우에는 혜택 지급액 만큼 카드 결제계좌에서 자동 출금될 수 있음",
			"혜택이 잘못 제공된 경우(중복 제공 등) 받은 혜택이 카드 결제계좌에서 자동 출금될 수 있음",
			"원화 결제를 제외한 외화(USD, JPY 등) 결제건에 한함"
		],
		"startDate": "2026-10-01",
		"endDate": "2026-10-31",
		"applyUrl": "https://www.samsungcard.com/personal/event/ing/UHPPBE1403M0.jsp?cms_id=3756954"
	},
	{
		"id": "samsung:3757147",
		"issuer": "samsung",
		"listUrl": "https://www.samsungcard.com/personal/event/ing/UHPPBE1401M0.jsp",
		"title": "삼성카드 회원을 위한 리저브 애프터눈 커피 세트",
		"summary": "26.10.06 ~ 26.10.31",
		"benefit": "26.10.06 ~ 26.10.31",
		"conditions": [
			"삼성카드 회원을 위한",
			"카드 혜택은 전월 실적 50만원 이상 시 제공 되며 스타벅스 선불카드 충전 이용 시는 전월 실적 관계없이 적립 [ 월 누적 별 적립한도 최대 180개 ]",
			"스타벅스 삼성카드 자세히 보기",
			"행사기간 2026.10.6(화) ~ 10.31(토) (행사 응모일 기준) 대상카드 스타벅스 삼성카드 혜택 리저브 애프터눈 커피 세트 2인 초대권 2장 + 제조음료 무료쿠폰 2장",
			"행사대상 아래 조건을 모두 충족하는 회원"
		],
		"exclusions": [
			"방문별 혜택의 경우 스타벅스 선불카드 충전 건은 제외",
			"신규 회원 연회비 캐시백 등 삼성카드의 다른 행사 혜택(캐시백, 포인트, 쿠폰, 마일리지 등)과 중복 제공되지 않음",
			"이용금액은 할인, 쿠폰/포인트 사용 등을 제외한 최종 결제금액 기준으로 합산하여 산정",
			"이용금액 산정 시 단기카드대출(현금서비스), 장기카드대출(카드론), 각종 수수료 및 이자(할부수수료, 카드대출 이자 등), 연체료, 연회비 납부건 제외"
		],
		"startDate": "2026-10-06",
		"endDate": "2026-10-31",
		"applyUrl": "https://www.samsungcard.com/personal/event/ing/UHPPBE1403M0.jsp?cms_id=3757147"
	},
	{
		"id": "lotte:11292",
		"issuer": "lotte",
		"listUrl": "https://www.lottecard.co.kr/app/LPBNFDA_V100.lc",
		"title": "트래블월렛 하이브리드 롯데카드 20만원 캐시백",
		"summary": "class=\"eventDetail\">",
		"benefit": "class=\"eventDetail\">",
		"conditions": [
			"트래블월렛 하이브리드 롯데카드로 이용 기간 내 국내 및 해외에서 30만원 이상 결제 시 트래블월렛 원화(KRW) 20만원 지급",
			"회원당 기간 내 1회 제공되며, 이벤트 응모 필수",
			"응모기간 : 2026.10.1(목) ~ 10.31(토)",
			"이용기간 : 2026.10.1(목) ~ 11.10(화)",
			"혜택 01 : 행사 시작일 직전 6개월 동안 (2026.4.1(수) ~ 9.30(수)) 롯데 개인 신용카드 결제 이력이 없는 회원"
		],
		"exclusions": [
			"(단, 행사 시작일 직전 12개월 동안 롯데카드에서 진행한 카드 이용 이벤트에 응모하여 혜택을 제공받은 회원은 제외)",
			"이벤트 요건 및 유의사항 미확인으로 인한 혜택 미적용 시, 별도 혜택 지급 및 응모 처리가 불가합니다.",
			"신용승인건만 이용금액 실적 인정되며, 충전된 금액(트래블페이) 사용건은 실적 제외됩니다.",
			"트래블 포인트 적립 혜택은 트래블월렛 하이브리드 롯데카드로 신용 결제한 금액 대상이며, 트래블월렛의 선불충전금으로 결제된 금액은 적립대상에서 제외됩니다."
		],
		"startDate": "2026-10-01",
		"endDate": "2026-10-31",
		"applyUrl": "https://www.lottecard.co.kr/app/LPBNFDA_V300.lc?evnBultSeq=11292&evnCtgSeq=9999&bigTabGubun=2"
	},
	{
		"id": "lotte:11289",
		"issuer": "lotte",
		"listUrl": "https://www.lottecard.co.kr/app/LPBNFDA_V100.lc",
		"title": "LG전자 온라인몰(LGE.COM) 최대 50만원 캐시백",
		"summary": "class=\"eventDetail\">",
		"benefit": "class=\"eventDetail\">",
		"conditions": [
			"이용기간 내 Trip to 로카(AMEX)로 LGE.COM에서 이용 시 최대 50만원 캐시백",
			"이용 금액 구간, 캐시백 금액으로 구성된 표",
			"1,000만원 이상",
			"이벤트 응모하기 필수",
			"행사기간 직전 6개월(2026.4.1(수)~2026.9.30(수)) 동안 롯데 개인 신용카드 결제 이력이 없는 회원"
		],
		"exclusions": [
			"이용 금액 구간 중복 적용 불가",
			"동월 내 다른 이벤트 응모 시, 이 이벤트 대상에서 제외됩니다. (최종 응모한 이벤트로 참여됨)",
			"할인제외 및 할인한도 등은 카드 자세히 보기를 통해 확인하여 주십시오.",
			"롯데카드의 다른 이용 이벤트에 참여하신 경우 중복 적용이 불가합니다."
		],
		"startDate": "2026-10-01",
		"endDate": "2026-10-31",
		"applyUrl": "https://www.lottecard.co.kr/app/LPBNFDA_V300.lc?evnBultSeq=11289&evnCtgSeq=9999&bigTabGubun=2"
	},
	{
		"id": "lotte:11325",
		"issuer": "lotte",
		"listUrl": "https://www.lottecard.co.kr/app/LPBNFDA_V100.lc",
		"title": "YBM X 디지로카로 무이자할부와 최대 15만원 혜택 받아가세요",
		"summary": "class=\"eventDetail\">",
		"benefit": "class=\"eventDetail\">",
		"conditions": [
			"대상카드로 이용기간 내 YBM에서 20만원 이상 결제 시 12개월 무이자 할부 혜택",
			"대상카드로 이용기간 내 20만원 이상 이용 시 15만원 캐시백",
			"응모기간 : 2026.9.16(수) ~ 10.31(토)",
			"카드이용기간 : 2026.9.16(수) ~ 11.30(월)",
			"행사기간 내 이벤트 응모하기를 통해 대상카드를 보유한 회원 중 최근 6개월 동안(2026.3.1 ~ 2026.8.31) 롯데카드 사용 이력이 없는 회원"
		],
		"exclusions": [
			"무이자 할부이용금액은 제외",
			"가족회원 제외, 이벤트 응모 필수",
			"(무이자 할부이용금액은 제외)",
			"롯데카드의 다른 카드 이용 이벤트 혜택과 중복 적용되지 않으며, 오프라인(설계사, 카드영업지점 등) 또는 콜센터를 통해 소지 하고 계신 회원은 대상자 에서 제외됩니다."
		],
		"startDate": "2026-09-16",
		"endDate": "2026-10-31",
		"applyUrl": "https://www.lottecard.co.kr/app/LPBNFDA_V300.lc?evnBultSeq=11325&evnCtgSeq=9999&bigTabGubun=2"
	},
	{
		"id": "hana:60588",
		"issuer": "hana",
		"listUrl": "https://m.hanacard.co.kr/MKEVT1000M.web",
		"title": "생활요금 자동납부하면 최대 2만 하나머니!",
		"summary": "최대 2만 하나머니 지급! 생활요금 4종 자동납부 시",
		"benefit": "최대 2만 하나머니 지급! 생활요금 4종 자동납부 시",
		"conditions": [
			"이벤트 기간 동안 자동납부 금액이",
			"LGU+는 이용상품(유/무선, 인터넷, 알뜰폰,",
			"자동납부 신청과 이벤트 응모는",
			"아래 [응모하기]를 통해",
			"아래 \"카드이동서비스 바로가기\""
		],
		"exclusions": [
			"지급 대상에서 제외됩니다.",
			"TV수신료는 전기요금에서 제외됩니다.",
			"자동 납부서비스는 제외됩니다.",
			"제외대상 : 하나BC"
		],
		"startDate": "2026-10-01",
		"endDate": "2026-10-31",
		"applyUrl": "https://m.hanacard.co.kr/MKEVT1010M.web?EVN_SEQ=60588"
	},
	{
		"id": "hana:60580",
		"issuer": "hana",
		"listUrl": "https://m.hanacard.co.kr/MKEVT1000M.web",
		"title": "결제계좌 변경하고 메가커피 10잔♡",
		"summary": "결제계좌를 하나은행으로 변경하고",
		"benefit": "결제계좌를 하나은행으로 변경하고",
		"conditions": [
			"결제계좌를 하나은행으로 변경하고",
			"월 합산 5만원 이상 이용 시 2개월간 메가MGC커피 아메리카노",
			"'응모하고 결제계좌 변경하기'",
			"결제계좌 변경 화면에서",
			"하나은행으로 결제계좌 변경"
		],
		"exclusions": [],
		"startDate": "2026-10-01",
		"endDate": "2026-10-31",
		"applyUrl": "https://m.hanacard.co.kr/MKEVT1010M.web?EVN_SEQ=60580"
	},
	{
		"id": "nh:6463",
		"issuer": "nh",
		"listUrl": "https://card.nonghyup.com/IPCC010001.menu",
		"title": "쓸수록 더 받는 최대 5만원 해외 캐시백",
		"summary": "진행중인 이벤트 이 페이지를 즐겨찾기에 추가",
		"benefit": "진행중인 이벤트 이 페이지를 즐겨찾기에 추가",
		"conditions": ["NH농협카드 응모 탭 이벤트입니다. 대상 카드와 제외 조건은 안내 이미지에 있습니다."],
		"exclusions": ["자세한 제외 업종은 카드사 안내 이미지를 확인하세요."],
		"startDate": "2026-09-21",
		"endDate": "2026-10-11",
		"applyUrl": "https://card.nonghyup.com/servlet/IpCb2002R.act?EVT_CRT_SQNO=6463"
	},
	{
		"id": "nh:6453",
		"issuer": "nh",
		"listUrl": "https://card.nonghyup.com/IPCC010001.menu",
		"title": "떴다 떴어! 가을맞이 상품권 이벤트! 추석 보름달에게 소원을 말해봐~",
		"summary": "진행중인 이벤트 이 페이지를 즐겨찾기에 추가",
		"benefit": "진행중인 이벤트 이 페이지를 즐겨찾기에 추가",
		"conditions": ["NH농협카드 응모 탭 이벤트입니다. 대상 카드와 제외 조건은 안내 이미지에 있습니다."],
		"exclusions": ["자세한 제외 업종은 카드사 안내 이미지를 확인하세요."],
		"startDate": "2026-09-14",
		"endDate": "2026-10-16",
		"applyUrl": "https://card.nonghyup.com/servlet/IpCb2002R.act?EVT_CRT_SQNO=6453"
	},
	{
		"id": "nh:6469",
		"issuer": "nh",
		"listUrl": "https://card.nonghyup.com/IPCC010001.menu",
		"title": "'서울시 신용카드동반성장상품권' 지급 이벤트 최대 5만원 페이백!",
		"summary": "진행중인 이벤트 이 페이지를 즐겨찾기에 추가",
		"benefit": "진행중인 이벤트 이 페이지를 즐겨찾기에 추가",
		"conditions": ["'서울시 신용카드동반성장상품권' 지급 이벤트 최대 5만원 페이백!"],
		"exclusions": ["자세한 제외 업종은 카드사 안내 이미지를 확인하세요."],
		"startDate": "2026-09-21",
		"endDate": "2026-10-18",
		"applyUrl": "https://card.nonghyup.com/servlet/IpCb2002R.act?EVT_CRT_SQNO=6469"
	},
	{
		"id": "nh:6400",
		"issuer": "nh",
		"listUrl": "https://card.nonghyup.com/IPCC010001.menu",
		"title": "[NH농협카드 X 롯데시네마] 롯데시네마 할인 예매하고 메가커피 받자!",
		"summary": "진행중인 이벤트 이 페이지를 즐겨찾기에 추가",
		"benefit": "진행중인 이벤트 이 페이지를 즐겨찾기에 추가",
		"conditions": ["[NH농협카드 X 롯데시네마] 롯데시네마 할인 예매하고 메가커피 받자!"],
		"exclusions": ["자세한 제외 업종은 카드사 안내 이미지를 확인하세요."],
		"startDate": "2026-09-01",
		"endDate": "2026-10-31",
		"applyUrl": "https://card.nonghyup.com/servlet/IpCb2002R.act?EVT_CRT_SQNO=6400"
	},
	{
		"id": "nh:6498",
		"issuer": "nh",
		"listUrl": "https://card.nonghyup.com/IPCC010001.menu",
		"title": "착한가격업소 착 붙는 혜택 왔소!",
		"summary": "진행중인 이벤트 이 페이지를 즐겨찾기에 추가",
		"benefit": "진행중인 이벤트 이 페이지를 즐겨찾기에 추가",
		"conditions": ["NH농협카드 응모 탭 이벤트입니다. 대상 카드와 제외 조건은 안내 이미지에 있습니다."],
		"exclusions": ["자세한 제외 업종은 카드사 안내 이미지를 확인하세요."],
		"startDate": "2026-10-01",
		"endDate": "2026-10-31",
		"applyUrl": "https://card.nonghyup.com/servlet/IpCb2002R.act?EVT_CRT_SQNO=6498"
	},
	{
		"id": "nh:6499",
		"issuer": "nh",
		"listUrl": "https://card.nonghyup.com/IPCC010001.menu",
		"title": "NH농협카드 쓰고 최대 14만5천원 캐시백 받자!",
		"summary": "진행중인 이벤트 이 페이지를 즐겨찾기에 추가",
		"benefit": "진행중인 이벤트 이 페이지를 즐겨찾기에 추가",
		"conditions": ["NH농협카드 쓰고 최대 14만5천원 캐시백 받자!"],
		"exclusions": ["자세한 제외 업종은 카드사 안내 이미지를 확인하세요."],
		"startDate": "2026-10-01",
		"endDate": "2026-10-31",
		"applyUrl": "https://card.nonghyup.com/servlet/IpCb2002R.act?EVT_CRT_SQNO=6499"
	},
	{
		"id": "nh:6472",
		"issuer": "nh",
		"listUrl": "https://card.nonghyup.com/IPCC010001.menu",
		"title": "관리비/휴대폰/가스/전기/4대보험 최대 35,000원 혜택!",
		"summary": "진행중인 이벤트 이 페이지를 즐겨찾기에 추가",
		"benefit": "진행중인 이벤트 이 페이지를 즐겨찾기에 추가",
		"conditions": ["NH농협카드 응모 탭 이벤트입니다. 대상 카드와 제외 조건은 안내 이미지에 있습니다."],
		"exclusions": ["자세한 제외 업종은 카드사 안내 이미지를 확인하세요."],
		"startDate": "2026-10-01",
		"endDate": "2026-10-31",
		"applyUrl": "https://card.nonghyup.com/servlet/IpCb2002R.act?EVT_CRT_SQNO=6472"
	},
	{
		"id": "nh:6473",
		"issuer": "nh",
		"listUrl": "https://card.nonghyup.com/IPCC010001.menu",
		"title": "넷플릭스 / 티빙 / 디즈니+ 구독 최대 5만원 캐시백!",
		"summary": "진행중인 이벤트 이 페이지를 즐겨찾기에 추가",
		"benefit": "진행중인 이벤트 이 페이지를 즐겨찾기에 추가",
		"conditions": ["NH농협카드 응모 탭 이벤트입니다. 대상 카드와 제외 조건은 안내 이미지에 있습니다."],
		"exclusions": ["자세한 제외 업종은 카드사 안내 이미지를 확인하세요."],
		"startDate": "2026-10-01",
		"endDate": "2026-10-31",
		"applyUrl": "https://card.nonghyup.com/servlet/IpCb2002R.act?EVT_CRT_SQNO=6473"
	},
	{
		"id": "nh:6474",
		"issuer": "nh",
		"listUrl": "https://card.nonghyup.com/IPCC010001.menu",
		"title": "쿠팡와우/네이버+멤버십 구독 첫 구독료 캐시백!",
		"summary": "진행중인 이벤트 이 페이지를 즐겨찾기에 추가",
		"benefit": "진행중인 이벤트 이 페이지를 즐겨찾기에 추가",
		"conditions": ["NH농협카드 응모 탭 이벤트입니다. 대상 카드와 제외 조건은 안내 이미지에 있습니다."],
		"exclusions": ["자세한 제외 업종은 카드사 안내 이미지를 확인하세요."],
		"startDate": "2026-10-01",
		"endDate": "2026-10-31",
		"applyUrl": "https://card.nonghyup.com/servlet/IpCb2002R.act?EVT_CRT_SQNO=6474"
	},
	{
		"id": "nh:6488",
		"issuer": "nh",
		"listUrl": "https://card.nonghyup.com/IPCC010001.menu",
		"title": "NH pay가 처음이라면, 메가MGC커피를 드립니다!",
		"summary": "진행중인 이벤트 이 페이지를 즐겨찾기에 추가",
		"benefit": "진행중인 이벤트 이 페이지를 즐겨찾기에 추가",
		"conditions": ["NH농협카드 응모 탭 이벤트입니다. 대상 카드와 제외 조건은 안내 이미지에 있습니다."],
		"exclusions": ["자세한 제외 업종은 카드사 안내 이미지를 확인하세요."],
		"startDate": "2026-10-01",
		"endDate": "2026-10-31",
		"applyUrl": "https://card.nonghyup.com/servlet/IpCb2002R.act?EVT_CRT_SQNO=6488"
	},
	{
		"id": "nh:6491",
		"issuer": "nh",
		"listUrl": "https://card.nonghyup.com/IPCC010001.menu",
		"title": "카톡 혜택 알림 받고, 경품에 커피 쿠폰까지~",
		"summary": "진행중인 이벤트 이 페이지를 즐겨찾기에 추가",
		"benefit": "진행중인 이벤트 이 페이지를 즐겨찾기에 추가",
		"conditions": ["NH농협카드 응모 탭 이벤트입니다. 대상 카드와 제외 조건은 안내 이미지에 있습니다."],
		"exclusions": ["자세한 제외 업종은 카드사 안내 이미지를 확인하세요."],
		"startDate": "2026-09-30",
		"endDate": "2026-10-31",
		"applyUrl": "https://card.nonghyup.com/servlet/IpCb2002R.act?EVT_CRT_SQNO=6491"
	},
	{
		"id": "nh:6521",
		"issuer": "nh",
		"listUrl": "https://card.nonghyup.com/IPCC010001.menu",
		"title": "zgm러닝카드 출시 기념 모바일상품권 이벤트",
		"summary": "진행중인 이벤트 이 페이지를 즐겨찾기에 추가",
		"benefit": "진행중인 이벤트 이 페이지를 즐겨찾기에 추가",
		"conditions": ["zgm러닝카드 출시 기념 모바일상품권 이벤트"],
		"exclusions": ["자세한 제외 업종은 카드사 안내 이미지를 확인하세요."],
		"startDate": "2026-10-01",
		"endDate": "2026-11-30",
		"applyUrl": "https://card.nonghyup.com/servlet/IpCb2002R.act?EVT_CRT_SQNO=6521"
	},
	{
		"id": "bc:2026100004",
		"issuer": "bc",
		"listUrl": "https://web.paybooc.co.kr/web/evnt/main",
		"title": "쇼핑적립 쿠팡 쿠팡 최대 2.5%적립 최대 3천원 추가적립",
		"summary": "쇼핑적립 쿠팡 쿠팡 최대 2.5%적립 최대 3천원 추가적립",
		"benefit": "쇼핑적립 쿠팡 쿠팡 최대 2.5%적립 최대 3천원 추가적립",
		"conditions": ["페이북이 로그인·비로그인 응모형으로 분류한 이벤트입니다."],
		"exclusions": [],
		"startDate": "2026-10-06",
		"endDate": "2026-10-31",
		"applyUrl": "https://web.paybooc.co.kr/web/evnt/evnt-dts?pybcUnifEvntNo=2026100004"
	},
	{
		"id": "bc:2026090040",
		"issuer": "bc",
		"listUrl": "https://web.paybooc.co.kr/web/evnt/main",
		"title": "커피패스 이벤트 2,900원에 2만원 커피쿠폰 받기",
		"summary": "커피패스 이벤트 2,900원에 2만원 커피쿠폰 받기",
		"benefit": "커피패스 이벤트 2,900원에 2만원 커피쿠폰 받기",
		"conditions": ["페이북이 로그인·비로그인 응모형으로 분류한 이벤트입니다."],
		"exclusions": [],
		"startDate": "2026-10-06",
		"endDate": "2026-10-31",
		"applyUrl": "https://web.paybooc.co.kr/web/evnt/evnt-dts?pybcUnifEvntNo=2026090040"
	},
	{
		"id": "bc:2026090065",
		"issuer": "bc",
		"listUrl": "https://web.paybooc.co.kr/web/evnt/main",
		"title": "할인 찬스 쿠팡•네이버페이 등 10월 마이태그 혜택",
		"summary": "※ 각 행사별 세부 사항 및 일정은 10월 마이태그 혜택보기를 접속하여 확인바랍니다.",
		"benefit": "※ 각 행사별 세부 사항 및 일정은 10월 마이태그 혜택보기를 접속하여 확인바랍니다.",
		"conditions": [
			"BC 및 제휴사의 개인(신용•체크) 카드",
			"페이북 앱 마이태그 화면에서 원하는 혜택을 태그하면 자동으로 고객님 명의의 BC카드에 혜택이 태그되는 맞춤형 마케팅 서비스예요.",
			"실적제한 없이, 신용•체크 제한 없이 카드 혜택에 추가로 더 받는 혜택이에요.",
			"혜택 조건에 맞게 가맹점에서 결제",
			"결제대금이 청구된 명세서에서 혜택 확인!"
		],
		"exclusions": ["※ 단, 법인•선불•기프트카드 제외", "※ 모바일ISP 결제 시 혜택 적용 불가"],
		"startDate": "2026-10-01",
		"endDate": "2026-10-31",
		"applyUrl": "https://web.paybooc.co.kr/web/evnt/evnt-dts?pybcUnifEvntNo=2026090065"
	},
	{
		"id": "bc:2026090037",
		"issuer": "bc",
		"listUrl": "https://web.paybooc.co.kr/web/evnt/main",
		"title": "BC바로 에어 마스터 카드 3천 마일리지 적립 최대 4.5만원 캐시백",
		"summary": "이벤트 기간 내 응모를 완료한 회원",
		"benefit": "이벤트 기간 내 응모를 완료한 회원",
		"conditions": [
			"이벤트 기간 내 응모를 완료한 회원",
			"이벤트 시작일로부터 6개월 이내(2026.04.01 ~ 2026.09.30) 모든 BC 바로 개인 신용카드 이용 및 탈회 이력이 없는 회원",
			"마케팅 전체항목 수신 동의 및 카드론 이용 동의를 완료하고 혜택 제공 시까지 유지한 회원",
			"카드 이용기간 종료 후 2개월 이내(2027년 1월말 예정)",
			"이벤트 기간 내 하단 ‘응모하기' 를 통해 이벤트 응모"
		],
		"exclusions": [
			"혜택 제공 및 제외 대상, 국내 일시불•할부 이용액 제외 가맹점 등 이벤트 유의사항을 꼭 확인해주세요.",
			"직전 6개월(2026.04.01 ~ 2026.09.30) 내 약정 해지 후 재가입한 경우, 기존 약정 해지 후 재가입한 경우 제외",
			"BC 바로카드의 다른 무실적 회원 대상 이벤트 및 연회비 캐시백 혜택과 중복 제공은 불가하며, 타 이벤트와 중복 응모시 최초 응모한 이벤트를 기준으로 혜택이 제공됩니다.",
			"※ 응모 완료시 취소 불가"
		],
		"startDate": "2026-10-01",
		"endDate": "2026-10-31",
		"applyUrl": "https://web.paybooc.co.kr/web/evnt/evnt-dts?pybcUnifEvntNo=2026090037"
	},
	{
		"id": "bc:2026090009",
		"issuer": "bc",
		"listUrl": "https://web.paybooc.co.kr/web/evnt/main",
		"title": "여수 미식여행 여수지역 일반음식점 마이태그 할인",
		"summary": "※ 법인•기프트•지역화폐 카드 제외",
		"benefit": "※ 법인•기프트•지역화폐 카드 제외",
		"conditions": [
			"BC 개인 신용•체크 카드",
			"마이태그 후 광주은행 BC카드로 2만원 이상 결제 시 3천원 결제일 할인",
			"※ 행사 기간 내 1인 1회",
			"※ [대상가맹점 보기]에 업로드 된 가맹점에서 이용시 혜택 적용",
			"마이태그 후 이용안내의 대상가맹점 목록에 있는 가맹점에서 이용하는 건에 대해 혜택 적용됩니다"
		],
		"exclusions": [
			"※ 법인•기프트•지역화폐 카드 제외",
			"※ 대상 가맹점 : 여수지역 일반, 휴게 음식점(테이블오더 및 배달앱, 홈페이지등 온라인 가맹점 제외)",
			"최종 카드 결제 금액이 2만원 이상이어야 혜택이 적용됩니다.(쿠폰•포인트•페이북머니 충전 후 결제한 금액 제외)",
			"기간 내 개별 결제 건에 혜택이 적용됩니다. (결제 금액 합산 적용 불가)"
		],
		"startDate": "2026-09-04",
		"endDate": "2026-11-04",
		"applyUrl": "https://web.paybooc.co.kr/web/evnt/evnt-dts?pybcUnifEvntNo=2026090009"
	},
	{
		"id": "bc:2026090046",
		"issuer": "bc",
		"listUrl": "https://web.paybooc.co.kr/web/evnt/main",
		"title": "라이프패스 이벤트 16,000원 할인쿠폰 특가 이벤트",
		"summary": "라이프패스 이벤트 16,000원 할인쿠폰 특가 이벤트",
		"benefit": "라이프패스 이벤트 16,000원 할인쿠폰 특가 이벤트",
		"conditions": ["페이북이 로그인·비로그인 응모형으로 분류한 이벤트입니다."],
		"exclusions": [],
		"startDate": "2026-10-01",
		"endDate": "2026-12-31",
		"applyUrl": "https://web.paybooc.co.kr/web/evnt/evnt-dts?pybcUnifEvntNo=2026090046"
	},
	{
		"id": "bc:2026040041",
		"issuer": "bc",
		"listUrl": "https://web.paybooc.co.kr/web/evnt/main",
		"title": "페이북 머니 결제 혜택 어디서든 0.5% 적립 많이 쓰면 1% 적립",
		"summary": "페이북 머니 결제 혜택 어디서든 0.5% 적립 많이 쓰면 1% 적립",
		"benefit": "페이북 머니 결제 혜택 어디서든 0.5% 적립 많이 쓰면 1% 적립",
		"conditions": ["페이북이 로그인·비로그인 응모형으로 분류한 이벤트입니다."],
		"exclusions": [],
		"startDate": "2026-04-30",
		"endDate": "2026-12-31",
		"applyUrl": "https://web.paybooc.co.kr/web/evnt/evnt-dts?pybcUnifEvntNo=2026040041"
	},
	{
		"id": "bc:2025110033",
		"issuer": "bc",
		"listUrl": "https://web.paybooc.co.kr/web/evnt/main",
		"title": "26년 GOAT카드 해외 온•오프라인 결제 기본3%+추가3% 적립",
		"summary": "전월 실적이 없어도 GOAT 카드로 해외 온•오프라인 구분없이 결제 시, 3% 추가 적립",
		"benefit": "전월 실적이 없어도 GOAT 카드로 해외 온•오프라인 구분없이 결제 시, 3% 추가 적립",
		"conditions": [
			"전월 실적이 없어도 GOAT 카드로 해외 온•오프라인 구분없이 결제 시, 3% 추가 적립",
			"※ 월 최대 한도 3만원 (3개월 단위 최대 9만원), 실적 조건 없음",
			"※ 2025년 4~12월 이벤트와 별도 응모임",
			"GOAT BC 바로카드",
			"전월실적, 적립한도 없이 페이북 머니 적립"
		],
		"exclusions": [
			"※ 해외 이용액은 해외이용수수료를 제외한 외화 청구 금액 기준",
			"- 응모 이전 이용내역에 대해서는 별도 적용 불가합니다.",
			"이벤트 혜택 제공 제외 대상",
			"이벤트 대상 미충족 또는 유의사항 미확인 등의 사유로 혜택 예외 제공은 불가합니다."
		],
		"startDate": "2025-12-12",
		"endDate": "2026-12-31",
		"applyUrl": "https://web.paybooc.co.kr/web/evnt/evnt-dts?pybcUnifEvntNo=2025110033"
	},
	{
		"id": "bc:2026020003",
		"issuer": "bc",
		"listUrl": "https://web.paybooc.co.kr/web/evnt/main",
		"title": "BC유니온페이 카드결제 시 일본 가맹점 쿠폰 할인",
		"summary": "BC유니온페이 카드결제 시 일본 가맹점 쿠폰 할인",
		"benefit": "BC유니온페이 카드결제 시 일본 가맹점 쿠폰 할인",
		"conditions": ["페이북이 로그인·비로그인 응모형으로 분류한 이벤트입니다."],
		"exclusions": [],
		"startDate": "2026-02-13",
		"endDate": "2027-12-31",
		"applyUrl": "https://web.paybooc.co.kr/web/evnt/evnt-dts?pybcUnifEvntNo=2026020003"
	},
	{
		"id": "bc:2026090054",
		"issuer": "bc",
		"listUrl": "https://web.paybooc.co.kr/web/evnt/main",
		"title": "10월 한정 이벤트 페이북카드 최대 27만원 혜택",
		"summary": "10월 한정 이벤트 페이북카드 최대 27만원 혜택",
		"benefit": "10월 한정 이벤트 페이북카드 최대 27만원 혜택",
		"conditions": ["페이북이 로그인·비로그인 응모형으로 분류한 이벤트입니다."],
		"exclusions": [],
		"startDate": "2026-10-01",
		"endDate": "2026-10-31",
		"applyUrl": "https://web.paybooc.co.kr/web/evnt/evnt-dts?pybcUnifEvntNo=2026090054"
	},
	{
		"id": "bc:2026090036",
		"issuer": "bc",
		"listUrl": "https://web.paybooc.co.kr/web/evnt/main",
		"title": "바로카드 연회비 이벤트 K-패스 카드 연회비100%결제일할인",
		"summary": "바로카드 연회비 이벤트 K-패스 카드 연회비100%결제일할인",
		"benefit": "바로카드 연회비 이벤트 K-패스 카드 연회비100%결제일할인",
		"conditions": ["페이북이 로그인·비로그인 응모형으로 분류한 이벤트입니다."],
		"exclusions": [],
		"startDate": "2026-10-01",
		"endDate": "2026-10-31",
		"applyUrl": "https://web.paybooc.co.kr/web/evnt/evnt-dts?pybcUnifEvntNo=2026090036"
	},
	{
		"id": "bc:2026090002",
		"issuer": "bc",
		"listUrl": "https://web.paybooc.co.kr/web/evnt/main",
		"title": "BC바로카드 금융서비스 동의하고 아이스 아메리카노 받기",
		"summary": "BC바로카드 금융서비스 동의하고 아이스 아메리카노 받기",
		"benefit": "BC바로카드 금융서비스 동의하고 아이스 아메리카노 받기",
		"conditions": ["페이북이 로그인·비로그인 응모형으로 분류한 이벤트입니다."],
		"exclusions": [],
		"startDate": "2026-09-18",
		"endDate": "2026-10-31",
		"applyUrl": "https://web.paybooc.co.kr/web/evnt/evnt-dts?pybcUnifEvntNo=2026090002"
	},
	{
		"id": "bc:2026080025",
		"issuer": "bc",
		"listUrl": "https://web.paybooc.co.kr/web/evnt/main",
		"title": "밀리의서재 1+1 혜택에 첫달 20% 할인까지",
		"summary": "밀리의서재 1+1 혜택에 첫달 20% 할인까지",
		"benefit": "밀리의서재 1+1 혜택에 첫달 20% 할인까지",
		"conditions": ["페이북이 로그인·비로그인 응모형으로 분류한 이벤트입니다."],
		"exclusions": [],
		"startDate": "2026-09-01",
		"endDate": "2026-10-31",
		"applyUrl": "https://web.paybooc.co.kr/web/evnt/evnt-dts?pybcUnifEvntNo=2026080025"
	},
	{
		"id": "bc:2026050007",
		"issuer": "bc",
		"listUrl": "https://web.paybooc.co.kr/web/evnt/main",
		"title": "해외 여행 꿀팁 최대 10만원 혜택 이거 하나로 해결",
		"summary": "해외 여행 꿀팁 최대 10만원 혜택 이거 하나로 해결",
		"benefit": "해외 여행 꿀팁 최대 10만원 혜택 이거 하나로 해결",
		"conditions": ["페이북이 로그인·비로그인 응모형으로 분류한 이벤트입니다."],
		"exclusions": [],
		"startDate": "2026-05-18",
		"endDate": "2026-10-31",
		"applyUrl": "https://web.paybooc.co.kr/web/evnt/evnt-dts?pybcUnifEvntNo=2026050007"
	},
	{
		"id": "bc:2025030014",
		"issuer": "bc",
		"listUrl": "https://web.paybooc.co.kr/web/evnt/main",
		"title": "KT SUPER DC 카드 KT 통신요금 월 최대 2.2만원할인",
		"summary": "KT SUPER DC 카드 KT 통신요금 월 최대 2.2만원할인",
		"benefit": "KT SUPER DC 카드 KT 통신요금 월 최대 2.2만원할인",
		"conditions": ["페이북이 로그인·비로그인 응모형으로 분류한 이벤트입니다."],
		"exclusions": [],
		"startDate": "2025-04-01",
		"endDate": "2026-10-31",
		"applyUrl": "https://web.paybooc.co.kr/web/evnt/evnt-dts?pybcUnifEvntNo=2025030014"
	},
	{
		"id": "bc:2024050010",
		"issuer": "bc",
		"listUrl": "https://web.paybooc.co.kr/web/evnt/main",
		"title": "KT 마이알뜰폰 카드 KT 알뜰폰 통신요금 24개월동안 추가 할인",
		"summary": "KT 마이알뜰폰 카드 KT 알뜰폰 통신요금 24개월동안 추가 할인",
		"benefit": "KT 마이알뜰폰 카드 KT 알뜰폰 통신요금 24개월동안 추가 할인",
		"conditions": ["페이북이 로그인·비로그인 응모형으로 분류한 이벤트입니다."],
		"exclusions": [],
		"startDate": "2024-10-01",
		"endDate": "2026-10-31",
		"applyUrl": "https://web.paybooc.co.kr/web/evnt/evnt-dts?pybcUnifEvntNo=2024050010"
	},
	{
		"id": "ibk:103578",
		"issuer": "ibk",
		"listUrl": "https://www.ibk.co.kr/event/ingListEvent.ibk?pageId=CM01060100&evnt_dscd=H",
		"title": "IBK유니온페이카드 「’일’단 사고 ‘본’다! 마케팅」 안내",
		"summary": "고객센터 1588-2588 , 해외 +82-31-888-8000",
		"benefit": "고객센터 1588-2588 , 해외 +82-31-888-8000",
		"conditions": ["IBK 카드 행사 화면에서 신청 또는 쿠폰을 받아야 혜택이 적용됩니다."],
		"exclusions": [],
		"startDate": "2026-02-20",
		"endDate": "2026-12-31",
		"applyUrl": "https://www.ibk.co.kr/event/ingDetailEvent.ibk?evnt_srno=103578&evnt_dscd=H&pageId=CM01060100"
	},
	{
		"id": "ibk:103628",
		"issuer": "ibk",
		"listUrl": "https://www.ibk.co.kr/event/ingListEvent.ibk?pageId=CM01060100&evnt_dscd=H",
		"title": "IBK유니온페이카드 해외가맹점 10% 즉시할인",
		"summary": "고객센터 1588-2588 , 해외 +82-31-888-8000",
		"benefit": "고객센터 1588-2588 , 해외 +82-31-888-8000",
		"conditions": [
			"IBK유니온페이카드 해외 오프라인 최대 10%즉시할인!UPI카드 10개국 오프라인점 최대 10%할인!이벤트 기간 2026.7.20.(월)~2027.1.31.(월)※예산소진 시 조기종료 대상 IBK 유니온페이 브랜드 개인 신용",
			"추천카드 일상의 기쁨카드 연회비 해외(UPI)10,000원 해외(VISA)12,000원 일년의 설렘카드 연회비 해외(UPI)10,000원 해외(VISA)12,000원",
			"사전 신청하기를 통한 사전 등록 고객에 한해 할인 혜택 제공됩니다.(IBK에서 발급받으신 카드 등록 후 등록 완료 화면에서"
		],
		"exclusions": ["예산 소진 시 조기 종료 가능 합니다."],
		"startDate": "2026-08-10",
		"endDate": "2027-01-31",
		"applyUrl": "https://www.ibk.co.kr/event/ingDetailEvent.ibk?evnt_srno=103628&evnt_dscd=H&pageId=CM01060100"
	}
];
var EXTRA_REPORT = [
	{
		"id": "samsung",
		"ok": true,
		"message": "진행 목록에서 마감이 가까운 18건을 읽고 응모 6건만 남겼습니다.",
		"count": 6
	},
	{
		"id": "lotte",
		"ok": true,
		"message": "진행 27건 중 14건을 확인했고 응모 3건입니다.",
		"count": 3
	},
	{
		"id": "hana",
		"ok": true,
		"message": "진행 17건 중 12건을 확인했고 응모 2건입니다.",
		"count": 2
	},
	{
		"id": "nh",
		"ok": true,
		"message": "응모 탭에서 진행 12건을 가져왔습니다. 조건 일부가 이미지라 카드사 화면을 함께 보세요.",
		"count": 12
	},
	{
		"id": "bc",
		"ok": true,
		"message": "페이북 진행 목록에서 응모·마이태그 16건을 남겼습니다. BC 홈은 여기로 연결됩니다.",
		"count": 16
	},
	{
		"id": "ibk",
		"ok": true,
		"message": "카드 행사 8건 중 신청·응모 2건입니다. 예금·청약 행사는 뺐습니다.",
		"count": 2
	}
];
var QUIET = {
	samsung: "삼성카드 목록을 이번엔 열지 못했습니다. 삼성카드 이벤트 페이지로 바로 갈 수 있습니다.",
	lotte: "롯데카드 목록을 이번엔 열지 못했습니다.",
	hana: "하나카드 목록을 이번엔 열지 못했습니다.",
	nh: "NH농협카드 응모 탭을 이번엔 열지 못했습니다.",
	bc: "BC·페이북 목록을 이번엔 열지 못했습니다.",
	ibk: "IBK 카드 행사 목록을 이번엔 열지 못했습니다.",
	kakaobank: "카카오뱅크 이벤트는 앱에서 열리는 경우가 많습니다. 목록이 비면 앱으로 이동하세요.",
	tossbank: "토스뱅크 이벤트는 앱 안 행사가 많습니다. 목록이 비면 앱으로 이동하세요."
};
function asList(value) {
	try {
		const parsed = JSON.parse(value);
		return Array.isArray(parsed) ? parsed.filter((item) => typeof item === "string") : [];
	} catch {
		return [];
	}
}
function toEvent(row) {
	return {
		id: row.id,
		issuer: row.issuer,
		title: row.title,
		summary: row.summary,
		benefit: row.benefit,
		conditions: asList(row.conditions),
		exclusions: asList(row.exclusions),
		startDate: row.start_date,
		endDate: row.end_date,
		applyUrl: row.apply_url,
		listUrl: row.list_url,
		entry: row.entry !== false
	};
}
function fullReport(partial, counts) {
	return ISSUERS.map((issuer) => {
		const hit = partial.find((item) => item.id === issuer.id);
		const count = counts.get(issuer.id) ?? hit?.count ?? 0;
		if (hit) return {
			id: issuer.id,
			name: issuer.name,
			listUrl: issuer.listUrl,
			count,
			ok: hit.ok,
			message: hit.message
		};
		return {
			id: issuer.id,
			name: issuer.name,
			listUrl: issuer.listUrl,
			count,
			ok: false,
			message: QUIET[issuer.id] ?? "이번 수집에서 응모·쿠폰·추첨 이벤트를 찾지 못했습니다."
		};
	});
}
async function insertEvents(events, collectedAt) {
	const sql = await getSql();
	for (const event of events) await sql`
      insert into entry_events (
        id, issuer, title, summary, benefit, conditions, exclusions,
        start_date, end_date, apply_url, list_url, active, collected_at, entry
      ) values (
        ${event.id}, ${event.issuer}, ${event.title}, ${event.summary}, ${event.benefit},
        ${JSON.stringify(event.conditions)}, ${JSON.stringify(event.exclusions)},
        ${event.startDate}, ${event.endDate}, ${event.applyUrl}, ${event.listUrl},
        true, ${collectedAt}, ${event.entry !== false}
      )
      on conflict (id) do nothing
    `;
}
async function seedIfEmpty() {
	const sql = await getSql();
	if ((await sql`select id from collect_state where id = 1`).length > 0) return;
	await insertEvents(SNAPSHOT_EVENTS, SNAPSHOT_AT);
	await sql`
    insert into collect_state (id, collected_at, report)
    values (1, ${SNAPSHOT_AT}, ${JSON.stringify(SNAPSHOT_REPORT)})
    on conflict (id) do nothing
  `;
}
async function backfillExtra() {
	const sql = await getSql();
	const counts = await sql`
    select issuer from entry_events where active = true group by issuer
  `;
	const have = new Set(counts.map((row) => row.issuer));
	const state = await sql`select report from collect_state where id = 1`;
	let prior = [];
	try {
		prior = JSON.parse(state[0]?.report ?? "[]");
	} catch {
		prior = [];
	}
	const reported = new Set(prior.filter((item) => item.ok).map((item) => item.id));
	const missingIssuers = new Set(EXTRA_EVENTS.map((event) => event.issuer).filter((issuer) => !have.has(issuer) && !reported.has(issuer)));
	if (missingIssuers.size === 0) return;
	await insertEvents(EXTRA_EVENTS.filter((event) => missingIssuers.has(event.issuer)), EXTRA_AT);
	const merged = prior.filter((item) => !missingIssuers.has(item.id));
	for (const report of EXTRA_REPORT) if (missingIssuers.has(report.id)) merged.push(report);
	await sql`
    insert into collect_state (id, collected_at, report)
    values (1, ${EXTRA_AT}, ${JSON.stringify(merged)})
    on conflict (id) do update set
      collected_at = excluded.collected_at,
      report = excluded.report
  `;
}
async function readBoard() {
	const sql = await getSql();
	const rows = await sql`
    select id, issuer, title, summary, benefit, conditions, exclusions,
           start_date::text as start_date, end_date::text as end_date,
           apply_url, list_url, entry
    from entry_events
    where active = true
    order by end_date asc, title asc
  `;
	const state = await sql`
    select collected_at::text as collected_at, report from collect_state where id = 1
  `;
	const events = rows.map(toEvent);
	const counts = /* @__PURE__ */ new Map();
	for (const event of events) counts.set(event.issuer, (counts.get(event.issuer) ?? 0) + 1);
	let partial = [];
	try {
		partial = JSON.parse(state[0]?.report ?? "[]");
	} catch {
		partial = [];
	}
	return {
		collectedAt: state[0]?.collected_at ?? (/* @__PURE__ */ new Date()).toISOString(),
		today: seoulToday(),
		events,
		issuers: fullReport(partial, counts)
	};
}
async function loadBoard() {
	await seedIfEmpty();
	await backfillExtra();
	return readBoard();
}
async function refreshBoard() {
	await seedIfEmpty();
	const sql = await getSql();
	const hits = await collectLive(seoulToday());
	const collectedAt = (/* @__PURE__ */ new Date()).toISOString();
	for (const hit of hits) {
		if (!hit.ok) continue;
		await sql`update entry_events set active = false where issuer = ${hit.issuer}`;
		for (const event of hit.events) await sql`
        insert into entry_events (
          id, issuer, title, summary, benefit, conditions, exclusions,
          start_date, end_date, apply_url, list_url, active, collected_at, entry
        ) values (
          ${event.id}, ${event.issuer}, ${event.title}, ${event.summary}, ${event.benefit},
          ${JSON.stringify(event.conditions)}, ${JSON.stringify(event.exclusions)},
          ${event.startDate}, ${event.endDate}, ${event.applyUrl}, ${event.listUrl},
          true, ${collectedAt}, ${event.entry !== false}
        )
        on conflict (id) do update set
          title = excluded.title,
          summary = excluded.summary,
          benefit = excluded.benefit,
          conditions = excluded.conditions,
          exclusions = excluded.exclusions,
          start_date = excluded.start_date,
          end_date = excluded.end_date,
          apply_url = excluded.apply_url,
          list_url = excluded.list_url,
          active = true,
          collected_at = excluded.collected_at,
          entry = excluded.entry
      `;
	}
	const previous = await sql`select report from collect_state where id = 1`;
	let prior = [];
	try {
		prior = JSON.parse(previous[0]?.report ?? "[]");
	} catch {
		prior = [];
	}
	const merged = [...prior.filter((item) => !hits.some((hit) => hit.issuer === item.id))];
	for (const hit of hits) merged.push({
		id: hit.issuer,
		ok: hit.ok,
		message: hit.ok ? hit.message : `${hit.message} 마지막 목록을 유지합니다.`,
		count: hit.ok ? hit.events.length : prior.find((item) => item.id === hit.issuer)?.count ?? 0
	});
	await sql`
    insert into collect_state (id, collected_at, report)
    values (1, ${collectedAt}, ${JSON.stringify(merged)})
    on conflict (id) do update set
      collected_at = excluded.collected_at,
      report = excluded.report
  `;
	return readBoard();
}
//#endregion
export { refreshBoard as a, loadBoard as i, MARKETS as n, issuerMeta as r, ISSUERS as t };
