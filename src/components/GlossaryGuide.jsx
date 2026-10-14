import React, { useEffect, useMemo, useState } from "react";
import { BookOpen, ChevronDown, ChevronUp } from "lucide-react";
import glossary from "../data/glossary-reference.json";

export default function GlossaryGuide() {
  const [expanded, setExpanded] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [imported, setImported] = useState(null);
  useEffect(() => {
    const controller = new AbortController();
    fetch("/data/wiki-glossary.json", { signal: controller.signal })
      .then(response => { if (!response.ok) throw new Error("No glossary import"); return response.json(); })
      .then(data => { if (!controller.signal.aborted && Array.isArray(data.headings) && typeof data.text === "string") setImported(data); })
      .catch(() => {});
    return () => controller.abort();
  }, []);
  const categories = ["All", ...new Set(glossary.map(item => item.category))];
  const filtered = useMemo(() => glossary.filter(item =>
    (category === "All" || item.category === category) &&
    `${item.term} ${item.definition} ${item.category}`.toLowerCase().includes(search.toLowerCase().trim())
  ), [category, search]);
  const headings = useMemo(() => (imported?.headings || []).filter(item =>
    (item.title || "").toLowerCase().includes(search.toLowerCase().trim())
  ).slice(0, 70), [imported, search]);
  return <section className="glossary-guide" aria-labelledby="glossary-heading">
    <div className="controls-guide-header">
      <div><div className="eyebrow">FIGHTING GAME TERMINOLOGY</div><h3 id="glossary-heading"><BookOpen size={24}/> GLOSSARY</h3>
        <p>Look up common notation, mechanics, combat terms, and frame-data vocabulary.</p></div>
      <button type="button" className="controls-toggle" aria-expanded={expanded} onClick={() => setExpanded(value => !value)}>
        {expanded ? <>COLLAPSE <ChevronUp size={16}/></> : <>EXPAND <ChevronDown size={16}/></>}
      </button>
    </div>
    {expanded && <div className="glossary-content">
      <div className="glossary-toolbar"><input aria-label="Search glossary" type="search" placeholder="Search terms, notation, or definitions..." value={search} onChange={event => setSearch(event.target.value)}/>
        <select aria-label="Filter glossary category" value={category} onChange={event => setCategory(event.target.value)}>{categories.map(value => <option key={value}>{value}</option>)}</select></div>
      <div className="glossary-grid">{filtered.map(item => <article className="glossary-card" key={item.term}><span>{item.category}</span><h4>{item.term}</h4>{item.image && <img className="glossary-motion-image" src={item.image} alt={`${item.term} directional motion input`} loading="lazy" />}<p>{item.definition}</p></article>)}</div>
      {filtered.length === 0 && <p role="status">No glossary terms match your search.</p>}
      {imported && <details className="glossary-import"><summary>IMPORTED GLOSSARY CONTENT</summary>
        <p>Imported wiki sections: {headings.length}</p>
        <div className="glossary-grid">{headings.map((item, index) => <article className="glossary-card" key={`${item.title}-${index}`}><span>IMPORTED SECTION</span><h4>{item.title}</h4></article>)}</div>
        <details className="glossary-raw"><summary>READ IMPORTED TEXT</summary><div className="glossary-raw-text">{imported.text}</div></details>
      </details>}
    </div>}
  </section>;
}
