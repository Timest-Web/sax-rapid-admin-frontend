export const dashboardKeys = {
  all: ["admin-dashboard"] as const,
  summary: () => [...dashboardKeys.all, "summary"] as const,
};