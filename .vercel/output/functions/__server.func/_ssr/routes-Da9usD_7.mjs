import { o as __toESM } from "../_runtime.mjs";
import { b as require_jsx_runtime, q as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as MARKETS, r as issuerMeta, t as ISSUERS } from "./store.server-B5M9eq0J.mjs";
import { a as ArrowUpRight, i as ChevronDown, n as Search, r as RefreshCw } from "../_libs/lucide-react.mjs";
import { n as Route$1, r as reloadBoard } from "./router-ZLc4sc69.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-Da9usD_7.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* Open a company link in its app when the phone has it.
* `mode: "app"` (바로가기) falls back to that app's store page.
* `mode: "page"` (응모) falls back to the exact web page.
* Desktop always opens the web page.
*/
function openApply(webUrl, androidPackage, mode = "page", iosAppId) {
	if (/Android/i.test(navigator.userAgent) && androidPackage) {
		const play = `https://play.google.com/store/apps/details?id=${encodeURIComponent(androidPackage)}`;
		try {
			const url = new URL(webUrl);
			const fallback = encodeURIComponent(mode === "app" ? play : webUrl);
			const path = `${url.host}${url.pathname}${url.search}`;
			const scheme = url.protocol.replace(":", "") || "https";
			window.location.href = `intent://${path}#Intent;scheme=${scheme};package=${androidPackage};S.browser_fallback_url=${fallback};end`;
			return;
		} catch {
			if (mode === "app") {
				window.location.assign(play);
				return;
			}
		}
	}
	if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
		if (mode === "app" && iosAppId) {
			const store = `https://apps.apple.com/kr/app/id${iosAppId}`;
			const timer = window.setTimeout(() => {
				if (document.visibilityState === "visible") window.location.replace(store);
			}, 1600);
			document.addEventListener("visibilitychange", () => {
				if (document.hidden) window.clearTimeout(timer);
			}, { once: true });
			window.location.assign(webUrl);
			return;
		}
		window.location.assign(webUrl);
		return;
	}
	window.open(webUrl, "_blank", "noopener,noreferrer");
}
function Home() {
	const initial = Route$1.useLoaderData();
	const [board, setBoard] = (0, import_react.useState)(initial);
	const [market, setMarket] = (0, import_react.useState)("card");
	const [issuer, setIssuer] = (0, import_react.useState)("all");
	const [sort, setSort] = (0, import_react.useState)("soon");
	const [query, setQuery] = (0, import_react.useState)("");
	const [openIds, setOpenIds] = (0, import_react.useState)([]);
	const [pending, setPending] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)("");
	const visible = (0, import_react.useMemo)(() => {
		const q = query.trim().toLowerCase();
		return board.events.filter((event) => issuerMeta(event.issuer).market === market).filter((event) => issuer === "all" || event.issuer === issuer).filter((event) => {
			if (!q) return true;
			return [
				event.title,
				event.summary,
				event.benefit,
				issuerName(event.issuer),
				...event.conditions
			].join(" ").toLowerCase().includes(q);
		}).sort((a, b) => sort === "new" ? b.startDate.localeCompare(a.startDate) || a.endDate.localeCompare(b.endDate) : a.endDate.localeCompare(b.endDate) || a.title.localeCompare(b.title, "ko"));
	}, [
		board.events,
		issuer,
		market,
		query,
		sort
	]);
	function toggle(id) {
		setOpenIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto min-h-screen w-full max-w-5xl px-3 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-6 sm:py-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex items-center justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "shrink-0 text-2xl font-semibold tracking-tight",
					children: "ㅇㅁㅁㅇ"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex min-w-0 items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "min-w-0 truncate text-right text-[11px] tabular-nums leading-tight text-muted sm:text-xs",
						children: ["수집 ", formatWhen(board.collectedAt)]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => void refresh(),
						disabled: pending,
						className: "inline-flex h-8 shrink-0 items-center gap-1 rounded-full bg-ink px-3 text-xs font-medium text-paper disabled:opacity-60",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: pending ? "size-3.5 animate-spin" : "size-3.5" }), pending ? "수집 중" : "다시 수집"]
					})]
				})]
			}),
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-accent",
				children: error
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 grid grid-cols-3 gap-1 rounded-full border border-line bg-card p-0.5",
				role: "tablist",
				"aria-label": "종류",
				children: MARKETS.map((item) => {
					const count = board.events.filter((event) => issuerMeta(event.issuer).market === item.id).length;
					const active = market === item.id;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						role: "tab",
						"aria-selected": active,
						onClick: () => {
							setMarket(item.id);
							setIssuer("all");
						},
						className: active ? "h-8 rounded-full bg-ink text-xs font-medium text-paper sm:text-sm" : "h-8 rounded-full text-xs text-muted sm:text-sm",
						children: [
							item.label,
							" ",
							count
						]
					}, item.id);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2 flex items-center gap-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex h-8 min-w-0 flex-1 items-center gap-1.5 rounded-full border border-line bg-card px-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "size-3.5 shrink-0 text-muted" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: query,
						onChange: (event) => setQuery(event.target.value),
						placeholder: "혜택, 회사, 조건",
						className: "w-full bg-transparent text-base leading-none outline-none placeholder:text-muted sm:text-sm"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex h-8 shrink-0 rounded-full border border-line bg-card p-0.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SortButton, {
						active: sort === "soon",
						onClick: () => setSort("soon"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "sm:hidden",
							children: "마감"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "hidden sm:inline",
							children: "마감 임박"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SortButton, {
						active: sort === "new",
						onClick: () => setSort("new"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "sm:hidden",
							children: "최근"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "hidden sm:inline",
							children: "최근 시작"
						})]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "-mx-3 mt-2 flex gap-1.5 overflow-x-auto px-3 pb-0.5 sm:mx-0 sm:px-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Chip, {
					active: issuer === "all",
					onClick: () => setIssuer("all"),
					children: ["전체 ", board.events.filter((event) => issuerMeta(event.issuer).market === market).length]
				}), ISSUERS.filter((item) => item.market === market).map((item) => {
					const count = board.events.filter((event) => event.issuer === item.id).length;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Chip, {
						active: issuer === item.id,
						onClick: () => setIssuer(item.id),
						children: [
							item.short,
							" ",
							count
						]
					}, item.id);
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 text-xs text-muted",
				children: [visible.length, "건"]
			}),
			visible.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 rounded-2xl border border-dashed border-line bg-card px-4 py-6 text-center text-sm text-muted",
				children: "이 종류에서 응모·쿠폰·추첨 이벤트가 없습니다. 아래 회사 앱에서 확인하세요."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-1.5 overflow-hidden rounded-2xl border border-line bg-card",
				children: visible.map((event) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EventRow, {
					event,
					today: board.today,
					open: openIds.includes(event.id),
					onToggle: () => toggle(event.id)
				}, event.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-6 border-t border-line pt-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-sm font-semibold",
					children: "수집 현황"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-2 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-card",
					children: board.issuers.filter((item) => issuerMeta(item.id).market === market).map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center justify-between gap-3 px-3 py-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm font-medium leading-snug",
								children: [item.name, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "ml-2 font-normal tabular-nums text-muted",
									children: [item.count, "건"]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "truncate text-xs leading-snug text-muted",
								children: item.message
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: item.listUrl,
							onClick: (click) => {
								click.preventDefault();
								const meta = issuerMeta(item.id);
								openApply(item.listUrl, meta.androidPackage, "app", meta.iosAppId);
							},
							className: "inline-flex h-7 shrink-0 items-center gap-0.5 text-xs font-medium text-accent",
							children: ["바로가기", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "size-3.5" })]
						})]
					}, item.id))
				})]
			})
		]
	});
}
function EventRow({ event, today, open, onToggle }) {
	const panelId = `event-panel-${event.id.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
		className: "border-b border-line last:border-b-0",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "px-2.5 py-1.5 sm:hidden",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1.5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Deadline, {
							end: event.endDate,
							today
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[11px] font-medium text-muted",
							children: issuerShort(event.issuer)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-[11px] tabular-nums text-muted",
							children: ["~", formatDay(event.endDate).slice(5)]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: event.applyUrl,
							target: "_blank",
							rel: "noreferrer",
							onClick: (click) => {
								click.preventDefault();
								openApply(event.applyUrl, issuerMeta(event.issuer).androidPackage);
							},
							className: "ml-auto inline-flex h-6 shrink-0 items-center gap-0.5 rounded-full bg-accent px-2 text-[11px] font-medium text-accent-ink",
							children: ["응모", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "size-3" })]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: onToggle,
					"aria-expanded": open,
					"aria-controls": `${panelId}-m`,
					className: "mt-0.5 flex w-full items-start gap-1 text-left",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: open ? "min-w-0 flex-1 text-pretty text-[13px] font-semibold leading-snug" : "min-w-0 flex-1 line-clamp-2 text-[13px] font-medium leading-snug",
						children: event.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, {
						className: `mt-0.5 size-3.5 shrink-0 text-muted transition-transform ${open ? "rotate-180" : ""}`,
						"aria-hidden": true
					})]
				}),
				open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EventBody, {
					event,
					id: `${panelId}-m`
				}) : null
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "hidden sm:block",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: onToggle,
					"aria-expanded": open,
					"aria-controls": panelId,
					className: "flex min-h-9 min-w-0 flex-1 items-center gap-2 py-1 pl-3 text-left",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Deadline, {
							end: event.endDate,
							today
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "w-10 shrink-0 text-[11px] font-medium text-muted",
							children: issuerShort(event.issuer)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "min-w-0 flex-1 truncate text-sm font-medium",
							children: event.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "shrink-0 text-[11px] tabular-nums text-muted",
							children: [
								formatDay(event.startDate).slice(5),
								"–",
								formatDay(event.endDate).slice(5)
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, {
							className: `size-3.5 shrink-0 text-muted transition-transform ${open ? "rotate-180" : ""}`,
							"aria-hidden": true
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
					href: event.applyUrl,
					target: "_blank",
					rel: "noreferrer",
					onClick: (click) => {
						click.preventDefault();
						openApply(event.applyUrl, issuerMeta(event.issuer).androidPackage);
					},
					className: "mr-3 inline-flex h-6 shrink-0 items-center gap-0.5 rounded-full bg-accent px-2 text-[11px] font-medium text-accent-ink",
					children: ["응모", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "size-3" })]
				})]
			}), open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "border-t border-line",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EventBody, {
					event,
					id: panelId
				})
			}) : null]
		})]
	});
}
function EventBody({ event, id }) {
	const benefit = event.benefit && event.benefit !== event.summary && event.benefit !== event.title ? event.benefit : "";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		id,
		className: "mt-1.5 rounded-xl bg-paper px-2.5 py-2.5 sm:mt-0 sm:rounded-none sm:px-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "hidden text-pretty text-sm font-semibold leading-snug sm:block",
				children: event.title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-pretty text-sm leading-relaxed sm:mt-1",
				children: event.summary
			}),
			benefit ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm font-medium",
				children: benefit
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-1.5 text-xs tabular-nums text-muted",
				children: [
					issuerName(event.issuer),
					" · ",
					formatDay(event.startDate),
					" – ",
					formatDay(event.endDate)
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "mt-2 text-sm font-semibold",
				children: "응모 조건"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-1 list-disc space-y-0.5 pl-5 text-sm leading-relaxed text-muted",
				children: (event.conditions.length ? event.conditions : ["카드사 페이지의 조건을 확인하세요."]).map((line) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: line }, line))
			}),
			event.exclusions.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "mt-2 text-sm font-semibold",
				children: "제외·유의사항"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-1 list-disc space-y-0.5 pl-5 text-sm leading-relaxed text-muted",
				children: event.exclusions.map((line) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: line }, line))
			})] }) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
				href: event.applyUrl,
				target: "_blank",
				rel: "noreferrer",
				onClick: (click) => {
					click.preventDefault();
					openApply(event.applyUrl, issuerMeta(event.issuer).androidPackage);
				},
				className: "mt-2.5 inline-flex h-9 w-full items-center justify-center gap-1 rounded-full bg-accent px-4 text-sm font-medium text-accent-ink sm:w-auto",
				children: [
					issuerName(event.issuer),
					"에서 응모",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "size-4" })
				]
			})
		]
	});
}
function SortButton({ active, onClick, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		onClick,
		className: active ? "h-7 rounded-full bg-ink px-2.5 text-xs font-medium text-paper" : "h-7 rounded-full px-2.5 text-xs text-muted",
		children
	});
}
function Chip({ active, onClick, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		onClick,
		className: active ? "h-7 shrink-0 rounded-full bg-ink px-2.5 text-xs font-medium text-paper" : "h-7 shrink-0 rounded-full border border-line bg-card px-2.5 text-xs text-ink",
		children
	});
}
function Deadline({ end, today }) {
	const days = daysUntil(end, today);
	const label = days < 0 ? "종료" : days === 0 ? "오늘" : `D-${days}`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: days >= 0 && days <= 7 ? "inline-flex h-5 w-12 shrink-0 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-medium tabular-nums text-accent-ink" : "inline-flex h-5 w-12 shrink-0 items-center justify-center rounded-full bg-paper px-1 text-[10px] font-medium tabular-nums text-muted",
		children: label
	});
}
function issuerName(id) {
	return ISSUERS.find((item) => item.id === id)?.name ?? id;
}
function issuerShort(id) {
	return ISSUERS.find((item) => item.id === id)?.short ?? id;
}
function daysUntil(end, today) {
	const endMs = Date.parse(`${end}T00:00:00+09:00`);
	const todayMs = Date.parse(`${today}T00:00:00+09:00`);
	return Math.round((endMs - todayMs) / 864e5);
}
function formatDay(iso) {
	const [year, month, day] = iso.split("-");
	return `${year}.${month}.${day}`;
}
function formatWhen(iso) {
	const date = new Date(iso);
	if (Number.isNaN(date.getTime())) return iso;
	const parts = new Intl.DateTimeFormat("ko-KR", {
		timeZone: "Asia/Seoul",
		month: "numeric",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
		hourCycle: "h23"
	}).formatToParts(date);
	const get = (type) => parts.find((part) => part.type === type)?.value ?? "";
	return `${get("month")}.${get("day")} ${get("hour")}:${get("minute")}`;
}
//#endregion
export { Home as component };
