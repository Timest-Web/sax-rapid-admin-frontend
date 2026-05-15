/* eslint-disable @typescript-eslint/no-explicit-any */
export const orderKeys = {
  all: ["orders"] as const,

  stats: () => [...orderKeys.all, "stats"] as const,

  lists: () => [...orderKeys.all, "list"] as const,
  list: (params: Record<string, any>) => [...orderKeys.lists(), params] as const,

  details: () => [...orderKeys.all, "detail"] as const,
  detail: (id: string) => [...orderKeys.details(), id] as const,
};