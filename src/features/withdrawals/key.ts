/* eslint-disable @typescript-eslint/no-explicit-any */
export const withdrawalKeys = {
  all: ["withdrawals"] as const,

  stats: (currency: string) => [...withdrawalKeys.all, "stats", currency] as const,

  lists: () => [...withdrawalKeys.all, "list"] as const,
  list: (q: Record<string, any>) => [...withdrawalKeys.lists(), q] as const,

  processing: (currency: string) => [...withdrawalKeys.all, "processing", currency] as const,
};