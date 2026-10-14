import React, { useState } from "react";
import HudGuide from "../components/HudGuide";
import SearchBar from "../components/SearchBar";
import ControlsGuide from "../components/ControlsGuide";
import GlossaryGuide from "../components/GlossaryGuide";
import { Swords, Flame, Search, Menu, X, ArrowUpRight, Crosshair, Zap, BookOpen, Activity, Dumbbell, ExternalLink, ChevronRight, Shield, Gamepad2 } from "lucide-react";
import { PageHeading, Empty } from "../components/Common";
import { tutorialLink, hasCuratedTutorial, resources } from "../config/content";
import frameData from "../data/frame-data.json";
import patchNotes from "../data/patch-notes.json";
import patchFeed from "../data/patch-feed.json";

export default function Guides({characters, guides, importedFrames, filteredCharacters, filteredGuides, filteredFrames, query, setQuery, difficulty, setDifficulty, category, setCategory, setSelected, go, patchIndex, savedPlan, setSavedPlan, formSent, setFormSent}) {
  const [guideTab, setGuideTab] = useState("guides");
  return <><section className="section page-section"><PageHeading eyebrow="KNOWLEDGE IS POWER" title={<>STUDY. ADAPT. <span>DOMINATE.</span></>} desc="Understand the systems behind the fight, one concept at a time."/><div className="guide-subtabs" role="tablist" aria-label="Guides sections">
  <button type="button" role="tab" aria-selected={guideTab === "guides"} className={guideTab === "guides" ? "active" : ""} onClick={() => setGuideTab("guides")}>GUIDES &amp; NOTATION</button>
  <button type="button" role="tab" aria-selected={guideTab === "hud"} className={guideTab === "hud" ? "active" : ""} onClick={() => setGuideTab("hud")}>BATTLE HUD</button>
</div>
{guideTab === "hud" ? <HudGuide onBack={() => setGuideTab("guides")}/> : <><ControlsGuide/><GlossaryGuide/><div className="toolbar"><SearchBar value={query} onChange={setQuery} placeholder="Search guides and topics..."/><select value={category} onChange={e=>setCategory(e.target.value)}><option>All</option>{[...new Set(guides.map(g=>g.category))].map(c=><option key={c}>{c}</option>)}</select><span className="result-count">{filteredGuides.length} LESSONS</span></div><div className="guide-grid">{filteredGuides.map((g,i)=><article className="guide-card" key={g.id}><div className="guide-top"><span className="guide-number">LESSON / {String(g.id).padStart(2,"0")}</span><span className="guide-category">{g.category}</span></div><h3>{g.title}</h3><p>{g.description}</p><div className="topic-list">{g.topics.map(t=><span key={t}>{t}</span>)}</div><button className="text-link" onClick={()=>setSelected(g)}>OPEN LESSON <ArrowUpRight size={16}/></button></article>)}</div>{filteredGuides.length===0&&<Empty/>}</>}</section></>;
}
