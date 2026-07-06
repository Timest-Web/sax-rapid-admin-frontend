import type { NotificationsQuery } from "./api";

export const notificationKeys = {
  all: ["notifications"] as const,

  count: () => [...notificationKeys.all, "count"] as const,

  lists: () => [...notificationKeys.all, "list"] as const,
  list: (query: NotificationsQuery) => [...notificationKeys.lists(), query] as const,
};