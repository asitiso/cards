import { o as __toESM } from "../_runtime.mjs";
import { b as require_jsx_runtime, q as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as ISSUERS } from "./types-CQCDGUHx.mjs";
import { a as ArrowUpRight, i as ChevronDown, n as Search, r as RefreshCw } from "../_libs/lucide-react.mjs";
import { n as Route, r as reloadBoard } from "./router-BQq9mKRQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DKbQE5Af.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Home() {
	const initial = Route.useLoaderData();
	const [board, setBoard] = (0, import_react.useState)(initial);
	const [issuer, setIssuer] = (0, import_react.useState)("all");
	const [sort, setSort] = (0, import_react.useState)("soon");
	const [query, setQuery] = (0, import_react.useState)("");
	const [openIds, setOpenIds] = (0, import_react.useState)([]);
	const [pending, setPending] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)("");
	const visible = (0, import_react.useMemo)(() => {
		const q = query.trim().toLowerCase();
		return board.events.filter((event) => issuer === "all" || event.issuer === issuer).filter((event) => {
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
		className: "mx-auto min-h-screen w-full max-w-5xl px-4 py-5 sm:px-6 sm:py-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex flex-col gap-4 border-b border-line pb-4 sm:flex-row sm:items-end sm:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-w-xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-medium tracking-wide text-accent",
							children: "카드사 응모만"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "mt-1 text-balance text-3xl font-semibold tracking-tight",
							children: "응모만"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-pretty text-sm leading-relaxed text-muted",
							children: "신한·삼성·현대·KB·롯데·우리·하나·NH·BC·IBK·카카오뱅크·토스뱅크 안에서, 버튼을 눌러 신청하는 이벤트만 골랐습니다. 행을 누르면 조건이 펼쳐지고, 응모는 카드사에서 합니다."
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-start gap-2 sm:items-end",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => void refresh(),
						disabled: pending,
						className: "inline-flex h-11 items-center gap-2 rounded-full bg-ink px-4 text-sm font-medium text-paper disabled:opacity-60",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: pending ? "size-4 animate-spin" : "size-4" }), pending ? "수집 중" : "다시 수집"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm tabular-nums text-muted",
						children: ["마지막 수집 ", formatWhen(board.collectedAt)]
					})]
				})]
			}),
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm text-accent",
				children: error
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 flex flex-col gap-3 sm:flex-row sm:items-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex h-11 flex-1 items-center gap-2 rounded-full border border-line bg-card px-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "size-4 text-muted" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: query,
						onChange: (event) => setQuery(event.target.value),
						placeholder: "혜택, 카드사, 조건 검색",
						className: "w-full bg-transparent text-sm outline-none placeholder:text-muted"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex h-11 rounded-full border border-line bg-card p-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortButton, {
						active: sort === "soon",
						onClick: () => setSort("soon"),
						children: "마감 임박"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortButton, {
						active: sort === "new",
						onClick: () => setSort("new"),
						children: "최근 시작"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex gap-2 overflow-x-auto pb-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Chip, {
					active: issuer === "all",
					onClick: () => setIssuer("all"),
					children: ["전체 ", board.events.length]
				}), ISSUERS.map((item) => {
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
				className: "mt-3 text-sm text-muted",
				children: [visible.length, "건 · 행을 눌러 접고 펼칩니다"]
			}),
			visible.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 rounded-2xl border border-dashed border-line bg-card px-5 py-8 text-center text-sm text-muted",
				children: "이 조건의 응모 이벤트가 없습니다. 다른 카드사를 보거나 아래 수집 현황에서 카드사로 이동하세요."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-2 overflow-hidden rounded-2xl border border-line bg-card",
				children: visible.map((event) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EventRow, {
					event,
					today: board.today,
					open: openIds.includes(event.id),
					onToggle: () => toggle(event.id)
				}, event.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-8 border-t border-line pt-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-base font-semibold",
						children: "수집 현황"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted",
						children: "막힌 카드사는 마지막 목록을 유지하고, 응모는 항상 카드사로 넘어갑니다."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-3 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-card",
						children: board.issuers.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-center justify-between gap-3 px-3 py-2 sm:px-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-sm font-medium leading-snug",
									children: [item.name, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "ml-2 font-normal tabular-nums text-muted",
										children: [item.count, "건"]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs leading-snug text-muted",
									children: item.message
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: item.listUrl,
								target: "_blank",
								rel: "noreferrer",
								className: "inline-flex h-9 shrink-0 items-center gap-0.5 text-sm font-medium text-accent",
								children: ["카드사로", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "size-4" })]
							})]
						}, item.id))
					})
				]
			})
		]
	});
}
function EventRow({ event, today, open, onToggle }) {
	const panelId = `event-panel-${event.id.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
	const benefit = event.benefit && event.benefit !== event.summary && event.benefit !== event.title ? event.benefit : "";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
		className: "border-b border-line last:border-b-0",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: onToggle,
				"aria-expanded": open,
				"aria-controls": panelId,
				className: "flex min-h-11 min-w-0 flex-1 items-center gap-2 py-1 pl-3 text-left sm:gap-3 sm:pl-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Deadline, {
						end: event.endDate,
						today
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "w-9 shrink-0 text-xs font-medium text-muted sm:w-12",
						children: issuerShort(event.issuer)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "min-w-0 flex-1 truncate text-sm font-medium",
						children: event.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "hidden shrink-0 text-xs tabular-nums text-muted sm:inline",
						children: [
							formatDay(event.startDate).slice(5),
							"–",
							formatDay(event.endDate).slice(5)
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, {
						className: `size-4 shrink-0 text-muted transition-transform ${open ? "rotate-180" : ""}`,
						"aria-hidden": true
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
				href: event.applyUrl,
				target: "_blank",
				rel: "noreferrer",
				className: "inline-flex h-11 shrink-0 items-center gap-0.5 pr-3 text-xs font-medium text-accent sm:pr-4",
				children: ["응모", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "size-3.5" })]
			})]
		}), open ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			id: panelId,
			className: "border-t border-line bg-paper px-3 py-3 sm:px-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-pretty text-sm font-semibold leading-snug",
					children: event.title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1.5 text-pretty text-sm leading-relaxed",
					children: event.summary
				}),
				benefit ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm font-medium text-ink",
					children: benefit
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 text-xs tabular-nums text-muted",
					children: [
						issuerName(event.issuer),
						" · ",
						formatDay(event.startDate),
						" – ",
						formatDay(event.endDate)
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "mt-3 text-sm font-semibold",
					children: "응모 조건"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-1 list-disc space-y-1 pl-5 text-sm leading-relaxed text-muted",
					children: (event.conditions.length ? event.conditions : ["카드사 페이지의 조건을 확인하세요."]).map((line) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: line }, line))
				}),
				event.exclusions.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "mt-3 text-sm font-semibold",
					children: "제외·유의사항"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-1 list-disc space-y-1 pl-5 text-sm leading-relaxed text-muted",
					children: event.exclusions.map((line) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: line }, line))
				})] }) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
					href: event.applyUrl,
					target: "_blank",
					rel: "noreferrer",
					className: "mt-3 inline-flex h-10 items-center gap-1 rounded-full bg-accent px-4 text-sm font-medium text-accent-ink",
					children: [
						issuerName(event.issuer),
						"에서 응모",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "size-4" })
					]
				})
			]
		}) : null]
	});
}
function SortButton({ active, onClick, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		onClick,
		className: active ? "h-9 rounded-full bg-ink px-3 text-sm font-medium text-paper" : "h-9 rounded-full px-3 text-sm text-muted",
		children
	});
}
function Chip({ active, onClick, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		onClick,
		className: active ? "h-11 shrink-0 rounded-full bg-ink px-4 text-sm font-medium text-paper" : "h-11 shrink-0 rounded-full border border-line bg-card px-4 text-sm text-ink",
		children
	});
}
function Deadline({ end, today }) {
	const days = daysUntil(end, today);
	const label = days < 0 ? "종료" : days === 0 ? "오늘 마감" : `D-${days}`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: days >= 0 && days <= 7 ? "inline-flex w-[4.75rem] shrink-0 justify-center rounded-full bg-accent px-1 py-0.5 text-xs font-medium tabular-nums text-accent-ink" : "inline-flex w-[4.75rem] shrink-0 justify-center rounded-full bg-paper px-1 py-0.5 text-xs font-medium tabular-nums text-muted",
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
	return new Intl.DateTimeFormat("ko-KR", {
		timeZone: "Asia/Seoul",
		month: "long",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit"
	}).format(date);
}
//#endregion
export { Home as component };
