import React, { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Search } from "lucide-react";
import entries from "../data/hud-reference.json";

const overviewItems = [
  { title: "Vitality Gauge", description: "Indicates the health remaining for each character. When a fighter’s vitality reaches zero, that fighter loses the round." },
  { title: "Drive Gauge", description: "Drive gives you the ability to perform various actions in Street Fighter 6. When this gauge is empty, it turns gray and slowly replenishes. The fighter enters Burnout and cannot use Drive-related techniques until the gauge has fully recovered." },
  { title: "Timer", description: "Indicates the time remaining in the round. If the timer reaches zero, the fighter with more remaining vitality wins the round." },
  { title: "Round Count", description: "Indicates the current round count. The type of icon indicates how the round was won." },
  { title: "Attribute Icon", description: "Some characters have unique icons that indicate a character-specific property. Examples include Kimberly’s Spray Can stock, Ryu’s Denjin charge, and Juri’s Fuha stock." },
  { title: "Character Icon", description: "Indicates the character being used and the selected control type: Classic, Modern, or Dynamic." },
  { title: "Super Art Gauge", description: "Spend this gauge to perform a powerful Super Art. Landing attacks builds the gauge, which can hold up to three stocks. Super Art gauge carries over between rounds." }
];

export default function HudGuide({ onBack }) {
  const [search, setSearch] = useState("");
  const [imported, setImported] = useState(null);
  useEffect(() => {
    const controller = new AbortController();
    fetch("/data/wiki-hud.json", { signal: controller.signal })
      .then(r => { if (!r.ok) throw new Error("HUD reference unavailable"); return r.json(); })
      .then(data => { if (!controller.signal.aborted && typeof data.text === "string") setImported(data); })
      .catch(() => {});
    return () => controller.abort();
  }, []);
  const indicators = useMemo(() => entries.filter(e => e.title !== "Battle HUD Overview" && `${e.title} ${e.description}`.toLowerCase().includes(search.trim().toLowerCase())), [search]);
  return <section className="hud-guide" aria-label="Battle HUD guide">
    <button type="button" className="hud-back" onClick={onBack}><ArrowLeft size={17}/> BACK TO GUIDES</button>
    <div className="eyebrow">STREET FIGHTER 6 / INTERFACE</div>
    <h2 className="hud-title">BATTLE <span>HUD GUIDE</span></h2>
    <p className="hud-intro">Understand the information displayed during a match, from your essential gauges to combat notifications.</p>

    <section className="hud-overview" aria-labelledby="hud-overview-title">
      <div className="hud-overview-heading"><span className="hud-section-kicker">01 / THE MATCH DISPLAY</span><h3 id="hud-overview-title">BATTLE HUD <em>OVERVIEW</em></h3></div>
      <div className="hud-overview-visual"><img src="/assets/hud/SF6_Battle_HUD.jpg" alt="Street Fighter 6 battle HUD overview with numbered interface elements"/></div>
      <div className="hud-overview-caption"><span className="hud-caption-line"/><div><strong>READ THE FIGHT AT A GLANCE</strong><p>Seven key indicators show your health, resources, time, round progress, and fighter information. Match each number in the diagram to its explanation below.</p></div></div>
      <div className="hud-overview-list">{overviewItems.map((item, index) => <article className="hud-overview-item" key={item.title}><span className="hud-overview-number">{String(index + 1).padStart(2,"0")}</span><div><h4>{item.title}</h4><p>{item.description}</p></div></article>)}</div>
    </section>

    <section className="hud-indicators" aria-labelledby="hud-indicators-title">
      <div className="hud-overview-heading"><span className="hud-section-kicker">02 / IN-MATCH NOTIFICATIONS</span><h3 id="hud-indicators-title">HUD <em>INDICATORS</em></h3><p>Visual references and their corresponding meanings.</p></div>
      <label className="hud-search"><Search size={18}/><input type="search" aria-label="Search HUD indicators" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search HUD indicators..."/></label>
      <div className="hud-reference-table" role="table" aria-label="HUD indicators and explanations">
        <div className="hud-table-header" role="row"><span role="columnheader">VISUAL REFERENCE</span><span role="columnheader">DESCRIPTION</span></div>
        {indicators.map(entry => <div className="hud-reference-row" role="row" key={entry.title}>
          <div className="hud-reference-art" role="cell"><img src={entry.image} alt={`${entry.title} indicator`} loading="lazy"/></div>
          <div className="hud-reference-copy" role="cell"><h4>{entry.title}</h4><p>{entry.description}</p></div>
        </div>)}
      </div>
      {indicators.length === 0 && <p className="hud-no-results">No HUD indicators match your search.</p>}
    </section>
  </section>;
}
