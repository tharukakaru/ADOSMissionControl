"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const DEFAULT_HOLD_MS = 1500;

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Press-and-hold timer for irreversible authorisation.
 * Progress advances only while the pointer/key is held; release resets.
 * Never auto-completes without a continuous human hold.
 */
export function useHoldToAuthorise({
  enabled,
  durationMs = DEFAULT_HOLD_MS,
  onComplete,
}: {
  enabled: boolean;
  durationMs?: number;
  onComplete: () => void;
}) {
  const [progress, setProgress] = useState(0);
  const [holding, setHolding] = useState(false);
  const rafRef = useRef(0);
  const startRef = useRef(0);
  const completedRef = useRef(false);
  const enabledRef = useRef(enabled);
  const durationRef = useRef(durationMs);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    enabledRef.current = enabled;
    durationRef.current = durationMs;
    onCompleteRef.current = onComplete;
  }, [enabled, durationMs, onComplete]);

  const cancel = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    rafRef.current = 0;
    startRef.current = 0;
    completedRef.current = false;
    setHolding(false);
    setProgress(0);
  }, []);

  const start = useCallback(() => {
    if (!enabledRef.current || completedRef.current) return;
    cancelAnimationFrame(rafRef.current);
    startRef.current = performance.now();
    completedRef.current = false;
    setHolding(true);
    setProgress(0);

    const tick = () => {
      if (!enabledRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = 0;
        startRef.current = 0;
        completedRef.current = false;
        setHolding(false);
        setProgress(0);
        return;
      }
      const elapsed = performance.now() - startRef.current;
      const stepped = prefersReducedMotion();
      const raw = Math.min(1, elapsed / durationRef.current);
      const next = stepped ? Math.floor(raw * 5) / 5 : raw;
      setProgress(next);

      if (elapsed >= durationRef.current) {
        if (!completedRef.current) {
          completedRef.current = true;
          setProgress(1);
          setHolding(false);
          onCompleteRef.current();
        }
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  return {
    progress: enabled ? progress : 0,
    holding: enabled && holding,
    start,
    cancel,
  };
}
