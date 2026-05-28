/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { getErrorMessage } from "@/src/lib/get-error";

import { commissionKeys } from "./key";
import {
  getCategoryCommissions,
  getCommissionStats,
  updateCategoryCommissionRate,
  type CategoryCommission,
  type CommissionStatsQuery,
} from "./api";

export function useCommissionStats(query: CommissionStatsQuery) {
  const { data: session, status } = useSession();
  const accessToken = (session as any)?.accessToken as string | undefined;
  const role = (session as any)?.role as string | undefined;

  return useQuery({
    queryKey: commissionKeys.stats(query),
    enabled: status === "authenticated" && !!accessToken && role === "Admin",
    queryFn: () => getCommissionStats(query),
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });
}

export function useCategoryCommissions() {
  const { data: session, status } = useSession();
  const accessToken = (session as any)?.accessToken as string | undefined;
  const role = (session as any)?.role as string | undefined;

  return useQuery({
    queryKey: commissionKeys.categories(),
    enabled: status === "authenticated" && !!accessToken && role === "Admin",
    queryFn: () => getCategoryCommissions(),
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });
}

export function useUpdateCategoryCommissionRate() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (vars: { categoryId: number; commissionRate: number }) =>
      updateCategoryCommissionRate(vars.categoryId, vars.commissionRate),

    onMutate: async (vars) => {
      const toastId = toast.loading("Updating commission rate...");
      await qc.cancelQueries({ queryKey: commissionKeys.categories() });

      const prev = qc.getQueryData<CategoryCommission[]>(
        commissionKeys.categories(),
      );

      // Optimistic update
      qc.setQueryData<CategoryCommission[]>(
        commissionKeys.categories(),
        (old) =>
          old?.map((c) =>
            c.categoryId === vars.categoryId
              ? { ...c, commissionRate: vars.commissionRate }
              : c,
          ) ?? old,
      );

      return { toastId, prev };
    },

    onError: (err, _vars, ctx) => {
      if (ctx?.prev) {
        qc.setQueryData(commissionKeys.categories(), ctx.prev);
      }
      toast.error(getErrorMessage(err), { id: ctx?.toastId });
    },

    onSuccess: (_updated, _vars, ctx) => {
      toast.success("Commission rate updated", { id: ctx?.toastId });
    },

    onSettled: async () => {
      // ensure server truth
      await qc.invalidateQueries({ queryKey: commissionKeys.categories() });
      await qc.invalidateQueries({ queryKey: commissionKeys.all });
    },
  });
}