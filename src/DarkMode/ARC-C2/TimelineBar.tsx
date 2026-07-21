"use client";

import { useState, useEffect, useRef, type PointerEvent as ReactPointerEvent } from "react";
import {
  Play,
  Pause,
  ChevronLeft,
  Search,
  Square,
  Target,
  MoreHorizontal,
  Hexagon,
  Plus,
  Video,
  ChevronDown,
  Menu,
} from "lucide-react";

const MONTHS = ["June 6th", "June 7th", "June 8th", "June 9th"];

function formatTimeFromProgress(progress: number): string {
  const totalSeconds = 24 * 60 * 60;
  const currentSeconds = Math.floor((progress / 100) * totalSeconds);
  const hours = Math.floor(currentSeconds / 3600);
  const minutes = Math.floor((currentSeconds % 3600) / 60);
  const seconds = currentSeconds % 60;
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

export function TimelineBar() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(65);
  const [currentTime, setCurrentTime] = useState("16:45:01");
  const [q, setQ] = useState("");
  const [checks, setChecks] = useState({ layers: false, tools: true, sources: false });
  const [isDragging, setIsDragging] = useState(false);
  const [showResponsiveMenu, setShowResponsiveMenu] = useState(false);
  const [containerWidth, setContainerWidth] = useState(1000);

  const gridRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const isCompact = containerWidth < 680;
  const isVeryCompact = containerWidth < 480;

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setCurrentTime(formatTimeFromProgress(progress));
  }, [progress]);

  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();

    const updateScrubber = (time: number) => {
      if (!isPlaying) return;
      const delta = time - lastTime;
      lastTime = time;

      setProgress((prev) => {
        const next = prev + delta * 0.001;
        if (next >= 100) {
          setIsPlaying(false);
          return 100;
        }
        return next;
      });

      animationFrameId = requestAnimationFrame(updateScrubber);
    };

    if (isPlaying) {
      animationFrameId = requestAnimationFrame(updateScrubber);
    }

    return () => cancelAnimationFrame(animationFrameId);
  }, [isPlaying]);

  const handlePointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!isDragging || !gridRef.current) return;
    const rect = gridRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    setProgress((x / rect.width) * 100);
  };

  const handlePointerUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  const toggleCheck = (key: keyof typeof checks) => {
    setChecks((c) => ({ ...c, [key]: !c[key] }));
  };

  const checkboxControls = (
    <>
      <button
        type="button"
        className={`tl-check${checks.layers ? " on" : ""}`}
        onClick={() => toggleCheck("layers")}
      >
        <span className="box" aria-hidden /> Map layers
      </button>
      <button
        type="button"
        className={`tl-check${checks.tools ? " on" : ""}`}
        onClick={() => toggleCheck("tools")}
      >
        <span className="box" aria-hidden /> Tools
      </button>
      <button
        type="button"
        className={`tl-check${checks.sources ? " on" : ""}`}
        onClick={() => toggleCheck("sources")}
      >
        <span className="box" aria-hidden /> Data sources
      </button>
    </>
  );

  const annotationPanel = (
    <div className="tl-annot-panel">
      <div className="tl-annot">
        <div className="tl-annot-left">
          <span className="tl-annot-label">Adding to</span>
          <button type="button" className="tl-annot-pick">
            <span className="tl-annot-diamond" aria-hidden />
            <span>Annotations</span>
            <ChevronDown size={8} />
          </button>
        </div>
        <button type="button" className="tl-annot-new">
          <Plus size={7} /> New
        </button>
      </div>
      <div className="tl-symrow">
        <span className="sym">
          SYMBOL <ChevronDown size={8} />
        </span>
        <button type="button" className="si" aria-label="Point symbol">
          <Target size={8} />
        </button>
        <button type="button" className="si" aria-label="More symbols">
          <MoreHorizontal size={8} />
        </button>
        <button type="button" className="si" aria-label="Polygon symbol">
          <Hexagon size={8} />
        </button>
        <button type="button" className="si" aria-label="Area symbol">
          <Square size={8} strokeDasharray="2 2" />
        </button>
        <button type="button" className="si" aria-label="Add symbol">
          <Plus size={8} />
        </button>
        <button type="button" className="si" aria-label="Video symbol">
          <Video size={8} />
        </button>
      </div>
    </div>
  );

  return (
    <div ref={containerRef} className="timeline">
      <div className="tl-top">
        <div className="tl-actions tl-section">
          <span className="tl-title">Timeline</span>
          <div className="tl-ctrls">
            <button type="button" className="cb" aria-label="Step back">
              <Play size={8} className="tl-step-back" />
            </button>
            <button
              type="button"
              className={`cb${!isPlaying ? " on" : ""}`}
              aria-label="Pause"
              onClick={() => setIsPlaying(false)}
            >
              <Pause size={8} />
            </button>
          </div>
          <button
            type="button"
            className={`tl-play${isPlaying ? " on" : ""}`}
            aria-label={isPlaying ? "Pause timeline" : "Play timeline"}
            onClick={() => setIsPlaying(true)}
          >
            <Play size={8} fill="currentColor" /> Play
          </button>
        </div>

        {!isCompact && (
          <div className="tl-annot-wrap tl-section">
            {annotationPanel}
            <ChevronLeft size={12} className="tl-annot-edge" aria-hidden />
          </div>
        )}

        {!isVeryCompact && !isCompact && (
          <div className="tl-search-wrap tl-section">
            <div className="tl-search">
              <Search size={10} aria-hidden />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                aria-label="Search timeline"
              />
            </div>
          </div>
        )}

        {!isCompact && (
          <div className="tl-checks-wrap tl-section">
            <div className="tl-checks">{checkboxControls}</div>
            <button type="button" className="tl-collapse" aria-label="Expand timeline">
              <ChevronLeft size={12} className="tl-collapse-icon" aria-hidden />
            </button>
          </div>
        )}

        {isCompact && (
          <div className="tl-menu">
            <button
              type="button"
              className="tl-menu-btn"
              aria-label="Timeline options"
              aria-expanded={showResponsiveMenu}
              onClick={() => setShowResponsiveMenu((open) => !open)}
            >
              <Menu size={12} />
            </button>

            {showResponsiveMenu && (
              <div className="tl-menu-panel">
                <div className="tl-menu-section">
                  <div className="tl-menu-label">Search</div>
                  <div className="tl-search">
                    <Search size={10} aria-hidden />
                    <input
                      value={q}
                      onChange={(e) => setQ(e.target.value)}
                      aria-label="Search timeline"
                    />
                  </div>
                </div>

                <div className="tl-menu-section">
                  <div className="tl-menu-label">Layers</div>
                  <div className="tl-checks tl-checks--menu">{checkboxControls}</div>
                </div>

                <div className="tl-menu-section">
                  <div className="tl-menu-label">Annotations</div>
                  {annotationPanel}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="tl-body">
        <div ref={gridRef} className="tl-track">
          <div className="tl-grid-inner">
            <div className="tl-months">
              {MONTHS.map((m) => (
                <div className="tl-month" key={m}>
                  <span>{m}</span>
                  <span className="tl-month-tick" aria-hidden />
                </div>
              ))}
            </div>

            <div className="tl-tracks">
              <div className="tl-track-row">
                <div className="tl-track-blocks">
                  <span className="tl-blk-square hostile" aria-hidden />
                  <span className="tl-blk-square hostile" aria-hidden />
                  <span className="tl-blk-square hostile" aria-hidden />
                  <span className="tl-blk-square hostile tl-blk-gap" aria-hidden />
                </div>
              </div>
              <div className="tl-track-row">
                <div className="tl-track-blocks">
                  <span className="tl-blk-square friendly" aria-hidden />
                  <span className="tl-blk-square friendly" aria-hidden />
                  <span className="tl-blk-square friendly" aria-hidden />
                </div>
              </div>
            </div>

            <div
              className="tl-scrubber"
              style={{ left: `${progress}%` }}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
            >
              <div className="tl-scrubber-grab" aria-hidden />
              <span className="tl-scrubber-tag mono">{currentTime}</span>
              <span className="tl-scrubber-tri" aria-hidden />
              <span className="tl-scrubber-line" aria-hidden />
            </div>
          </div>
        </div>

        <div className="tl-legend">
          <div className="tl-legend-head">
            <span className="tl-live-badge">
              <span className="tl-live-dot" aria-hidden /> LIVE
            </span>
          </div>
          <div className="tl-legend-rows">
            <div className="tl-leg-row">
              <div className="tl-leg">
                <span className="sw sw-imagery" aria-hidden />
                Satellite Imagery
              </div>
              <span className="c">4</span>
            </div>
            <div className="tl-leg-row">
              <div className="tl-leg">
                <span className="sw sw-signals" aria-hidden />
                Signals Intel
              </div>
              <span className="c">3</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
