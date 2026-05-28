/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { buyerKeys } from "./key";
import { BuyerListItem, BuyerProfile, getBuyerActivity, getBuyerOrders, getBuyerProfile, getBuyers, getBuyerStats, reactivateBuyer, suspendBuyer, UpdatedUser, updateUser, UpdateUserInput, type BuyersQuery } from "./api";
import { toast } from "sonner";
import { getErrorMessage } from "@/src/lib/get-error";

export function useBuyers(query: BuyersQuery) {
  const { data: session, status } = useSession();
  const accessToken = (session as any)?.accessToken as string | undefined;
  const role = (session as any)?.role as string | undefined;

  return useQuery({
    queryKey: buyerKeys.list(query),
    enabled: status === "authenticated" && !!accessToken && role === "Admin",
    queryFn: () => getBuyers(query),
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });
}

export function useBuyerStats() {
  const { data: session, status } = useSession();
  const accessToken = (session as any)?.accessToken as string | undefined;
  const role = (session as any)?.role as string | undefined;

  return useQuery({
    queryKey: buyerKeys.stats(),
    enabled: status === "authenticated" && !!accessToken && role === "Admin",
    queryFn: () => getBuyerStats(),
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });
}

export function useBuyerProfile(customerId?: string) {
  const { data: session, status } = useSession();
  const accessToken = (session as any)?.accessToken as string | undefined;

  return useQuery({
    queryKey: customerId ? buyerKeys.detail(customerId) : ["buyers", "detail", "missing"],
    enabled: !!customerId && status === "authenticated" && !!accessToken,
    queryFn: () => getBuyerProfile(customerId!),
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });
}

export function useBuyerOrders(customerId?: string, pageNumber = 1, pageSize = 20) {
  const { data: session, status } = useSession();
  const accessToken = (session as any)?.accessToken as string | undefined;

  return useQuery({
    queryKey: customerId ? buyerKeys.orders(customerId, { pageNumber, pageSize }) : ["buyers", "orders", "missing"],
    enabled: !!customerId && status === "authenticated" && !!accessToken,
    queryFn: () => getBuyerOrders(customerId!, pageNumber, pageSize),
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });
}

export function useBuyerActivity(customerId?: string, pageNumber = 1, pageSize = 20) {
  const { data: session, status } = useSession();
  const accessToken = (session as any)?.accessToken as string | undefined;

  return useQuery({
    queryKey: customerId ? buyerKeys.activity(customerId, { pageNumber, pageSize }) : ["buyers", "activity", "missing"],
    enabled: !!customerId && status === "authenticated" && !!accessToken,
    queryFn: () => getBuyerActivity(customerId!, pageNumber, pageSize),
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });
}


export function useSuspendBuyer() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ customerId, reason }: { customerId: string; reason: string }) =>
      suspendBuyer(customerId, reason),
    onMutate: () => ({ toastId: toast.loading("Suspending buyer...") }),
    onSuccess: async (_res, vars, ctx) => {
      toast.success("Buyer suspended", { id: ctx?.toastId });
      await qc.invalidateQueries({ queryKey: buyerKeys.all });
      await qc.invalidateQueries({ queryKey: buyerKeys.detail(vars.customerId) });
    },
    onError: (err, _vars, ctx) => toast.error(getErrorMessage(err), { id: ctx?.toastId }),
  });
}

export function useReactivateBuyer() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (customerId: string) => reactivateBuyer(customerId),
    onMutate: () => ({ toastId: toast.loading("Reactivating buyer...") }),
    onSuccess: async (_res, customerId, ctx) => {
      toast.success("Buyer reactivated", { id: ctx?.toastId });
      await qc.invalidateQueries({ queryKey: buyerKeys.all });
      await qc.invalidateQueries({ queryKey: buyerKeys.detail(customerId) });
    },
    onError: (err, _vars, ctx) => toast.error(getErrorMessage(err), { id: ctx?.toastId }),
  });
}

function patchBuyerInLists(
  qc: ReturnType<typeof useQueryClient>,
  customerId: string,
  patch: Partial<BuyerListItem>,
) {
  qc.setQueriesData<BuyerListItem[]>(
    { queryKey: buyerKeys.lists() },
    (old) => old?.map((b) => (b.id === customerId ? { ...b, ...patch } : b)),
  );
}

function patchBuyerDetail(
  qc: ReturnType<typeof useQueryClient>,
  customerId: string,
  patch: Partial<BuyerProfile>,
) {
  qc.setQueryData<BuyerProfile>(buyerKeys.detail(customerId), (old) =>
    old ? { ...old, ...patch } : old,
  );
}

export function useUpdateBuyerUser() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (vars: { userId: string; payload: UpdateUserInput
     }) =>
      updateUser(vars.userId, vars.payload),

    onMutate: async (vars) => {
      const toastId = toast.loading("Saving profile changes...");
      await qc.cancelQueries({ queryKey: buyerKeys.all });

      const prevDetail = qc.getQueryData(buyerKeys.detail(vars.userId));
      const prevLists = qc.getQueriesData({ queryKey: buyerKeys.lists() });

      // optimistic patch (best effort)
      patchBuyerDetail(qc, vars.userId, {
        email: vars.payload.email as any,
        phoneNumber: vars.payload.phoneNumber as any,
        fullName:
          vars.payload.firstName || vars.payload.lastName
            ? `${vars.payload.firstName ?? ""} ${vars.payload.lastName ?? ""}`.trim()
            : undefined,
      });

      patchBuyerInLists(qc, vars.userId, {
        email: vars.payload.email as any,
        phoneNumber: vars.payload.phoneNumber as any,
        fullName:
          vars.payload.firstName || vars.payload.lastName
            ? `${vars.payload.firstName ?? ""} ${vars.payload.lastName ?? ""}`.trim()
            : undefined,
      });

      return { toastId, prevDetail, prevLists, userId: vars.userId };
    },

    onError: (err, _vars, ctx) => {
      if (ctx?.prevDetail) qc.setQueryData(buyerKeys.detail(ctx.userId), ctx.prevDetail);
      ctx?.prevLists?.forEach(([key, data]: any) => qc.setQueryData(key, data));

      toast.error(getErrorMessage(err), { id: ctx?.toastId });
    },

    onSuccess: (updated: UpdatedUser, vars, ctx) => {
      toast.success("Profile updated", { id: ctx?.toastId });

      // patch caches with server truth
      patchBuyerDetail(qc, vars.userId, {
        fullName: updated.fullName,
        email: updated.email,
        phoneNumber: updated.phoneNumber,
        // optional: if you extend BuyerProfile type later
        // status: updated.status,
        // countryCode: updated.countryCode,
        // verificationStatus: updated.verificationStatus,
      });

      patchBuyerInLists(qc, vars.userId, {
        fullName: updated.fullName,
        email: updated.email,
        phoneNumber: updated.phoneNumber,
        status: updated.status,
        verificationStatus: updated.verificationStatus,
        countryCode: updated.countryCode,
      });
    },

    onSettled: async (_res, _err, vars) => {
      // keep everything in sync
      await qc.invalidateQueries({ queryKey: buyerKeys.lists() });
      await qc.invalidateQueries({ queryKey: buyerKeys.detail(vars.userId) });
    },
  });
}