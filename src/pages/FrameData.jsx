import React from "react";
import SearchBar from "../components/SearchBar";
import { Swords, Flame, Search, Menu, X, ArrowUpRight, Crosshair, Zap, BookOpen, Activity, Dumbbell, ExternalLink, ChevronRight, Shield, Gamepad2 } from "lucide-react";
import { PageHeading, Empty } from "../components/Common";
import { tutorialLink, hasCuratedTutorial, resources } from "../config/content";
import frameData from "../data/frame-data.json";
import patchNotes from "../data/patch-notes.json";
import patchFeed from "../data/patch-feed.json";

export default function FrameData({characters, guides, importedFrames, filteredCharacters, filteredGuides, filteredFrames, query, setQuery, difficulty, setDifficulty, category, setCategory, setSelected, go, patchIndex, savedPlan, setSavedPlan, formSent, setFormSent}) {
  return <><section className="section page-section"><PageHeading eyebrow="DATA WINS MATCHES" title={<>FRAME DATA <span>LAB.</span></>} desc="Get familiar with the numbers. Search move values, compare startup and recovery, and study on-hit and on-block advantages."/><div className="toolbar"><SearchBar value={query} onChange={setQuery} placeholder="Search character or move..."/><span className="result-count">{filteredFrames.length} MOVES INDEXED</span></div><details className="frame-data-collapse"><summary><span>FRAME DATA TABLE</span><span className="frame-data-count">{filteredFrames.length} MOVES · CLICK TO EXPAND</span></summary><div className="table-wrap"><table className="frame-table"><thead><tr><th>FIGHTER</th><th>MOVE</th><th>TYPE</th><th>STARTUP</th><th>ACTIVE</th><th>RECOVERY</th><th>ON HIT</th><th>ON BLOCK</th></tr></thead><tbody>{filteredFrames.map(f=><tr key={f.id}><td><span className="table-fighter">{f.character}</span></td><td>{f.name}</td><td><span className="type-pill">{f.type}</span></td><td>{f.startup}</td><td>{f.active}</td><td>{f.recovery}</td><td className={String(f.onHit).startsWith("+")?"positive":"negative"}>{f.onHit}</td><td className={String(f.onBlock).startsWith("+")?"positive":"negative"}>{f.onBlock}</td></tr>)}</tbody></table>{filteredFrames.length===0&&<Empty/>}</div></details></section></>;
}
