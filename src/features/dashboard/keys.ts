import type { DashboardCurrency } from "./api";

export const dashboardKeys = {
  all: ["admin-dashboard"] as const,

  summary: () => [...dashboardKeys.all, "summary"] as const,

  graph: (currency: DashboardCurrency, year: number) =>
    [...dashboardKeys.all, "graph", { currency, year }] as const,

  recentOrders: (params: {
    currency: DashboardCurrency;
    pageNumber: number;
    pageSize: number;
    dateFrom?: string;
    dateTo?: string;
  }) => [...dashboardKeys.all, "recent-orders", params] as const,

  recentTransactions: (params: {
    currency: DashboardCurrency;
    pageNumber: number;
    pageSize: number;
    dateFrom?: string;
    dateTo?: string;
  }) => [...dashboardKeys.all, "recent-transactions", params] as const,
};