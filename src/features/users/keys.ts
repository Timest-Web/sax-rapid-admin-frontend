export const usersKeys = {
  all: ["admin-users"] as const,
  list: (params: { role: string; page: number; pageSize: number }) =>
    [...usersKeys.all, "list", params] as const,
};