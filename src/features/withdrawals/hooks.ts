/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { getErrorMessage } from "@/src/lib/get-error";

import { withdrawalKeys } from "./key";
import {
  bulkSettleBatch,
  getProcessingBatch,
  getWithdrawals,
  getWithdrawalStats,
  reviewWithdrawal,
  type WithdrawalRequest,
  type WithdrawalsQuery,
  type ReviewWithdrawalInput,
  type BulkSettleInput,
} from "./api";

function hasRole(roleValue: unknown, allowed: string[]) {
  if (!roleValue) return false;
  if (Array.isArray(roleValue)) return roleValue.some((r) => allowed.includes(String(r)));
  return allowed.includes(String(roleValue));
}

// choose who can access withdrawals pages
function enabledFinance(status: string, accessToken?: string, role?: unknown) {
  return (
    status === "authenticated" &&
    !!accessToken &&
    hasRole(role, ["SuperAdmin", "Admin", "Account"])
  );
}

export function useWithdrawalStats(currency = "NGN") {
  const { data: session, status } = useSession();
  const accessToken = (session as any)?.accessToken as string | undefined;
  const role = (session as any)?.role;

  return useQuery({
    queryKey: withdrawalKeys.stats(currency),
    enabled: enabledFinance(status, accessToken, role),
    queryFn: () => getWithdrawalStats(currency),
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });
}

export function useWithdrawals(query: WithdrawalsQuery) {
  const { data: session, status } = useSession();
  const accessToken = (session as any)?.accessToken as string | undefined;
  const role = (session as any)?.role;

  return useQuery({
    queryKey: withdrawalKeys.list(query),
    enabled: enabledFinance(status, accessToken, role),
    queryFn: () => getWithdrawals(query),
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });
}

export function useProcessingBatch(currency: string) {
  const { data: session, status } = useSession();
  const accessToken = (session as any)?.accessToken as string | undefined;
  const role = (session as any)?.role;

  return useQuery({
    queryKey: withdrawalKeys.processing(currency),
    enabled: enabledFinance(status, accessToken, role) && !!currency,
    queryFn: () => getProcessingBatch(currency),
    staleTime: 10_000,
    refetchOnWindowFocus: false,
  });
}

function statusFromAction(action: string) {
  const a = String(action || "").toLowerCase();
  if (a.includes("approve")) return "Approved";
  if (a.includes("reject")) return "Rejected";
  if (a.includes("hold")) return "On Hold";
  return "Reviewed";
}

function patchWithdrawalEverywhere(
  qc: ReturnType<typeof useQueryClient>,
  withdrawalId: string,
  patch: Partial<WithdrawalRequest>,
) {
  qc.setQueriesData<WithdrawalRequest[]>(
    { queryKey: withdrawalKeys.lists() },
    (old) => (old ? old.map((w) => (w.id === withdrawalId ? { ...w, ...patch } : w)) : old),
  );

  qc.setQueriesData<WithdrawalRequest[]>(
    { queryKey: withdrawalKeys.processingBase() },
    (old) => (old ? old.map((w) => (w.id === withdrawalId ? { ...w, ...patch } : w)) : old),
  );
}

export function useReviewWithdrawal() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (vars: { withdrawalId: string; payload: ReviewWithdrawalInput }) =>
      reviewWithdrawal(vars.withdrawalId, vars.payload),

    onMutate: async (vars) => {
      const toastId = toast.loading("Reviewing withdrawal...");

      await qc.cancelQueries({ queryKey: withdrawalKeys.all });

      const prev = qc.getQueriesData({ queryKey: withdrawalKeys.all });

      patchWithdrawalEverywhere(qc, vars.withdrawalId, {
        status: statusFromAction(vars.payload.action),
        processedAt: new Date().toISOString(),
      });

      return { toastId, prev };
    },

    onError: (err, _vars, ctx) => {
      ctx?.prev?.forEach(([key, data]: any) => qc.setQueryData(key, data));
      toast.error(getErrorMessage(err), { id: ctx?.toastId });
    },

    onSuccess: (_ok, _vars, ctx) => {
      toast.success("Withdrawal reviewed", { id: ctx?.toastId });
    },

    onSettled: async () => {
      await qc.invalidateQueries({ queryKey: withdrawalKeys.all });
    },
  });
}

export function useBulkSettleBatch() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: BulkSettleInput) => bulkSettleBatch(payload),
    onMutate: () => ({ toastId: toast.loading("Settling batch...") }),
    onSuccess: (_ok, _vars, ctx) => {
      toast.success("Batch settled", { id: ctx?.toastId });
    },
    onError: (err, _vars, ctx) => {
      toast.error(getErrorMessage(err), { id: ctx?.toastId });
    },
    onSettled: async () => {
      await qc.invalidateQueries({ queryKey: withdrawalKeys.all });
    },
  });
}