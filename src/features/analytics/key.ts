/* eslint-disable @typescript-eslint/no-explicit-any */
export const analyticsKeys = {
  all: ["analytics"] as const,

  dashboardStats: (q: Record<string, any>) => [...analyticsKeys.all, "dashboard-stats", q] as const,
  monthlyRevenue: (q: Record<string, any>) => [...analyticsKeys.all, "monthly-revenue", q] as const,
  monthlyOrders: (q: Record<string, any>) => [...analyticsKeys.all, "monthly-orders", q] as const,
  topProducts: (q: Record<string, any>) => [...analyticsKeys.all, "top-products", q] as const,
  recentOrders: (q: Record<string, any>) => [...analyticsKeys.all, "recent-orders", q] as const,
};