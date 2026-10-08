//#region node_modules/.nitro/vite/services/ssr/assets/types-CQCDGUHx.js
var ISSUERS = [
	{
		id: "shinhan",
		name: "신한카드",
		short: "신한",
		listUrl: "https://www.shinhancard.com/mob/MOBFM829N/MOBFM829R01.shc"
	},
	{
		id: "samsung",
		name: "삼성카드",
		short: "삼성",
		listUrl: "https://www.samsungcard.com/personal/event/ing/UHPPBE1401M0.jsp"
	},
	{
		id: "hyundai",
		name: "현대카드",
		short: "현대",
		listUrl: "https://www.hyundaicard.com/cpb/ev/CPBEV0101_01.hc"
	},
	{
		id: "kb",
		name: "KB국민카드",
		short: "KB",
		listUrl: "https://card.kbcard.com/BON/DVIEW/HBBMCXCRVNEC0001"
	},
	{
		id: "lotte",
		name: "롯데카드",
		short: "롯데",
		listUrl: "https://www.lottecard.co.kr/app/LPBNFDA_V100.lc"
	},
	{
		id: "woori",
		name: "우리카드",
		short: "우리",
		listUrl: "https://pc.wooricard.com/dcpc/yh1/bnf/bnf02/prgevnt/H1BNF202S00.do"
	},
	{
		id: "hana",
		name: "하나카드",
		short: "하나",
		listUrl: "https://m.hanacard.co.kr/MKEVT1000M.web"
	},
	{
		id: "nh",
		name: "NH농협카드",
		short: "NH",
		listUrl: "https://card.nonghyup.com/IPCC010001.menu"
	},
	{
		id: "bc",
		name: "BC카드",
		short: "BC",
		listUrl: "https://web.paybooc.co.kr/web/evnt/main"
	},
	{
		id: "ibk",
		name: "IBK기업은행",
		short: "IBK",
		listUrl: "https://www.ibk.co.kr/event/ingListEvent.ibk?pageId=CM01060100&evnt_dscd=H"
	},
	{
		id: "kakaobank",
		name: "카카오뱅크",
		short: "카카오",
		listUrl: "https://www.kakaobank.com/products/checkcard"
	},
	{
		id: "tossbank",
		name: "토스뱅크",
		short: "토스",
		listUrl: "https://www.tossbank.com/product-service/card/check-card"
	}
];
function issuerMeta(id) {
	const found = ISSUERS.find((item) => item.id === id);
	if (!found) throw new Error(`unknown issuer ${id}`);
	return found;
}
//#endregion
export { issuerMeta as n, ISSUERS as t };
