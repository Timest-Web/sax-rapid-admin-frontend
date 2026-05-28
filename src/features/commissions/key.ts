/* eslint-disable @typescript-eslint/no-explicit-any */
export const commissionKeys = {
  all: ["commissions"] as const,

  stats: (q: Record<string, any>) => [...commissionKeys.all, "stats", q] as const,

  categories: () => [...commissionKeys.all, "categories"] as const,
};