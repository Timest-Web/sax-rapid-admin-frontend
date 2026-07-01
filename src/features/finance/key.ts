import type {
  FinanceStatsQuery,
  FinanceTransactionsQuery,
  VendorWalletsQuery,
  PaymentGatewaysQuery,
} from "./api";

export const financeKeys = {
  all: ["finance"] as const,

  stats: (query: FinanceStatsQuery) => [...financeKeys.all, "stats", query] as const,

  transactions: (query: FinanceTransactionsQuery) =>
    [...financeKeys.all, "transactions", query] as const,

  vendorWallets: (query: VendorWalletsQuery) =>
    [...financeKeys.all, "vendorWallets", query] as const,

  gateways: (query: PaymentGatewaysQuery) => [...financeKeys.all, "gateways", query] as const,
};