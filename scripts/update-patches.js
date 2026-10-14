import fs from 'node:fs/promises';
const url='https://store.steampowered.com/feeds/news/app/1364780/';
const target=new URL('../src/data/patch-feed.json',import.meta.url);
const decode=s=>s.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g,'$1').replace(/<[^>]*>/g,' ').replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/\s+/g,' ').trim();
try {
 const r=await fetch(url,{headers:{'User-Agent':'FightLabLearningProject/1.0'}});if(!r.ok)throw Error(`HTTP ${r.status}`);
 const xml=await r.text();const items=[...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].slice(0,8).map((m,i)=>{const t=m[1];const field=n=>(t.match(new RegExp(`<${n}>([\s\S]*?)<\/${n}>`))||[])[1]||'';return {id:i+1,title:decode(field('title')),date:new Date(field('pubDate')).toISOString().slice(0,10),type:'Game announcement',summary:decode(field('description')).slice(0,240),url:decode(field('link')),source:'Steam News'};}).filter(x=>x.title&&x.url);
 if(!items.length)throw Error('No RSS entries found');await fs.writeFile(target,JSON.stringify(items,null,2)+'\n');console.log(`Saved ${items.length} news items. Run npm run dev or build to see them.`);
} catch(e){console.error('Unable to refresh Steam news; existing cached feed was kept:',e.message);process.exitCode=1;}
