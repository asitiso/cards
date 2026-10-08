import { n as TSS_SERVER_FUNCTION, t as createServerFn } from "./ssr.mjs";
import { a as refreshBoard, i as loadBoard } from "./store.server-B5M9eq0J.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/board.functions-bq3bx83O.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var getBoard_createServerFn_handler = createServerRpc({
	id: "8c14451dae457ac2e171179defe6369842c145c577862973196c2960056b5a59",
	name: "getBoard",
	filename: "src/lib/events/board.functions.ts"
}, (opts) => getBoard.__executeServer(opts));
var getBoard = createServerFn({ method: "GET" }).handler(getBoard_createServerFn_handler, async () => loadBoard());
var reloadBoard_createServerFn_handler = createServerRpc({
	id: "c20b50b61dfab16855048e96c1dbd7dab49bfa123c16e3c0754efa0768c00509",
	name: "reloadBoard",
	filename: "src/lib/events/board.functions.ts"
}, (opts) => reloadBoard.__executeServer(opts));
var reloadBoard = createServerFn({ method: "POST" }).handler(reloadBoard_createServerFn_handler, async () => refreshBoard());
//#endregion
export { getBoard_createServerFn_handler, reloadBoard_createServerFn_handler };
