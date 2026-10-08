import { t as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-A6pJPYTF.mjs";
import { a as refreshPharma, i as loadPharmaBoard, n as clearPharmaLogin, o as savePharmaLogin, r as deletePharmaCompany, s as updatePharmaCompany, t as addPharmaCompany } from "./store.server-DJOqlAdO.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/board.functions-BjvzHzky.js
var getPharmaBoard_createServerFn_handler = createServerRpc({
	id: "d9b8dddb359c15f8c53d67878b580806f69853d4a2ccd860aaa047e0f5f11613",
	name: "getPharmaBoard",
	filename: "src/lib/pharma/board.functions.ts"
}, (opts) => getPharmaBoard.__executeServer(opts));
var getPharmaBoard = createServerFn({ method: "GET" }).handler(getPharmaBoard_createServerFn_handler, async () => loadPharmaBoard());
var reloadPharma_createServerFn_handler = createServerRpc({
	id: "81384d28ddaa14716f0e0713e938a43bf7dc53d179fb28c7c6ee2c527fa36333",
	name: "reloadPharma",
	filename: "src/lib/pharma/board.functions.ts"
}, (opts) => reloadPharma.__executeServer(opts));
var reloadPharma = createServerFn({ method: "POST" }).validator((data) => ({ companyId: data?.companyId ?? "" })).handler(reloadPharma_createServerFn_handler, async ({ data }) => refreshPharma(data.companyId || void 0));
var storePharmaLogin_createServerFn_handler = createServerRpc({
	id: "b9abab0d616af06cc73f7f660d68ac8cf86ab98cb55e3578b9840f3c2eab6398",
	name: "storePharmaLogin",
	filename: "src/lib/pharma/board.functions.ts"
}, (opts) => storePharmaLogin.__executeServer(opts));
var storePharmaLogin = createServerFn({ method: "POST" }).validator((data) => ({
	companyId: String(data.companyId ?? ""),
	username: String(data.username ?? ""),
	password: String(data.password ?? "")
})).handler(storePharmaLogin_createServerFn_handler, async ({ data }) => savePharmaLogin(data.companyId, data.username, data.password));
var removePharmaLogin_createServerFn_handler = createServerRpc({
	id: "1aaab22452eef24edbc300560980af93ec4b7b7a683758d66a4f42c01107fa6a",
	name: "removePharmaLogin",
	filename: "src/lib/pharma/board.functions.ts"
}, (opts) => removePharmaLogin.__executeServer(opts));
var removePharmaLogin = createServerFn({ method: "POST" }).validator((data) => ({ companyId: String(data.companyId ?? "") })).handler(removePharmaLogin_createServerFn_handler, async ({ data }) => clearPharmaLogin(data.companyId));
var createPharmaCompany_createServerFn_handler = createServerRpc({
	id: "fe6856b22266cbb8e418214854d8e1e8378b48c8ffc9cb9db65bdf8e65612eed",
	name: "createPharmaCompany",
	filename: "src/lib/pharma/board.functions.ts"
}, (opts) => createPharmaCompany.__executeServer(opts));
var createPharmaCompany = createServerFn({ method: "POST" }).validator((data) => ({
	name: String(data.name ?? ""),
	loginUrl: String(data.loginUrl ?? "")
})).handler(createPharmaCompany_createServerFn_handler, async ({ data }) => addPharmaCompany(data.name, data.loginUrl));
var editPharmaCompany_createServerFn_handler = createServerRpc({
	id: "f08e9530d5135c704625b20f8aa980371004573ac6c6eb2a50c4c5efa07e4472",
	name: "editPharmaCompany",
	filename: "src/lib/pharma/board.functions.ts"
}, (opts) => editPharmaCompany.__executeServer(opts));
var editPharmaCompany = createServerFn({ method: "POST" }).validator((data) => ({
	companyId: String(data.companyId ?? ""),
	name: String(data.name ?? ""),
	loginUrl: String(data.loginUrl ?? "")
})).handler(editPharmaCompany_createServerFn_handler, async ({ data }) => updatePharmaCompany(data.companyId, data.name, data.loginUrl));
var removePharmaCompany_createServerFn_handler = createServerRpc({
	id: "e5e017d455614273379fd1fb209a7a34ef1a3254cd54f5c8c92e6a9f8cffe45e",
	name: "removePharmaCompany",
	filename: "src/lib/pharma/board.functions.ts"
}, (opts) => removePharmaCompany.__executeServer(opts));
var removePharmaCompany = createServerFn({ method: "POST" }).validator((data) => ({ companyId: String(data.companyId ?? "") })).handler(removePharmaCompany_createServerFn_handler, async ({ data }) => deletePharmaCompany(data.companyId));
//#endregion
export { createPharmaCompany_createServerFn_handler, editPharmaCompany_createServerFn_handler, getPharmaBoard_createServerFn_handler, reloadPharma_createServerFn_handler, removePharmaCompany_createServerFn_handler, removePharmaLogin_createServerFn_handler, storePharmaLogin_createServerFn_handler };
