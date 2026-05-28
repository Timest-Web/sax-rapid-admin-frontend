/* eslint-disable @typescript-eslint/no-explicit-any */
export const vendorKeys = {
  all: ["vendors"] as const,

  lists: () => [...vendorKeys.all, "list"] as const,
  list: (q: Record<string, any>) => [...vendorKeys.lists(), q] as const,

  details: () => [...vendorKeys.all, "detail"] as const,
  detail: (id: string) => [...vendorKeys.details(), id] as const,

  orders: (vendorId: string, q: Record<string, any>) =>
    [...vendorKeys.detail(vendorId), "orders", q] as const,

  kyc: (vendorId: string) => [...vendorKeys.detail(vendorId), "kyc"] as const,

  payouts: (vendorId: string, q: Record<string, any>) =>
    [...vendorKeys.detail(vendorId), "payouts", q] as const,

  reviewSummary: (vendorId: string) =>
    [...vendorKeys.detail(vendorId), "reviews-summary"] as const,

  reviews: (vendorId: string, q: Record<string, any>) =>
    [...vendorKeys.detail(vendorId), "reviews", q] as const,
};
