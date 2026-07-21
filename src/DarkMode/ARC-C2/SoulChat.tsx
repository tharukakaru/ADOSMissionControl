"use client";

import {
  SoulChatProvider,
  useSoulChat,
  SoulChatHeader,
  SoulChatFeed,
  SoulChatCompose,
} from "./chat";

function SoulChatPanel({ onAuthorise }: { onAuthorise: () => void }) {
  const {
    messages,
    query,
    setQuery,
    intent,
    setIntent,
    selectedAction,
    setSelectedAction,
    sendIntent,
  } = useSoulChat();

  return (
    <aside className="soul">
      <SoulChatHeader query={query} onQueryChange={setQuery} />
      <SoulChatFeed messages={messages} onAuthorise={onAuthorise} />
      <SoulChatCompose
        intent={intent}
        onIntentChange={setIntent}
        onSendIntent={sendIntent}
        selectedAction={selectedAction}
        onSelectAction={setSelectedAction}
      />
    </aside>
  );
}

export function SoulChat({ onAuthorise }: { onAuthorise: () => void }) {
  return (
    <SoulChatProvider>
      <SoulChatPanel onAuthorise={onAuthorise} />
    </SoulChatProvider>
  );
}
