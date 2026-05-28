/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from "@/src/lib/axios";

export type ApiResponse<T = unknown> = {
  success: boolean;
  message: string;
  data: T;
};

function unwrap<T>(payload: ApiResponse<T> | T): T {
  return (payload as any)?.data ?? (payload as T);
}

export type WithdrawalStats = {
  pendingRequests: number;
  processedToday: number;
  totalDisbursed: number;
  currency: string;
};

export type WithdrawalRequest = {
  id: string;
  vendorId: string;
  vendorName: string;
  amount: number;
  currency: string;
  status: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  createdAt: string;
  processedAt: string | null;
};

export type WithdrawalsQuery = {
  currency?: string; // default NGN
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  pageNumber: number;
  pageSize: number;
};

export type ReviewWithdrawalInput = {
  action: "Approve" | "Reject" | "Hold" | string;
  note: string;
};

export type BulkSettleInput = {
  withdrawalIds: string[];
  isSuccess: boolean;
  adminNote: string;
  currency: string; // NGN | ZAR
};

export async function getWithdrawalStats(currency = "NGN") {
  const res = await apiClient.get<ApiResponse<WithdrawalStats>>(
    "/api/withdrawals/stats",
    { params: { currency } },
  );
  return unwrap(res.data);
}

export async function getWithdrawals(query: WithdrawalsQuery) {
  const res = await apiClient.get<ApiResponse<WithdrawalRequest[]>>("/api/withdrawals", {
    params: { currency: "NGN", ...query },
  });
  return unwrap(res.data);
}

export async function reviewWithdrawal(withdrawalId: string, payload: ReviewWithdrawalInput) {
  const res = await apiClient.patch<ApiResponse<boolean>>(
    `/api/withdrawals/${withdrawalId}/review`,
    payload,
  );
  return unwrap(res.data);
}

export async function getProcessingBatch(currency: string) {
  const res = await apiClient.get<ApiResponse<WithdrawalRequest[]>>(
    "/api/withdrawals/batches/processing",
    { params: { currency } },
  );
  return unwrap(res.data);
}

export async function bulkSettleBatch(payload: BulkSettleInput) {
  const res = await apiClient.post<ApiResponse<boolean>>(
    "/api/withdrawals/batches/settle",
    payload,
  );
  return unwrap(res.data);
}