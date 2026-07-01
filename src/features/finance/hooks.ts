/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { getErrorMessage } from "@/src/lib/get-error";

import { financeKeys } from "./key";
import {
  getFinanceStats,
  getFinanceTransactions,
  getVendorWallets,
  getPaymentGateways,
  toggleVendorWalletFreeze,
  processManualVendorPayout,
  type FinanceStatsQuery,
  type FinanceTransactionsQuery,
  type VendorWalletsQuery,
  type PaymentGatewaysQuery,
  type ManualPayoutInput,
  type VendorWalletDto,
} from "./api";

function enabledAdmin(status: string, accessToken?: string, role?: string) {
  return status === "authenticated" && !!accessToken && role === "Admin";
}

/** ------------------ Queries ------------------ */

export function useFinanceStats(query: FinanceStatsQuery) {
  const { data: session, status } = useSession();
  const accessToken = (session as any)?.accessToken as string | undefined;
  const role = (session as any)?.role as string | undefined;

  return useQuery({
    queryKey: financeKeys.stats(query),
    enabled: enabledAdmin(status, accessToken, role),
    queryFn: () => getFinanceStats(query),
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });
}

export function useFinanceTransactions(query: FinanceTransactionsQuery) {
  const { data: session, status } = useSession();
  const accessToken = (session as any)?.accessToken as string | undefined;
  const role = (session as any)?.role as string | undefined;

  return useQuery({
    queryKey: financeKeys.transactions(query),
    enabled: enabledAdmin(status, accessToken, role),
    queryFn: () => getFinanceTransactions(query),
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });
}

export function useVendorWallets(query: VendorWalletsQuery) {
  const { data: session, status } = useSession();
  const accessToken = (session as any)?.accessToken as string | undefined;
  const role = (session as any)?.role as string | undefined;

  return useQuery({
    queryKey: financeKeys.vendorWallets(query),
    enabled: enabledAdmin(status, accessToken, role),
    queryFn: () => getVendorWallets(query),
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });
}

export function usePaymentGateways(query: PaymentGatewaysQuery) {
  const { data: session, status } = useSession();
  const accessToken = (session as any)?.accessToken as string | undefined;
  const role = (session as any)?.role as string | undefined;

  return useQuery({
    queryKey: financeKeys.gateways(query),
    enabled: enabledAdmin(status, accessToken, role),
    queryFn: () => getPaymentGateways(query),
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });
}

/** ------------------ Mutations ------------------ */

function patchWalletLists(
  qc: ReturnType<typeof useQueryClient>,
  vendorId: string,
  patch: Partial<VendorWalletDto>,
) {
  qc.setQueriesData<VendorWalletDto[]>(
    { queryKey: ["finance", "vendorWallets"] },
    (old) => old?.map((w) => (w.vendorId === vendorId ? { ...w, ...patch } : w)),
  );
}

export function useToggleVendorWalletFreeze() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (vendorId: string) => toggleVendorWalletFreeze(vendorId),

    onMutate: async (vendorId) => {
      const toastId = toast.loading("Updating wallet status...");
      await qc.cancelQueries({ queryKey: financeKeys.all });

      const prev = qc.getQueriesData({ queryKey: ["finance", "vendorWallets"] });

      // optimistic: toggle Active <-> Frozen if present
      const current = (qc.getQueriesData({ queryKey: ["finance", "vendorWallets"] })?.[0]?.[1] ??
        []) as VendorWalletDto[];

      const found = current.find((w) => w.vendorId === vendorId);
      if (found?.status) {
        const next = String(found.status).toLowerCase().includes("frozen") ? "Active" : "Frozen";
        patchWalletLists(qc, vendorId, { status: next });
      }

      return { toastId, prev };
    },

    onError: (err, _vendorId, ctx) => {
      ctx?.prev?.forEach(([key, data]: any) => qc.setQueryData(key, data));
      toast.error(getErrorMessage(err), { id: ctx?.toastId });
    },

    onSuccess: (_ok, _vendorId, ctx) => {
      toast.success("Wallet updated", { id: ctx?.toastId });
    },

    onSettled: async () => {
      await qc.invalidateQueries({ queryKey: financeKeys.all });
    },
  });
}

export function useManualVendorPayout() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (vars: { vendorId: string; payload: ManualPayoutInput }) =>
      processManualVendorPayout(vars.vendorId, vars.payload),

    onMutate: async (vars) => {
      const toastId = toast.loading("Processing payout...");
      await qc.cancelQueries({ queryKey: financeKeys.all });

      const prev = qc.getQueriesData({ queryKey: ["finance", "vendorWallets"] });

      // optimistic: subtract from walletBalance if present in cache
      const current = (qc.getQueriesData({ queryKey: ["finance", "vendorWallets"] })?.[0]?.[1] ??
        []) as VendorWalletDto[];
      const found = current.find((w) => w.vendorId === vars.vendorId);
      if (found) {
        patchWalletLists(qc, vars.vendorId, {
          walletBalance: Math.max(0, (found.walletBalance ?? 0) - vars.payload.amount),
        });
      }

      return { toastId, prev };
    },

    onError: (err, _vars, ctx) => {
      ctx?.prev?.forEach(([key, data]: any) => qc.setQueryData(key, data));
      toast.error(getErrorMessage(err), { id: ctx?.toastId });
    },

    onSuccess: (_ok, _vars, ctx) => {
      toast.success("Payout processed", { id: ctx?.toastId });
    },

    onSettled: async () => {
      await qc.invalidateQueries({ queryKey: financeKeys.all });
    },
  });
}