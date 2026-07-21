"use client";

import { Bot, Cpu, Eye, User } from "lucide-react";
import type { Autonomy } from "../types";

const AUTONOMY_OPTIONS: { key: Autonomy; icon: typeof User }[] = [
  { key: "IN-LOOP", icon: User },
  { key: "ON-LOOP", icon: Eye },
  { key: "SUPERVISED", icon: Bot },
];

export function AutonomyFooter({
  autonomy,
  onChange,
}: {
  autonomy: Autonomy;
  onChange: (value: Autonomy) => void;
}) {
  return (
    <div className="autonomy">
      <div className="autonomy-h">
        <span className="autonomy-mark" aria-hidden>
          <Cpu size={9} strokeWidth={2.2} />
        </span>
        LEVEL OF AUTONOMY
      </div>
      <div className="auto-seg" role="group" aria-label="Level of autonomy">
        {AUTONOMY_OPTIONS.map(({ key, icon: Icon }) => (
          <button
            key={key}
            type="button"
            className={`aseg${autonomy === key ? " on" : ""}`}
            aria-pressed={autonomy === key}
            onClick={() => onChange(key)}
          >
            <Icon size={12} strokeWidth={1.75} aria-hidden />
            <span>{key}</span>
          </button>
        ))}
      </div>
      <div className="auto-note">AI proposes; a human must approve every action.</div>
    </div>
  );
}
