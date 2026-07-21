"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { SOUL_CHAT_SEED, SOUL_DEFAULT_REPLY } from "../data";
import type { SoulAction, SoulChatMessage } from "../types";

interface SoulChatContextValue {
  messages: SoulChatMessage[];
  query: string;
  setQuery: (value: string) => void;
  intent: string;
  setIntent: (value: string) => void;
  selectedAction: SoulAction | null;
  setSelectedAction: (action: SoulAction | null) => void;
  addMessage: (message: SoulChatMessage) => void;
  sendIntent: () => void;
}

const SoulChatContext = createContext<SoulChatContextValue | undefined>(undefined);

function buildAgentReply(userText: string): SoulChatMessage {
  return {
    id: crypto.randomUUID(),
    role: "agent",
    label: { who: "SOUL", pill: "GROUND DGX" },
    bubble: SOUL_DEFAULT_REPLY,
    code: {
      lines: [
        { key: "task_assignment", dim: "status:", value: "IN_PROGRESS" },
        { dim: "query_intent:", value: `"${userText}"` },
      ],
    },
  };
}

export function SoulChatProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<SoulChatMessage[]>(SOUL_CHAT_SEED);
  const [query, setQuery] = useState("");
  const [intent, setIntent] = useState("");
  const [selectedAction, setSelectedAction] = useState<SoulAction | null>(null);

  const addMessage = useCallback((message: SoulChatMessage) => {
    setMessages((prev) => [...prev, message]);
  }, []);

  const sendIntent = useCallback(() => {
    const text = intent.trim();
    if (!text) return;

    const operatorMessage: SoulChatMessage = {
      id: crypto.randomUUID(),
      role: "operator",
      variant: "followup",
      senderLabel: "OPERATOR | COMMANDER · ROE-ALPHA ›",
      text,
    };

    setMessages((prev) => [...prev, operatorMessage]);
    setIntent("");

    window.setTimeout(() => {
      setMessages((prev) => [...prev, buildAgentReply(text)]);
    }, 1500);
  }, [intent]);

  const value = useMemo(
    () => ({
      messages,
      query,
      setQuery,
      intent,
      setIntent,
      selectedAction,
      setSelectedAction,
      addMessage,
      sendIntent,
    }),
    [messages, query, intent, selectedAction, addMessage, sendIntent],
  );

  return (
    <SoulChatContext.Provider value={value}>
      {children}
    </SoulChatContext.Provider>
  );
}

export function useSoulChat() {
  const context = useContext(SoulChatContext);
  if (!context) {
    throw new Error("useSoulChat must be used within a SoulChatProvider");
  }
  return context;
}
