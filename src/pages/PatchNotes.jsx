import React from "react";
import { Swords, Flame, Search, Menu, X, ArrowUpRight, Crosshair, Zap, BookOpen, Activity, Dumbbell, ExternalLink, ChevronRight, Shield, Gamepad2 } from "lucide-react";
import { PageHeading, Empty } from "../components/Common";
import { tutorialLink, hasCuratedTutorial, resources } from "../config/content";
import frameData from "../data/frame-data.json";
import patchNotes from "../data/patch-notes.json";
import patchFeed from "../data/patch-feed.json";

export default function PatchNotes({characters, guides, importedFrames, filteredCharacters, filteredGuides, filteredFrames, query, setQuery, difficulty, setDifficulty, category, setCategory, setSelected, go, patchIndex, savedPlan, setSavedPlan, formSent, setFormSent}) {
  return <><section className="section page-section"><PageHeading eyebrow="UPDATE INTELLIGENCE" title={<>PATCH NOTES <span>& UPDATES.</span></>} desc="Track balance changes, game updates, and official announcements. Browse game updates and balance changes in one place."/><div className="patch-intro"><div className="patch-icon"><Activity size={27}/></div><div><strong>STAY CURRENT. ADAPT YOUR GAME.</strong><p>Patch notes can affect move properties, character balance, mechanics, and competitive strategy. Check the publication date and version on the source page before updating your training notes.</p></div></div><div className="patch-grid">{patchNotes.map((patch,i)=><article className="patch-card" key={patch.id}><div className="patch-card-top"><span className="patch-number">UPDATE SOURCE / 0{i+1}</span><span className="patch-type">{patch.type}</span></div><h3>{patch.title}</h3><p>{patch.summary}</p><div className="patch-meta"><span>{patch.source}</span><span>{patch.date}</span></div><a className="btn-primary patch-open" href={patch.url} target="_blank" rel="noreferrer">OPEN PATCH NOTES <ExternalLink size={15}/></a></article>)}</div></section></>;
}
