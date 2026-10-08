import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { a as DialogPortal, i as DialogOverlay, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { t as ISSUERS } from "./types-CQCDGUHx.mjs";
import { a as ArrowUpRight, i as RefreshCw, r as Search, t as X } from "../_libs/lucide-react.mjs";
import { n as Route, r as reloadBoard } from "./router-BsnCDQ3p.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-C1r2gFpH.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Home() {
	const initial = Route.useLoaderData();
	const [board, setBoard] = (0, import_react.useState)(initial);
	const [issuer, setIssuer] = (0, import_react.useState)("all");
	const [sort, setSort] = (0, import_react.useState)("soon");
	const [query, setQuery] = (0, import_react.useState)("");
	const [openId, setOpenId] = (0, import_react.useState)(null);
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
	const open = board.events.find((event) => event.id === openId) ?? null;
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
		className: "mx-auto min-h-screen w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex flex-col gap-6 border-b border-line pb-6 sm:flex-row sm:items-end sm:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-w-xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-medium tracking-wide text-accent",
							children: "카드사 응모만"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "mt-2 text-balance text-4xl font-semibold tracking-tight",
							children: "응모만"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-pretty text-base leading-relaxed text-muted",
							children: "신한·삼성·현대·KB·롯데·우리·하나·NH·BC·IBK·카카오뱅크·토스뱅크 안에서, 버튼을 눌러 신청하는 이벤트만 골랐습니다. 실제 응모는 카드사 화면에서 합니다."
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
				className: "mt-4 text-sm text-muted",
				children: [visible.length, "건"]
			}),
			visible.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-8 rounded-3xl border border-dashed border-line bg-card px-5 py-10 text-center text-sm text-muted",
				children: "이 조건의 응모 이벤트가 없습니다. 다른 카드사를 보거나 아래 수집 현황에서 카드사로 이동하세요."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-4 grid gap-3 sm:grid-cols-2",
				children: visible.map((event) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "flex h-full flex-col rounded-3xl border border-line bg-card p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-medium text-muted",
								children: issuerName(event.issuer)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Deadline, {
								end: event.endDate,
								today: board.today
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-3 text-balance text-lg font-semibold leading-snug",
							children: event.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 line-clamp-3 text-pretty text-sm leading-relaxed text-muted",
							children: event.summary
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-4 text-sm tabular-nums text-ink",
							children: [
								formatDay(event.startDate),
								" – ",
								formatDay(event.endDate)
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-5 flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setOpenId(event.id),
								className: "inline-flex h-11 flex-1 items-center justify-center rounded-full border border-line text-sm font-medium",
								children: "응모 조건"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: event.applyUrl,
								target: "_blank",
								rel: "noreferrer",
								className: "inline-flex h-11 flex-1 items-center justify-center gap-1 rounded-full bg-accent text-sm font-medium text-accent-ink",
								children: ["응모하기", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "size-4" })]
							})]
						})
					]
				}) }, event.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-12 border-t border-line pt-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-lg font-semibold",
						children: "수집 현황"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted",
						children: "막힌 카드사는 마지막 목록을 유지하고, 응모는 항상 카드사로 넘어갑니다."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-4 divide-y divide-line rounded-3xl border border-line bg-card",
						children: board.issuers.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex flex-col gap-2 px-4 py-4 sm:flex-row sm:items-center sm:justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm font-medium",
								children: [item.name, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "ml-2 tabular-nums text-muted",
									children: [item.count, "건"]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm leading-relaxed text-muted",
								children: item.message
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: item.listUrl,
								target: "_blank",
								rel: "noreferrer",
								className: "inline-flex h-11 shrink-0 items-center gap-1 text-sm font-medium text-accent",
								children: ["카드사로", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "size-4" })]
							})]
						}, item.id))
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: open !== null,
				onOpenChange: (next) => !next && setOpenId(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, { className: "fixed inset-0 bg-ink/40" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, {
					className: "fixed inset-x-3 top-10 z-10 max-h-[80vh] overflow-y-auto rounded-3xl bg-card p-5 shadow-none sm:inset-x-auto sm:left-1/2 sm:w-full sm:max-w-lg sm:-translate-x-1/2",
					children: open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EventDetail, {
						event: open,
						today: board.today,
						onClose: () => setOpenId(null)
					}) : null
				})] })
			})
		]
	});
}
function EventDetail({ event, today, onClose }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-start justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
				className: "text-balance text-xl font-semibold",
				children: event.title
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, {
				className: "mt-2 text-sm text-muted",
				children: [
					issuerName(event.issuer),
					" · ",
					formatDay(event.startDate),
					" – ",
					formatDay(event.endDate)
				]
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: onClose,
				className: "inline-flex size-11 items-center justify-center",
				"aria-label": "닫기",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" })
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-3",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Deadline, {
				end: event.endDate,
				today
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-4 text-pretty text-sm leading-relaxed",
			children: event.summary
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
			className: "mt-6 text-sm font-semibold",
			children: "응모 조건"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-2 list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted",
			children: (event.conditions.length ? event.conditions : ["카드사 페이지의 조건을 확인하세요."]).map((line) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: line }, line))
		}),
		event.exclusions.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
			className: "mt-6 text-sm font-semibold",
			children: "제외·유의사항"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-2 list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted",
			children: event.exclusions.map((line) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: line }, line))
		})] }) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
			href: event.applyUrl,
			target: "_blank",
			rel: "noreferrer",
			className: "mt-6 inline-flex h-12 w-full items-center justify-center gap-1 rounded-full bg-accent text-sm font-medium text-accent-ink",
			children: [
				issuerName(event.issuer),
				"에서 응모",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "size-4" })
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-3 text-center text-sm text-muted",
			children: "혜택 지급과 대상 여부는 카드사 기준입니다."
		})
	] });
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
		className: days >= 0 && days <= 7 ? "rounded-full bg-accent px-2.5 py-1 text-xs font-medium tabular-nums text-accent-ink" : "rounded-full bg-paper px-2.5 py-1 text-xs font-medium tabular-nums text-muted",
		children: label
	});
}
function issuerName(id) {
	return ISSUERS.find((item) => item.id === id)?.name ?? id;
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
