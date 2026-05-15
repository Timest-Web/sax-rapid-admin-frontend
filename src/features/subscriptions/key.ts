/* eslint-disable @typescript-eslint/no-explicit-any */
export const subscriptionKeys = {
  all: ["subscriptions"] as const,

  lists: () => [...subscriptionKeys.all, "list"] as const,
  list: (q: Record<string, any>) => [...subscriptionKeys.lists(), q] as const,

  details: () => [...subscriptionKeys.all, "detail"] as const,
  detail: (planId: string) => [...subscriptionKeys.details(), planId] as const,
};