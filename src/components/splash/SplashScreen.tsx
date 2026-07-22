/**
 * @module SplashScreen
 * @description Full-screen boot splash shown once per app load, before any
 * other UI (including the Welcome onboarding modal). Renders the ARC OS
 * HYENA background artwork (halftone pattern + wordmark baked into a single
 * image) behind a dark overlay, then fades out on its own after a short
 * delay or immediately on click/key press.
 *
 * Gating lives in module scope (not a store) — this is a per-page-load
 * splash, not a persisted onboarding flag, so it should reappear on every
 * fresh launch/reload but never re-show on client-side navigation between
 * routes within the same load.
 *
 * BUGFIX: `mounted`'s initial value used to be computed from the
 * module-scope `hasShownThisLoad` flag directly in useState's initializer.
 * That flag is set once per server process, not per request/page-load — in
 * dev (Turbopack hot reload) or a long-lived Node server, a later SSR pass
 * could see `hasShownThisLoad === true` and render nothing, while a fresh
 * client always starts with `hasShownThisLoad === false` and renders the
 * splash. Server and client output disagreeing = hydration mismatch. Fixed
 * by always starting `mounted` at `false` (matches server, which never runs
 * the module-flag check) and only deciding whether to actually show the
 * splash inside a `useEffect`, which only ever runs on the client after
 * hydration — so the very first paint is identical on both sides.
 * @license GPL-3.0-only
 */

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

// Module-scope flag: survives client-side route changes (same JS context)
// but resets on a real reload/new tab, which is what "boot splash" means.
let hasShownThisLoad = false;

const AUTO_DISMISS_MS = 2600;
const FADE_MS = 400;

export function SplashScreen() {
  // Always start unmounted — identical on server and the client's first
  // render, so there's nothing to mismatch during hydration. The decision
  // to actually show it happens client-side only, in the effect below.
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [fadingOut, setFadingOut] = useState(false);

  // Client-only: decide once, after mount, whether this load should show
  // the splash at all.
  useEffect(() => {
    if (hasShownThisLoad) return;
    hasShownThisLoad = true;
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    // Mount starts at opacity 0; flip to visible on the next frame so the
    // opacity transition actually animates in rather than starting at full.
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(raf);
  }, [mounted]);

  function dismiss() {
    setFadingOut(true);
    window.setTimeout(() => setMounted(false), FADE_MS);
  }

  useEffect(() => {
    if (!mounted) return;
    const timer = window.setTimeout(() => dismiss(), AUTO_DISMISS_MS);
    return () => window.clearTimeout(timer);
  }, [mounted]);

  if (!mounted) return null;

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Dismiss splash screen"
      onClick={dismiss}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") dismiss();
      }}
      className="fixed inset-0 z-[9999] cursor-pointer overflow-hidden bg-black transition-opacity ease-out"
      style={{
        opacity: visible && !fadingOut ? 1 : 0,
        transitionDuration: `${FADE_MS}ms`,
      }}
    >
      <Image
        src="/splash/splash-bg.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-contain sm:object-cover"
      />
      {/* Dark overlay so the artwork reads as a true boot screen and any
          future foreground content stays legible. The source artwork
          already bakes in its own vignette; this adds a uniform scrim
          on top of it. */}
      <div className="absolute inset-0 bg-black/35" />
    </div>
  );
}
