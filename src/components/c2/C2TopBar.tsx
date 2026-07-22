"use client";

import { useState } from "react";
import { Search, Bell, UserCircle2 } from "lucide-react";
import { useConnectionQuality } from "@/hooks/use-connection-quality";
import { cn } from "@/lib/utils";

/**
 * VISUAL REDESIGN NOTE (this pass):
 * 1. C2 Battle Management / HYENA toggle is now genuinely clickable on both
 *    sides — previously C2BM was `disabled` since that mode has no real
 *    page to switch to yet. Per your instruction, the toggle behavior
 *    itself (yellow highlight moves between the two, no page change) is
 *    what matters right now, independent of whether C2BM mode has real
 *    content — wire in real navigation here once it does.
 * 2. User icon recolored to the light blue from your reference
 *    (--redesign-blue, #5aa9e6) instead of the neutral gray it had before.
 * 3. Bell icon now shows a small red notification dot — was missing
 *    entirely before.
 * 4. Center green tint — measured this directly from your reference PNG
 *    (sampled actual pixel values across the bar) rather than eyeballing
 *    it again. It's much wider than my last attempt: a soft horizontal
 *    gradient spanning roughly the middle 70% of the whole bar's width,
 *    peaking around 40% of the way across (roughly under the LINK/
 *    AUTONOMY text, not exactly centered on it), fading to fully
 *    transparent well before either edge. My previous version scoped the
 *    gradient tightly to just the text block's own width (~100px each
 *    side), which is why it looked more like a narrow glow than a wide
 *    gradient. Fixed by applying it across the entire bar instead of a
 *    small box behind the text.
 */
export function C2TopBar() {
  const { latencyMs } = useConnectionQuality();
  const [mode, setMode] = useState<"hyena" | "c2bm">("hyena");

  return (
    <div
      className="relative h-8 flex items-center justify-between px-3 border-b border-[var(--redesign-border)] text-[11px] shrink-0 overflow-hidden"
      style={{ background: "var(--redesign-bg-topbar)" }}
    >
      {/* Wide green tint spanning most of the bar, peaking under the
          LINK/AUTONOMY block — measured from the reference image, not a
          small box scoped to the text anymore. */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, transparent 10%, color-mix(in srgb, var(--redesign-green) 11%, transparent) 38%, color-mix(in srgb, var(--redesign-green) 11%, transparent) 44%, transparent 82%, transparent 100%)",
        }}
      />
      {/* Left — branding + mode toggle */}
      <div className="relative flex items-center gap-3 z-10">
        <div className="flex items-baseline gap-1">
          <span className="font-display text-sm font-semibold tracking-[0.05em] text-[var(--redesign-text-primary)]">
            ARC <span className="text-[var(--redesign-yellow)]">O</span>S
          </span>
        </div>

        <div className="flex items-center gap-0.5 rounded overflow-hidden border border-[var(--redesign-border)]">
          <button
            onClick={() => setMode("c2bm")}
            title="C2 Battle Management"
            className={cn(
              "px-2 py-0.5 text-[10px] font-mono font-semibold tracking-wider uppercase cursor-pointer transition-colors",
              mode === "c2bm"
                ? "bg-[var(--redesign-yellow)] text-[var(--redesign-bg-black)]"
                : "text-[var(--redesign-text-secondary)] hover:text-[var(--redesign-text-primary)]"
            )}
          >
            C2 Battle Management
          </button>
          <button
            onClick={() => setMode("hyena")}
            title="HYENA"
            className={cn(
              "px-2 py-0.5 text-[10px] font-display font-bold tracking-wider uppercase cursor-pointer transition-colors",
              mode === "hyena"
                ? "bg-[var(--redesign-yellow)] text-[var(--redesign-bg-black)]"
                : "text-[var(--redesign-text-secondary)] hover:text-[var(--redesign-text-primary)]"
            )}
          >
            HYENA
          </button>
        </div>

        <span className="bg-[var(--redesign-red)]/20 text-[var(--redesign-red)] px-1.5 py-0.5 text-[9px] font-mono font-semibold">
          pre Alpha X
        </span>
      </div>

      {/* Center — link status */}
      <div className="relative flex items-center gap-6 text-[var(--redesign-text-secondary)] font-mono z-10">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-status-success" />
          <span>LINK {latencyMs || 10}ms</span>
        </div>
        <div>
          AUTONOMY: <span className="text-[var(--redesign-yellow)] font-semibold">ON-LOOP</span>
        </div>
      </div>

      {/* Right — search / notifications / operator, nothing else */}
      <div className="relative flex items-center gap-3 z-10">
        <button className="p-1 text-[var(--redesign-text-secondary)] hover:text-[var(--redesign-text-primary)] transition-colors">
          <Search size={13} />
        </button>
        <button className="relative p-1 text-[var(--redesign-text-secondary)] hover:text-[var(--redesign-text-primary)] transition-colors">
          <Bell size={13} />
          <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-[var(--redesign-red)]" />
        </button>
        <div className="flex items-center gap-2 pl-2 border-l border-[var(--redesign-border)]">
          <UserCircle2 size={18} className="text-[var(--redesign-blue)]" />
          <div className="text-right">
            <div className="text-[var(--redesign-text-primary)] font-semibold text-[10px]">K. Premachandra</div>
            <div className="text-[var(--redesign-text-secondary)] text-[9px]">Commander · ROE-Alpha</div>
          </div>
        </div>
      </div>
    </div>
  );
}
