/* eslint-disable @typescript-eslint/no-explicit-any */
export const couponKeys = {
  all: ["coupons"] as const,

  stats: () => [...couponKeys.all, "stats"] as const,

  lists: () => [...couponKeys.all, "list"] as const,
  list: (q: Record<string, any>) => [...couponKeys.lists(), q] as const,
};