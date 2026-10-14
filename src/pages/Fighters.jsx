import React from "react";
import FighterCard from "../components/FighterCard";
import SearchBar from "../components/SearchBar";
import { Swords, Flame, Search, Menu, X, ArrowUpRight, Crosshair, Zap, BookOpen, Activity, Dumbbell, ExternalLink, ChevronRight, Shield, Gamepad2 } from "lucide-react";
import { PageHeading, Empty } from "../components/Common";
import { tutorialLink, hasCuratedTutorial, resources } from "../config/content";
import frameData from "../data/frame-data.json";
import patchNotes from "../data/patch-notes.json";
import patchFeed from "../data/patch-feed.json";

export default function Fighters({characters, guides, importedFrames, filteredCharacters, filteredGuides, filteredFrames, query, setQuery, difficulty, setDifficulty, category, setCategory, setSelected, go, patchIndex, savedPlan, setSavedPlan, formSent, setFormSent}) {
  return <><section className="section page-section"><PageHeading eyebrow="ROSTER INTELLIGENCE" title={<>PICK YOUR <span>FIGHTER.</span></>} desc="Explore playstyles, strengths, and signature moves. Find the fighter that fits your game plan."/><div className="toolbar"><SearchBar value={query} onChange={setQuery} placeholder="Search fighters, roles, styles..."/><select value={difficulty} onChange={e=>setDifficulty(e.target.value)}><option>All</option><option>Beginner</option><option>Intermediate</option><option>Advanced</option></select><span className="result-count">{filteredCharacters.length} FIGHTERS FOUND</span></div><div className="fighter-grid">{filteredCharacters.map((c,i)=><FighterCard key={c.id} fighter={c} index={i} onSelect={setSelected}/>)}</div>{filteredCharacters.length===0&&<Empty/>}</section></>;
}
