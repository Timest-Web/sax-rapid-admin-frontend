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
  status: string; // Pending | Approved | Rejected | On Hold | Completed | Failed
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
  const res = await apiClient.get<ApiResponse<WithdrawalStats> | WithdrawalStats>(
    "/api/withdrawals/stats",
    { params: { currency } },
  );
  return unwrap(res.data);
}

export async function getWithdrawals(query: WithdrawalsQuery) {
  const res = await apiClient.get<ApiResponse<WithdrawalRequest[]> | WithdrawalRequest[]>(
    "/api/withdrawals",
    {
      params: {
        currency: query.currency ?? "NGN",
        status: query.status,
        dateFrom: query.dateFrom,
        dateTo: query.dateTo,
        pageNumber: query.pageNumber,
        pageSize: query.pageSize,
      },
    },
  );

  return unwrap(res.data);
}

export async function reviewWithdrawal(withdrawalId: string, payload: ReviewWithdrawalInput) {
  const res = await apiClient.patch<ApiResponse<boolean> | boolean>(
    `/api/withdrawals/${withdrawalId}/review`,
    payload,
  );
  return unwrap(res.data);
}

export async function getProcessingBatch(currency: string) {
  const res = await apiClient.get<ApiResponse<WithdrawalRequest[]> | WithdrawalRequest[]>(
    "/api/withdrawals/batches/processing",
    { params: { currency } },
  );
  return unwrap(res.data);
}

export async function bulkSettleBatch(payload: BulkSettleInput) {
  const res = await apiClient.post<ApiResponse<boolean> | boolean>(
    "/api/withdrawals/batches/settle",
    payload,
  );
  return unwrap(res.data);
}