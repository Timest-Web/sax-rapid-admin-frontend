import type { AuditLogsQuery } from "./api";

export const auditKeys = {
  all: ["auditLogs"] as const,

  stats: () => [...auditKeys.all, "stats"] as const,

  list: (query: AuditLogsQuery) => [...auditKeys.all, "list", query] as const,

  lists: () => [...auditKeys.all, "list"] as const,
};