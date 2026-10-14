/**
 * Sequential, resumable character wiki importer.
 * Usage:
 * npm run scrape:characters -- --fighter "Juri"
 * npm run scrape:characters -- --limit 3
 * npm run scrape:characters -- --all
 * Add --data to include each fighter's /Data page.
 * Does not bypass access controls, CAPTCHAs, robots rules, or rate limits.
 */
import fs from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
const args=process.argv.slice(2);
const value=(flag)=>{const i=args.indexOf(flag);return i<0?null:args[i+1]};
const roster=JSON.parse(await fs.readFile('src/data/characters.json','utf8'));
const output='src/data/wiki-characters.json';
let existing={};
try{existing=JSON.parse(await fs.readFile(output,'utf8'))}catch{}
const fighter=value('--fighter');
const limit=Number(value('--limit')||3);
const all=args.includes('--all');
const includeData=args.includes('--data');
const refresh=args.includes('--refresh');
if(!Number.isInteger(limit)||limit<1)throw new Error('--limit must be a positive integer');
const names=fighter?roster.filter(c=>c.name.toLowerCase()===fighter.toLowerCase()):roster;
if(!names.length)throw new Error(`Unknown fighter: ${fighter}`);
const selected=all||fighter?names:names.slice(0,limit);
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const slug=s=>s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
// The wiki uses different page-title spelling for certain characters.
const wikiTitleOverrides = {
  'M. Bison': 'M.Bison',
  'C. Viper': 'C.Viper',
  'E. Honda': 'E.Honda',
  'Arjun': 'Arjun'
};
const getWikiUrl = (character, part) => {
 const title = wikiTitleOverrides[character.name];
 if (title) return `https://wiki.supercombo.gg/w/Street_Fighter_6/${encodeURIComponent(title)}${part === 'data' ? '/Data' : ''}`;
 return part === 'data' ? character.wikiDataUrl : character.wikiUrl;
};

for(const c of selected){
 const current=existing[c.name]||{};
 const parts=includeData?['overview','data']:['overview'];
 for(const part of parts){
  if(current[part]&&!refresh){console.log(`Skipping cached ${c.name} ${part}`);continue}
  const url=getWikiUrl(c,part);
  const file=`public/data/wiki-characters/${slug(c.name)}-${part}.json`;
  console.log(`\nFetching ${c.name} ${part}: ${url}`);
  const result=spawnSync(process.execPath,['scripts/wiki-scraper.js',url,'--out',file],{encoding:'utf8'});
  if(result.stdout)process.stdout.write(result.stdout);
  if(result.stderr)process.stderr.write(result.stderr);
  if(result.status!==0){
   const message=`${result.stderr||''} ${result.stdout||''}`;
   if(/page you specified doesn't exist|missingtitle|page does not exist/i.test(message)){
    console.warn(`Skipping missing wiki page for ${c.name} ${part}; continuing with other fighters.`);
    continue;
   }
   console.error(`Stopped on ${c.name} ${part} due to a non-missing-page error. Rerun later if permitted.`);
   process.exit(1);
  }
  const raw=JSON.parse(await fs.readFile(file,'utf8'));
  // Keep source-derived headings, compact tables, and limited text for UI use.
  current[part]={source:raw.source,fetchedAt:raw.fetchedAt,title:raw.title,
    headings:(raw.headings||[]).slice(0,80),tables:(raw.tables||[]).slice(0,250).map(t=>t.slice(0,150).map(r=>r.slice(0,25))),
    text:(raw.text||'').slice(0,30000),imageUrls:(raw.images||[]).slice(0,30)};
  existing[c.name]=current;
  await fs.writeFile(output,JSON.stringify(existing,null,2)+'\n');
  console.log(`Imported ${c.name} ${part}: ${current[part].headings.length} sections, ${current[part].tables.length} tables`);
  await sleep(1600);
 }
}
const build=spawnSync(process.execPath,['scripts/build-wiki-data.js'],{encoding:'utf8'});
if(build.stdout)process.stdout.write(build.stdout);
if(build.stderr)process.stderr.write(build.stderr);
console.log(`\nFinished. Imported records saved to ${output}. Restart Vite if changes do not appear.`);
