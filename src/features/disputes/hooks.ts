/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { getErrorMessage } from "@/src/lib/get-error";

import { disputeKeys } from "./key";
import {
  getDisputeById,
  getDisputes,
  getDisputeStats,
  resolveDispute,
  type GetDisputesParams,
  type ResolveDisputeBody,
} from "./api";

export function useDisputes(params: GetDisputesParams) {
  const { data: session, status } = useSession();
  const accessToken = (session as any)?.accessToken as string | undefined;
  const role = (session as any)?.role as string | undefined;

  return useQuery({
    queryKey: disputeKeys.list(params as any),
    enabled: status === "authenticated" && !!accessToken && role === "Admin",
    queryFn: () => getDisputes(params),
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });
}

export function useDispute(id?: string) {
  const { data: session, status } = useSession();
  const accessToken = (session as any)?.accessToken as string | undefined;
  const role = (session as any)?.role as string | undefined;

  return useQuery({
    queryKey: disputeKeys.detail(id ?? ""),
    enabled:
      status === "authenticated" && !!accessToken && role === "Admin" && !!id,
    queryFn: () => getDisputeById(id as string),
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });
}

export function useDisputeStats() {
  const { data: session, status } = useSession();
  const accessToken = (session as any)?.accessToken as string | undefined;
  const role = (session as any)?.role as string | undefined;

  return useQuery({
    queryKey: disputeKeys.stats(),
    enabled: status === "authenticated" && !!accessToken && role === "Admin",
    queryFn: () => getDisputeStats(),
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });
}

export function useResolveDispute() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (vars: { caseId: string; body: ResolveDisputeBody }) =>
      resolveDispute(vars.caseId, vars.body),

    onMutate: () => {
      const toastId = toast.loading("Resolving dispute...");
      return { toastId };
    },

    onError: (err, _vars, ctx) => {
      toast.error(getErrorMessage(err), { id: ctx?.toastId });
    },

    onSuccess: (_res, _vars, ctx) => {
      toast.success("Dispute resolved", { id: ctx?.toastId });
    },

    onSettled: async () => {
      await qc.invalidateQueries({ queryKey: disputeKeys.all() });
    },
  });
}