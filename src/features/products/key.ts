/* eslint-disable @typescript-eslint/no-explicit-any */
export const productKeys = {
  all: ["admin-products"] as const,

  lists: () => [...productKeys.all, "list"] as const,
  list: (q: Record<string, any>) => [...productKeys.lists(), q] as const,

  details: () => [...productKeys.all, "detail"] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,

  counts: () => [...productKeys.all, "count"] as const,
  count: (status?: string) =>
    [...productKeys.counts(), { status: status ?? "ALL" }] as const,
};