import { fetchText, stripTags, visibleMarkup } from "../src/lib/events/html.ts";
const serial="30006298";
const urls=[
 ["official-mobile-event","https://m.wooricard.com/dcmw/yh1/bnf/bnf02/prgevnt/movePrgEvntDtl.do?evntSrno="+serial],
 ["official-app-route-wrapper","https://m.wooricard.com/dcmw/yh1/mlk/mlk03/M1MLK303S01.do?pageId=yh1/bnf/bnf02/prgevnt/movePrgEvntDtl.do?evntSrno="+serial],
 ["previous-desktop-event","https://pc.wooricard.com/dcpc/yh1/bnf/bnf02/prgevnt/movePrgEvntDtl.do?evntSrno="+serial],
];
for (const [name,url] of urls){
 try{
  const html=await fetchText(url,{},9000);
  const pageText=stripTags(visibleMarkup(html)).replace(/\s+/g," ");
  const snippets=[];
  for (const re of [/com\.wooricard\.wcard/ig,/intent:\/\//ig,/evntSrno/ig,/market:\/\//ig,/play\.google\.com/ig,/appStore|앱스토어/ig]){
    const m=re.exec(html);
    if(m)snippets.push(html.slice(Math.max(0,m.index-90),m.index+165).replace(/\s+/g," "));
  }
  console.log(JSON.stringify({
   name,length:html.length,textLength:pageText.length,
   hasSerial:html.includes(serial),hasPageId:html.includes("pageId"),
   hasAppLink:/com\.wooricard\.wcard|intent:\/\/|market:\/\/|play\.google\.com/i.test(html),
   textStart:pageText.slice(0,220),snippets
  }));
 }catch(e){
  console.log(JSON.stringify({name,error:String(e instanceof Error?e.message:e).slice(0,180)}));
 }
}
