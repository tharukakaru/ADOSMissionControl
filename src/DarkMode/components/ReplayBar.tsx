"use client";

import { SkipBack, ChevronsLeft, Play, Pause, SkipForward } from "lucide-react";
import { useArcStore } from "../store/useArcStore";

export function ReplayBar() {
  const isPlaying = useArcStore((s) => s.isPlaying);
  const togglePlay = useArcStore((s) => s.togglePlay);

  return (
    <footer className="replay">
      <div className="rl up">
        <span className="dot" />
        Replay
      </div>
      <span className="rtime mono">17:44:50Z</span>

      <div className="rctrls">
        <SkipBack />
        <ChevronsLeft />
        <button type="button" onClick={togglePlay} aria-label={isPlaying ? "Pause" : "Play"}>
          {isPlaying ? <Pause fill="currentColor" /> : <Play fill="currentColor" />}
        </button>
        <SkipForward />
      </div>

      <div className="scrub">
        <i />
        <span className="mk" style={{ left: "38%" }} />
        <span className="mk" style={{ left: "60%" }} />
        <b />
      </div>

      <div className="rstats up">
        <span>
          <b>Scale</b> 1M
        </span>
        <span>
          <b>FPS</b> 60
        </span>
        <span>
          <b>Fused Tracks</b> 10
        </span>
      </div>
    </footer>
  );
}
