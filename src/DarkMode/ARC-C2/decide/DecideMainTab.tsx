"use client";

import { Sparkles, ShieldCheck, ChevronsRight } from "lucide-react";
import { COAS } from "../data";
import { CoaCard } from "./CoaCard";
import { DataSourcesSection } from "./DataSourcesSection";

export function DecideMainTab({
  selectedCoa,
  onSelectCoa,
  onRequestAuthorise,
}: {
  selectedCoa: string;
  onSelectCoa: (id: string) => void;
  onRequestAuthorise: () => void;
}) {
  return (
    <div className="dec-scroll">
      <div className="dec-sub">
        <Sparkles size={11} className="spark" />
        <span className="t">SOUL AI · DECISION</span>
        <span className="agent">DECISION AGENT</span>
      </div>

      <div className="await">
        <div className="lbl">AWAITING AUTHORISATION</div>
        <div className="ttl">INTERCEPT → TRACK 552 (Group-3 UAS)</div>
        <div className="sub">Effector SE-204 · 88% confidence</div>
      </div>

      <div className="sec-lbl">RECOMMENDED COURSES OF ACTION</div>

      {COAS.map((coa) => (
        <CoaCard
          key={coa.id}
          coa={coa}
          selected={selectedCoa === coa.id}
          onSelect={() => onSelectCoa(coa.id)}
        />
      ))}

      <div className="dec-action">
        <button type="button" className="btn-dec-authorise" onClick={onRequestAuthorise}>
          <ShieldCheck size={12} strokeWidth={2} aria-hidden />
          <span>REVIEW &amp; AUTHORISE</span>
          <ChevronsRight size={12} strokeWidth={2.5} aria-hidden />
        </button>
        <div className="dec-note">
          Every recommendation is explainable and traced to the entities, rules, and reasoning that
          produced it. Use of force always requires a positive human gate.
        </div>
      </div>

      <DataSourcesSection />
    </div>
  );
}
