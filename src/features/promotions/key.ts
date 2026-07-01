export const promoKeys = {
  all: ["admin-promotions"] as const,
  stats: () => [...promoKeys.all, "stats"] as const,
  campaigns: (q: unknown) => [...promoKeys.all, "campaigns", q] as const,
};