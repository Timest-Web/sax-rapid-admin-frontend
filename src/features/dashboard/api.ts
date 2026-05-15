import { apiClient } from "@/src/lib/axios";


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

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export async function getAdminDashboard() {
  const res = await apiClient.get<ApiResponse<AdminDashboard>>("/api/Admin/dashboard");
  return res.data.data;
}