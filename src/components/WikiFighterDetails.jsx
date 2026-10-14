import React,{useEffect,useState} from "react";
import {Search,ExternalLink} from "lucide-react";
export default function WikiFighterDetails({fighter, wikiMoves}){
 const entry=wikiMoves[fighter.name];
 const [filter,setFilter]=useState("");
 const [expanded,setExpanded]=useState(null);
 useEffect(()=>{setFilter("");setExpanded(null)},[fighter.name]);
 const moves=(entry?.moves||[]).filter(m=>(m.name+" "+m.description+" "+m.notes).toLowerCase().includes(filter.toLowerCase()));
 return <div className="wiki-reference">
   <h4>SUPERCOMBO FIGHTER INTELLIGENCE</h4>
   <div className="wiki-reference-links"><a href={fighter.wikiUrl} target="_blank" rel="noreferrer">CHARACTER OVERVIEW <ExternalLink size={13}/></a><a href={fighter.wikiDataUrl} target="_blank" rel="noreferrer">FULL FRAME DATA <ExternalLink size={13}/></a></div>
   {entry?.intro&&<><h4>WIKI OVERVIEW</h4><p className="wiki-intro">{entry.intro}</p></>}
   {entry?.headings?.length>0&&<><h4>AVAILABLE GUIDE SECTIONS</h4><div className="topic-list">{entry.headings.slice(0,16).map((heading,i)=><span key={i}>{heading}</span>)}</div></>}
   <h4>IMPORTED MOVE DATA ({entry?.moves?.length||0})</h4>
   {entry?.moves?.length>0?<><label className="search-box wiki-move-search"><Search size={16}/><input aria-label="Search imported moves" placeholder="Search moves, inputs, notes..." value={filter} onChange={e=>setFilter(e.target.value)}/></label>
   <div className="wiki-table-scroll"><table className="wiki-move-table"><thead><tr><th>MOVE</th><th>STARTUP</th><th>ACTIVE</th><th>RECOVERY</th><th>ON HIT</th><th>ON BLOCK</th><th>DAMAGE</th></tr></thead><tbody>{moves.map((m,i)=><React.Fragment key={m.name+i}><tr className="wiki-move-row" onClick={()=>setExpanded(expanded===m.name?null:m.name)} title="Click for additional move information"><td><strong>{m.name}</strong></td><td>{m.startup}</td><td>{m.active}</td><td>{m.recovery}</td><td>{m.onHit}</td><td>{m.onBlock}</td><td>{m.damage}</td></tr>{expanded===m.name&&<tr><td colSpan="7" className="wiki-move-details"><strong>{m.description}</strong><p>Guard: {m.guard} · Cancel: {m.cancel}</p>{m.notes&&<p>{m.notes}</p>}</td></tr>}</React.Fragment>)}</tbody></table></div>
   {moves.length===0&&<p>No imported moves match this search.</p>}</>:<p>No usable move tables were extracted for this fighter. Use the wiki links above for the full information.</p>}
   <p className="wiki-data-note">Source: SuperCombo community wiki. These are partial cached records from the October 10, 2026 export, not live data. Some moves and notes may be missing; verify current values at the source.</p>
 </div>;
}

