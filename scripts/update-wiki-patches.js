import fs from "node:fs/promises";
const input = JSON.parse(await fs.readFile("public/data/wiki-import.json", "utf8"));
const table = (input.tables || []).find(t => t[0]?.[0]?.toLowerCase() === "version" && t[0]?.[1]?.toLowerCase() === "date");
if (!table) throw new Error("No version/date patch table found. Scrape the main SF6 page first.");
const feed = table.slice(1).filter(r=>r.length>=3).map((r,i)=>({id:i+1,title:`SF6 Patch ${r[0]}`,version:r[0],date:r[1],type:"Wiki patch summary",summary:r[2],url:"https://wiki.supercombo.gg/w/Street_Fighter_6/Patch_Notes",source:"SuperCombo Wiki"}));
await fs.writeFile("src/data/patch-feed.json",JSON.stringify(feed,null,2)+"\n");
console.log(`Updated ${feed.length} wiki patch summaries in src/data/patch-feed.json`);
