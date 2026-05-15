/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { orderKeys } from "./key";
import { cancelOrder, getAdminOrders, getAdminOrderStats, getOrderById, OrderDetails, updateOrderStatus, type AdminOrdersQuery } from "./api";
import { toast } from "sonner";
import { getErrorMessage } from "@/src/lib/get-error";

export function useAdminOrders(params: AdminOrdersQuery) {
  const { data: session, status } = useSession();
  const accessToken = (session as any)?.accessToken as string | undefined;
  const role = (session as any)?.role as string | undefined;

  return useQuery({
    queryKey: orderKeys.list(params),
    enabled: status === "authenticated" && !!accessToken && role === "Admin",
    queryFn: () => getAdminOrders(params),
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });
}

export function useAdminOrderStats() {
  const { data: session, status } = useSession();
  const accessToken = (session as any)?.accessToken as string | undefined;
  const role = (session as any)?.role as string | undefined;

  return useQuery({
    queryKey: orderKeys.stats(),
    enabled: status === "authenticated" && !!accessToken && role === "Admin",
    queryFn: () => getAdminOrderStats(),
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });
}

export function useOrder(orderId?: string) {
  const { data: session, status } = useSession();
  const accessToken = (session as any)?.accessToken as string | undefined;

  return useQuery({
    queryKey: orderId ? orderKeys.detail(orderId) : ["orders", "detail", "missing"],
    enabled: !!orderId && status === "authenticated" && !!accessToken,
    queryFn: () => getOrderById(orderId!),
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });
}


export function useUpdateOrderStatus() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, status }: { orderId: string; status: string }) =>
      updateOrderStatus(orderId, status),

    onMutate: () => ({ toastId: toast.loading("Updating order status...") }),

    onSuccess: async (updated: OrderDetails, _vars, ctx) => {
      toast.success("Status updated", { id: ctx?.toastId });
      qc.setQueryData(orderKeys.detail(updated.id), updated);
      await qc.invalidateQueries({ queryKey: orderKeys.lists() });
      await qc.invalidateQueries({ queryKey: orderKeys.stats() });
    },

    onError: (err, _vars, ctx) => toast.error(getErrorMessage(err), { id: ctx?.toastId }),
  });
}

export function useCancelOrder() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (orderId: string) => cancelOrder(orderId),

    onMutate: () => ({ toastId: toast.loading("Cancelling order...") }),

    onSuccess: async (_msg, orderId, ctx) => {
      toast.success("Order cancelled", { id: ctx?.toastId });
      await qc.invalidateQueries({ queryKey: orderKeys.detail(orderId) });
      await qc.invalidateQueries({ queryKey: orderKeys.lists() });
      await qc.invalidateQueries({ queryKey: orderKeys.stats() });
    },

    onError: (err, _vars, ctx) => toast.error(getErrorMessage(err), { id: ctx?.toastId }),
  });
}