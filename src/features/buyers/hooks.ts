/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { buyerKeys } from "./key";
import { getBuyerActivity, getBuyerOrders, getBuyerProfile, getBuyers, getBuyerStats, reactivateBuyer, suspendBuyer, type BuyersQuery } from "./api";
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