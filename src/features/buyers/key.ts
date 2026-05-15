/* eslint-disable @typescript-eslint/no-explicit-any */
export const buyerKeys = {
  all: ["buyers"] as const,

  stats: () => [...buyerKeys.all, "stats"] as const,

  lists: () => [...buyerKeys.all, "list"] as const,
  list: (q: Record<string, any>) => [...buyerKeys.lists(), q] as const,

  details: () => [...buyerKeys.all, "detail"] as const,
  detail: (id: string) => [...buyerKeys.details(), id] as const,

  orders: (id: string, q: Record<string, any>) => [...buyerKeys.detail(id), "orders", q] as const,
  activity: (id: string, q: Record<string, any>) => [...buyerKeys.detail(id), "activity", q] as const,
};