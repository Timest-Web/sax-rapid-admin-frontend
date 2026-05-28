/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from "@/src/lib/axios";

type MaybeWrapped<T> = T | { success: boolean; message: string; data: T };

function unwrap<T>(payload: MaybeWrapped<T>): T {
  return (payload as any)?.data ?? (payload as T);
}

export type DashboardStats = {
  visits: number;
  products: number;
  revenue: number;
  currency: string;
  orders: number;
  categories: number;
  stockLevel: number;
  vendors: number;
  customers: number;
  dateFrom: string | null;
  dateTo: string | null;
};

export type DashboardStatsQuery = {
  currency?: string; // default NGN
  dateFrom?: string;
  dateTo?: string;
};

export type TopPerformingProduct = {
  productId: string;
  bundleId: string | null;
  productName: string;
  sku: string;
  unitsSold: number;
};

export type TopProductsQuery = {
  pageNumber: number;
  pageSize: number;
  dateFrom?: string;
  dateTo?: string;
};

export type MonthlyRevenuePoint = {
  month: number;
  year: number;
  totalRevenue: number;
  currency: string;
};

export type MonthlyRevenueQuery = {
  currency?: string; // default NGN
  dateFrom?: string;
  dateTo?: string;
};

export type MonthlyOrdersPoint = {
  month: number;
  year: number;
  orderCount: number;
};

export type MonthlyOrdersQuery = {
  dateFrom?: string;
  dateTo?: string;
};

export type RecentAdminOrder = {
  orderId: string;
  orderNumber: string;
  customerName: string;
  productName: string;
  amount: number;
  currency: string;
  status: string;
  date: string;
};

export type RecentOrdersQuery = {
  currency?: string; // default NGN
  pageNumber: number;
  pageSize: number;
  dateFrom?: string;
  dateTo?: string;
};

export async function getDashboardStats(params: DashboardStatsQuery = {}) {
  const res = await apiClient.get<MaybeWrapped<DashboardStats>>(
    "/api/analytics/dashboard/stats",
    { params: { currency: "NGN", ...params } },
  );
  return unwrap(res.data);
}

export async function getTopPerformingProducts(params: TopProductsQuery) {
  const res = await apiClient.get<MaybeWrapped<TopPerformingProduct[]>>(
    "/api/analytics/analytics/products/top-performing",
    { params },
  );
  return unwrap(res.data);
}

export async function getMonthlyRevenue(params: MonthlyRevenueQuery = {}) {
  const res = await apiClient.get<MaybeWrapped<MonthlyRevenuePoint[]>>(
    "/api/analytics/analytics/revenue/monthly",
    { params: { currency: "NGN", ...params } },
  );
  return unwrap(res.data);
}

export async function getMonthlyOrders(params: MonthlyOrdersQuery = {}) {
  const res = await apiClient.get<MaybeWrapped<MonthlyOrdersPoint[]>>(
    "/api/analytics/analytics/orders/monthly",
    { params },
  );
  return unwrap(res.data);
}

export async function getRecentAdminOrders(params: RecentOrdersQuery) {
  const res = await apiClient.get<MaybeWrapped<RecentAdminOrder[]>>(
    "/api/Orders/admin/recent",
    { params: { currency: "NGN", ...params } },
  );
  return unwrap(res.data);
}