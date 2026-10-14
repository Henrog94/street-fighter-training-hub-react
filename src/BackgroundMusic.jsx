
import { useEffect, useRef, useState } from "react";
import {
  Music2,
  X,
  Play,
  Pause,
  Square,
  Volume2,
  VolumeX
} from "lucide-react";

export default function BackgroundMusic() {
  const audioRef = useRef(null);
  const userStoppedRef = useRef(false);

  const [expanded, setExpanded] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(15);

  // Keep volume synchronized with the slider.
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = volume / 100;
    }
  }, [volume]);

  // Attempt autoplay when the website loads.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    let active = true;

    async function attemptAutoplay() {
      if (!active || userStoppedRef.current || !audio.paused) {
        return;
      }

      try {
        await audio.play();
      } catch (error) {
        // Browser may block autoplay until user interaction.
      }
    }

    attemptAutoplay();

    // Try once more on the first user interaction.
    function startOnInteraction(event) {
      if (event.target.closest?.(".music-widget")) {
        return;
      }

      if (!userStoppedRef.current) {
        attemptAutoplay();
      }
    }

    document.addEventListener("pointerdown", startOnInteraction);
    document.addEventListener("keydown", startOnInteraction);

    return () => {
      active = false;
      document.removeEventListener("pointerdown", startOnInteraction);
      document.removeEventListener("keydown", startOnInteraction);
    };
  }, []);

  // Play or pause.
  async function togglePlay() {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      userStoppedRef.current = false;

      try {
        await audio.play();
      } catch (error) {
        console.error("Music playback failed:", error);
      }
    } else {
      userStoppedRef.current = true;
      audio.pause();
    }
  }

  // Stop playback and return to the beginning.
  function stopMusic() {
    const audio = audioRef.current;
    if (!audio) return;

    userStoppedRef.current = true;
    audio.pause();
    audio.currentTime = 0;
    setPlaying(false);
  }

  return (
    <div className="music-widget">
      <audio
        ref={audioRef}
        src="/audio/background-music.mp3"
        loop
        preload="auto"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
      />

      {expanded && (
        <div className="music-widget-panel">
          <button
            type="button"
            className="music-control"
            onClick={togglePlay}
            title={playing ? "Pause" : "Play"}
            aria-label={playing ? "Pause music" : "Play music"}
          >
            {playing ? <Pause size={17} /> : <Play size={17} />}
          </button>

          <button
            type="button"
            className="music-control"
            onClick={stopMusic}
            title="Stop"
            aria-label="Stop music"
          >
            <Square size={15} />
          </button>

          <div className="music-volume">
            {volume === 0 ? (
              <VolumeX size={17} />
            ) : (
              <Volume2 size={17} />
            )}

            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              aria-label="Music volume"
            />

            <span>{volume}%</span>
          </div>
        </div>
      )}

      <button
        type="button"
        className="music-widget-toggle"
        onClick={() => setExpanded(!expanded)}
        aria-label={
          expanded ? "Close music controls" : "Open music controls"
        }
        aria-expanded={expanded}
        title="Music controls"
      >
        {expanded ? <X size={21} /> : <Music2 size={21} />}
      </button>
    </div>
  );
}
