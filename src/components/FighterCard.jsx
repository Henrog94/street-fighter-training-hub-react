import React from "react";
import {ArrowUpRight,ChevronRight} from "lucide-react";

/** Shared roster card; data and selection behavior arrive through props. */
export default function FighterCard({fighter:c,index:i,onSelect}) {
  return <button className="fighter-card" onClick={()=>onSelect(c)}><div className={"fighter-image-wrap"+(c.imageKind==="wiki-icon"?" wiki-icon-wrap":"")}><img src={c.image.startsWith("http")?c.image:"/"+c.image} alt={c.name} onError={e=>{e.currentTarget.style.opacity="0.15"}}/><span className="fighter-index">0{i+1}</span><span className="fighter-open"><ArrowUpRight size={18}/></span><div className="fighter-image-shade"/></div><div className="fighter-info"><div className="fighter-meta"><span>{c.role}</span><span className={"difficulty "+c.difficulty.toLowerCase()}>{c.difficulty}</span></div><h3>{c.name.toUpperCase()}</h3><p>{c.description}</p><div className="fighter-footer"><span>{c.style}</span><span className="view-details">VIEW INTEL <ChevronRight size={14}/></span></div></div></button>;
}
