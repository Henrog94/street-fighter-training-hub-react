/** Convert the locally scraped SuperCombo export into searchable fighter move records.
 * Only values present in the imported tables are included. No values are inferred.
 */
import fs from 'node:fs/promises';
const input='src/data/wiki-characters.json';
const output='src/data/wiki-moves.json';
const source=JSON.parse(await fs.readFile(input,'utf8'));
const result={};
for(const [fighter,parts] of Object.entries(source)){
  const overview=parts.overview || null;
  const data=parts.data || null;
  const moves=[];
  for(const table of (data?.tables||[])){
    if(!Array.isArray(table)||!Array.isArray(table[1]))continue;
    const title=String(table[1][0]||'').split('\n')[0].trim();
    if(!title || !table.some(row=>Array.isArray(row)&&row.includes('Startup')&&row.includes('Active')))continue;
    const fields={};
    for(let i=0;i<table.length-1;i++){
      const headers=table[i],values=table[i+1];
      if(!Array.isArray(headers)||!Array.isArray(values)||headers.length<1||headers.length!==values.length)continue;
      for(let j=0;j<headers.length;j++){
        const key=String(headers[j]||'').trim();
        if(key && !fields[key])fields[key]=String(values[j]??'').trim();
      }
    }
    const code=title.split(/\s+/)[0];
    const desc=String(table[1][0]||'').split('\n').slice(-1)[0].trim();
    moves.push({name:title,code,description:desc,startup:fields.Startup||'—',active:fields.Active||'—',recovery:fields.Recovery||'—',onHit:fields['Hit Advantage']||'—',onBlock:fields['Block Advantage']||'—',damage:fields.Damage||'—',guard:fields.Guard||'—',cancel:fields.Cancel||'—',notes:fields.Notes||''});
  }
  const headings=(overview?.headings||[]).filter(h=>h.level<=3 && h.title!=='SF6 Navigation').map(h=>h.title.replace(/&amp;/g,'&'));
  // The export includes a text excerpt, not a complete overview; avoid mislabeling it as comprehensive.
  const intro=String(overview?.text||'').split('Introduction\n\nedit\n\n')[1]?.split('\n\nPick if you like:')[0]?.slice(0,1100) || '';
  result[fighter]={source:overview?.source||data?.source||'',dataSource:data?.source||'',fetchedAt:data?.fetchedAt||overview?.fetchedAt||'',headings, intro, moves, overviewAvailable:!!headings.length, dataAvailable:!!moves.length,overviewTableCount:overview?.tables?.length||0,dataTableCount:data?.tables?.length||0};
}
await fs.writeFile(output,JSON.stringify(result,null,2)+'\n');
console.log(`Built ${output}: ${Object.keys(result).length} fighters, ${Object.values(result).reduce((n,f)=>n+f.moves.length,0)} indexed moves.`);
