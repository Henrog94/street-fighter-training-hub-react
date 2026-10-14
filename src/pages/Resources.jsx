import React from "react";
import { Swords, Flame, Search, Menu, X, ArrowUpRight, Crosshair, Zap, BookOpen, Activity, Dumbbell, ExternalLink, ChevronRight, Shield, Gamepad2 } from "lucide-react";
import { PageHeading, Empty } from "../components/Common";
import { tutorialLink, hasCuratedTutorial, resources } from "../config/content";
import frameData from "../data/frame-data.json";
import patchNotes from "../data/patch-notes.json";
import patchFeed from "../data/patch-feed.json";

export default function Resources({characters, guides, importedFrames, filteredCharacters, filteredGuides, filteredFrames, query, setQuery, difficulty, setDifficulty, category, setCategory, setSelected, go, patchIndex, savedPlan, setSavedPlan, formSent, setFormSent}) {
  return <><section className="section page-section"><PageHeading eyebrow="OUTSIDE THE DOJO" title={<>YOUR RESEARCH <span>ARSENAL.</span></>} desc="A few useful places to keep learning, check community knowledge, and follow the game."/><div className="resource-grid">{resources.map((r,i)=><a className="resource-card" key={r.name} href={r.url} target="_blank" rel="noreferrer"><span className="resource-number">RESOURCE / 0{i+1}</span><span className="resource-icon"><ExternalLink size={22}/></span><h3>{r.name}</h3><p>{r.type}</p><span className="resource-link">OPEN RESOURCE <ArrowUpRight size={16}/></span></a>)}</div><div className="note-box"><Activity size={20}/><p>Character data and frame data in this project are local JSON learning examples. External resources are provided for further research.</p></div></section></>;
}
