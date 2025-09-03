"use client";

import { ConversationItem } from "./ConversationItem";

// Mock data for now - TODO: Replace with real data from database
const mockConversations = [
  {
    id: "1",
    title: "New conversation with Agent Builder",
    lastMessageAt: new Date(),
    isActive: true,
  },
];

export function ConversationList() {
  return (
    <div className="flex flex-col gap-1 mt-4">
      <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 px-2">Chats</h3>
      {mockConversations.length > 0 ? (
        mockConversations.map((conversation) => (
          <ConversationItem
            key={conversation.id}
            id={conversation.id}
            title={conversation.title}
            lastMessageAt={conversation.lastMessageAt}
            isActive={conversation.isActive}
          />
        ))
      ) : (
        <p className="text-sm text-stone-500 dark:text-stone-400 px-2 py-4">No conversations yet</p>
      )}
    </div>
  );
}