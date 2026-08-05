import type { WithdrawalsQuery } from "./api";

export const withdrawalKeys = {
  all: ["admin-withdrawals"] as const,

  stats: (currency: string) => [...withdrawalKeys.all, "stats", currency] as const,

  lists: () => [...withdrawalKeys.all, "list"] as const,
  list: (query: WithdrawalsQuery) => [...withdrawalKeys.lists(), query] as const,

  processingBase: () => [...withdrawalKeys.all, "processing"] as const,
  processing: (currency: string) =>
    [...withdrawalKeys.processingBase(), currency] as const,
};