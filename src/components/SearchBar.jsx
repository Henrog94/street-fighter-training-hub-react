import React from "react";
import {Search} from "lucide-react";

/** Shared controlled search field used by the roster and guides. */
export default function SearchBar({value,onChange,placeholder}) {
  return <label className="search-box"><Search size={18}/><input type="search" value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}/></label>;
}
