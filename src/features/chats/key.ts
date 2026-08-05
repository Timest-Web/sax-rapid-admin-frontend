export const chatKeys = {
  all: ["admin-chat"] as const,

  conversations: () => [...chatKeys.all, "conversations"] as const,
  conversation: (id: string) => [...chatKeys.all, "conversation", id] as const,
  messages: (conversationId: string) =>
    [...chatKeys.all, "messages", conversationId] as const,

  unreadCount: () => [...chatKeys.all, "unread-count"] as const,
};