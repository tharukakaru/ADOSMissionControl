"use client";

import { ChevronRight } from "lucide-react";
import type { SoulTurnLabelSpec } from "../types";

function Diamond({ color }: { color: string }) {
  return (
    <svg width="11" height="11" viewBox="0 0 12 12" aria-hidden>
      <rect x="2" y="2" width="8" height="8" transform="rotate(45 6 6)" fill={color} />
    </svg>
  );
}

function SrcStackIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden className="src-badge-icon">
      <rect x="1" y="1.5" width="8" height="2" rx="0.5" fill="currentColor" />
      <rect x="1" y="6.5" width="8" height="2" rx="0.5" fill="currentColor" />
    </svg>
  );
}

export function SoulTurnLabel({ spec }: { spec: SoulTurnLabelSpec }) {
  const diamondColor = spec.diamondColor
    ?? (spec.sub ? "var(--soul-chat-green)" : "var(--soul-chat-yellow)");

  if (spec.sub) {
    return (
      <div className="turn-lbl sub">
        <Diamond color={diamondColor} />
        <span className="who">{spec.who}</span>
        <ChevronRight size={13} className="chev" />
      </div>
    );
  }

  return (
    <div className="turn-lbl">
      <Diamond color={diamondColor} />
      <span className="who">{spec.who}</span>
      <ChevronRight size={12} className="chev" strokeWidth={2.5} />
      {spec.pill ? (
        <span className="src-badge">
          <SrcStackIcon />
          {spec.pill}
        </span>
      ) : null}
    </div>
  );
}
