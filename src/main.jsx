import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, useLocation, useNavigate, Routes, Route, Navigate } from "react-router-dom";
import useLocalData from "./hooks/useLocalData";
import { Swords, Flame, Search, Menu, X, ArrowUpRight, Crosshair, Zap, BookOpen, Activity, Dumbbell, ExternalLink, ChevronRight, Shield, Gamepad2 } from "lucide-react";




import patchFeed from "./data/patch-feed.json";

import "./styles.css";
import BackgroundMusic from "./BackgroundMusic";
import Navbar, {nav} from "./components/Navbar";
import FighterDetailModal from "./components/FighterDetailModal";
import Home from "./pages/Home";
import Fighters from "./pages/Fighters";
import Guides from "./pages/Guides";
import FrameData from "./pages/FrameData";
import PatchNotes from "./pages/PatchNotes";
import Training from "./pages/Training";
import Resources from "./pages/Resources";
const pages = {home:Home, fighters:Fighters, guides:Guides, frames:FrameData, patches:PatchNotes, training:Training, resources:Resources};

function App(){
  const navigate = useNavigate();
  const location = useLocation();
  const page = location.pathname.slice(1) || "home";
  const { data: characters, loading: charactersLoading, error: charactersError, retry: retryCharacters } = useLocalData("/data/characters.json", []);
  const { data: guides, loading: guidesLoading, error: guidesError, retry: retryGuides } = useLocalData("/data/guides.json", []);
  const { data: wikiMoves, loading: wikiLoading, error: wikiError, retry: retryWiki } = useLocalData("/data/wiki-moves.json", {});
  const importedFrames = useMemo(() => Object.entries(wikiMoves).flatMap(([character, entry]) =>
    (entry.moves || []).map((move, index) => ({...move, character, id:`${character}-${index}`, type:"Wiki import"}))), [wikiMoves]);
  const loading = charactersLoading || guidesLoading || wikiLoading;
  const dataError = charactersError || guidesError || wikiError;
  const retryData = () => { retryCharacters(); retryGuides(); retryWiki(); };
  const [savedPlan, setSavedPlan] = useState(() => {
    try { return JSON.parse(localStorage.getItem("fightlab-practice-plan") || "null"); }
    catch { return null; }
  });
  const [mobile,setMobile]=useState(false);
  const [query,setQuery]=useState("");
  const [difficulty,setDifficulty]=useState("All");
  const [category,setCategory]=useState("All");
  const [selected,setSelected]=useState(null);
  const [formSent,setFormSent]=useState(false);
  const [patchIndex,setPatchIndex]=useState(0);
  useEffect(()=>{const timer=setInterval(()=>setPatchIndex(i=>(i+1)%patchFeed.length),6500);return ()=>clearInterval(timer)},[]);
  const go=(p)=>{navigate(p==="home"?"/":`/${p}`);setQuery("");setMobile(false);setSelected(null);window.scrollTo({top:0,behavior:"smooth"});};
  const filteredCharacters=useMemo(()=>characters.filter(c=>(c.name+" "+c.style+" "+c.role+" "+c.difficulty).toLowerCase().includes(query.toLowerCase())&&(difficulty==="All"||c.difficulty===difficulty)),[characters,query,difficulty]);
  const filteredGuides=useMemo(()=>guides.filter(g=>(g.title+" "+g.description+" "+g.topics.join(" ")).toLowerCase().includes(query.toLowerCase())&&(category==="All"||g.category===category)),[guides,query,category]);
  const filteredFrames=useMemo(()=>importedFrames.filter(f=>(f.character+" "+f.name+" "+f.description).toLowerCase().includes(query.toLowerCase())),[importedFrames,query]);

 const pageProps = {characters, guides, importedFrames, filteredCharacters, filteredGuides, filteredFrames, query, setQuery, difficulty, setDifficulty, category, setCategory, setSelected, go, patchIndex, savedPlan, setSavedPlan, formSent, setFormSent};
 return <div className="app-shell">
  <BackgroundMusic />
    <Navbar page={page} go={go} mobile={mobile} setMobile={setMobile}/>
    <main>
      {loading && <div className="data-status" role="status">LOADING FIGHTLAB DATA...</div>}
      {dataError && <div className="data-status data-error" role="alert">Could not load the local fighter database: {dataError} <button type="button" onClick={retryData}>RETRY</button></div>}
      {!loading && !dataError && <Routes>
        {nav.map(([, id]) => <Route key={id} path={id==="home"?"/":`/${id}`} element={<div className="route-page">{React.createElement(pages[id], pageProps)}</div>} />)}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>}
    </main>
    <footer className="footer"><button className="footer-brand" onClick={()=>go("home")}><Swords size={19}/> FIGHT<span>LAB</span></button><span>TRAIN SMART. PLAY BOLD. KEEP LEARNING.</span><span className="footer-copy">FAN-MADE LEARNING PROJECT · 2026</span></footer>
    <FighterDetailModal selected={selected} setSelected={setSelected} wikiMoves={wikiMoves}/>
  </div>;
}

createRoot(document.getElementById("root")).render(<React.StrictMode><BrowserRouter><App/></BrowserRouter></React.StrictMode>);
