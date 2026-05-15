// features/vendors/key.ts
export const vendorKeys = {
  all: ["admin-vendors"] as const,
  lists: () => [...vendorKeys.all, "list"] as const,
  list: (params: { page: number; pageSize: number }) =>
    [...vendorKeys.lists(), params] as const,
  details: () => [...vendorKeys.all, "detail"] as const,
  detail: (id: string) => [...vendorKeys.details(), id] as const,
};