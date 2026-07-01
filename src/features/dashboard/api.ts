/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from "@/src/lib/axios";

export type DashboardCurrency = "NGN" | "ZAR";

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export type AdminDashboard = {
  totalUsers: number;
  totalVendors: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  pendingVendorApplications: number;
  pendingOrders: number;
  activeProducts: number;
  generatedAt: string;
};

export async function getAdminDashboard() {
  const res = await apiClient.get<ApiResponse<AdminDashboard>>("/api/Admin/dashboard");
  return res.data.data;
}

/** ---------------------------
 * Dashboard Graph
 * --------------------------*/
export type DashboardGraphData = {
  currency: DashboardCurrency;
  year: number;
  revenue: { month: number; monthName: string; amount: number }[];
  orders: { month: number; monthName: string; count: number }[];
};

export async function getDashboardGraph(params: {
  currency: DashboardCurrency;
  year: number;
}) {
  const res = await apiClient.get<ApiResponse<DashboardGraphData>>(
    "/api/analytics/dashboard/graph",
    { params },
  );
  return res.data.data;
}

/** ---------------------------
 * Recent Orders (Admin)
 * --------------------------*/
export type RecentOrder = {
  orderId: string;
  orderNumber: string;
  customerName: string;
  productName: string;
  amount: number;
  currency: DashboardCurrency;
  status: string;
  date: string;
};

export async function getRecentOrders(params: {
  currency: DashboardCurrency;
  pageNumber: number;
  pageSize: number;
  dateFrom?: string;
  dateTo?: string;
}) {
  const res = await apiClient.get<ApiResponse<RecentOrder[]>>(
    "/api/Orders/admin/recent",
    { params },
  );
  return res.data.data;
}

/** ---------------------------
 * Recent Transactions (Admin)
 * --------------------------*/
export type RecentTransaction = {
  orderId: string; // "ORD-...." (string)
  customerName: string;
  productName: string;
  amount: number;
  currency: DashboardCurrency;
  date: string;
};

export async function getRecentTransactions(params: {
  currency: DashboardCurrency;
  pageNumber: number;
  pageSize: number;
  dateFrom?: string;
  dateTo?: string;
}) {
  const res = await apiClient.get<ApiResponse<RecentTransaction[]>>(
    "/api/admin/transactions/recent",
    { params },
  );
  return res.data.data;
}