import React from "react";
import {Search} from "lucide-react";
export function PageHeading({eyebrow,title,desc}){return <div className="section-heading page-heading"><div><div className="eyebrow"><span className="eyebrow-line"/>{eyebrow}</div><h2>{title}</h2></div><p>{desc}</p></div>}
export function Empty(){return <div className="empty-state"><Search size={24}/><h3>NO MATCHES FOUND</h3><p>Try another search term or filter.</p></div>}
