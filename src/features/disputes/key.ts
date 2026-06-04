export const disputeKeys = {
  all: () => ["disputes"] as const,
  list: (params: Record<string, unknown>) => ["disputes", "list", params] as const,
  detail: (id: string) => ["disputes", "detail", id] as const,
  stats: () => ["disputes", "stats"] as const,
};