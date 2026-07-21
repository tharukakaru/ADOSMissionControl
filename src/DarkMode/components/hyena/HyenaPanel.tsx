"use client";

import { Sparkles, X, Shield, Clock, LineChart, CheckCircle, Send } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useArcStore } from "../../store/useArcStore";
import { SUGGESTIONS } from "../../data/dummyData";

const SUG_ICON: Record<string, LucideIcon> = {
  shield: Shield,
  clock: Clock,
  line: LineChart,
  check: CheckCircle,
};

/** Floating decision-support assistant overlay (covers TEWA/batteries by design). */
export function HyenaPanel() {
  const open = useArcStore((s) => s.hyenaOpen);
  const toggleHyena = useArcStore((s) => s.toggleHyena);

  if (!open) return null;

  return (
    <section className="hyena">
      <div className="hyh">
        <div className="hic">
          <Sparkles />
        </div>
        <div>
          <div className="htt">HYENA AI</div>
          <div className="hsub up">Decision Support · Online</div>
        </div>
        <button type="button" className="hx" onClick={toggleHyena} aria-label="Close HYENA AI">
          <X />
        </button>
      </div>

      <div className="hybody">
        <div className="aimsg">
          <div className="ab">
            <Sparkles />
          </div>
          <div className="at">
            HYENA AI online. I have fused situational awareness across all three ARC OS
            subsystems. How can I support the watch, Commander?
          </div>
        </div>
      </div>

      <div className="hysug">
        {SUGGESTIONS.map((s) => {
          const Icon = SUG_ICON[s.icon];
          return (
            <button type="button" className="sug" key={s.id}>
              <Icon />
              {s.label}
              <span className="ar">›</span>
            </button>
          );
        })}
      </div>

      <div className="hyinput">
        <div className="hyfield">
          <span className="ph">Ask HYENA AI…</span>
          <div className="snd">
            <Send />
          </div>
        </div>
        <div className="hydisc">
          HYENA AI may surface uncertain correlations · verify before action
        </div>
      </div>
    </section>
  );
}
