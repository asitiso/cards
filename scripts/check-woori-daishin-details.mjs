import { fetchText, stripTags, visibleMarkup } from "../src/lib/events/html.ts";

const samples = [
 ["woori", "https://pc.wooricard.com/dcpc/yh1/bnf/bnf02/prgevnt/movePrgEvntDtl.do?evntSrno=30006298", "3번, 60만원씩 쓰면 5% 캐시백"],
 ["woori", "https://pc.wooricard.com/dcpc/yh1/bnf/bnf02/prgevnt/movePrgEvntDtl.do?evntSrno=30006323", "디지털 정기결제 캐시백 이벤트"],
 ["daishin", "https://www.daishin.com/content/w/customer/event/eventDetail.ds?cid=6917&m=1109&p=12933&v=12835", "고배당 투자에 혜택을 더하다"],
];
for (const [issuer,url,title] of samples) {
 try {
  const start=Date.now();
  const html=await fetchText(url,{},6000);
  const visible=stripTags(visibleMarkup(html));
  const words=title.split(/\s+/).filter(word=>word.length>2);
  console.log(JSON.stringify({
   issuer,host:new URL(url).hostname,ms:Date.now()-start,htmlLength:html.length,textLength:visible.length,
   titleMatch:visible.includes(title),someTitleWords:words.some(word=>visible.includes(word)),
   eventIdMention:issuer==="woori" ? /30006298|30006323/.test(html) : /6917/.test(html),
   hasRuleKeywords:/이벤트\s*기간|참여\s*대상|유의사항|혜택/.test(visible),
   hasAngularTemplate:/\{\{(?:event\.|yymmddhhmm)/.test(html),
   hasArticleTag:/<article\b|<main\b|class=["'][^"']*(?:event|evt).*(?:detail|cont)/i.test(html),
   contentTypeHint:html.slice(0,50).replace(/\s+/g," "),
  }));
 }catch(e){console.log(JSON.stringify({issuer,host:new URL(url).hostname,error:String(e instanceof Error?e.message:e).slice(0,120)}));}
}

try {
 const html=await fetchText("https://pc.wooricard.com/dcpc/yh1/bnf/bnf02/prgevnt/movePrgEvntDtl.do?evntSrno=30006298",{},6000);
 const urls=[...html.matchAll(/<script[^>]*\\bsrc\\s*=\\s*["']([^"']+)["']/gi)]
  .map(m=>{try{return new URL(m[1],"https://pc.wooricard.com").href}catch{return ""}})
  .filter(Boolean);
 const candidates=urls.filter(v=>/(?:prgevnt|bnf02|event)/i.test(v)).slice(0,3);
 const inline=[...new Set([...html.matchAll(/[\\w/-]+(?:Evnt|event)[\\w/-]*\\.(?:pwkjson|do)/gi)].map(x=>x[0]))].slice(0,15);
 console.log("WOORI_DISCOVERY "+JSON.stringify({scriptCount:urls.length,candidatePaths:candidates.map(v=>new URL(v).pathname),inlineRoutes:inline}));
 for(const url of candidates){
  try{
   const js=await fetchText(url,{},5000);
   const routes=[...new Set([...js.matchAll(/[\\w/-]+(?:Evnt|event)[\\w/-]*\\.(?:pwkjson|do)/gi)].map(x=>x[0]))].slice(0,20);
   console.log("WOORI_JS_ROUTES "+JSON.stringify({path:new URL(url).pathname,sourceLength:js.length,routes}));
  }catch(e){console.log("WOORI_JS_UNAVAILABLE "+new URL(url).pathname+" "+String(e).slice(0,80))}
 }
}catch(e){console.log("WOORI_DISCOVERY_UNAVAILABLE "+String(e).slice(0,100))}
