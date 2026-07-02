/* eslint-disable @typescript-eslint/no-explicit-any */
export const vendorKeys = {
  all: ["vendors"] as const,

  lists: () => [...vendorKeys.all, "list"] as const,
  list: (query: { page: number; pageSize: number }) =>
    [...vendorKeys.lists(), query] as const,

  detail: (userId: string) => [...vendorKeys.all, "detail", userId] as const,

  orders: (vendorProfileId: string, params: any) =>
    [...vendorKeys.all, "orders", vendorProfileId, params] as const,

  kyc: (vendorProfileId: string) => [...vendorKeys.all, "kyc", vendorProfileId] as const,

  payouts: (vendorProfileId: string, params: any) =>
    [...vendorKeys.all, "payouts", vendorProfileId, params] as const,

  reviewSummary: (vendorProfileId: string) =>
    [...vendorKeys.all, "reviewSummary", vendorProfileId] as const,

  reviews: (vendorProfileId: string, params: any) =>
    [...vendorKeys.all, "reviews", vendorProfileId, params] as const,
};