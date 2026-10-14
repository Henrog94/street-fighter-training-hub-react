import React, { useState } from "react";
import { Gamepad2, ChevronDown, ChevronUp } from "lucide-react";

function youtubeId(url) {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.toLowerCase();
    let id = null;
    if (host === "youtu.be" || host === "www.youtu.be") id = parsed.pathname.split("/")[1];
    else if (["youtube.com", "www.youtube.com", "m.youtube.com", "www.youtube-nocookie.com", "youtube-nocookie.com"].includes(host)) {
      const segments = parsed.pathname.split("/").filter(Boolean);
      id = segments[0] === "watch" ? parsed.searchParams.get("v") : (["embed", "shorts", "live"].includes(segments[0]) ? segments[1] : null);
    }
    return /^[A-Za-z0-9_-]{11}$/.test(id || "") ? id : null;
  } catch { return null; }
}

export default function GuideVideoButtons({ videos = [] }) {
  const [active, setActive] = useState(null);
  const valid = videos.map((video, index) => ({ ...video, index, id: youtubeId(video.url) })).filter(video => video.id);
  if (!valid.length) return null;
  return <div className="guide-video-section">
    <h4>VIDEO TUTORIALS</h4>
    <div className="guide-video-list">{valid.map(video => <div className="guide-video-item" key={`${video.index}-${video.id}`}>
      <button type="button" className="btn-primary modal-video guide-video-toggle" aria-expanded={active === video.index} onClick={() => setActive(active === video.index ? null : video.index)}>
        <Gamepad2 size={17}/> {video.title} {active === video.index ? <ChevronUp size={17}/> : <ChevronDown size={17}/>}
      </button>
      {active === video.index && <div className="neutral-video-embed"><iframe src={`https://www.youtube-nocookie.com/embed/${video.id}`} title={video.title} loading="lazy" referrerPolicy="strict-origin-when-cross-origin" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen /></div>}
    </div>)}</div>
  </div>;
}
