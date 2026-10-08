export type PharmaCompany = {
  id: string;
  name: string;
  short: string;
  loginUrl: string;
};

/** Bookmark list without the wholesale folder. 바로팜만 남겼다. */
export const SEED_COMPANIES: PharmaCompany[] = [
  { id: "baropharm", name: "바로팜", short: "바로팜", loginUrl: "https://www.baropharm.com/" },
  { id: "theshop", name: "theSHOP·대웅", short: "대웅", loginUrl: "http://www.shop.co.kr/front/theshop/main/main" },
  { id: "hmp", name: "HMP몰·한미", short: "HMP", loginUrl: "http://www.hmpmall.co.kr/login.do" },
  { id: "ildong", name: "일동 SHOP", short: "일동", loginUrl: "https://www.ildongshop.com/w/login/login.do" },
  { id: "onnuri", name: "온누리약국", short: "온누리", loginUrl: "http://www.onnuridrugstore.co.kr/" },
  { id: "hubase", name: "Hubase", short: "Hubase", loginUrl: "https://www.hubase.kr/" },
  { id: "dapmall", name: "DAPmall·동아", short: "동아", loginUrl: "https://www.dapmall.com/auth/login?redirectUrl=/main/index" },
  { id: "dongwha", name: "동화eMall", short: "동화", loginUrl: "https://www.dw1897.co.kr/emall/home/main" },
  { id: "premion", name: "녹십자 프리미온", short: "녹십자", loginUrl: "https://premion.gccorp.com/login" },
  { id: "pharmstreet", name: "팜스트리트·보령", short: "보령", loginUrl: "https://www.pharm-street.com/" },
  { id: "kdshop", name: "광동제약", short: "광동", loginUrl: "https://kdshop.co.kr/main/index.do" },
  { id: "jwshop", name: "JW중외제약", short: "중외", loginUrl: "https://www.jwshop.co.kr/member/login2.do?type=2" },
  { id: "pharmsnet", name: "팜스넷", short: "팜스넷", loginUrl: "http://www.pharmsnet.com/jsp/main/a_main.jsp" },
  { id: "dspmall", name: "동성몰", short: "동성", loginUrl: "https://www.dspmall.kr/" },
  { id: "platpharm", name: "종근당플랫팜", short: "종근당", loginUrl: "https://www.platpharm.co.kr/" },
  { id: "sozo", name: "소조몰·신일", short: "신일", loginUrl: "https://www.sozomall.co.kr/" },
  { id: "ondama", name: "온다몰·대원", short: "대원", loginUrl: "https://www.ondamall.co.kr/user/login?target=/#none" },
  { id: "hdp", name: "현대약품", short: "현대약품", loginUrl: "https://hdpmall.co.kr/intro/member.php?returnUrl=%2F" },
  { id: "mianutra", name: "MIA점막면역학회", short: "MIA", loginUrl: "https://mianutra.com/" },
  { id: "nutri", name: "뉴트리파마", short: "뉴트리", loginUrl: "http://www.nutripharma.co.kr/" },
  { id: "danaumv", name: "다나음(비타민디)", short: "다나음D", loginUrl: "http://www.danaum.com/index.html" },
  { id: "duolac", name: "듀오락 전문가몰", short: "듀오락", loginUrl: "http://expert.duolac.co.kr/shop/main/index.php" },
  { id: "desimone", name: "드시모네 약국몰", short: "드시모네", loginUrl: "http://bio11.or.kr/main/index" },
  { id: "buwelly", name: "Buwelly", short: "Buwelly", loginUrl: "http://greensun365.shop.blogpay.co.kr/" },
  { id: "cellonix", name: "셀로몰", short: "셀로몰", loginUrl: "http://www.cellonixmall.com/login/login_form.page" },
  { id: "cellromax", name: "셀로맥스", short: "셀로맥스", loginUrl: "https://www.cellromax.co.kr/" },
  { id: "natures", name: "네이처스팜", short: "네이처스", loginUrl: "http://www.naturespharm.co.kr/" },
  { id: "pharmtalk", name: "팜톡", short: "팜톡", loginUrl: "http://pharmtalk.co.kr/" },
  { id: "braun", name: "브라운 다이렉트", short: "브라운", loginUrl: "http://braundirect.co.kr/" },
  { id: "pharmadia", name: "한화·파마디아", short: "파마디아", loginUrl: "http://pharmadia.com/member/password_change.php" },
  { id: "lsk", name: "엘스케이", short: "LSK", loginUrl: "https://www.pharmsacademy.com/mall/index.php" },
  { id: "pharmsmetic", name: "팜스메틱", short: "팜스메틱", loginUrl: "http://pharmsmetic.com/" },
  { id: "kheart", name: "k하트", short: "k하트", loginUrl: "http://kheart.co.kr/" },
  { id: "petn", name: "펫앤팜", short: "펫앤팜", loginUrl: "https://www.petnpharm.com/main/index.html" },
  { id: "danaum", name: "다나음 약사몰", short: "다나음", loginUrl: "https://danaum.com/index.html" },
  { id: "bereum", name: "테라바이오틱스", short: "테라", loginUrl: "https://bereum.shop/" },
  { id: "hangaram", name: "한가람약품", short: "한가람", loginUrl: "http://hangarampharm.com/Contents/Main/Main0.asp" },
  { id: "solvit", name: "솔빛피앤에프", short: "솔빛", loginUrl: "https://www.solvitpf.com/" },
  { id: "yeskin", name: "예스킨샵", short: "예스킨", loginUrl: "https://yeskinshop.co.kr/" },
  { id: "idahum", name: "아이다움", short: "아이다움", loginUrl: "https://www.idahummall.co.kr/shop/intro.php" },
  { id: "drs", name: "디알에스", short: "DRS", loginUrl: "https://drskorea.kr/login?back_url=Lw%3D%3D&used_login_btn=Y" },
  { id: "pharmev", name: "팜에비던스", short: "팜에비던스", loginUrl: "https://pharmev.kr/login?back_url=LzQx&used_login_btn=N" },
  { id: "onyak", name: "온약몰", short: "온약", loginUrl: "https://www.onyak.co.kr/login?back_url=Lw%3D%3D" },
  { id: "pstn", name: "피에스티엔", short: "PSTN", loginUrl: "https://www.pstnmall.com/Login" },
  { id: "medipharm", name: "메디팜", short: "메디팜", loginUrl: "https://tv.medipharm.co.kr/shop/index" },
  { id: "pyunhanga", name: "편한가", short: "편한가", loginUrl: "https://pyunhangamall.cafe24.com/index.html" },
  { id: "cellmed", name: "셀메드", short: "셀메드", loginUrl: "https://cellmedmall.co.kr/products/member" },
];

export function chipLabel(name: string): string {
  const cut = name.split(/[·\s]/)[0]?.trim() || name.trim();
  return cut.slice(0, 8);
}
