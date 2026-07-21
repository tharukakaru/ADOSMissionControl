"use client";

import { useEffect, useRef, type ReactNode } from "react";
import type { SoulChatMessage } from "../types";
import { SoulChatMessageView } from "./SoulChatMessageView";

function renderMessageList(messages: SoulChatMessage[], onAuthorise: () => void) {
  const nodes: ReactNode[] = [];

  for (let index = 0; index < messages.length; index += 1) {
    const message = messages[index];

    if (message.role === "operator" && message.variant === "followup") {
      const next = messages[index + 1];
      if (next?.role === "agent") {
        nodes.push(
          <div key={message.id} className="chat-exchange">
            <div className="msg-user">{message.text}</div>
            <SoulChatMessageView message={next} onAuthorise={onAuthorise} />
          </div>,
        );
        index += 1;
        continue;
      }
    }

    nodes.push(
      <SoulChatMessageView
        key={message.id}
        message={message}
        onAuthorise={onAuthorise}
      />,
    );
  }

  return nodes;
}

export function SoulChatFeed({
  messages,
  onAuthorise,
}: {
  messages: SoulChatMessage[];
  onAuthorise: () => void;
}) {
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  return (
    <div className="chat-shell">
      <div className="chat-glow chat-glow--left" aria-hidden />
      <div className="chat-glow chat-glow--bottom" aria-hidden />
      <div className="chat" ref={chatRef}>
        <div className="chat-feed">
          {renderMessageList(messages, onAuthorise)}
        </div>
      </div>
    </div>
  );
}
