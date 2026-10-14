import React, { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, BookOpen, ChevronDown, ChevronUp } from "lucide-react";
import controls from "../data/controls-reference.json";
import buttons from "../data/button-reference.json";


export default function ControlsGuide() {
  const [expanded, setExpanded] = useState(true);
  const [term, setTerm] = useState("");
  const [wiki, setWiki] = useState(null);
  const [wikiStatus, setWikiStatus] = useState("loading");
  useEffect(() => {
    const controller = new AbortController();
    fetch("/data/wiki-controls.json", {signal: controller.signal})
      .then(r => { if (!r.ok) throw new Error("No imported controls file"); return r.json(); })
      .then(data => {
        if (!data?.source?.includes("wiki.supercombo.gg") || !Array.isArray(data.headings)) throw new Error("Invalid controls data");
        setWiki(data); setWikiStatus("ready");
      })
      .catch(() => { if (!controller.signal.aborted) setWikiStatus("missing"); });
    return () => controller.abort();
  }, []);
  const wikiHeadings = useMemo(() => (wiki?.headings || []).filter(h =>
    h.title?.toLowerCase().includes(term.toLowerCase())
  ).slice(0, 40), [wiki, term]);
  const visible = useMemo(() => controls.filter(item =>
    `${item.category} ${item.notation} ${item.explanation}`.toLowerCase().includes(term.trim().toLowerCase())
  ), [term]);
  return <section className="controls-guide" aria-labelledby="controls-guide-heading">
    <div className="controls-guide-header">
      <div><div className="eyebrow">LEARN THE FUNDAMENTALS</div><h3 id="controls-guide-heading"><BookOpen size={25}/> CONTROLS &amp; NOTATION</h3>
        <p>Quick reference for reading inputs, using Drive mechanics, and understanding SF6 control schemes.</p></div>
      <button type="button" className="controls-toggle" aria-expanded={expanded} onClick={() => setExpanded(v => !v)}>
        {expanded ? <>COLLAPSE <ChevronUp size={16}/></> : <>EXPAND <ChevronDown size={16}/></>}
      </button>
    </div>
    {expanded && <>
      <div className="control-visual-intro"><h4>BUTTON ICON REFERENCE</h4><p>Blue = light, yellow = medium, red = heavy. The two multicolor symbols below are <strong>guide shortcuts</strong> for Drive Impact and Drive Parry, not additional physical controller buttons.</p></div>
      <div className="control-button-grid">{buttons.map(button => <article key={button.icon} className="control-button-card"><img src={`/assets/controls/${button.icon}.png`} alt={`${button.name} icon`} loading="lazy"/><div><span className="control-notation">{button.notation}</span><h4>{button.name}</h4><p>{button.detail}</p></div></article>)}</div>
      <div className="control-layouts"><article><h4>CLASSIC CONTROLLER LAYOUT</h4><img src="/assets/controls/classic-controller-layout.png" alt="Classic Xbox controller button layout for Street Fighter 6, including Drive Impact and Parry combinations" loading="lazy"/><p>Classic uses six separate attack strengths. Controller mappings can be customized in-game.</p></article><article><h4>MODERN CONTROLLER LAYOUT</h4><img src="/assets/controls/modern-controller-layout.png" alt="Modern Xbox controller layout for Street Fighter 6 showing light, medium, heavy, special, assist, impact and parry" loading="lazy"/><p>Modern uses simplified light, medium, and heavy attacks with special, assist, and dedicated Drive controls.</p></article></div>
      <details className="notation-popout">
        <summary> <span>INPUT DIRECTIONS &amp; NUMPAD NOTATION</span><span className="notation-summary-hint">CLICK TO EXPAND</span></summary>
        <div className="notation-body">
          <p>Fighting-game commands commonly use <strong>numpad notation</strong>: each direction is represented by a number. Punches are LP, MP, HP, and kicks are LK, MK, HK. These abbreviations are used throughout the controls guide.</p>
          <div className="notation-comparison">
            <div><h5>DIRECTION ARROWS</h5><div className="notation-pad" aria-label="Directional arrows: up-left, up, up-right, left, neutral, right, down-left, down, down-right">{["↖","↑","↗","←","N","→","↙","↓","↘"].map((v,i)=><span key={i} className={i===4?"neutral":""}>{v}</span>)}</div></div>
            <div><h5>NUMPAD EQUIVALENTS</h5><div className="notation-pad" aria-label="Numpad notation: 7 8 9, 4 5 6, 1 2 3">{["7","8","9","4","5","6","1","2","3"].map((v,i)=><span key={i} className={i===4?"neutral":""}>{v}</span>)}</div></div>
          </div>
          <p><strong>5</strong> means neutral (no directional input). <strong>6</strong> means forward, toward the opponent; these examples assume your character faces right. When facing left, directions reverse on screen.</p>
          <div className="notation-examples">
            <div><code>2LK</code><span>Down + Light Kick (crouching light kick)</span></div>
            <div><code>236HP</code><span>Down → down-forward → forward + Heavy Punch (quarter-circle forward)</span></div>
            <div><code>j.MP</code><span>Jumping Medium Punch; <code>j.</code> means performed in the air</span></div>
          </div>
        </div>
      </details>
      <label className="controls-search-label" htmlFor="controls-search">SEARCH CONTROLS</label>
      <input id="controls-search" className="controls-search" type="search" value={term} onChange={e=>setTerm(e.target.value)} placeholder="Try 236P, Drive Parry, Classic..." />
      <div className="controls-grid">{visible.map(item => <article className="controls-item" key={item.notation}>
        <span className="controls-category">{item.category}</span><h4>{item.notation}</h4><p>{item.explanation}</p>
      </article>)}</div>
      {visible.length === 0 && <p role="status">No matching control entries. Try a different term.</p>}
      {wikiStatus === "ready" && wikiHeadings.length > 0 && <details className="controls-import">
        <summary>ADDITIONAL CONTROLS TOPICS</summary>
        <div className="controls-grid">{wikiHeadings.map((h,i) => <article className="controls-item" key={`${h.title}-${i}`}><h4>{h.title}</h4></article>)}</div>
      </details>}
    </>}
  </section>;
}
