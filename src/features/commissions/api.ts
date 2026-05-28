/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from "@/src/lib/axios";

type MaybeWrapped<T> = T | { success: boolean; message: string; data: T };

function unwrap<T>(payload: MaybeWrapped<T>): T {
  return (payload as any)?.data ?? (payload as T);
}

export type CommissionStats = {
  totalCommissionRevenue: number;
  currency: string;
  averagePlatformRate: number;
  highestEarningCategory: string | null;
};

export type CategoryCommission = {
  categoryId: number;
  categoryName: string;
  commissionRate: number;
};

export type CommissionStatsQuery = {
  currency?: string;
  dateFrom?: string;
  dateTo?: string;
};

export async function getCommissionStats(params: CommissionStatsQuery = {}) {
  const res = await apiClient.get<MaybeWrapped<CommissionStats>>(
    "/api/commissions/stats",
    { params: { currency: "NGN", ...params } },
  );
  return unwrap(res.data);
}

export async function getCategoryCommissions() {
  const res = await apiClient.get<MaybeWrapped<CategoryCommission[]>>(
    "/api/commissions/categories",
  );
  return unwrap(res.data);
}

export async function updateCategoryCommissionRate(
  categoryId: number,
  commissionRate: number,
) {
  const res = await apiClient.patch<MaybeWrapped<CategoryCommission>>(
    `/api/commissions/categories/${categoryId}`,
    { commissionRate },
  );
  return unwrap(res.data);
}