"use client";

import { ShieldCheck, ChevronsRight } from "lucide-react";
import type { SoulChatMessage } from "../types";
import { SoulTurnLabel } from "./SoulTurnLabel";
import { SoulCodeBlock } from "./SoulCodeBlock";

export function SoulChatMessageView({
  message,
  onAuthorise,
}: {
  message: SoulChatMessage;
  onAuthorise: () => void;
}) {
  if (message.role === "operator") {
    if (message.variant === "intro") {
      return (
        <div className="chat-start">
          <div className="chat-op">{message.senderLabel}</div>
          <div className="msg-user">{message.text}</div>
        </div>
      );
    }

    return (
      <div className="chat-exchange">
        <div className="msg-user">{message.text}</div>
      </div>
    );
  }

  const turnClass = message.actionLayout ? "turn turn--action" : "turn";

  return (
    <article className={turnClass}>
      <SoulTurnLabel spec={message.label} />

      {message.actionLayout ? (
        <div className="turn-content">
          {message.bubble ? <div className="bubble">{message.bubble}</div> : null}
          {message.action ? (
            <div className="turn-action-block">
              <SoulCodeBlock block={message.action.code} />
              <button type="button" className="btn-authorise" onClick={onAuthorise}>
                <ShieldCheck size={11} strokeWidth={2} aria-hidden />
                <span className="btn-authorise-label">{message.action.buttonLabel}</span>
                <ChevronsRight size={11} strokeWidth={2.5} aria-hidden />
              </button>
            </div>
          ) : null}
        </div>
      ) : (
        <>
          {message.bubble ? <div className="bubble">{message.bubble}</div> : null}
          {message.code ? <SoulCodeBlock block={message.code} /> : null}
          {message.nested ? (
            <div className="turn-sub">
              {message.nested.labels.map((label) => (
                <SoulTurnLabel key={`${message.id}-${label.who}`} spec={label} />
              ))}
              <div className={`bubble${message.nested.bubbleSub ? " bubble--sub" : ""}`}>
                {message.nested.bubble}
              </div>
            </div>
          ) : null}
        </>
      )}
    </article>
  );
}
