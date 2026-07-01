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


export type FinanceStatsDto = {
  totalRevenue: number;
  commissionEarned: number;
  pendingPayouts: number;
  netProfit: number;
  currency: string; // "NGN"
};

export type FinanceTransactionDto = {
  transactionId: string;
  reference: string | null;
  amount: number;
  currency: string;
  status: string; // Paid | Pending | Refunded | ...
  type: string; // OrderPayment | ...
  date: string; // ISO
  userName: string;
};

export type VendorWalletDto = {
  vendorId: string;
  vendorName: string;
  walletBalance: number;
  pendingBalance: number;
  lastPayoutDate: string | null;
  status: string; // Active | Frozen | ...
  currency: string;
};

export type PaymentGatewayDto = {
  gatewayName: string;
  monthlyVolume: number;
  currency: string;
  transactionCount: number;
  status: string;
};


export type FinanceStatsQuery = {
  currency?: string; // default NGN
  dateFrom?: string; // ISO date-time
  dateTo?: string; // ISO date-time
};

export type FinanceTransactionsQuery = {
  currency?: string; // default NGN
  status?: string; // Paid | Pending | Refunded ...
  dateFrom?: string;
  dateTo?: string;
  pageNumber: number;
  pageSize: number;
};

export type VendorWalletsQuery = {
  currency?: string; // default NGN
  status?: string; // Active | Frozen ...
  startDate?: string;
  endDate?: string;
  pageNumber: number;
  pageSize: number;
};

export type PaymentGatewaysQuery = {
  currency?: string; // default NGN
  status?: string;
  dateFrom?: string;
  dateTo?: string;
};

export type ManualPayoutInput = { amount: number };

export async function getFinanceStats(query: FinanceStatsQuery = {}) {
  const res = await apiClient.get<ApiResponse<FinanceStatsDto>>("/api/finance/stats", {
    params: { currency: "NGN", ...query },
  });
  return unwrap(res.data);
}

export async function getFinanceTransactions(query: FinanceTransactionsQuery) {
  const res = await apiClient.get<ApiResponse<FinanceTransactionDto[]>>(
    "/api/finance/transactions",
    { params: { currency: "NGN", ...query } },
  );
  return unwrap(res.data);
}

export async function getVendorWallets(query: VendorWalletsQuery) {
  const res = await apiClient.get<ApiResponse<VendorWalletDto[]>>("/api/finance/vendor-wallets", {
    params: { currency: "NGN", ...query },
  });
  return unwrap(res.data);
}

export async function getPaymentGateways(query: PaymentGatewaysQuery = {}) {
  const res = await apiClient.get<ApiResponse<PaymentGatewayDto[]>>(
    "/api/finance/payment-gateways",
    { params: { currency: "NGN", ...query } },
  );
  return unwrap(res.data);
}


export async function toggleVendorWalletFreeze(vendorId: string) {
  const res = await apiClient.post<ApiResponse<boolean>>(
    `/api/finance/vendor-wallets/${vendorId}/toggle-freeze`,
  );
  return unwrap(res.data);
}

export async function processManualVendorPayout(vendorId: string, payload: ManualPayoutInput) {
  const res = await apiClient.post<ApiResponse<boolean>>(
    `/api/finance/vendor-wallets/${vendorId}/payout`,
    payload,
  );
  return unwrap(res.data);
}