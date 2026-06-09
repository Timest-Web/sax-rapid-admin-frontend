export const roleKeys = {
  all: ["admin-roles"] as const,
  list: () => [...roleKeys.all, "list"] as const,
  stats: () => [...roleKeys.all, "stats"] as const,
  permissions: (roleId: string) => [...roleKeys.all, "permissions", roleId] as const,
};