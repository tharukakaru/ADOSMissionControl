/**
 * @deprecated Replaced by CSS Grid layout in arc.css — kept for revertibility.
 */
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";

const STORAGE_KEY = "arc-c2.layout";

const DEFAULTS = {
  soulWidth: 460,
  decideWidth: 306,
  entWidth: 296,
  timelineHeight: 196,
} as const;

const LIMITS = {
  soul: { min: 320, max: 720 },
  decide: { min: 240, max: 460 },
  ent: { min: 240, max: 420 },
  timeline: { min: 120, max: 320 },
} as const;

type ColPanel = "soul" | "decide" | "ent";
type DragKind = ColPanel | "timeline";

interface DragSession {
  kind: DragKind;
  startX: number;
  startY: number;
  startSoul: number;
  startDecide: number;
  startEnt: number;
  startTimeline: number;
}

export interface ResizeHandleProps {
  onPointerDown: (e: ReactPointerEvent<HTMLDivElement>) => void;
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function loadStored(): Partial<typeof DEFAULTS> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Partial<typeof DEFAULTS>;
  } catch {
    return {};
  }
}

type LayoutState = {
  soulWidth: number;
  decideWidth: number;
  entWidth: number;
  timelineHeight: number;
};

function persistLayout(layout: LayoutState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(layout));
}

function applyDrag(session: DragSession, dx: number, dy: number, setters: {
  setSoulWidth: (n: number) => void;
  setDecideWidth: (n: number) => void;
  setEntWidth: (n: number) => void;
  setTimelineHeight: (n: number) => void;
}) {
  switch (session.kind) {
    case "soul":
      setters.setSoulWidth(clamp(session.startSoul + dx, LIMITS.soul.min, LIMITS.soul.max));
      break;
    case "decide":
      setters.setDecideWidth(clamp(session.startDecide + dx, LIMITS.decide.min, LIMITS.decide.max));
      break;
    case "ent":
      setters.setEntWidth(clamp(session.startEnt - dx, LIMITS.ent.min, LIMITS.ent.max));
      break;
    case "timeline":
      setters.setTimelineHeight(clamp(session.startTimeline - dy, LIMITS.timeline.min, LIMITS.timeline.max));
      break;
  }
}

export function useArcC2Layout() {
  const [soulWidth, setSoulWidth] = useState(() =>
    clamp(loadStored().soulWidth ?? DEFAULTS.soulWidth, LIMITS.soul.min, LIMITS.soul.max),
  );
  const [decideWidth, setDecideWidth] = useState(() =>
    clamp(loadStored().decideWidth ?? DEFAULTS.decideWidth, LIMITS.decide.min, LIMITS.decide.max),
  );
  const [entWidth, setEntWidth] = useState(() =>
    clamp(loadStored().entWidth ?? DEFAULTS.entWidth, LIMITS.ent.min, LIMITS.ent.max),
  );
  const [timelineHeight, setTimelineHeight] = useState(() =>
    clamp(loadStored().timelineHeight ?? DEFAULTS.timelineHeight, LIMITS.timeline.min, LIMITS.timeline.max),
  );
  const [resizing, setResizing] = useState(false);
  const sessionRef = useRef<DragSession | null>(null);
  const layoutRef = useRef({ soulWidth, decideWidth, entWidth, timelineHeight });
  const listenersRef = useRef<{ onMove: (e: PointerEvent) => void; onUp: (e: PointerEvent) => void } | null>(null);

  useEffect(() => {
    layoutRef.current = { soulWidth, decideWidth, entWidth, timelineHeight };
  }, [soulWidth, decideWidth, entWidth, timelineHeight]);

  const endDrag = useCallback(() => {
    const listeners = listenersRef.current;
    if (listeners) {
      window.removeEventListener("pointermove", listeners.onMove);
      window.removeEventListener("pointerup", listeners.onUp);
      window.removeEventListener("pointercancel", listeners.onUp);
      listenersRef.current = null;
    }
    if (sessionRef.current) {
      persistLayout(layoutRef.current);
    }
    sessionRef.current = null;
    setResizing(false);
  }, []);

  const beginDrag = useCallback((kind: DragKind, e: ReactPointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    endDrag();

    const layout = layoutRef.current;
    sessionRef.current = {
      kind,
      startX: e.clientX,
      startY: e.clientY,
      startSoul: layout.soulWidth,
      startDecide: layout.decideWidth,
      startEnt: layout.entWidth,
      startTimeline: layout.timelineHeight,
    };
    setResizing(true);

    const onMove = (ev: PointerEvent) => {
      const session = sessionRef.current;
      if (!session) return;
      applyDrag(
        session,
        ev.clientX - session.startX,
        ev.clientY - session.startY,
        { setSoulWidth, setDecideWidth, setEntWidth, setTimelineHeight },
      );
    };

    const onUp = () => {
      endDrag();
    };

    listenersRef.current = { onMove, onUp };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
  }, [endDrag]);

  useEffect(() => () => endDrag(), [endDrag]);

  const onSoulPointerDown = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => beginDrag("soul", e),
    [beginDrag],
  );
  const onDecidePointerDown = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => beginDrag("decide", e),
    [beginDrag],
  );
  const onEntPointerDown = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => beginDrag("ent", e),
    [beginDrag],
  );
  const onTimelinePointerDown = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => beginDrag("timeline", e),
    [beginDrag],
  );

  const soulHandle = useMemo<ResizeHandleProps>(
    () => ({ onPointerDown: onSoulPointerDown }),
    [onSoulPointerDown],
  );
  const decideHandle = useMemo<ResizeHandleProps>(
    () => ({ onPointerDown: onDecidePointerDown }),
    [onDecidePointerDown],
  );
  const entHandle = useMemo<ResizeHandleProps>(
    () => ({ onPointerDown: onEntPointerDown }),
    [onEntPointerDown],
  );
  const timelineHandle = useMemo<ResizeHandleProps>(
    () => ({ onPointerDown: onTimelinePointerDown }),
    [onTimelinePointerDown],
  );

  return {
    soulWidth,
    decideWidth,
    entWidth,
    timelineHeight,
    resizing,
    soulHandle,
    decideHandle,
    entHandle,
    timelineHandle,
  };
}
