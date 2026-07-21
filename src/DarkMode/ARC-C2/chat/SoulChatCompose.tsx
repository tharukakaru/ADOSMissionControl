"use client";

import { useCallback, type KeyboardEvent } from "react";
import {
  Mic, Send, ArrowLeftRight, Tag, Activity, AlertTriangle,
} from "lucide-react";
import type { SoulAction } from "../types";

const SOUL_ACTIONS: {
  id: SoulAction;
  label: string;
  icon: typeof ArrowLeftRight;
  danger?: boolean;
}[] = [
  { id: "handoff", label: "HANDOFF", icon: ArrowLeftRight },
  { id: "classify", label: "CLASSIFY", icon: Tag },
  { id: "track", label: "TRACK", icon: Activity },
  { id: "engage", label: "ENGAGE", icon: AlertTriangle, danger: true },
];

export function SoulChatCompose({
  intent,
  onIntentChange,
  onSendIntent,
  selectedAction,
  onSelectAction,
}: {
  intent: string;
  onIntentChange: (value: string) => void;
  onSendIntent: () => void;
  selectedAction: SoulAction | null;
  onSelectAction: (action: SoulAction | null) => void;
}) {
  const onIntentKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        onSendIntent();
      }
    },
    [onSendIntent],
  );

  return (
    <div className="soul-compose">
      <div className="soul-input">
        <Mic size={10} className="mic" />
        <input
          value={intent}
          onChange={(e) => onIntentChange(e.target.value)}
          onKeyDown={onIntentKeyDown}
          placeholder="type intent ·"
        />
        <button type="button" className="send" onClick={onSendIntent} aria-label="Send intent">
          <Send size={9} />
        </button>
      </div>

      <div className="soul-actions">
        {SOUL_ACTIONS.map(({ id, label, icon: Icon, danger }) => (
          <button
            key={id}
            type="button"
            className={`sa${danger ? " danger" : ""}${selectedAction === id ? " on" : ""}`}
            aria-pressed={selectedAction === id}
            onClick={() => onSelectAction(selectedAction === id ? null : id)}
          >
            <Icon size={7} />
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
