import React from "react";
import { Swords, Flame, Search, Menu, X, ArrowUpRight, Crosshair, Zap, BookOpen, Activity, Dumbbell, ExternalLink, ChevronRight, Shield, Gamepad2 } from "lucide-react";
export const nav = [
  ["Home", "home", Flame], ["Fighters", "fighters", Swords], ["Guides", "guides", BookOpen],
  ["Frame Data", "frames", Activity], ["Patch Notes", "patches", BookOpen], ["Training", "training", Dumbbell], ["Resources", "resources", ExternalLink]
];
export default function Navbar({page,go,mobile,setMobile}) {
  return <>    <div className="topline"><span><span className="live-dot"/> TRAINING MODE ONLINE</span><span className="topline-right">SF6 // FIGHTER DATABASE <span className="topline-sep">—</span> EST. 2026</span></div>
    <header className="navbar">
      <button className="brand" onClick={()=>go("home")} aria-label="Go home"><span className="brand-mark"><Swords size={24}/></span><span>FIGHT<span className="brand-accent">LAB</span><small>STREET FIGHTER TRAINING HUB</small></span></button>
      <button className="mobile-toggle" onClick={()=>setMobile(!mobile)} aria-label="Toggle navigation">{mobile?<X/>:<Menu/>}</button>
      <nav className={mobile?"nav-links open":"nav-links"}>{nav.map(([label,id,Icon])=><button key={id} className={page===id?"nav-item active":"nav-item"} onClick={()=>go(id)}><Icon size={15}/>{label}</button>)}</nav>
      <button className="nav-cta" onClick={()=>go("training")}><Crosshair size={16}/> ENTER TRAINING <ArrowUpRight size={15}/></button>
    </header>
</>;
}
